const supabase = require("../config/supabase");

// ===============================
// ADD WORKOUT
// ===============================
async function addWorkout(req, res) {
    try {
        const userId = req.user.id;

        const {
            workout_name,
            workout_type,
            duration,
            workout_date,
        } = req.body;

        if (!workout_name || !workout_name.trim()) {
            return res.status(400).json({
                message: "Workout name is required.",
            });
        }

        const { data, error } = await supabase
            .from("workouts")
            .insert([
                {
                    user_id: userId,
                    workout_name: workout_name.trim(),
                    workout_type: workout_type || "Strength",
                    duration:
                        duration !== null &&
                            duration !== undefined &&
                            duration !== ""
                            ? Number(duration)
                            : null,
                    workout_date:
                        workout_date || new Date().toISOString().split("T")[0],
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Add workout error:", error);

            return res.status(500).json({
                message: "Failed to add workout.",
            });
        }

        return res.status(201).json({
            message: "Workout added successfully.",
            workout: data,
        });
    } catch (error) {
        console.error("Add workout controller error:", error);

        return res.status(500).json({
            message: "Internal server error.",
        });
    }
}


// ===============================
// UPDATE WORKOUT
// ===============================
async function updateWorkout(req, res) {
    try {
        const userId = req.user.id;
        const workoutId = req.params.id;

        const {
            workout_name,
            workout_type,
            duration,
            workout_date,
        } = req.body;

        if (!workout_name || !workout_name.trim()) {
            return res.status(400).json({
                message: "Workout name is required.",
            });
        }

        const { data, error } = await supabase
            .from("workouts")
            .update({
                workout_name: workout_name.trim(),
                workout_type: workout_type || "Strength",
                duration:
                    duration !== null &&
                        duration !== undefined &&
                        duration !== ""
                        ? Number(duration)
                        : null,
                workout_date: workout_date || null,
            })
            .eq("id", workoutId)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) {
            console.error("Update workout error:", error);

            return res.status(500).json({
                message: "Failed to update workout.",
            });
        }

        if (!data) {
            return res.status(404).json({
                message: "Workout not found.",
            });
        }

        return res.status(200).json({
            message: "Workout updated successfully.",
            workout: data,
        });
    } catch (error) {
        console.error("Update workout controller error:", error);

        return res.status(500).json({
            message: "Internal server error.",
        });
    }
}


// ===============================
// DELETE WORKOUT
// ===============================
async function deleteWorkout(req, res) {
    try {
        const userId = req.user.id;
        const workoutId = req.params.id;

        const { data, error } = await supabase
            .from("workouts")
            .delete()
            .eq("id", workoutId)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) {
            console.error("Delete workout error:", error);

            return res.status(500).json({
                message: "Failed to delete workout.",
            });
        }

        if (!data) {
            return res.status(404).json({
                message: "Workout not found.",
            });
        }

        return res.status(200).json({
            message: "Workout deleted successfully.",
        });
    } catch (error) {
        console.error("Delete workout controller error:", error);

        return res.status(500).json({
            message: "Internal server error.",
        });
    }
}


module.exports = {
    addWorkout,
    updateWorkout,
    deleteWorkout,
};