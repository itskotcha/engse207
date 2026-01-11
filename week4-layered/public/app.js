// app.js - Frontend Logic
// ENGSE207 Software Architecture - Week 3 Lab

// ========================================
// PART 1: STATE MANAGEMENT
// ========================================

let allTasks = [];
let currentFilter = 'ALL';


// ========================================
// PART 2: DOM ELEMENTS
// ========================================

const addTaskForm = document.getElementById('addTaskForm');
const statusFilter = document.getElementById('statusFilter');
const loadingOverlay = document.getElementById('loadingOverlay');

// Task list containers
const todoTasks = document.getElementById('todoTasks');
const progressTasks = document.getElementById('progressTasks');
const doneTasks = document.getElementById('doneTasks');

// Task counters
const todoCount = document.getElementById('todoCount');
const progressCount = document.getElementById('progressCount');
const doneCount = document.getElementById('doneCount');


// ========================================
// PART 3: API FUNCTIONS - FETCH TASKS
// ========================================

async function fetchTasks() {
    showLoading();
    try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        allTasks = data.tasks;
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to load tasks. Please refresh the page.');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 4: API FUNCTIONS - CREATE TASK
// ========================================

async function createTask(taskData) {
    showLoading();
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create task');
        }
        
        const data = await response.json();
        // Add new task to the beginning of the array
        allTasks.unshift({
            id: data.id,
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            status: 'TODO',
            created_at: new Date().toISOString()
        });
        
        renderTasks();
        
        // Reset form
        addTaskForm.reset();
        
        // Show success notification (Optional improvement: Toast notification)
        // alert('✅ Task created successfully!'); // Commented out to be less annoying
    } catch (error) {
        console.error('Error creating task:', error);
        alert('❌ Failed to create task. Please try again.');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 5: API FUNCTIONS - UPDATE STATUS
// ========================================

async function updateTaskStatus(taskId, newStatus) {
    showLoading();
    try {
        const response = await fetch(`/api/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            throw new Error('Failed to update status');
        }

        // Update local state
        const taskIndex = allTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            allTasks[taskIndex].status = newStatus;
            renderTasks();
        }

    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update task status.');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 6: API FUNCTIONS - DELETE TASK
// ========================================

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        // Remove from local state
        allTasks = allTasks.filter(t => t.id !== taskId);
        renderTasks();

    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task.');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 7: RENDER FUNCTIONS - MAIN RENDER
// ========================================

function renderTasks() {
    // Clear all lists
    todoTasks.innerHTML = '';
    progressTasks.innerHTML = '';
    doneTasks.innerHTML = '';
    
    // Filter tasks based on global filter
    let filteredTasks = allTasks;
    if (currentFilter !== 'ALL') {
        filteredTasks = allTasks.filter(task => task.status === currentFilter);
    }
    
    // Separate by status for columns
    const todo = filteredTasks.filter(t => t.status === 'TODO');
    const progress = filteredTasks.filter(t => t.status === 'IN_PROGRESS');
    const done = filteredTasks.filter(t => t.status === 'DONE');
    
    // Update counters
    todoCount.textContent = todo.length;
    progressCount.textContent = progress.length;
    doneCount.textContent = done.length;
    
    // Render each column
    renderTaskList(todo, todoTasks, 'TODO');
    renderTaskList(progress, progressTasks, 'IN_PROGRESS');
    renderTaskList(done, doneTasks, 'DONE');
}


// ========================================
// PART 8: RENDER FUNCTIONS - RENDER LIST
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
// PART 9: RENDER FUNCTIONS - CREATE CARD
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
            ${createStatusButtons(task.id, currentStatus)}
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                🗑️ Delete
            </button>
        </div>
    `;
    
    return card;
}


// ========================================
// PART 10: HELPER FUNCTIONS - STATUS BUTTONS
// ========================================

function createStatusButtons(taskId, currentStatus) {
    const buttons = [];
    
    // Logic for TODO Column
    if (currentStatus === 'TODO') {
        buttons.push(`
            <button class="btn btn-warning btn-sm" onclick="updateTaskStatus(${taskId}, 'IN_PROGRESS')">
                Start →
            </button>
        `);
    }
    
    // Logic for IN_PROGRESS Column
    if (currentStatus === 'IN_PROGRESS') {
        buttons.push(`
            <button class="btn btn-primary btn-sm" onclick="updateTaskStatus(${taskId}, 'TODO')">
                ← Back
            </button>
            <button class="btn btn-success btn-sm" onclick="updateTaskStatus(${taskId}, 'DONE')">
                Done ✓
            </button>
        `);
    }

    // Logic for DONE Column
    if (currentStatus === 'DONE') {
        buttons.push(`
            <button class="btn btn-warning btn-sm" onclick="updateTaskStatus(${taskId}, 'IN_PROGRESS')">
                ← Reopen
            </button>
        `);
    }
    
    return buttons.join('');
}


// ========================================
// PART 11: UTILITY FUNCTIONS
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

function showLoading() {
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    if(loadingOverlay) loadingOverlay.style.display = 'none';
}


// ========================================
// PART 12: EVENT LISTENERS
// ========================================

// Add Task Form Submit
if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const titleInput = document.getElementById('taskTitle');
        const descInput = document.getElementById('taskDescription');
        const prioInput = document.getElementById('taskPriority');

        const title = titleInput.value.trim();
        const description = descInput.value.trim();
        const priority = prioInput.value;
        
        if (!title) {
            alert('Please enter a task title');
            return;
        }
        
        createTask({ title, description, priority });
    });
}

// Filter Change
if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderTasks();
    });
}


// ========================================
// PART 13: INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Task Board App Initialized');
    console.log('📊 Architecture: Monolithic');
    fetchTasks();
});


// ========================================
// PART 14: GLOBAL FUNCTION EXPOSURE
// ========================================

// Expose functions to window object so inline onclick="" works
window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;