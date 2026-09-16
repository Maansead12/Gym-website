import { Link } from "react-router-dom";
import "./Programs.css";

const programs = [
  {
    title: "Weight Training",
    description: "Build strength and increase muscle mass.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
  },
  {
    title: "Cardio Fitness",
    description: "Improve endurance and burn calories.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&auto=format&fit=crop&q=80",
  },
  {
    title: "CrossFit",
    description: "High-intensity functional workouts.",
    image:
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&auto=format&fit=crop&q=80",
  },
  {
    title: "Yoga",
    description: "Improve flexibility and balance.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80",
  },
  {
    title: "Personal Training",
    description: "One-on-one coaching with professionals.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
  },
  {
    title: "Bodybuilding",
    description: "Professional muscle-building plans.",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
  },
];

function Programs() {
  return (
    <section className="programs">
      <h2>Our Programs</h2>

      <div className="program-grid">
        {programs.map((program, index) => (
          <div className="program-card" key={index}>
            <img src={program.image} alt={program.title} />

            <div className="program-content">
              <h3>{program.title}</h3>

              <p>{program.description}</p>

              <Link to="/programs">
                <button>Learn More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Programs;