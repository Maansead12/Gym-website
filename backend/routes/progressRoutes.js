const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
    getProgress,
    updateProgress,
} = require("../controllers/progressController");

const router = express.Router();

router.get("/", authenticateToken, getProgress);

router.put("/", authenticateToken, updateProgress);

module.exports = router;