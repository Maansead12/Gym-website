import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Workout
    const [workoutName, setWorkoutName] = useState("");
    const [workoutType, setWorkoutType] = useState("Strength");
    const [duration, setDuration] = useState("");
    const [workoutDate, setWorkoutDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [workoutMessage, setWorkoutMessage] = useState("");
    const [addingWorkout, setAddingWorkout] = useState(false);

    // Progress
    const [weight, setWeight] = useState("");
    const [goalPercentage, setGoalPercentage] = useState(0);
    const [notes, setNotes] = useState("");
    const [progressMessage, setProgressMessage] = useState("");
    const [updatingProgress, setUpdatingProgress] = useState(false);

    // Membership
    const [membershipPlan, setMembershipPlan] = useState("Basic");
    const [membershipStartDate, setMembershipStartDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [membershipEndDate, setMembershipEndDate] = useState("");
    const [membershipMessage, setMembershipMessage] = useState("");
    const [updatingMembership, setUpdatingMembership] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("fitzone_token");
        const savedUser = localStorage.getItem("fitzone_user");

        if (!token || !savedUser) {
            navigate("/login");
            return;
        }

        try {
            const currentUser = JSON.parse(savedUser);
            setUser(currentUser);
            loadDashboard(token);
        } catch (error) {
            console.error("User data error:", error);
            navigate("/login");
        }
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

            if (data.membership) {
                setMembershipPlan(
                    data.membership.plan || "Basic"
                );

                setMembershipStartDate(
                    data.membership.start_date ||
                    new Date().toISOString().split("T")[0]
                );

                setMembershipEndDate(
                    data.membership.end_date || ""
                );
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
                        goal_percentage:
                            Number(goalPercentage),
                        notes: notes.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setProgressMessage(
                    data.message ||
                    "Failed to update progress."
                );
                return;
            }

            setProgressMessage(
                "Progress updated successfully! 💪"
            );

            await loadDashboard(token);
        } catch (error) {
            console.error(
                "Progress update error:",
                error
            );

            setProgressMessage(
                "Unable to connect to the server."
            );
        } finally {
            setUpdatingProgress(false);
        }
    }

    async function handleUpdateMembership(event) {
        event.preventDefault();
        setMembershipMessage("");

        if (!membershipPlan) {
            setMembershipMessage(
                "Please select a membership plan."
            );
            return;
        }

        if (!membershipStartDate) {
            setMembershipMessage(
                "Please select a start date."
            );
            return;
        }

        if (
            membershipEndDate &&
            membershipEndDate < membershipStartDate
        ) {
            setMembershipMessage(
                "End date cannot be before start date."
            );
            return;
        }

        try {
            setUpdatingMembership(true);

            const token = localStorage.getItem("fitzone_token");

            const response = await fetch(
                "http://localhost:5000/api/memberships",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        plan: membershipPlan,
                        start_date: membershipStartDate,
                        end_date:
                            membershipEndDate || null,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMembershipMessage(
                    data.message ||
                    "Failed to update membership."
                );
                return;
            }

            setMembershipMessage(
                "Membership updated successfully! 💪"
            );

            await loadDashboard(token);
        } catch (error) {
            console.error(
                "Membership update error:",
                error
            );

            setMembershipMessage(
                "Unable to connect to the server."
            );
        } finally {
            setUpdatingMembership(false);
        }
    }

    if (!user || loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <h2>Loading Dashboard...</h2>
                <p>Preparing your fitness overview</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-loading">
                <div className="error-icon">!</div>
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
    const workoutCount = dashboard?.workoutCount || 0;
    const progress = dashboard?.progress;
    const recentWorkouts =
        dashboard?.recentWorkouts || [];

    const goal = Number(
        progress?.goal_percentage || 0
    );

    const membershipStatus =
        membership?.status || "inactive";

    function getWorkoutIcon(type) {
        const icons = {
            Chest: "💪",
            Back: "🏋️",
            Legs: "🦵",
            Shoulders: "🏋️",
            Arms: "💪",
            Cardio: "🏃",
            Strength: "🔥",
            "Full Body": "⚡",
        };

        return icons[type] || "🏋️";
    }

    function formatDate(date) {
        if (!date) return "—";

        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    return (
        <div className="dashboard-page">
            <main className="dashboard-content">

                {/* HERO */}

                <section className="dashboard-hero">

                    <div className="hero-content">

                        <div className="hero-label">
                            MEMBER DASHBOARD
                        </div>

                        <h1>
                            Welcome back,{" "}
                            <span>{user.name}</span>
                        </h1>

                        <p>
                            Track your training, monitor your
                            progress, and stay consistent.
                        </p>

                        <div className="hero-actions">
                            <button
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "workout-section"
                                        )
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                                className="hero-primary-btn"
                            >
                                + Add Workout
                            </button>

                            <button
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "progress-section"
                                        )
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                                className="hero-secondary-btn"
                            >
                                View Progress
                            </button>
                        </div>

                    </div>

                    <div className="hero-avatar">
                        {user.name
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                </section>

                {/* OVERVIEW */}

                <section className="overview-grid">

                    <div className="overview-card">
                        <div className="overview-icon membership-icon">
                            💳
                        </div>

                        <div>
                            <span>MEMBERSHIP</span>

                            <strong>
                                {membership?.plan ||
                                    "No Plan"}
                            </strong>

                            <small
                                className={
                                    membershipStatus ===
                                        "active"
                                        ? "status-active"
                                        : "status-inactive"
                                }
                            >
                                {membershipStatus}
                            </small>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="overview-icon workout-icon">
                            🏋️
                        </div>

                        <div>
                            <span>WORKOUTS</span>

                            <strong>
                                {workoutCount}
                            </strong>

                            <small>
                                Total recorded
                            </small>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="overview-icon progress-icon">
                            📈
                        </div>

                        <div>
                            <span>GOAL PROGRESS</span>

                            <strong>
                                {goal}%
                            </strong>

                            <small>
                                Current progress
                            </small>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="overview-icon weight-icon">
                            ⚖️
                        </div>

                        <div>
                            <span>WEIGHT</span>

                            <strong>
                                {progress?.weight
                                    ? `${progress.weight}`
                                    : "—"}
                            </strong>

                            <small>
                                {progress?.weight
                                    ? "kg"
                                    : "Not recorded"}
                            </small>
                        </div>
                    </div>

                </section>

                {/* PROGRESS SNAPSHOT */}

                <section
                    className="progress-snapshot"
                    id="progress-section"
                >
                    <div className="section-heading">
                        <div>
                            <span>YOUR FITNESS JOURNEY</span>
                            <h2>Progress Snapshot</h2>
                        </div>

                        <strong>
                            {goal}%
                        </strong>
                    </div>

                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${Math.min(
                                    Math.max(goal, 0),
                                    100
                                )}%`,
                            }}
                        ></div>
                    </div>

                    <div className="progress-meta">
                        <span>0%</span>
                        <span>Goal completion</span>
                        <span>100%</span>
                    </div>

                    <div className="progress-details">

                        <div>
                            <span>Current Weight</span>
                            <strong>
                                {progress?.weight
                                    ? `${progress.weight} kg`
                                    : "Not recorded"}
                            </strong>
                        </div>

                        <div>
                            <span>Last Updated</span>
                            <strong>
                                {progress?.updated_at
                                    ? new Date(
                                        progress.updated_at
                                    ).toLocaleDateString()
                                    : "Not recorded"}
                            </strong>
                        </div>

                        <div>
                            <span>Member Since</span>
                            <strong>
                                {user.created_at
                                    ? new Date(
                                        user.created_at
                                    ).toLocaleDateString()
                                    : "—"}
                            </strong>
                        </div>

                    </div>

                    {progress?.notes && (
                        <div className="progress-note">
                            <span>PROGRESS NOTE</span>
                            <p>
                                {progress.notes}
                            </p>
                        </div>
                    )}
                </section>

                {/* MEMBERSHIP */}

                <section className="dashboard-section">

                    <div className="section-heading">
                        <div>
                            <span>MEMBERSHIP</span>
                            <h2>My Membership</h2>
                        </div>
                    </div>

                    <div className="current-membership">

                        <div className="membership-plan-card">
                            <div className="plan-top">
                                <span>CURRENT PLAN</span>

                                <span
                                    className={
                                        membershipStatus ===
                                            "active"
                                            ? "membership-status active"
                                            : "membership-status"
                                    }
                                >
                                    {membershipStatus}
                                </span>
                            </div>

                            <h3>
                                {membership?.plan ||
                                    "No Membership"}
                            </h3>

                            <div className="membership-dates">

                                <div>
                                    <span>
                                        START DATE
                                    </span>
                                    <strong>
                                        {formatDate(
                                            membership?.start_date
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        END DATE
                                    </span>
                                    <strong>
                                        {formatDate(
                                            membership?.end_date
                                        )}
                                    </strong>
                                </div>

                            </div>
                        </div>

                        <form
                            className="dashboard-form membership-form"
                            onSubmit={
                                handleUpdateMembership
                            }
                        >
                            <div className="form-grid">

                                <div className="form-group">
                                    <label>
                                        Membership Plan
                                    </label>

                                    <select
                                        value={
                                            membershipPlan
                                        }
                                        onChange={(event) =>
                                            setMembershipPlan(
                                                event.target
                                                    .value
                                            )
                                        }
                                    >
                                        <option value="Basic">
                                            Basic
                                        </option>
                                        <option value="Premium">
                                            Premium
                                        </option>
                                        <option value="Pro">
                                            Pro
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            membershipStartDate
                                        }
                                        onChange={(event) =>
                                            setMembershipStartDate(
                                                event.target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            membershipEndDate
                                        }
                                        onChange={(event) =>
                                            setMembershipEndDate(
                                                event.target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                            </div>

                            <button
                                className="primary-btn"
                                type="submit"
                                disabled={
                                    updatingMembership
                                }
                            >
                                {updatingMembership
                                    ? "Updating..."
                                    : "Update Membership →"}
                            </button>

                            {membershipMessage && (
                                <p className="form-message">
                                    {membershipMessage}
                                </p>
                            )}
                        </form>

                    </div>

                </section>

                {/* PROGRESS FORM */}

                <section className="dashboard-section">

                    <div className="section-heading">
                        <div>
                            <span>FITNESS TRACKING</span>
                            <h2>Update My Progress</h2>
                        </div>
                    </div>

                    <form
                        className="dashboard-form"
                        onSubmit={handleUpdateProgress}
                    >

                        <div className="form-grid">

                            <div className="form-group">
                                <label>
                                    Current Weight (kg)
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    step="0.1"
                                    placeholder="e.g. 85.5"
                                    value={weight}
                                    onChange={(event) =>
                                        setWeight(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Goal Progress (%)
                                </label>

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

                        </div>

                        <div className="form-group full-width">
                            <label>
                                Progress Notes
                            </label>

                            <textarea
                                rows="5"
                                placeholder="Write something about your training, nutrition, consistency, recovery, or goals..."
                                value={notes}
                                onChange={(event) =>
                                    setNotes(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <button
                            className="primary-btn"
                            type="submit"
                            disabled={updatingProgress}
                        >
                            {updatingProgress
                                ? "Updating..."
                                : "Save Progress →"}
                        </button>

                        {progressMessage && (
                            <p className="form-message">
                                {progressMessage}
                            </p>
                        )}

                    </form>

                </section>

                {/* ADD WORKOUT */}

                <section
                    className="dashboard-section"
                    id="workout-section"
                >

                    <div className="section-heading">
                        <div>
                            <span>TRAINING LOG</span>
                            <h2>Add Workout</h2>
                        </div>
                    </div>

                    <form
                        className="dashboard-form"
                        onSubmit={handleAddWorkout}
                    >

                        <div className="form-grid">

                            <div className="form-group">
                                <label>
                                    Workout Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Chest Workout"
                                    value={workoutName}
                                    onChange={(event) =>
                                        setWorkoutName(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Workout Type
                                </label>

                                <select
                                    value={workoutType}
                                    onChange={(event) =>
                                        setWorkoutType(
                                            event.target.value
                                        )
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

                            <div className="form-group">
                                <label>
                                    Duration (minutes)
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="60"
                                    value={duration}
                                    onChange={(event) =>
                                        setDuration(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Workout Date
                                </label>

                                <input
                                    type="date"
                                    value={workoutDate}
                                    onChange={(event) =>
                                        setWorkoutDate(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                        </div>

                        <button
                            className="primary-btn"
                            type="submit"
                            disabled={addingWorkout}
                        >
                            {addingWorkout
                                ? "Adding Workout..."
                                : "Add Workout →"}
                        </button>

                        {workoutMessage && (
                            <p className="form-message">
                                {workoutMessage}
                            </p>
                        )}

                    </form>

                </section>

                {/* RECENT WORKOUTS */}

                <section className="dashboard-section">

                    <div className="section-heading">
                        <div>
                            <span>TRAINING HISTORY</span>
                            <h2>Recent Workouts</h2>
                        </div>

                        <span className="activity-count">
                            {recentWorkouts.length} recorded
                        </span>
                    </div>

                    {recentWorkouts.length === 0 ? (
                        <div className="empty-state">
                            <div>🏋️</div>
                            <h3>No workouts yet</h3>
                            <p>
                                Add your first workout to
                                start building your training
                                history.
                            </p>
                        </div>
                    ) : (
                        <div className="workout-list">

                            {recentWorkouts.map(
                                (workout) => (
                                    <div
                                        className="workout-item"
                                        key={workout.id}
                                    >

                                        <div className="workout-icon">
                                            {getWorkoutIcon(
                                                workout.workout_type
                                            )}
                                        </div>

                                        <div className="workout-info">
                                            <strong>
                                                {
                                                    workout.workout_name
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    workout.workout_type ||
                                                    "Workout"
                                                }
                                            </span>
                                        </div>

                                        <div className="workout-meta">

                                            <strong>
                                                {workout.duration
                                                    ? `${workout.duration} min`
                                                    : "—"}
                                            </strong>

                                            <span>
                                                {formatDate(
                                                    workout.workout_date
                                                )}
                                            </span>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

            </main>
        </div>
    );
}

export default Dashboard;