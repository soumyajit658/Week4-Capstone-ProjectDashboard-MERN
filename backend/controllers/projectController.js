const Project = require("../models/Project");

// Create Project
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Project name is required"
            });
        }

        const project = await Project.create({
            name,
            description,
            owner: req.user.id,
            members: [req.user.id]
        });

        res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.error("Create Project Error:", error);

        res.status(500).json({
            message: "Failed to create project",
            error: error.message
        });
    }
};


// Get All Projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user.id },
                { members: req.user.id }
            ]
        })
            .populate("owner", "name email")
            .populate("members", "name email");

        res.status(200).json(projects);

    } catch (error) {
        console.error("Get Projects Error:", error);

        res.status(500).json({
            message: "Failed to fetch projects",
            error: error.message
        });
    }
};


// Get Single Project
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("owner", "name email")
            .populate("members", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json(project);

    } catch (error) {
        console.error("Get Project Error:", error);

        res.status(500).json({
            message: "Failed to fetch project",
            error: error.message
        });
    }
};


// Update Project
const updateProject = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Only project owner can update
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only the project owner can update this project"
            });
        }

        // Update only provided fields
        if (name !== undefined) {
            project.name = name;
        }

        if (description !== undefined) {
            project.description = description;
        }

        if (status !== undefined) {
            project.status = status;
        }

        const updatedProject = await project.save();

        res.status(200).json({
            message: "Project updated successfully",
            project: updatedProject
        });

    } catch (error) {
        console.error("Update Project Error:", error);

        res.status(500).json({
            message: "Failed to update project",
            error: error.message
        });
    }
};


// Delete Project
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Only project owner can delete
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only the project owner can delete this project"
            });
        }

        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        console.error("Delete Project Error:", error);

        res.status(500).json({
            message: "Failed to delete project",
            error: error.message
        });
    }
};


module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};