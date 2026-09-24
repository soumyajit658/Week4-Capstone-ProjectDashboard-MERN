const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// JWT Authentication Middleware
const authenticateToken = require("./middleware/authMiddleware");

// Project routes
const projectRoutes = require("./routes/projectRoutes");

app.use("/api/projects", projectRoutes);

// Task routes
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/tasks", taskRoutes);

// Protected test route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You accessed a protected route!",
        user: req.user
    });
});

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Week 4 Project Dashboard API is running!"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});