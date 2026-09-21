import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("fitzone_token");
  const savedUser = localStorage.getItem("fitzone_user");

  const isLoggedIn = !!token;

  let user = null;

  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error("User data error:", error);
    }
  }

  const isAdmin = user?.role === "admin";

  function handleLogout() {
    localStorage.removeItem("fitzone_token");
    localStorage.removeItem("fitzone_user");

    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="logo">FITZONE</div>

      <ul className="nav-links">

        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>

        <li>
          <Link to="/programs">Programs</Link>
        </li>

        {isLoggedIn && (
          <li>
            <Link to="/dashboard">
              Dashboard
            </Link>
          </li>
        )}

        {isAdmin && (
          <li>
            <Link to="/admin">
              Admin
            </Link>
          </li>
        )}

      </ul>

      {isLoggedIn ? (
        <button
          className="login-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <Link to="/login">
          <button className="login-btn">
            Login
          </button>
        </Link>
      )}
    </nav>
  );
}

export default Navbar;