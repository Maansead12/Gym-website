const express = require("express");

const {
    getProfile,
    updateProfile,
    changePassword,
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// GET PROFILE
// GET /api/profile
// ========================================
router.get(
    "/",
    authMiddleware,
    getProfile
);


// ========================================
// UPDATE PROFILE
// PUT /api/profile
// ========================================
router.put(
    "/",
    authMiddleware,
    updateProfile
);


// ========================================
// CHANGE PASSWORD
// PUT /api/profile/password
// ========================================
router.put(
    "/password",
    authMiddleware,
    changePassword
);


module.exports = router;