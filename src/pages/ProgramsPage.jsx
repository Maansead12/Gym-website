import { Link } from "react-router-dom";
import "./ProgramsPage.css";

const programs = [
  {
    title: "Weight Training",
    description:
      "Build strength, increase muscle mass, and develop a powerful physique.",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=85",
    icon: "🏋️",
  },
  {
    title: "Cardio Fitness",
    description:
      "Improve your endurance, heart health, and overall fitness while burning calories.",
    image:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=85",
    icon: "❤️",
  },
  {
    title: "CrossFit",
    description:
      "High-intensity functional training designed to challenge your entire body.",
    image:
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format&fit=crop&q=85",
    icon: "🔥",
  },
  {
    title: "Yoga",
    description:
      "Improve flexibility, balance, mobility, and mental relaxation.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=85",
    icon: "🧘",
  },
  {
    title: "Boxing",
    description:
      "Learn boxing techniques while improving strength, speed, and fitness.",
    image:
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=85",
    icon: "🥊",
  },
  {
    title: "Personal Training",
    description:
      "Get one-on-one coaching and a training program designed around your goals.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=85",
    icon: "💪",
  },
];

function ProgramsPage() {
  return (
    <div className="programs-page">

      {/* Hero */}
      <section className="programs-hero">
        <div className="programs-hero-content">
          <p>TRAIN • IMPROVE • TRANSFORM</p>

          <h1>
            OUR <span>PROGRAMS</span>
          </h1>

          <p className="programs-hero-description">
            Find the perfect workout program and take your fitness
            journey to the next level.
          </p>
        </div>
      </section>


      {/* Programs */}
      <section className="programs-section">

        <div className="programs-header">
          <p className="section-label">CHOOSE YOUR WORKOUT</p>

          <h2>
            Find Your <span>Program</span>
          </h2>

          <p>
            Whether your goal is building muscle, losing fat, improving
            fitness, or becoming stronger, we have a program for you.
          </p>
        </div>


        <div className="programs-grid">

          {programs.map((program, index) => (
            <div className="program-page-card" key={index}>

              <div className="program-image">
                <img
                  src={program.image}
                  alt={program.title}
                />

                <div className="program-icon">
                  {program.icon}
                </div>
              </div>

              <div className="program-card-content">

                <h3>{program.title}</h3>

                <p>{program.description}</p>

                <Link to="/login">
                  <button>
                    Learn More →
                  </button>
                </Link>

              </div>

            </div>
          ))}

        </div>

      </section>


      {/* CTA */}
      <section className="programs-cta">

        <p className="section-label">READY TO START?</p>

        <h2>
          Your Transformation <span>Starts Today.</span>
        </h2>

        <p>
          Choose a program, stay consistent, and become the strongest
          version of yourself.
        </p>

        <Link to="/login">
          <button>
            Join FitZone
          </button>
        </Link>

      </section>

    </div>
  );
}

export default ProgramsPage;