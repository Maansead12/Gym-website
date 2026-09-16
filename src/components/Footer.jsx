import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-logo">
          <h2>FITZONE</h2>

          <p>
            Transform your body and mind with the best fitness
            experience.
          </p>
        </div>


        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/programs">Programs</Link>
          <Link to="/login">Login</Link>
        </div>


        <div className="footer-contact">
          <h3>Contact</h3>

          <p>📍 Bhubaneswar, India</p>
          <p>📞 +91 9876543210</p>
          <p>✉ fitzone@gmail.com</p>
        </div>

      </div>


      <hr />


      <p className="copyright">
        © 2026 FitZone Gym. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;