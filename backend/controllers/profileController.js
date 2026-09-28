const bcrypt = require("bcryptjs");
const supabase = require("../config/supabase");

// ========================================
// GET MY PROFILE
// GET /api/profile
// ========================================
async function getProfile(req, res) {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from("users")
            .select("id, name, email, role, created_at")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Get profile error:", error);

            return res.status(500).json({
                message: "Failed to load profile.",
            });
        }

        if (!data) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        return res.status(200).json({
            user: data,
        });
    } catch (error) {
        console.error("Get profile controller error:", error);

        return res.status(500).json({
            message: "Internal server error.",
        });
    }
}


// ========================================
// UPDATE PROFILE
// PUT /api/profile
// ========================================
async function updateProfile(req, res) {
    try {
        const userId = req.user.id;

        const {
            name,
            email,
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required.",
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Email is required.",
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        // Check whether another account already uses this email
        const { data: existingUser, error: emailCheckError } =
            await supabase
                .from("users")
                .select("id")
                .eq("email", cleanEmail)
                .neq("id", userId)
                .maybeSingle();

        if (emailCheckError) {
            console.error(
                "Email check error:",
                emailCheckError
            );

            return res.status(500).json({
                message: "Failed to check email.",
            });
        }

        if (existingUser) {
            return res.status(409).json({
                message:
                    "That email is already being used by another account.",
            });
        }

        const { data, error } = await supabase
            .from("users")
            .update({
                name: cleanName,
                email: cleanEmail,
            })
            .eq("id", userId)
            .select("id, name, email, role, created_at")
            .single();

        if (error) {
            console.error(
                "Update profile error:",
                error
            );

            return res.status(500).json({
                message: "Failed to update profile.",
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: data,
        });
    } catch (error) {
        console.error(
            "Update profile controller error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
        });
    }
}


// ========================================
// CHANGE PASSWORD
// PUT /api/profile/password
// ========================================
async function changePassword(req, res) {
    try {
        const userId = req.user.id;

        const {
            currentPassword,
            newPassword,
        } = req.body;

        if (!currentPassword) {
            return res.status(400).json({
                message: "Current password is required.",
            });
        }

        if (!newPassword) {
            return res.status(400).json({
                message: "New password is required.",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message:
                    "New password must be at least 6 characters.",
            });
        }

        // Get current password hash
        const { data: user, error: userError } =
            await supabase
                .from("users")
                .select("password")
                .eq("id", userId)
                .single();

        if (userError || !user) {
            console.error(
                "Password user lookup error:",
                userError
            );

            return res.status(404).json({
                message: "User not found.",
            });
        }

        // Verify current password
        const passwordMatches = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Current password is incorrect.",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        const { error: updateError } =
            await supabase
                .from("users")
                .update({
                    password: hashedPassword,
                })
                .eq("id", userId);

        if (updateError) {
            console.error(
                "Password update error:",
                updateError
            );

            return res.status(500).json({
                message: "Failed to change password.",
            });
        }

        return res.status(200).json({
            message:
                "Password changed successfully.",
        });
    } catch (error) {
        console.error(
            "Change password controller error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
        });
    }
}


module.exports = {
    getProfile,
    updateProfile,
    changePassword,
};