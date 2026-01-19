require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./database/connection');
const taskController = require('./src/controllers/taskController');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

const app = express();

// =====================
// Environment Config
// =====================
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// =====================
// CORS (สำคัญสำหรับ Client-Server)
// =====================
const corsOptions = {
    origin: true,          // อนุญาต frontend จากเครื่องอื่น
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// =====================
// Middleware
// =====================
app.use(express.json());
app.use(express.static('public'));

// Logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// =====================
// Routes
// =====================

// Statistics (ต้องมาก่อน :id)
app.get('/api/tasks/stats',
    taskController.getStatistics.bind(taskController)
);

// CRUD
app.get('/api/tasks',
    taskController.getAllTasks.bind(taskController)
);

app.get('/api/tasks/:id',
    taskController.getTaskById.bind(taskController)
);

app.post('/api/tasks',
    taskController.createTask.bind(taskController)
);

app.put('/api/tasks/:id',
    taskController.updateTask.bind(taskController)
);

app.delete('/api/tasks/:id',
    taskController.deleteTask.bind(taskController)
);

// Special action
app.patch(
    '/api/tasks/:id/next-status',
    taskController.moveToNextStatus.bind(taskController)
);

// Error handler (ต้องอยู่ท้ายสุด)
app.use(errorHandler);

// =====================
// Start Server
// =====================
async function startServer() {
    try {
        await database.connect();

        app.listen(PORT, HOST, () => {
            logger.info(`🚀 Server running at http://${HOST}:${PORT}`);
            logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// =====================
// Graceful Shutdown
// =====================
process.on('SIGINT', async () => {
    logger.info('🛑 Shutting down...');
    await database.close();
    process.exit(0);
});

startServer();
