const supabase = require("../config/supabase");

// =========================
// GET ALL MEMBERS
// =========================
const getAllMembers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("id, name, email, role, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Get members error:", error);

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


// =========================
// GET MEMBER DETAILS
// =========================
const getMemberDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: member, error: memberError } = await supabase
            .from("users")
            .select("id, name, email, role, created_at")
            .eq("id", id)
            .single();

        if (memberError || !member) {
            return res.status(404).json({
                message: "Member not found",
            });
        }

        const { data: memberships, error: membershipError } =
            await supabase
                .from("memberships")
                .select("*")
                .eq("user_id", id)
                .order("created_at", { ascending: false });

        if (membershipError) {
            return res.status(500).json({
                message: membershipError.message,
            });
        }

        const { data: progress, error: progressError } =
            await supabase
                .from("progress")
                .select("*")
                .eq("user_id", id)
                .order("updated_at", { ascending: false });

        if (progressError) {
            return res.status(500).json({
                message: progressError.message,
            });
        }

        const { data: workouts, error: workoutError } =
            await supabase
                .from("workouts")
                .select("*")
                .eq("user_id", id)
                .order("workout_date", { ascending: false })
                .order("created_at", { ascending: false });

        if (workoutError) {
            return res.status(500).json({
                message: workoutError.message,
            });
        }

        res.status(200).json({
            member,
            membership: memberships?.[0] || null,
            memberships: memberships || [],
            progress: progress?.[0] || null,
            progressHistory: progress || [],
            workouts: workouts || [],
        });
    } catch (error) {
        console.error("Get member details error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================
// UPDATE MEMBER
// =========================
const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({
                message: "Name, email, and role are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const { data: existingUser, error: existingError } =
            await supabase
                .from("users")
                .select("id")
                .eq("email", normalizedEmail)
                .neq("id", id)
                .maybeSingle();

        if (existingError) {
            return res.status(500).json({
                message: existingError.message,
            });
        }

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists",
            });
        }

        const { data, error } = await supabase
            .from("users")
            .update({
                name: name.trim(),
                email: normalizedEmail,
                role,
            })
            .eq("id", id)
            .select("id, name, email, role, created_at")
            .single();

        if (error) {
            console.error("Update member error:", error);

            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(200).json({
            message: "Member updated successfully",
            member: data,
        });
    } catch (error) {
        console.error("Update member error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================
// DELETE MEMBER
// =========================
const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id === id) {
            return res.status(400).json({
                message: "You cannot delete your own admin account",
            });
        }

        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Delete member error:", error);

            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(200).json({
            message: "Member deleted successfully",
        });
    } catch (error) {
        console.error("Delete member error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================
// ADMIN STATS
// =========================
const getAdminStats = async (req, res) => {
    try {
        const { count: userCount, error: usersError } =
            await supabase
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

        const { count: membershipCount, error: membershipError } =
            await supabase
                .from("memberships")
                .select("*", {
                    count: "exact",
                    head: true,
                })
                .eq("status", "active");

        if (membershipError) {
            return res.status(500).json({
                message: membershipError.message,
            });
        }

        const { count: workoutCount, error: workoutError } =
            await supabase
                .from("workouts")
                .select("*", {
                    count: "exact",
                    head: true,
                });

        if (workoutError) {
            return res.status(500).json({
                message: workoutError.message,
            });
        }

        const { count: progressCount, error: progressError } =
            await supabase
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

        res.status(200).json({
            stats: {
                totalUsers: userCount || 0,
                activeMemberships: membershipCount || 0,
                totalWorkouts: workoutCount || 0,
                progressTracking: progressCount || 0,
            },
        });
    } catch (error) {
        console.error("Admin stats error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================
// UPDATE MEMBER MEMBERSHIP
// =========================
const updateMemberMembership = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            plan,
            status,
            start_date,
            end_date,
        } = req.body;

        if (!plan || !status) {
            return res.status(400).json({
                message: "Plan and status are required",
            });
        }

        const { data: member, error: memberError } =
            await supabase
                .from("users")
                .select("id")
                .eq("id", id)
                .single();

        if (memberError || !member) {
            return res.status(404).json({
                message: "Member not found",
            });
        }

        const { data: existingMembership, error: findError } =
            await supabase
                .from("memberships")
                .select("id")
                .eq("user_id", id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

        if (findError) {
            return res.status(500).json({
                message: findError.message,
            });
        }

        let data;
        let error;

        if (existingMembership) {
            const result = await supabase
                .from("memberships")
                .update({
                    plan,
                    status,
                    start_date: start_date || null,
                    end_date: end_date || null,
                })
                .eq("id", existingMembership.id)
                .select("*")
                .single();

            data = result.data;
            error = result.error;
        } else {
            const result = await supabase
                .from("memberships")
                .insert([
                    {
                        user_id: id,
                        plan,
                        status,
                        start_date: start_date || null,
                        end_date: end_date || null,
                    },
                ])
                .select("*")
                .single();

            data = result.data;
            error = result.error;
        }

        if (error) {
            console.error("Update membership error:", error);

            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(200).json({
            message: "Membership updated successfully",
            membership: data,
        });
    } catch (error) {
        console.error("Update membership error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================
// UPDATE MEMBER PROGRESS
// =========================
const updateMemberProgress = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            goal_percentage,
            weight,
            notes,
        } = req.body;

        const goal = Number(goal_percentage);

        if (
            Number.isNaN(goal) ||
            goal < 0 ||
            goal > 100
        ) {
            return res.status(400).json({
                message: "Goal percentage must be between 0 and 100",
            });
        }

        const { data: member, error: memberError } =
            await supabase
                .from("users")
                .select("id")
                .eq("id", id)
                .single();

        if (memberError || !member) {
            return res.status(404).json({
                message: "Member not found",
            });
        }

        const { data: existingProgress, error: findError } =
            await supabase
                .from("progress")
                .select("id")
                .eq("user_id", id)
                .order("updated_at", { ascending: false })
                .limit(1)
                .maybeSingle();

        if (findError) {
            return res.status(500).json({
                message: findError.message,
            });
        }

        let data;
        let error;

        if (existingProgress) {
            const result = await supabase
                .from("progress")
                .update({
                    goal_percentage: goal,
                    weight:
                        weight === "" ||
                            weight === null ||
                            weight === undefined
                            ? null
                            : Number(weight),
                    notes: notes || null,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", existingProgress.id)
                .select("*")
                .single();

            data = result.data;
            error = result.error;
        } else {
            const result = await supabase
                .from("progress")
                .insert([
                    {
                        user_id: id,
                        goal_percentage: goal,
                        weight:
                            weight === "" ||
                                weight === null ||
                                weight === undefined
                                ? null
                                : Number(weight),
                        notes: notes || null,
                    },
                ])
                .select("*")
                .single();

            data = result.data;
            error = result.error;
        }

        if (error) {
            console.error("Update progress error:", error);

            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(200).json({
            message: "Progress updated successfully",
            progress: data,
        });
    } catch (error) {
        console.error("Update progress error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================
// ADD MEMBER WORKOUT
// =========================
const addMemberWorkout = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            workout_name,
            workout_type,
            duration,
            workout_date,
        } = req.body;

        if (!workout_name || !workout_name.trim()) {
            return res.status(400).json({
                message: "Workout name is required",
            });
        }

        const { data: member, error: memberError } =
            await supabase
                .from("users")
                .select("id")
                .eq("id", id)
                .single();

        if (memberError || !member) {
            return res.status(404).json({
                message: "Member not found",
            });
        }

        let workoutDuration = null;

        if (
            duration !== "" &&
            duration !== null &&
            duration !== undefined
        ) {
            workoutDuration = Number(duration);

            if (
                Number.isNaN(workoutDuration) ||
                workoutDuration < 0
            ) {
                return res.status(400).json({
                    message: "Duration must be a valid positive number",
                });
            }
        }

        const { data, error } = await supabase
            .from("workouts")
            .insert([
                {
                    user_id: id,
                    workout_name: workout_name.trim(),
                    workout_type: workout_type || null,
                    duration: workoutDuration,
                    workout_date: workout_date || null,
                },
            ])
            .select("*")
            .single();

        if (error) {
            console.error("Add workout error:", error);

            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(201).json({
            message: "Workout added successfully",
            workout: data,
        });
    } catch (error) {
        console.error("Add workout error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================
// UPDATE MEMBER WORKOUT
// =========================
const updateMemberWorkout = async (req, res) => {
    try {
        const { workoutId } = req.params;

        const {
            workout_name,
            workout_type,
            duration,
            workout_date,
        } = req.body;

        if (!workout_name || !workout_name.trim()) {
            return res.status(400).json({
                message: "Workout name is required",
            });
        }

        const { data: existingWorkout, error: findError } =
            await supabase
                .from("workouts")
                .select("id")
                .eq("id", workoutId)
                .single();

        if (findError || !existingWorkout) {
            return res.status(404).json({
                message: "Workout not found",
            });
        }

        let workoutDuration = null;

        if (
            duration !== "" &&
            duration !== null &&
            duration !== undefined
        ) {
            workoutDuration = Number(duration);

            if (
                Number.isNaN(workoutDuration) ||
                workoutDuration < 0
            ) {
                return res.status(400).json({
                    message: "Duration must be a valid positive number",
                });
            }
        }

        const { data, error } = await supabase
            .from("workouts")
            .update({
                workout_name: workout_name.trim(),
                workout_type: workout_type || null,
                duration: workoutDuration,
                workout_date: workout_date || null,
            })
            .eq("id", workoutId)
            .select("*")
            .single();

        if (error) {
            console.error("Update workout error:", error);

            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(200).json({
            message: "Workout updated successfully",
            workout: data,
        });
    } catch (error) {
        console.error("Update workout error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================
// DELETE MEMBER WORKOUT
// =========================
const deleteMemberWorkout = async (req, res) => {
    try {
        const { workoutId } = req.params;

        const { data: existingWorkout, error: findError } =
            await supabase
                .from("workouts")
                .select("id")
                .eq("id", workoutId)
                .single();

        if (findError || !existingWorkout) {
            return res.status(404).json({
                message: "Workout not found",
            });
        }

        const { error } = await supabase
            .from("workouts")
            .delete()
            .eq("id", workoutId);

        if (error) {
            console.error("Delete workout error:", error);

            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(200).json({
            message: "Workout deleted successfully",
        });
    } catch (error) {
        console.error("Delete workout error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================
// EXPORTS
// =========================
module.exports = {
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
};