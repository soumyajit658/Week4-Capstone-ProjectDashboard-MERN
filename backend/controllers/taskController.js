const Task = require("../models/Task");
const Project = require("../models/Project");

// Create Task
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            project,
            assignedTo,
            priority
        } = req.body;

        if (!title || !project) {
            return res.status(400).json({
                message: "Task title and project are required"
            });
        }

        // Check if project exists
        const existingProject = await Project.findById(project);

        if (!existingProject) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Check if user belongs to project
        const isMember =
            existingProject.owner.toString() === req.user.id ||
            existingProject.members.some(
                member => member.toString() === req.user.id
            );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project"
            });
        }

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            priority,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        console.error("Create Task Error:", error);

        res.status(500).json({
            message: "Failed to create task",
            error: error.message
        });
    }
};


// Get All Tasks for a Project
const getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const isMember =
            project.owner.toString() === req.user.id ||
            project.members.some(
                member => member.toString() === req.user.id
            );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project"
            });
        }

        const tasks = await Task.find({
            project: projectId
        })
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        res.status(200).json(tasks);

    } catch (error) {
        console.error("Get Tasks Error:", error);

        res.status(500).json({
            message: "Failed to fetch tasks",
            error: error.message
        });
    }
};


// Get Single Task
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);

    } catch (error) {
        console.error("Get Task Error:", error);

        res.status(500).json({
            message: "Failed to fetch task",
            error: error.message
        });
    }
};


// Update Task
const updateTask = async (req, res) => {
    try {
        const {
            title,
            description,
            assignedTo,
            status,
            priority
        } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const isMember =
            project.owner.toString() === req.user.id ||
            project.members.some(
                member => member.toString() === req.user.id
            );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project"
            });
        }

        if (title !== undefined) {
            task.title = title;
        }

        if (description !== undefined) {
            task.description = description;
        }

        if (assignedTo !== undefined) {
            task.assignedTo = assignedTo;
        }

        if (status !== undefined) {
            task.status = status;
        }

        if (priority !== undefined) {
            task.priority = priority;
        }

        const updatedTask = await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (error) {
        console.error("Update Task Error:", error);

        res.status(500).json({
            message: "Failed to update task",
            error: error.message
        });
    }
};


// Delete Task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Only project owner or task creator can delete
        const canDelete =
            project.owner.toString() === req.user.id ||
            task.createdBy.toString() === req.user.id;

        if (!canDelete) {
            return res.status(403).json({
                message: "You do not have permission to delete this task"
            });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error("Delete Task Error:", error);

        res.status(500).json({
            message: "Failed to delete task",
            error: error.message
        });
    }
};


module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};