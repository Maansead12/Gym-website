const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from("users")
            .insert([
                {
                    name,
                    email,
                    password: hashedPassword,
                    role: "member",
                },
            ])
            .select("id, name, email, role, created_at")
            .single();

        if (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    message: "Email already exists",
                });
            }

            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(201).json({
            message: "Account created successfully",
            user: data,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    signup,
};