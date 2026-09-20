import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("fitzone_token", data.token);
      localStorage.setItem(
        "fitzone_user",
        JSON.stringify(data.user)
      );

      setMessage(`Welcome back, ${data.user.name}! 💪`);

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-left">
          <p className="login-label">
            WELCOME BACK
          </p>

          <h1>
            TRAIN HARD.
            <br />
            <span>STAY STRONG.</span>
          </h1>

          <p className="login-description">
            Log in to your FitZone account and continue
            your fitness journey.
          </p>
        </div>

        <div className="login-card">

          <div className="login-logo">
            FITZONE
          </div>

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Login to your account
          </p>

          <form onSubmit={handleLogin}>

            <div className="login-input-group">
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

            <div className="login-input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging In..." : "Login →"}
            </button>

          </form>

          {message && (
            <p className="login-message">
              {message}
            </p>
          )}

          <div className="login-divider">
            <span>OR</span>
          </div>

          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/signup">
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;