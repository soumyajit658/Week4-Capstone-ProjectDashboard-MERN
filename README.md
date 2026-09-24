# 🚀 Week 4 MERN Project Management Dashboard

A full-stack **Project Management Dashboard** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).

The application allows authenticated users to create and manage projects and tasks through a Kanban-style dashboard. Tasks can be created, edited, deleted, assigned priorities, moved between different statuses, and managed using drag-and-drop.

---

## 📌 Project Overview

This project was developed as a **Week 4 MERN Capstone Project** to practice building a complete full-stack web application.

The application contains:

- User Registration
- User Login
- JWT Authentication
- Protected API Routes
- Project Management
- Task Management
- Task Priorities
- Task Status Management
- Kanban Board
- Drag-and-Drop Tasks
- MongoDB Database
- React Frontend
- Express/Node.js Backend

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- @hello-pangea/dnd
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

## Database

- MongoDB Atlas

## Development Tools

- Visual Studio Code
- Git
- GitHub
- Thunder Client / Postman
- MongoDB Atlas

---

# 📂 Project Structure

```text
Week4-Capstone-ProjectDashboard-MERN/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── user.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
