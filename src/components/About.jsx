import { Link } from "react-router-dom";
import "./About.css";
import gymImage from "../assets/image/gym.avif";

function About() {
  return (
    <section className="about">
      <div className="about-text">
        <h2>About FitZone</h2>

        <p>
          At FitZone, we believe fitness is a lifestyle. Our gym offers
          state-of-the-art equipment, certified trainers, and customized
          workout plans to help you achieve your goals.
        </p>

        <div className="stats">
          <div>
            <h3>500+</h3>
            <p>Members</p>
          </div>

          <div>
            <h3>20+</h3>
            <p>Professional Trainers</p>
          </div>

          <div>
            <h3>8+</h3>
            <p>Years Experience</p>
          </div>
        </div>

        <Link to="/about">
          <button className="about-btn">Learn More</button>
        </Link>
      </div>

      <div className="about-image">
        <img src={gymImage} alt="Gym" />
      </div>
    </section>
  );
}

export default About;