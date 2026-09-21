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
} = require("../controllers/adminController");

const router = express.Router();

/* ADMIN STATS */

router.get(
    "/stats",
    authenticateToken,
    requireAdmin,
    getAdminStats
);

/* ALL MEMBERS */

router.get(
    "/members",
    authenticateToken,
    requireAdmin,
    getAllMembers
);

/* MEMBER DETAILS */

router.get(
    "/members/:id",
    authenticateToken,
    requireAdmin,
    getMemberDetails
);

/* UPDATE MEMBER */

router.put(
    "/members/:id",
    authenticateToken,
    requireAdmin,
    updateMember
);

/* UPDATE MEMBERSHIP */

router.put(
    "/members/:id/membership",
    authenticateToken,
    requireAdmin,
    updateMemberMembership
);

/* UPDATE PROGRESS */

router.put(
    "/members/:id/progress",
    authenticateToken,
    requireAdmin,
    updateMemberProgress
);

/* DELETE MEMBER */

router.delete(
    "/members/:id",
    authenticateToken,
    requireAdmin,
    deleteMember
);

module.exports = router;