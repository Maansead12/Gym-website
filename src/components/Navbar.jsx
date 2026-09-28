import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

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

  const userName = user?.name || "Member";

  const userInitial = userName
    .charAt(0)
    .toUpperCase();

  function isActive(path) {
    return location.pathname === path;
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("fitzone_token");
    localStorage.removeItem("fitzone_user");

    setMenuOpen(false);

    navigate("/login");
  }

  return (
    <nav className="navbar">

      {/* LOGO */}

      <Link
        to="/"
        className="navbar-logo"
        onClick={closeMenu}
      >
        FITZONE
      </Link>


      {/* DESKTOP / MOBILE LINKS */}

      <div
        className={`navbar-menu ${menuOpen ? "navbar-menu-open" : ""
          }`}
      >

        <ul className="nav-links">

          <li>
            <Link
              to="/"
              className={
                isActive("/")
                  ? "active"
                  : ""
              }
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className={
                isActive("/about")
                  ? "active"
                  : ""
              }
              onClick={closeMenu}
            >
              About
            </Link>
          </li>

          <li>
            <Link
              to="/programs"
              className={
                isActive("/programs")
                  ? "active"
                  : ""
              }
              onClick={closeMenu}
            >
              Programs
            </Link>
          </li>

          {isLoggedIn && (
            <li>
              <Link
                to="/dashboard"
                className={
                  isActive(
                    "/dashboard"
                  )
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            </li>
          )}

          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className={
                  location.pathname.startsWith(
                    "/admin"
                  )
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                Admin
              </Link>
            </li>
          )}

        </ul>


        {/* MOBILE USER AREA */}

        {isLoggedIn && (
          <div className="mobile-user-area">

            <div className="mobile-user-info">

              <div className="navbar-avatar">
                {userInitial}
              </div>

              <div>
                <strong>
                  {userName}
                </strong>

                <span>
                  {isAdmin
                    ? "Administrator"
                    : "Member"}
                </span>
              </div>

            </div>

            <button
              className="mobile-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        )}

      </div>


      {/* RIGHT SIDE */}

      <div className="navbar-right">

        {isLoggedIn ? (

          <div className="navbar-user">

            <div className="navbar-user-text">

              <strong>
                {userName}
              </strong>

              {isAdmin && (
                <span>
                  ADMIN
                </span>
              )}

            </div>

            <div className="navbar-avatar">
              {userInitial}
            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        ) : (

          <Link to="/login">
            <button className="login-btn">
              Login
            </button>
          </Link>

        )}

      </div>


      {/* MOBILE MENU BUTTON */}

      <button
        className={`navbar-toggle ${menuOpen
            ? "navbar-toggle-open"
            : ""
          }`}
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >

        <span></span>
        <span></span>
        <span></span>

      </button>

    </nav>
  );
}

export default Navbar;