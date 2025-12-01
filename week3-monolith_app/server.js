// server.js
// Task Board - Monolithic Application
// ENGSE207 Software Architecture - Week 3 Lab

// ========================================
// PART 1: IMPORT DEPENDENCIES
// ========================================

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');


// ========================================
// PART 2: INITIALIZE APPLICATION
// ========================================

const app = express();
const PORT = 3000;


// ========================================
// PART 3: MIDDLEWARE CONFIGURATION
// ========================================

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to serve static files from 'public' folder
app.use(express.static('public'));


// ========================================
// PART 4: DATABASE CONNECTION
// ========================================

const db = new sqlite3.Database('./database/tasks.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});


// ========================================
// PART 5: API ROUTES - GET ALL TASKS
// ========================================

app.get('/api/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks ORDER BY created_at DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching tasks:', err.message);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        } else {
            res.json({ tasks: rows });
        }
    });
});


// ========================================
// PART 6: API ROUTES - GET SINGLE TASK
// ========================================

app.get('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM tasks WHERE id = ?';

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error fetching task:', err.message);
            res.status(500).json({ error: 'Failed to fetch task' });
        } else if (!row) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ task: row });
        }
    });
});


// ========================================
// PART 7: API ROUTES - CREATE TASK
// ========================================

app.post('/api/tasks', (req, res) => {
    const { title, description, priority } = req.body;
    
    // Validation: Check if title exists
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    // SQL to insert new task (Default status is 'TODO')
    const sql = `
        INSERT INTO tasks (title, description, status, priority) 
        VALUES (?, ?, 'TODO', ?)
    `;
    
    // priority defaults to 'MEDIUM' if not provided (handled by Schema usually, but good to be safe)
    const taskPriority = priority || 'MEDIUM';

    db.run(sql, [title, description, taskPriority], function(err) {
        if (err) {
            console.error('Error creating task:', err.message);
            res.status(500).json({ error: 'Failed to create task' });
        } else {
            // this.lastID contains the ID of the newly inserted row
            res.status(201).json({ 
                id: this.lastID,
                title,
                description,
                status: 'TODO',
                priority: taskPriority,
                message: 'Task created successfully'
            });
        }
    });
});


// ========================================
// PART 8: API ROUTES - UPDATE TASK
// ========================================

app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    
    // Build dynamic SQL
    let updates = [];
    let values = [];
    
    if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
    }
    if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
    }
    if (status !== undefined) {
        updates.push('status = ?');
        values.push(status);
    }
    if (priority !== undefined) {
        updates.push('priority = ?');
        values.push(priority);
    }

    // If nothing to update
    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    // Add ID to values array for the WHERE clause
    values.push(id);

    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(sql, values, function(err) {
        if (err) {
            console.error('Error updating task:', err.message);
            res.status(500).json({ error: 'Failed to update task' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ message: 'Task updated successfully', changes: this.changes });
        }
    });
});


// ========================================
// PART 9: API ROUTES - DELETE TASK
// ========================================

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?';

    db.run(sql, [id], function(err) {
        if (err) {
            console.error('Error deleting task:', err.message);
            res.status(500).json({ error: 'Failed to delete task' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ message: 'Task deleted successfully' });
        }
    });
});


// ========================================
// PART 10: API ROUTES - UPDATE STATUS
// ========================================

app.patch('/api/tasks/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
            error: 'Invalid status. Must be TODO, IN_PROGRESS, or DONE' 
        });
    }
    
    const sql = 'UPDATE tasks SET status = ? WHERE id = ?';

    db.run(sql, [status, id], function(err) {
        if (err) {
            console.error('Error updating status:', err.message);
            res.status(500).json({ error: 'Failed to update status' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ message: 'Status updated successfully', status });
        }
    });
});


// ========================================
// PART 11: SERVE FRONTEND
// ========================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// ========================================
// PART 12: START SERVER
// ========================================

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Task Board application started`);
    console.log(`📊 Architecture: Monolithic (All-in-one)`);
});


// ========================================
// PART 13: GRACEFUL SHUTDOWN
// ========================================

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});