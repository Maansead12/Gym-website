import { Link } from "react-router-dom";
import "./AboutPage.css";
import gymImage from "../assets/image/gym.avif";

function AboutPage() {
  return (
    <div className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <p>WELCOME TO FITZONE</p>

          <h1>
            BUILD A <span>STRONGER</span> YOU
          </h1>

          <p className="about-hero-description">
            More than a gym. A place where discipline, strength,
            and determination become your lifestyle.
          </p>
        </div>
      </section>


      {/* About Section */}
      <section className="about-main">

        <div className="about-image">
          <img src={gymImage} alt="FitZone Gym" />
        </div>

        <div className="about-content">
          <p className="section-label">WHO WE ARE</p>

          <h2>
            More Than Just a <span>Gym.</span>
          </h2>

          <p>
            FitZone is a modern fitness center built for people who
            are serious about improving themselves. Whether you are
            starting your fitness journey or already an experienced
            athlete, we provide the environment and support you need.
          </p>

          <p>
            Our goal is simple: help you become stronger, healthier,
            and more confident through quality training, expert
            guidance, and consistency.
          </p>

          <Link to="/login">
            <button>Join FitZone</button>
          </Link>
        </div>

      </section>


      {/* Statistics */}
      <section className="about-stats">

        <div className="stat">
          <h2>5+</h2>
          <p>Years Experience</p>
        </div>

        <div className="stat">
          <h2>2K+</h2>
          <p>Happy Members</p>
        </div>

        <div className="stat">
          <h2>15+</h2>
          <p>Expert Trainers</p>
        </div>

        <div className="stat">
          <h2>50+</h2>
          <p>Weekly Classes</p>
        </div>

      </section>


      {/* Mission */}
      <section className="mission">

        <div className="mission-header">
          <p className="section-label">OUR PURPOSE</p>

          <h2>
            Train With <span>Purpose.</span>
          </h2>
        </div>

        <div className="mission-cards">

          <div className="mission-card">
            <div className="mission-icon">🎯</div>

            <h3>Our Mission</h3>

            <p>
              To inspire people to live healthier and stronger lives
              through effective training and professional guidance.
            </p>
          </div>


          <div className="mission-card">
            <div className="mission-icon">👁️</div>

            <h3>Our Vision</h3>

            <p>
              To create a fitness community where everyone feels
              motivated, supported, and capable of achieving their goals.
            </p>
          </div>


          <div className="mission-card">
            <div className="mission-icon">🔥</div>

            <h3>Our Values</h3>

            <p>
              Discipline, consistency, hard work, and determination
              are the foundation of everything we do.
            </p>
          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="about-cta">

        <p className="section-label">READY TO CHANGE?</p>

        <h2>
          Your Best Version <span>Starts Here.</span>
        </h2>

        <p>
          Stop waiting. Start training and become the strongest
          version of yourself.
        </p>

        <Link to="/login">
          <button>Start Your Journey</button>
        </Link>

      </section>

    </div>
  );
}

export default AboutPage;