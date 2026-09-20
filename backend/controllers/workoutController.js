const supabase = require("../config/supabase");

const getWorkouts = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from("workouts")
            .select("*")
            .eq("user_id", userId)
            .order("workout_date", { ascending: false })
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Get workouts error:", error);

            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(200).json({
            workouts: data || [],
        });
    } catch (error) {
        console.error("Get workouts error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const addWorkout = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            workout_name,
            workout_type,
            duration,
            workout_date,
        } = req.body;

        if (!workout_name) {
            return res.status(400).json({
                message: "Workout name is required",
            });
        }

        const { data, error } = await supabase
            .from("workouts")
            .insert([
                {
                    user_id: userId,
                    workout_name: workout_name.trim(),
                    workout_type: workout_type || null,
                    duration: duration || null,
                    workout_date: workout_date || new Date().toISOString().split("T")[0],
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

module.exports = {
    getWorkouts,
    addWorkout,
};