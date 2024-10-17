// controllers/taskController.js
const db = require('../config/db'); // Ensure you export the MySQL connection from your db.js

// Helper function to query the database
const queryAsync = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Create a task
const createTask = async (req, res) => {
    const { user_id, title, description, due_date, priority } = req.body;

    const query = `
        INSERT INTO tasks (user_id, title, description, due_date, priority)
        VALUES (?, ?, ?, ?, ?);
    `;

    try {
        const results = await queryAsync(query, [user_id, title, description, due_date, priority]);
        res.status(201).json({ message: 'Task created', taskId: results.insertId });
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ message: 'Error creating task' });
    }
};

// Get all tasks for a user
const getTasksByUser = async (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT * FROM tasks WHERE user_id = ?;
    `;

    try {
        const results = await queryAsync(query, [userId]);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
    const userId = req.params.userId;
    const taskId = req.params.taskId;

    const query = `
        SELECT * FROM tasks WHERE id = ? AND user_id = ?;
    `;

    try {
        const results = await queryAsync(query, [taskId, userId]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error fetching task:', err);
        res.status(500).json({ message: 'Error fetching task' });
    }
};

// Update a task
const updateTask = async (req, res) => {
    const taskId = req.params.taskId;
    const { title, description, due_date, priority } = req.body;

    const query = `
        UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?
        WHERE id = ?;
    `;

    try {
        const results = await queryAsync(query, [title, description, due_date, priority, taskId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task updated' });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ message: 'Error updating task' });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    const taskId = req.params.taskId;

    const query = `
        DELETE FROM tasks WHERE id = ?;
    `;

    try {
        const results = await queryAsync(query, [taskId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Error deleting task' });
    }
};

// Export the task controller functions
module.exports = {
    createTask,
    getTasksByUser,
    getTaskById,
    updateTask,
    deleteTask,
};
