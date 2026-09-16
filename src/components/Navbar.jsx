import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
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
      </ul>

      <Link to="/login">
        <button className="login-btn">Login</button>
      </Link>
    </nav>
  );
}

export default Navbar;