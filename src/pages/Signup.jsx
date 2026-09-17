import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSignup(event) {
        event.preventDefault();
        setMessage("");

        if (!name || !email || !password || !confirmPassword) {
            setMessage("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters.");
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim().toLowerCase(),
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Signup failed.");
                return;
            }

            setMessage("Account created successfully! 💪");

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Signup error:", error);
            setMessage(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="signup-page">
            <div className="signup-container">

                <div className="signup-left">
                    <p className="signup-label">
                        JOIN FITZONE
                    </p>

                    <h1>
                        START YOUR
                        <br />
                        <span>JOURNEY.</span>
                    </h1>

                    <p className="signup-description">
                        Create your FitZone account and take the first
                        step toward becoming stronger, healthier, and
                        more confident.
                    </p>
                </div>

                <div className="signup-card">

                    <div className="signup-logo">
                        FITZONE
                    </div>

                    <h2>Create Account</h2>

                    <p className="signup-subtitle">
                        Join our fitness community
                    </p>

                    <form onSubmit={handleSignup}>

                        <div className="signup-input-group">
                            <label>Full Name</label>

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                            />
                        </div>

                        <div className="signup-input-group">
                            <label>Email Address</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                            />
                        </div>

                        <div className="signup-input-group">
                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />
                        </div>

                        <div className="signup-input-group">
                            <label>Confirm Password</label>

                            <input
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Creating Account..."
                                : "Create Account →"}
                        </button>

                    </form>

                    {message && (
                        <p className="signup-message">
                            {message}
                        </p>
                    )}

                    <div className="signup-divider">
                        <span>OR</span>
                    </div>

                    <p className="login-link">
                        Already have an account?{" "}
                        <Link to="/login">
                            Login
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Signup;