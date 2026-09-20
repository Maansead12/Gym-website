import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("fitzone_token");
        const savedUser = localStorage.getItem("fitzone_user");

        if (!token || !savedUser) {
            navigate("/login");
            return;
        }

        const currentUser = JSON.parse(savedUser);
        setUser(currentUser);

        async function loadDashboard() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/dashboard",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem("fitzone_token");
                        localStorage.removeItem("fitzone_user");
                        navigate("/login");
                        return;
                    }

                    throw new Error(
                        data.message || "Failed to load dashboard"
                    );
                }

                setDashboard(data);
            } catch (error) {
                console.error("Dashboard error:", error);
                setError(
                    "Unable to load your dashboard data."
                );
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, [navigate]);

    if (!user || loading) {
        return (
            <div className="dashboard-loading">
                <h2>Loading Dashboard...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-loading">
                <h2>{error}</h2>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    const membership = dashboard?.membership;
    const workoutCount = dashboard?.workoutCount || 0;
    const progress = dashboard?.progress;
    const recentWorkouts = dashboard?.recentWorkouts || [];

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

                        <strong>
                            {membership?.status
                                ? membership.status.toUpperCase()
                                : "NO PLAN"}
                        </strong>

                        <p>
                            {membership?.plan || "No membership yet"}
                        </p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Workouts</h3>

                        <strong>{workoutCount}</strong>

                        <p>This Month</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Progress</h3>

                        <strong>
                            {progress?.goal_percentage || 0}%
                        </strong>

                        <p>Monthly Goal</p>
                    </div>

                </section>

                <section className="dashboard-activity">

                    <h2>Recent Activity</h2>

                    {recentWorkouts.length === 0 ? (
                        <div className="activity-empty">
                            <p>No workouts recorded yet.</p>
                            <span>
                                Your workouts will appear here.
                            </span>
                        </div>
                    ) : (
                        recentWorkouts.map((workout) => (
                            <div
                                className="activity-item"
                                key={workout.id}
                            >
                                <span>🏋️</span>

                                <div>
                                    <strong>
                                        {workout.workout_name}
                                    </strong>

                                    <p>
                                        {workout.workout_type ||
                                            "Workout"}

                                        {workout.duration
                                            ? ` • ${workout.duration} min`
                                            : ""}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}

                </section>

            </main>

        </div>
    );
}

export default Dashboard;