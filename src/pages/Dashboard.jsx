import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("fitzone_token");
        const savedUser = localStorage.getItem("fitzone_user");

        if (!token || !savedUser) {
            navigate("/login");
            return;
        }

        setUser(JSON.parse(savedUser));
    }, [navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-page">

            <main className="dashboard-content">

                <section className="dashboard-welcome">
                    <p>WELCOME BACK</p>

                    <h1>
                        Hello, <span>{user.name}</span> 👋
                    </h1>

                    <p>
                        Ready to get stronger and reach your fitness goals?
                    </p>
                </section>

                <section className="dashboard-cards">

                    <div className="dashboard-card">
                        <h3>Membership</h3>
                        <strong>ACTIVE</strong>
                        <p>FitZone Member</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Workouts</h3>
                        <strong>12</strong>
                        <p>This Month</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Progress</h3>
                        <strong>78%</strong>
                        <p>Monthly Goal</p>
                    </div>

                </section>

                <section className="dashboard-activity">

                    <h2>Recent Activity</h2>

                    <div className="activity-item">
                        <span>🏋️</span>
                        <div>
                            <strong>Strength Training</strong>
                            <p>Completed workout</p>
                        </div>
                    </div>

                    <div className="activity-item">
                        <span>💪</span>
                        <div>
                            <strong>Chest Workout</strong>
                            <p>Completed workout</p>
                        </div>
                    </div>

                    <div className="activity-item">
                        <span>🏃</span>
                        <div>
                            <strong>Cardio</strong>
                            <p>Completed workout</p>
                        </div>
                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;