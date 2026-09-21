const supabase = require("../config/supabase");

const getAllMembers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("id, name, email, role, created_at")
            .order("created_at", {
                ascending: false,
            });

        if (error) {
            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(200).json({
            members: data || [],
        });
    } catch (error) {
        console.error("Get members error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const getMemberDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Member ID is required",
            });
        }

        const {
            data: member,
            error: memberError,
        } = await supabase
            .from("users")
            .select("id, name, email, role, created_at")
            .eq("id", id)
            .single();

        if (memberError || !member) {
            return res.status(404).json({
                message: "Member not found",
            });
        }

        const {
            data: membership,
            error: membershipError,
        } = await supabase
            .from("memberships")
            .select("*")
            .eq("user_id", id)
            .order("created_at", {
                ascending: false,
            })
            .limit(1)
            .maybeSingle();

        if (membershipError) {
            return res.status(500).json({
                message: membershipError.message,
            });
        }

        const {
            data: workouts,
            error: workoutsError,
        } = await supabase
            .from("workouts")
            .select("*")
            .eq("user_id", id)
            .order("workout_date", {
                ascending: false,
            })
            .order("created_at", {
                ascending: false,
            });

        if (workoutsError) {
            return res.status(500).json({
                message: workoutsError.message,
            });
        }

        const {
            data: progress,
            error: progressError,
        } = await supabase
            .from("progress")
            .select("*")
            .eq("user_id", id)
            .order("updated_at", {
                ascending: false,
            })
            .limit(1)
            .maybeSingle();

        if (progressError) {
            return res.status(500).json({
                message: progressError.message,
            });
        }

        res.status(200).json({
            member,
            membership,
            progress,
            workouts: workouts || [],
        });
    } catch (error) {
        console.error(
            "Get member details error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};

/* UPDATE MEMBER */

const updateMember = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            role,
        } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Member ID is required",
            });
        }

        if (!name || !email || !role) {
            return res.status(400).json({
                message:
                    "Name, email, and role are required",
            });
        }

        const validRoles = [
            "member",
            "admin",
        ];

        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanName) {
            return res.status(400).json({
                message: "Name cannot be empty",
            });
        }

        if (!cleanEmail) {
            return res.status(400).json({
                message: "Email cannot be empty",
            });
        }

        const {
            data: existingMember,
            error: findError,
        } = await supabase
            .from("users")
            .select("id")
            .eq("id", id)
            .maybeSingle();

        if (findError) {
            return res.status(500).json({
                message: findError.message,
            });
        }

        if (!existingMember) {
            return res.status(404).json({
                message: "Member not found",
            });
        }

        const {
            data,
            error,
        } = await supabase
            .from("users")
            .update({
                name: cleanName,
                email: cleanEmail,
                role,
            })
            .eq("id", id)
            .select(
                "id, name, email, role, created_at"
            )
            .single();

        if (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    message:
                        "That email is already being used.",
                });
            }

            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(200).json({
            message: "Member updated successfully",
            member: data,
        });
    } catch (error) {
        console.error(
            "Update member error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};

/* DELETE MEMBER */

const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Member ID is required",
            });
        }

        if (req.user.id === id) {
            return res.status(400).json({
                message:
                    "You cannot delete your own admin account",
            });
        }

        const {
            data: existingMember,
            error: findError,
        } = await supabase
            .from("users")
            .select("id, name, email, role")
            .eq("id", id)
            .maybeSingle();

        if (findError) {
            return res.status(500).json({
                message: findError.message,
            });
        }

        if (!existingMember) {
            return res.status(404).json({
                message: "Member not found",
            });
        }

        const {
            error: deleteError,
        } = await supabase
            .from("users")
            .delete()
            .eq("id", id);

        if (deleteError) {
            return res.status(500).json({
                message: deleteError.message,
            });
        }

        res.status(200).json({
            message: "Member deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete member error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};

/* ADMIN STATISTICS */

const getAdminStats = async (req, res) => {
    try {
        // Total users
        const {
            count: totalUsers,
            error: usersError,
        } = await supabase
            .from("users")
            .select("*", {
                count: "exact",
                head: true,
            });

        if (usersError) {
            return res.status(500).json({
                message: usersError.message,
            });
        }

        // Active memberships
        const {
            count: activeMemberships,
            error: membershipsError,
        } = await supabase
            .from("memberships")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("status", "active");

        if (membershipsError) {
            return res.status(500).json({
                message: membershipsError.message,
            });
        }

        // Total workouts
        const {
            count: totalWorkouts,
            error: workoutsError,
        } = await supabase
            .from("workouts")
            .select("*", {
                count: "exact",
                head: true,
            });

        if (workoutsError) {
            return res.status(500).json({
                message: workoutsError.message,
            });
        }

        // Members with progress
        const {
            count: membersWithProgress,
            error: progressError,
        } = await supabase
            .from("progress")
            .select("*", {
                count: "exact",
                head: true,
            });

        if (progressError) {
            return res.status(500).json({
                message: progressError.message,
            });
        }

        // Recently joined users
        const {
            data: recentMembers,
            error: recentMembersError,
        } = await supabase
            .from("users")
            .select(
                "id, name, email, role, created_at"
            )
            .order("created_at", {
                ascending: false,
            })
            .limit(5);

        if (recentMembersError) {
            return res.status(500).json({
                message: recentMembersError.message,
            });
        }

        res.status(200).json({
            stats: {
                totalUsers: totalUsers || 0,
                activeMemberships:
                    activeMemberships || 0,
                totalWorkouts: totalWorkouts || 0,
                membersWithProgress:
                    membersWithProgress || 0,
            },
            recentMembers: recentMembers || [],
        });
    } catch (error) {
        console.error(
            "Admin stats error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    getAllMembers,
    getMemberDetails,
    updateMember,
    deleteMember,
    getAdminStats,
};