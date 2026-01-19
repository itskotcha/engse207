// app.js - Client-Server Architecture (Week 5)

// ========================================
// PART 1: API CONFIG (เชื่อม backend บน VM)
// ========================================
const API_BASE = API_CONFIG.BASE_URL;
const API = {
    TASKS: `${API_BASE}${API_CONFIG.ENDPOINTS.TASKS}`,
    STATS: `${API_BASE}${API_CONFIG.ENDPOINTS.STATS}`
};


// ========================================
// PART 2: STATE MANAGEMENT
// ========================================
let allTasks = [];
let currentFilter = 'ALL';


// ========================================
// PART 3: DOM ELEMENTS
// ========================================
const addTaskForm = document.getElementById('addTaskForm');
const statusFilter = document.getElementById('statusFilter');
const loadingOverlay = document.getElementById('loadingOverlay');

const todoTasks = document.getElementById('todoTasks');
const progressTasks = document.getElementById('progressTasks');
const doneTasks = document.getElementById('doneTasks');

const todoCount = document.getElementById('todoCount');
const progressCount = document.getElementById('progressCount');
const doneCount = document.getElementById('doneCount');


// ========================================
// PART 4: LOADING UI
// ========================================
function showLoading() {
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    if (loadingOverlay) loadingOverlay.style.display = 'none';
}


// ========================================
// PART 5: API - FETCH TASKS (GET)
// ========================================
async function fetchTasks() {
    showLoading();
    try {
        const response = await fetch(API.TASKS);
        const result = await response.json();

        allTasks = result.data || [];
        renderTasks();

    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('❌ โหลดข้อมูลจากเซิร์ฟเวอร์ไม่สำเร็จ');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 6: API - CREATE TASK (POST)
// ========================================
async function createTask(taskData) {
    showLoading();
    try {
        const response = await fetch(API.TASKS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) throw new Error();

        await fetchTasks();
        addTaskForm.reset();

    } catch (error) {
        console.error('Error creating task:', error);
        alert('❌ ไม่สามารถเพิ่มงานได้');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 7: API - UPDATE STATUS (PATCH /next-status)
// ========================================
async function updateTaskStatus(taskId) {
    showLoading();
    try {
        const response = await fetch(`${API.TASKS}/${taskId}/next-status`, {
            method: 'PATCH'
        });

        if (!response.ok) throw new Error();

        await fetchTasks();

    } catch (error) {
        console.error('Error updating status:', error);
        alert('❌ ไม่สามารถเปลี่ยนสถานะได้');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 8: API - DELETE TASK (DELETE)
// ========================================
async function deleteTask(taskId) {
    if (!confirm('ลบงานนี้หรือไม่?')) return;

    showLoading();
    try {
        const response = await fetch(`${API.TASKS}/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error();

        await fetchTasks();

    } catch (error) {
        console.error('Error deleting task:', error);
        alert('❌ ลบงานไม่สำเร็จ');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 9: RENDER MAIN BOARD
// ========================================
function renderTasks() {

    todoTasks.innerHTML = '';
    progressTasks.innerHTML = '';
    doneTasks.innerHTML = '';

    let filteredTasks = allTasks;

    if (currentFilter !== 'ALL') {
        filteredTasks = allTasks.filter(task => task.status === currentFilter);
    }

    const todo = filteredTasks.filter(t => t.status === 'TODO');
    const progress = filteredTasks.filter(t => t.status === 'IN_PROGRESS');
    const done = filteredTasks.filter(t => t.status === 'DONE');

    todoCount.textContent = todo.length;
    progressCount.textContent = progress.length;
    doneCount.textContent = done.length;

    renderTaskList(todo, todoTasks, 'TODO');
    renderTaskList(progress, progressTasks, 'IN_PROGRESS');
    renderTaskList(done, doneTasks, 'DONE');
}


// ========================================
// PART 10: RENDER COLUMN LIST
// ========================================
function renderTaskList(tasks, container, currentStatus) {
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tasks here ❄️</p></div>';
        return;
    }

    tasks.forEach(task => {
        const card = createTaskCard(task, currentStatus);
        container.appendChild(card);
    });
}


// ========================================
// PART 11: RENDER TASK CARD
// ========================================
function createTaskCard(task, currentStatus) {
    const card = document.createElement('div');
    card.className = 'task-card';

    const priorityClass = `priority-${task.priority.toLowerCase()}`;

    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <span class="priority-badge ${priorityClass}">${task.priority}</span>
        </div>

        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}

        <div class="task-meta">
            Created: ${formatDate(task.created_at)}
        </div>

        <div class="task-actions">
            <button class="btn btn-primary btn-sm"
                onclick="updateTaskStatus(${task.id})">
                🔁 Next Status
            </button>

            <button class="btn btn-danger btn-sm"
                onclick="deleteTask(${task.id})">
                🗑️ Delete
            </button>
        </div>
    `;

    return card;
}


// ========================================
// PART 12: UTILITIES
// ========================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}


// ========================================
// PART 13: EVENT LISTENERS
// ========================================
if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const priority = document.getElementById('taskPriority').value;

        if (!title) {
            alert('Please enter a task title');
            return;
        }

        createTask({ title, description, priority });
    });
}

if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderTasks();
    });
}


// ========================================
// PART 14: INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Client-Server Mode');
    console.log('🌐 API =', API_BASE);
    fetchTasks();
});


// ========================================
// PART 15: GLOBAL EXPORT
// ========================================
window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;
