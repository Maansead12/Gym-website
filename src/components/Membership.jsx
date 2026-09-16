import { Link } from "react-router-dom";
import "./Membership.css";

function Membership() {
  const plans = [
    {
      name: "Basic",
      price: "₹999",
      features: [
        "Gym Access",
        "Locker",
        "Free Wi-Fi",
      ],
    },
    {
      name: "Premium",
      price: "₹1999",
      features: [
        "Everything in Basic",
        "Personal Trainer",
        "Diet Plan",
      ],
    },
    {
      name: "Elite",
      price: "₹2999",
      features: [
        "Everything in Premium",
        "VIP Support",
        "Unlimited Classes",
      ],
    },
  ];

  return (
    <section className="membership">
      <h2>Membership Plans</h2>

      <div className="plans">
        {plans.map((plan, index) => (
          <div className="plan" key={index}>
            <h3>{plan.name}</h3>

            <h1>{plan.price}</h1>

            {plan.features.map((item, i) => (
              <p key={i}>✔ {item}</p>
            ))}

            <Link to="/login">
              <button>Choose Plan</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Membership;