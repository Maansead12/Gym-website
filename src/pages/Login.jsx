import { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setMessage("Login successful! Welcome to FitZone 💪");
  }

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-left">
          <p className="login-label">WELCOME BACK</p>

          <h1>
            TRAIN <span>HARD.</span>
            <br />
            STAY <span>STRONG.</span>
          </h1>

          <p className="login-description">
            Sign in to your FitZone account and continue your
            fitness journey.
          </p>
        </div>


        <div className="login-card">

          <div className="login-logo">
            FITZONE
          </div>

          <h2>Member Login</h2>

          <p className="login-subtitle">
            Access your fitness account
          </p>


          <form onSubmit={handleLogin}>

            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>


            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>


            <div className="login-options">

              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <a href="#" onClick={(event) => event.preventDefault()}>
                Forgot Password?
              </a>

            </div>


            <button type="submit">
              Login →
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
            Don't have an account?
            <a href="#" onClick={(event) => event.preventDefault()}>
              {" "}Create Account
            </a>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;