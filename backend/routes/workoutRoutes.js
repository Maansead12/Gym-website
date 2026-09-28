const express = require("express");

const {
    addWorkout,
    updateWorkout,
    deleteWorkout,
} = require("../controllers/workoutController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// ADD WORKOUT
// POST /api/workouts
// ===============================
router.post(
    "/",
    authMiddleware,
    addWorkout
);


// ===============================
// UPDATE WORKOUT
// PUT /api/workouts/:id
// ===============================
router.put(
    "/:id",
    authMiddleware,
    updateWorkout
);


// ===============================
// DELETE WORKOUT
// DELETE /api/workouts/:id
// ===============================
router.delete(
    "/:id",
    authMiddleware,
    deleteWorkout
);


module.exports = router;