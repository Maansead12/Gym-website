import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    function handleSignup(event) {
        event.preventDefault();

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

        setMessage("Account created successfully! 💪");
    }

    return (
        <div className="signup-page">

            <div className="signup-container">

                {/* Left Side */}
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


                {/* Sign Up Card */}
                <div className="signup-card">

                    <div className="signup-logo">
                        FITZONE
                    </div>

                    <h2>Create Account</h2>

                    <p className="signup-subtitle">
                        Join our fitness community
                    </p>


                    <form onSubmit={handleSignup}>

                        {/* Name */}
                        <div className="signup-input-group">
                            <label>Full Name</label>

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>


                        {/* Email */}
                        <div className="signup-input-group">
                            <label>Email Address</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>


                        {/* Password */}
                        <div className="signup-input-group">
                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>


                        {/* Confirm Password */}
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


                        <button type="submit">
                            Create Account →
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
                        Already have an account?

                        <Link to="/login">
                            {" "}Login
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Signup;