import "./Features.css";

function Features() {
  const features = [
    {
      title: "Modern Equipment",
      desc: "Train with world-class machines and the latest fitness technology.",
      icon: "🏋️",
    },
    {
      title: "Expert Trainers",
      desc: "Certified trainers to guide you toward your fitness goals.",
      icon: "💪",
    },
    {
      title: "Nutrition Plans",
      desc: "Personalized meal plans for muscle gain and fat loss.",
      icon: "🥗",
    },
  ];

  return (
    <section className="features">
      <h2>Why Choose FitZone?</h2>

      <div className="feature-container">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;