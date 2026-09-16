import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          BUILD YOUR <br />
          <span>DREAM BODY</span>
        </h1>

        <p>
          Join our fitness community and achieve your goals with
          professional trainers and modern equipment.
        </p>

        <Link to="/login">
          <button>Join Now</button>
        </Link>
      </div>
    </section>
  );
}

export default Hero;