import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable
} from "@hello-pangea/dnd";

import api from "../services/api";
import "../App.css";

function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [editingProjectId, setEditingProjectId] = useState(null);

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskPriority, setTaskPriority] = useState("medium");

    // Task editing states
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [taskStatus, setTaskStatus] = useState("todo");

    const [message, setMessage] = useState("");

    // =========================
    // FETCH PROJECTS
    // =========================

    const fetchProjects = async () => {
        try {
            const response = await api.get("/projects");

            setProjects(response.data);

            if (response.data.length > 0) {
                setSelectedProject((current) => {
                    if (!current) {
                        return response.data[0];
                    }

                    return (
                        response.data.find(
                            (project) =>
                                project._id === current._id
                        ) || response.data[0]
                    );
                });
            } else {
                setSelectedProject(null);
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Failed to fetch projects"
            );
        }
    };

    // =========================
    // FETCH TASKS
    // =========================

    const fetchTasks = async (projectId) => {
        try {
            const response = await api.get(
                `/tasks/project/${projectId}`
            );

            setTasks(response.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Failed to fetch tasks"
            );
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchTasks(selectedProject._id);
        } else {
            setTasks([]);
        }
    }, [selectedProject]);

    // =========================
    // CREATE PROJECT
    // =========================

    const handleCreateProject = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/projects", {
                name: projectName,
                description: projectDescription
            });

            const newProject = response.data.project;

            setProjects((previous) => [
                ...previous,
                newProject
            ]);

            setSelectedProject(newProject);

            setProjectName("");
            setProjectDescription("");

            setMessage("Project created successfully");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Failed to create project"
            );
        }
    };

    // =========================
    // EDIT PROJECT
    // =========================

    const handleEditProject = (project) => {
        setEditingProjectId(project._id);
        setProjectName(project.name);
        setProjectDescription(project.description || "");
        setMessage("");
    };

    // =========================
    // UPDATE PROJECT
    // =========================

    const handleUpdateProject = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put(
                `/projects/${editingProjectId}`,
                {
                    name: projectName,
                    description: projectDescription
                }
            );

            const updatedProject = response.data.project;

            setProjects((previous) =>
                previous.map((project) =>
                    project._id === updatedProject._id
                        ? updatedProject
                        : project
                )
            );

            setSelectedProject(updatedProject);

            setEditingProjectId(null);
            setProjectName("");
            setProjectDescription("");

            setMessage("Project updated successfully");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Failed to update project"
            );
        }
    };

    // =========================
    // CANCEL PROJECT EDIT
    // =========================

    const cancelProjectEdit = () => {
        setEditingProjectId(null);
        setProjectName("");
        setProjectDescription("");
        setMessage("");
    };

    // =========================
    // DELETE PROJECT
    // =========================

    const handleDeleteProject = async (projectId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/projects/${projectId}`);

            const remainingProjects = projects.filter(
                (project) => project._id !== projectId
            );

            setProjects(remainingProjects);

            if (remainingProjects.length > 0) {
                setSelectedProject(remainingProjects[0]);
            } else {
                setSelectedProject(null);
                setTasks([]);
            }

            setMessage("Project deleted successfully");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Failed to delete project"
            );
        }
    };

    // =========================
    // CREATE TASK
    // =========================

    const handleCreateTask = async (e) => {
        e.preventDefault();

        if (!selectedProject) {
            setMessage("Please select a project first");
            return;
        }

        try {
            await api.post("/tasks", {
                title: taskTitle,
                description: taskDescription,
                project: selectedProject._id,
                priority: taskPriority
            });

            setTaskTitle("");
            setTaskDescription("");
            setTaskPriority("medium");

            setMessage("Task created successfully");

            fetchTasks(selectedProject._id);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Failed to create task"
            );
        }
    };

    // =========================
    // START EDIT TASK
    // =========================

    const handleEditTask = (task) => {
        setEditingTaskId(task._id);
        setTaskTitle(task.title);
        setTaskDescription(task.description || "");
        setTaskPriority(task.priority || "medium");
        setTaskStatus(task.status || "todo");
        setMessage("");
    };

    // =========================
    // UPDATE TASK
    // =========================

    const handleUpdateTask = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put(
                `/tasks/${editingTaskId}`,
                {
                    title: taskTitle,
                    description: taskDescription,
                    priority: taskPriority,
                    status: taskStatus
                }
            );

            const updatedTask = response.data.task;

            setTasks((previous) =>
                previous.map((task) =>
                    task._id === updatedTask._id
                        ? updatedTask
                        : task
                )
            );

            setEditingTaskId(null);
            setTaskTitle("");
            setTaskDescription("");
            setTaskPriority("medium");
            setTaskStatus("todo");

            setMessage("Task updated successfully");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Failed to update task"
            );
        }
    };

    // =========================
    // CANCEL TASK EDIT
    // =========================

    const cancelTaskEdit = () => {
        setEditingTaskId(null);
        setTaskTitle("");
        setTaskDescription("");
        setTaskPriority("medium");
        setTaskStatus("todo");
        setMessage("");
    };

    // =========================
    // UPDATE TASK STATUS
    // =========================

    const updateTaskStatus = async (task, status) => {
        try {
            const response = await api.put(
                `/tasks/${task._id}`,
                {
                    status
                }
            );

            const updatedTask = response.data.task;

            setTasks((previous) =>
                previous.map((currentTask) =>
                    currentTask._id === updatedTask._id
                        ? updatedTask
                        : currentTask
                )
            );

            setMessage("Task status updated");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Failed to update task"
            );
        }
    };

    // =========================
    // DELETE TASK
    // =========================

    const deleteTask = async (taskId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/tasks/${taskId}`);

            setTasks((previous) =>
                previous.filter(
                    (task) => task._id !== taskId
                )
            );

            setMessage("Task deleted successfully");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Failed to delete task"
            );
        }
    };

    // =========================
    // DRAG AND DROP
    // =========================

    const handleDragEnd = async (result) => {
        const {
            destination,
            source,
            draggableId
        } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId ===
                source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const task = tasks.find(
            (currentTask) =>
                currentTask._id === draggableId
        );

        if (!task) {
            return;
        }

        const newStatus =
            destination.droppableId;

        if (
            newStatus !== source.droppableId
        ) {
            await updateTaskStatus(
                task,
                newStatus
            );
        }
    };

    // =========================
    // TASK FILTERING
    // =========================

    const todoTasks = tasks.filter(
        (task) => task.status === "todo"
    );

    const progressTasks = tasks.filter(
        (task) => task.status === "in-progress"
    );

    const completedTasks = tasks.filter(
        (task) => task.status === "completed"
    );

    // =========================
    // TASK CARD
    // =========================

    const renderTask = (task, index) => (
        <Draggable
            key={task._id}
            draggableId={task._id}
            index={index}
        >
            {(provided, snapshot) => (
                <div
                    className="task-card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging
                            ? 0.7
                            : 1
                    }}
                >
                    <h4>{task.title}</h4>

                    <p>
                        {task.description}
                    </p>

                    <span>
                        Priority: {task.priority}
                    </span>

                    <div className="task-actions">

                        {task.status === "todo" && (
                            <button
                                onClick={() =>
                                    updateTaskStatus(
                                        task,
                                        "in-progress"
                                    )
                                }
                            >
                                Start
                            </button>
                        )}

                        {task.status === "in-progress" && (
                            <>
                                <button
                                    onClick={() =>
                                        updateTaskStatus(
                                            task,
                                            "todo"
                                        )
                                    }
                                >
                                    Back
                                </button>

                                <button
                                    onClick={() =>
                                        updateTaskStatus(
                                            task,
                                            "completed"
                                        )
                                    }
                                >
                                    Complete
                                </button>
                            </>
                        )}

                        {task.status === "completed" && (
                            <button
                                onClick={() =>
                                    updateTaskStatus(
                                        task,
                                        "todo"
                                    )
                                }
                            >
                                Reopen
                            </button>
                        )}

                        <button
                            onClick={() =>
                                handleEditTask(task)
                            }
                        >
                            Edit
                        </button>

                        <button
                            onClick={() =>
                                deleteTask(task._id)
                            }
                        >
                            Delete
                        </button>

                    </div>
                </div>
            )}
        </Draggable>
    );

    // =========================
    // DASHBOARD
    // =========================

    return (
        <div className="dashboard">

            {/* HEADER */}

            <header className="dashboard-header">

                <h1>
                    Project Management Dashboard
                </h1>

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");

                        window.location.href =
                            "/login";
                    }}
                >
                    Logout
                </button>

            </header>

            {/* MESSAGE */}

            {message && (
                <p className="message">
                    {message}
                </p>
            )}

            <div className="dashboard-content">

                {/* SIDEBAR */}

                <aside className="projects-sidebar">

                    <h2>Projects</h2>

                    {projects.length === 0 ? (
                        <p>
                            No projects yet.
                        </p>
                    ) : (
                        projects.map((project) => (
                            <button
                                key={project._id}
                                className={
                                    selectedProject?._id ===
                                    project._id
                                        ? "project-button active"
                                        : "project-button"
                                }
                                onClick={() =>
                                    setSelectedProject(
                                        project
                                    )
                                }
                            >
                                {project.name}
                            </button>
                        ))
                    )}

                    <hr />

                    <h3>
                        {editingProjectId
                            ? "Edit Project"
                            : "Create Project"}
                    </h3>

                    <form
                        onSubmit={
                            editingProjectId
                                ? handleUpdateProject
                                : handleCreateProject
                        }
                    >
                        <input
                            type="text"
                            placeholder={
                                editingProjectId
                                    ? "Edit project name"
                                    : "Project name"
                            }
                            value={projectName}
                            onChange={(e) =>
                                setProjectName(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <textarea
                            placeholder={
                                editingProjectId
                                    ? "Edit description"
                                    : "Description"
                            }
                            value={
                                projectDescription
                            }
                            onChange={(e) =>
                                setProjectDescription(
                                    e.target.value
                                )
                            }
                        />

                        <button type="submit">
                            {editingProjectId
                                ? "Update Project"
                                : "Create Project"}
                        </button>

                        {editingProjectId && (
                            <button
                                type="button"
                                onClick={
                                    cancelProjectEdit
                                }
                                style={{
                                    background:
                                        "#6b7280"
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>

                </aside>

                {/* MAIN */}

                <main className="dashboard-main">

                    {selectedProject ? (
                        <>

                            {/* PROJECT HEADER */}

                            <div className="project-header">

                                <div>
                                    <h2>
                                        {
                                            selectedProject.name
                                        }
                                    </h2>

                                    <p>
                                        {
                                            selectedProject.description
                                        }
                                    </p>
                                </div>

                                <div className="project-actions">

                                    <button
                                        onClick={() =>
                                            handleEditProject(
                                                selectedProject
                                            )
                                        }
                                    >
                                        Edit Project
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDeleteProject(
                                                selectedProject._id
                                            )
                                        }
                                    >
                                        Delete Project
                                    </button>

                                </div>

                            </div>

                            {/* ADD / EDIT TASK */}

                            <section className="add-task">

                                <h3>
                                    {editingTaskId
                                        ? "Edit Task"
                                        : "Add Task"}
                                </h3>

                                <form
                                    onSubmit={
                                        editingTaskId
                                            ? handleUpdateTask
                                            : handleCreateTask
                                    }
                                >

                                    <input
                                        type="text"
                                        placeholder="Task title"
                                        value={taskTitle}
                                        onChange={(e) =>
                                            setTaskTitle(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <input
                                        type="text"
                                        placeholder="Task description"
                                        value={
                                            taskDescription
                                        }
                                        onChange={(e) =>
                                            setTaskDescription(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <select
                                        value={
                                            taskPriority
                                        }
                                        onChange={(e) =>
                                            setTaskPriority(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="low">
                                            Low
                                        </option>

                                        <option value="medium">
                                            Medium
                                        </option>

                                        <option value="high">
                                            High
                                        </option>
                                    </select>

                                    {editingTaskId && (
                                        <select
                                            value={
                                                taskStatus
                                            }
                                            onChange={(e) =>
                                                setTaskStatus(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="todo">
                                                TODO
                                            </option>

                                            <option value="in-progress">
                                                IN PROGRESS
                                            </option>

                                            <option value="completed">
                                                COMPLETED
                                            </option>
                                        </select>
                                    )}

                                    <button type="submit">
                                        {editingTaskId
                                            ? "Update Task"
                                            : "Add Task"}
                                    </button>

                                    {editingTaskId && (
                                        <button
                                            type="button"
                                            onClick={
                                                cancelTaskEdit
                                            }
                                            style={{
                                                background:
                                                    "#6b7280"
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}

                                </form>

                            </section>

                            {/* KANBAN BOARD */}

                            <DragDropContext
                                onDragEnd={
                                    handleDragEnd
                                }
                            >

                                <section className="kanban-board">

                                    {/* TODO */}

                                    <Droppable
                                        droppableId="todo"
                                    >
                                        {(
                                            provided,
                                            snapshot
                                        ) => (
                                            <div
                                                className={`kanban-column ${
                                                    snapshot.isDraggingOver
                                                        ? "drag-over"
                                                        : ""
                                                }`}
                                                ref={
                                                    provided.innerRef
                                                }
                                                {...provided.droppableProps}
                                            >

                                                <h3>
                                                    TODO
                                                </h3>

                                                {todoTasks.map(
                                                    (
                                                        task,
                                                        index
                                                    ) =>
                                                        renderTask(
                                                            task,
                                                            index
                                                        )
                                                )}

                                                {
                                                    provided.placeholder
                                                }

                                            </div>
                                        )}
                                    </Droppable>

                                    {/* IN PROGRESS */}

                                    <Droppable
                                        droppableId="in-progress"
                                    >
                                        {(
                                            provided,
                                            snapshot
                                        ) => (
                                            <div
                                                className={`kanban-column ${
                                                    snapshot.isDraggingOver
                                                        ? "drag-over"
                                                        : ""
                                                }`}
                                                ref={
                                                    provided.innerRef
                                                }
                                                {...provided.droppableProps}
                                            >

                                                <h3>
                                                    IN PROGRESS
                                                </h3>

                                                {progressTasks.map(
                                                    (
                                                        task,
                                                        index
                                                    ) =>
                                                        renderTask(
                                                            task,
                                                            index
                                                        )
                                                )}

                                                {
                                                    provided.placeholder
                                                }

                                            </div>
                                        )}
                                    </Droppable>

                                    {/* COMPLETED */}

                                    <Droppable
                                        droppableId="completed"
                                    >
                                        {(
                                            provided,
                                            snapshot
                                        ) => (
                                            <div
                                                className={`kanban-column ${
                                                    snapshot.isDraggingOver
                                                        ? "drag-over"
                                                        : ""
                                                }`}
                                                ref={
                                                    provided.innerRef
                                                }
                                                {...provided.droppableProps}
                                            >

                                                <h3>
                                                    COMPLETED
                                                </h3>

                                                {completedTasks.map(
                                                    (
                                                        task,
                                                        index
                                                    ) =>
                                                        renderTask(
                                                            task,
                                                            index
                                                        )
                                                )}

                                                {
                                                    provided.placeholder
                                                }

                                            </div>
                                        )}
                                    </Droppable>

                                </section>

                            </DragDropContext>

                        </>
                    ) : (
                        <div>
                            <h2>
                                No projects yet
                            </h2>

                            <p>
                                Create your first
                                project from the
                                sidebar.
                            </p>
                        </div>
                    )}

                </main>

            </div>

        </div>
    );
}

export default Dashboard;