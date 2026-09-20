const supabase = require("../config/supabase");

const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get membership
        const { data: membership, error: membershipError } =
            await supabase
                .from("memberships")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

        if (membershipError) {
            console.error("Membership error:", membershipError);

            return res.status(500).json({
                message: membershipError.message,
            });
        }

        // Get workout count
        const { count: workoutCount, error: workoutCountError } =
            await supabase
                .from("workouts")
                .select("*", {
                    count: "exact",
                    head: true,
                })
                .eq("user_id", userId);

        if (workoutCountError) {
            console.error("Workout count error:", workoutCountError);

            return res.status(500).json({
                message: workoutCountError.message,
            });
        }

        // Get recent workouts
        const { data: recentWorkouts, error: workoutsError } =
            await supabase
                .from("workouts")
                .select(
                    "id, workout_name, workout_type, duration, workout_date"
                )
                .eq("user_id", userId)
                .order("workout_date", { ascending: false })
                .limit(5);

        if (workoutsError) {
            console.error("Workouts error:", workoutsError);

            return res.status(500).json({
                message: workoutsError.message,
            });
        }

        // Get latest progress
        const { data: progress, error: progressError } =
            await supabase
                .from("progress")
                .select("*")
                .eq("user_id", userId)
                .order("updated_at", { ascending: false })
                .limit(1)
                .maybeSingle();

        if (progressError) {
            console.error("Progress error:", progressError);

            return res.status(500).json({
                message: progressError.message,
            });
        }

        res.status(200).json({
            membership,
            workoutCount: workoutCount || 0,
            progress,
            recentWorkouts: recentWorkouts || [],
        });
    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    getDashboard,
};