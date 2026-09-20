const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
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
        console.error("Signup error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const { data: user, error } = await supabase
            .from("users")
            .select("id, name, email, password, role, created_at")
            .eq("email", email.trim().toLowerCase())
            .single();

        if (error || !user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
        };

        res.status(200).json({
            message: "Login successful",
            token,
            user: safeUser,
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    signup,
    login,
};