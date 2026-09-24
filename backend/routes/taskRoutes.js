const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const router = express.Router();

// Create Task
router.post("/", authenticateToken, createTask);

// Get all tasks for a project
router.get("/project/:projectId", authenticateToken, getTasks);

// Get one task
router.get("/:id", authenticateToken, getTaskById);

// Update task
router.put("/:id", authenticateToken, updateTask);

// Delete task
router.delete("/:id", authenticateToken, deleteTask);

module.exports = router;