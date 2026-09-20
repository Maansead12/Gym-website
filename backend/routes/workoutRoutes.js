const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
    getWorkouts,
    addWorkout,
} = require("../controllers/workoutController");

const router = express.Router();

router.get("/", authenticateToken, getWorkouts);

router.post("/", authenticateToken, addWorkout);

module.exports = router;