const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const {
    getAllMembers,
    getMemberDetails,
    updateMember,
    deleteMember,
} = require("../controllers/adminController");

const router = express.Router();

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

module.exports = router;