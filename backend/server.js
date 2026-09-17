const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/supabase");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        message: "FitZone backend is running!",
    });
});

// Supabase connection test
app.get("/api/test-supabase", async (req, res) => {
    try {
        const { error } = await supabase
            .from("users")
            .select("id")
            .limit(1);

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        res.status(200).json({
            success: true,
            message: "Supabase connection successful",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Supabase connection failed",
        });
    }
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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});