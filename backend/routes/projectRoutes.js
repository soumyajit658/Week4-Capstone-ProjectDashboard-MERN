const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

const router = express.Router();

// Create Project
router.post("/", authenticateToken, createProject);

// Get All Projects
router.get("/", authenticateToken, getProjects);

// Get Single Project
router.get("/:id", authenticateToken, getProjectById);

// Update Project
router.put("/:id", authenticateToken, updateProject);

// Delete Project
router.delete("/:id", authenticateToken, deleteProject);

module.exports = router;