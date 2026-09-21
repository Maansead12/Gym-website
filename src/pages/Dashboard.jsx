import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Workout states
    const [workoutName, setWorkoutName] = useState("");
    const [workoutType, setWorkoutType] = useState("Strength");
    const [duration, setDuration] = useState("");
    const [workoutDate, setWorkoutDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [workoutMessage, setWorkoutMessage] = useState("");
    const [addingWorkout, setAddingWorkout] = useState(false);

    // Progress states
    const [weight, setWeight] = useState("");
    const [goalPercentage, setGoalPercentage] = useState(0);
    const [notes, setNotes] = useState("");
    const [progressMessage, setProgressMessage] = useState("");
    const [updatingProgress, setUpdatingProgress] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("fitzone_token");
        const savedUser = localStorage.getItem("fitzone_user");

        if (!token || !savedUser) {
            navigate("/login");
            return;
        }

        const currentUser = JSON.parse(savedUser);

        setUser(currentUser);

        loadDashboard(token);
    }, [navigate]);

    async function loadDashboard(token) {
        try {
            setLoading(true);
            setError("");

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

            // Load existing progress into the form
            if (data.progress) {
                setWeight(
                    data.progress.weight !== null &&
                        data.progress.weight !== undefined
                        ? data.progress.weight
                        : ""
                );

                setGoalPercentage(
                    data.progress.goal_percentage || 0
                );

                setNotes(data.progress.notes || "");
            }
        } catch (error) {
            console.error("Dashboard error:", error);

            setError("Unable to load your dashboard data.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddWorkout(event) {
        event.preventDefault();

        setWorkoutMessage("");

        if (!workoutName.trim()) {
            setWorkoutMessage("Please enter a workout name.");
            return;
        }

        try {
            setAddingWorkout(true);

            const token = localStorage.getItem("fitzone_token");

            const response = await fetch(
                "http://localhost:5000/api/workouts",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        workout_name: workoutName.trim(),
                        workout_type: workoutType,
                        duration: duration
                            ? Number(duration)
                            : null,
                        workout_date: workoutDate,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setWorkoutMessage(
                    data.message || "Failed to add workout."
                );

                return;
            }

            setWorkoutMessage(
                "Workout added successfully! 💪"
            );

            setWorkoutName("");
            setWorkoutType("Strength");
            setDuration("");

            setWorkoutDate(
                new Date().toISOString().split("T")[0]
            );

            await loadDashboard(token);
        } catch (error) {
            console.error("Add workout error:", error);

            setWorkoutMessage(
                "Unable to connect to the server."
            );
        } finally {
            setAddingWorkout(false);
        }
    }

    async function handleUpdateProgress(event) {
        event.preventDefault();

        setProgressMessage("");

        if (
            goalPercentage === "" ||
            Number(goalPercentage) < 0 ||
            Number(goalPercentage) > 100
        ) {
            setProgressMessage(
                "Goal percentage must be between 0 and 100."
            );

            return;
        }

        try {
            setUpdatingProgress(true);

            const token = localStorage.getItem("fitzone_token");

            const response = await fetch(
                "http://localhost:5000/api/progress",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        weight: weight
                            ? Number(weight)
                            : null,
                        goal_percentage: Number(goalPercentage),
                        notes: notes.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setProgressMessage(
                    data.message || "Failed to update progress."
                );

                return;
            }

            setProgressMessage(
                "Progress updated successfully! 💪"
            );

            await loadDashboard(token);
        } catch (error) {
            console.error("Progress update error:", error);

            setProgressMessage(
                "Unable to connect to the server."
            );
        } finally {
            setUpdatingProgress(false);
        }
    }

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

                <button
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    const membership = dashboard?.membership;

    const workoutCount =
        dashboard?.workoutCount || 0;

    const progress = dashboard?.progress;

    const recentWorkouts =
        dashboard?.recentWorkouts || [];

    return (
        <div className="dashboard-page">
            <main className="dashboard-content">

                {/* WELCOME */}

                <section className="dashboard-welcome">
                    <p>WELCOME BACK</p>

                    <h1>
                        Hello, <span>{user.name}</span> 👋
                    </h1>

                    <p>
                        Ready to get stronger and reach your
                        fitness goals?
                    </p>
                </section>

                {/* DASHBOARD CARDS */}

                <section className="dashboard-cards">

                    <div className="dashboard-card">
                        <h3>Membership</h3>

                        <strong>
                            {membership?.status
                                ? membership.status.toUpperCase()
                                : "NO PLAN"}
                        </strong>

                        <p>
                            {membership?.plan ||
                                "No membership yet"}
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

                {/* PROGRESS */}

                <section className="progress-section">

                    <h2>My Progress</h2>

                    <p>
                        Update your weight and fitness goal progress.
                    </p>

                    <form
                        className="progress-form"
                        onSubmit={handleUpdateProgress}
                    >

                        <div className="progress-input-group">
                            <label>Current Weight (kg)</label>

                            <input
                                type="number"
                                min="1"
                                step="0.1"
                                placeholder="e.g. 85.5"
                                value={weight}
                                onChange={(event) =>
                                    setWeight(event.target.value)
                                }
                            />
                        </div>

                        <div className="progress-input-group">
                            <label>Goal Progress (%)</label>

                            <input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0 - 100"
                                value={goalPercentage}
                                onChange={(event) =>
                                    setGoalPercentage(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="progress-input-group progress-notes">
                            <label>Notes</label>

                            <textarea
                                placeholder="Write something about your progress..."
                                value={notes}
                                onChange={(event) =>
                                    setNotes(event.target.value)
                                }
                                rows="4"
                            />
                        </div>

                        <button
                            className="update-progress-btn"
                            type="submit"
                            disabled={updatingProgress}
                        >
                            {updatingProgress
                                ? "Updating..."
                                : "Update Progress →"}
                        </button>

                    </form>

                    {progressMessage && (
                        <p className="progress-message">
                            {progressMessage}
                        </p>
                    )}

                </section>

                {/* ADD WORKOUT */}

                <section className="add-workout-section">

                    <h2>Add Workout</h2>

                    <p>
                        Record your workout and keep track of
                        your fitness activity.
                    </p>

                    <form
                        className="workout-form"
                        onSubmit={handleAddWorkout}
                    >

                        <div className="workout-input-group">
                            <label>Workout Name</label>

                            <input
                                type="text"
                                placeholder="e.g. Chest Workout"
                                value={workoutName}
                                onChange={(event) =>
                                    setWorkoutName(event.target.value)
                                }
                            />
                        </div>

                        <div className="workout-input-group">
                            <label>Workout Type</label>

                            <select
                                value={workoutType}
                                onChange={(event) =>
                                    setWorkoutType(event.target.value)
                                }
                            >
                                <option value="Strength">
                                    Strength
                                </option>

                                <option value="Cardio">
                                    Cardio
                                </option>

                                <option value="Chest">
                                    Chest
                                </option>

                                <option value="Back">
                                    Back
                                </option>

                                <option value="Legs">
                                    Legs
                                </option>

                                <option value="Shoulders">
                                    Shoulders
                                </option>

                                <option value="Arms">
                                    Arms
                                </option>

                                <option value="Full Body">
                                    Full Body
                                </option>
                            </select>
                        </div>

                        <div className="workout-input-group">
                            <label>Duration (minutes)</label>

                            <input
                                type="number"
                                min="1"
                                placeholder="60"
                                value={duration}
                                onChange={(event) =>
                                    setDuration(event.target.value)
                                }
                            />
                        </div>

                        <div className="workout-input-group">
                            <label>Workout Date</label>

                            <input
                                type="date"
                                value={workoutDate}
                                onChange={(event) =>
                                    setWorkoutDate(event.target.value)
                                }
                            />
                        </div>

                        <button
                            className="add-workout-btn"
                            type="submit"
                            disabled={addingWorkout}
                        >
                            {addingWorkout
                                ? "Adding Workout..."
                                : "Add Workout →"}
                        </button>

                    </form>

                    {workoutMessage && (
                        <p className="workout-message">
                            {workoutMessage}
                        </p>
                    )}

                </section>

                {/* RECENT ACTIVITY */}

                <section className="dashboard-activity">

                    <h2>Recent Activity</h2>

                    {recentWorkouts.length === 0 ? (
                        <div className="activity-empty">
                            <p>No workouts recorded yet.</p>

                            <span>
                                Add your first workout above.
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