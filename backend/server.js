const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/supabase");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const progressRoutes = require("./routes/progressRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// ========================================
// CORS
// ========================================

app.use(
    cors({
        origin: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS",
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);


// ========================================
// BODY PARSER
// ========================================

app.use(express.json());


// ========================================
// HOME / HEALTH CHECK
// ========================================

app.get("/", (req, res) => {
    res.status(200).json({
        message: "FitZone backend is running!",
    });
});


// ========================================
// API ROUTES
// ========================================

app.use("/api/auth", authRoutes);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/workouts",
    workoutRoutes
);

app.use(
    "/api/progress",
    progressRoutes
);

app.use(
    "/api/memberships",
    membershipRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/profile",
    profileRoutes
);


// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});


// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
    console.error(
        "Server error:",
        err
    );

    res.status(500).json({
        message: "Internal server error",
    });
});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});