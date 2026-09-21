const supabase = require("../config/supabase");

const getProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from("progress")
            .select("*")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(200).json({
            progress: data,
        });
    } catch (error) {
        console.error("Get progress error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const updateProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            goal_percentage,
            weight,
            notes,
        } = req.body;

        if (
            goal_percentage === undefined ||
            goal_percentage === null
        ) {
            return res.status(400).json({
                message: "Goal percentage is required",
            });
        }

        if (
            Number(goal_percentage) < 0 ||
            Number(goal_percentage) > 100
        ) {
            return res.status(400).json({
                message: "Goal percentage must be between 0 and 100",
            });
        }

        const { data: existingProgress, error: findError } =
            await supabase
                .from("progress")
                .select("*")
                .eq("user_id", userId)
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
                    goal_percentage: Number(goal_percentage),
                    weight:
                        weight !== "" &&
                            weight !== null &&
                            weight !== undefined
                            ? Number(weight)
                            : null,
                    notes: notes ? notes.trim() : null,
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
                        user_id: userId,
                        goal_percentage: Number(goal_percentage),
                        weight:
                            weight !== "" &&
                                weight !== null &&
                                weight !== undefined
                                ? Number(weight)
                                : null,
                        notes: notes ? notes.trim() : null,
                    },
                ])
                .select("*")
                .single();

            data = result.data;
            error = result.error;
        }

        if (error) {
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

module.exports = {
    getProgress,
    updateProgress,
};