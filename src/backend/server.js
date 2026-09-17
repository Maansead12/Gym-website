const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/supabase");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the React frontend to connect
app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

// Test backend
app.get("/", (req, res) => {
    res.status(200).json({
        message: "FitZone backend is running!",
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err);

    res.status(500).json({
        message: "Internal server error",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});