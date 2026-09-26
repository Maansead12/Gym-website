const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const {
    getAllMembers,
    getMemberDetails,
    updateMember,
    deleteMember,
    getAdminStats,
    updateMemberMembership,
    updateMemberProgress,
    addMemberWorkout,
    updateMemberWorkout,
    deleteMemberWorkout,
} = require("../controllers/adminController");

const router = express.Router();


// =========================
// ADMIN STATS
// =========================

router.get(
    "/stats",
    authenticateToken,
    requireAdmin,
    getAdminStats
);


// =========================
// MEMBERS
// =========================

router.get(
    "/members",
    authenticateToken,
    requireAdmin,
    getAllMembers
);

router.get(
    "/members/:id",
    authenticateToken,
    requireAdmin,
    getMemberDetails
);

router.put(
    "/members/:id",
    authenticateToken,
    requireAdmin,
    updateMember
);

router.delete(
    "/members/:id",
    authenticateToken,
    requireAdmin,
    deleteMember
);


// =========================
// MEMBERSHIP
// =========================

router.put(
    "/members/:id/membership",
    authenticateToken,
    requireAdmin,
    updateMemberMembership
);


// =========================
// PROGRESS
// =========================

router.put(
    "/members/:id/progress",
    authenticateToken,
    requireAdmin,
    updateMemberProgress
);


// =========================
// WORKOUTS
// =========================

// Add workout for member
router.post(
    "/members/:id/workouts",
    authenticateToken,
    requireAdmin,
    addMemberWorkout
);


// Edit workout
router.put(
    "/workouts/:workoutId",
    authenticateToken,
    requireAdmin,
    updateMemberWorkout
);


// Delete workout
router.delete(
    "/workouts/:workoutId",
    authenticateToken,
    requireAdmin,
    deleteMemberWorkout
);


module.exports = router;