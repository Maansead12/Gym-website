const supabase = require("../config/supabase");

const getMembership = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from("memberships")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(200).json({
            membership: data,
        });
    } catch (error) {
        console.error("Get membership error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const createMembership = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            plan,
            start_date,
            end_date,
        } = req.body;

        if (!plan) {
            return res.status(400).json({
                message: "Membership plan is required",
            });
        }

        const validPlans = [
            "Basic",
            "Premium",
            "Pro",
        ];

        if (!validPlans.includes(plan)) {
            return res.status(400).json({
                message: "Invalid membership plan",
            });
        }

        const { data: existingMembership, error: findError } =
            await supabase
                .from("memberships")
                .select("*")
                .eq("user_id", userId)
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

        const membershipData = {
            user_id: userId,
            plan,
            status: "active",
            start_date:
                start_date ||
                new Date().toISOString().split("T")[0],
            end_date: end_date || null,
        };

        if (existingMembership) {
            const result = await supabase
                .from("memberships")
                .update({
                    plan: membershipData.plan,
                    status: membershipData.status,
                    start_date: membershipData.start_date,
                    end_date: membershipData.end_date,
                })
                .eq("id", existingMembership.id)
                .select("*")
                .single();

            data = result.data;
            error = result.error;
        } else {
            const result = await supabase
                .from("memberships")
                .insert([membershipData])
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
            message: "Membership updated successfully",
            membership: data,
        });
    } catch (error) {
        console.error("Create membership error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    getMembership,
    createMembership,
};