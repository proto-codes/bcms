const db = require('../config/db');

// Helper function to query the database
const queryAsync = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Helper function to validate task input
const validateTaskInput = (title, description, due_date, priority) => {
    if (!title || typeof title !== 'string' || title.trim() === '') {
        throw new Error('Title is required and must be a non-empty string.');
    }
    if (title.length > 100) {
        throw new Error('Title cannot exceed 100 characters.');
    }
    if (description && typeof description !== 'string') {
        throw new Error('Description must be a string.');
    }
    if (description && description.length > 500) {
        throw new Error('Description cannot exceed 500 characters.');
    }
    if (!due_date || typeof due_date !== 'string' || isNaN(Date.parse(due_date))) {
        throw new Error('Due date is required and must be a valid date.');
    }
    const dueDate = new Date(due_date);
    if (dueDate < new Date()) {
        throw new Error('Due date cannot be in the past.');
    }
    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
        throw new Error('Priority must be Low, Medium, or High.');
    }
};

// Create a task
const createTask = async (req, res) => {
    const { title, description, due_date, priority } = req.body;
    const user_id = req.user.id; // Assuming you're using middleware to attach the user id

    try {
        // Validate input
        validateTaskInput(title, description, due_date, priority);

        const query = `
            INSERT INTO tasks (user_id, title, description, due_date, priority)
            VALUES (?, ?, ?, ?, ?);
        `;
        const results = await queryAsync(query, [user_id, title, description, due_date, priority]);

        res.status(201).json({ success: true, message: 'Task created', taskId: results.insertId });
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get all tasks for a user
const getTasksByUser = async (req, res) => {
    const userId = req.user.id; // Use the authenticated user's ID

    const query = `
        SELECT * FROM tasks WHERE user_id = ?;
    `;

    try {
        const results = await queryAsync(query, [userId]);
        res.status(200).json({ success: true, tasks: results });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ success: false, message: 'Error fetching tasks' });
    }
};

// Update a task
const updateTask = async (req, res) => {
    const taskId = req.params.taskId;
    const { title, description, due_date, priority } = req.body;

    if (!taskId) {
        return res.status(400).json({ success: false, message: 'Task ID is required.' });
    }

    try {
        // Validate input only if there are fields in the body
        if (Object.keys(req.body).length > 0) {
            validateTaskInput(title, description, due_date, priority);
        }

        const query = `
            UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?
            WHERE id = ?;
        `;
        const results = await queryAsync(query, [title, description, due_date, priority, taskId]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, message: 'Task updated' });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    const taskId = req.params.taskId;

    if (!taskId) {
        return res.status(400).json({ success: false, message: 'Task ID is required.' });
    }

    const query = `
        DELETE FROM tasks WHERE id = ?;
    `;

    try {
        const results = await queryAsync(query, [taskId]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, message: 'Task deleted' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ success: false, message: 'Error deleting task' });
    }
};

module.exports = {
    createTask,
    getTasksByUser,
    updateTask,
    deleteTask,
};
