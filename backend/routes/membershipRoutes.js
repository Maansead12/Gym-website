const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
    getMembership,
    createMembership,
} = require("../controllers/membershipController");

const router = express.Router();

router.get("/", authenticateToken, getMembership);

router.post("/", authenticateToken, createMembership);

module.exports = router;