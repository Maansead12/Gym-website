const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/supabase");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "FitZone backend is running!",
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/workouts", workoutRoutes);

app.use("/api/progress", progressRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});

app.use((err, req, res, next) => {
    console.error("Server error:", err);

    res.status(500).json({
        message: "Internal server error",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});