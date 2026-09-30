import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

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
    const [editingWorkoutId, setEditingWorkoutId] = useState(null);
    const [editingWorkoutName, setEditingWorkoutName] = useState("");
    const [editingWorkoutType, setEditingWorkoutType] = useState("Strength");
    const [editingDuration, setEditingDuration] = useState("");
    const [editingWorkoutDate, setEditingWorkoutDate] = useState("");
    const [updatingWorkout, setUpdatingWorkout] = useState(false);
    const [deletingWorkoutId, setDeletingWorkoutId] = useState(null);
    const [workoutToDelete, setWorkoutToDelete] = useState(null);
    const [showWorkoutDeleteConfirm, setShowWorkoutDeleteConfirm] = useState(false);
    const [workoutDeleteMessage, setWorkoutDeleteMessage] = useState("");

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

    // Profile
    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profileMessage, setProfileMessage] = useState("");
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

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
            setProfileName(currentUser.name || "");
            setProfileEmail(currentUser.email || "");
            loadDashboard(token);
        } catch (error) {
            console.error("User data error:", error);
            navigate("/login");
        }
    }, [navigate]);

    async function loadDashboard(token, showLoader = true) {
        try {
            if (showLoader) setLoading(true);
            setError("");

            const response = await fetch(
                "${API_URL}/api/dashboard",
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
            if (showLoader) setLoading(false);
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
                "${API_URL}/api/workouts",
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
                "Workout added successfully! ðŸ’ª"
            );

            setWorkoutName("");
            setWorkoutType("Strength");
            setDuration("");
            setWorkoutDate(
                new Date().toISOString().split("T")[0]
            );

            await loadDashboard(token, false);
        } catch (error) {
            console.error("Add workout error:", error);

            setWorkoutMessage(
                "Unable to connect to the server."
            );
        } finally {
            setAddingWorkout(false);
        }
    }

    function startEditWorkout(workout) {
        setEditingWorkoutId(workout.id);
        setEditingWorkoutName(workout.workout_name || "");
        setEditingWorkoutType(workout.workout_type || "Strength");
        setEditingDuration(workout.duration ?? "");
        setEditingWorkoutDate(workout.workout_date || "");
        setWorkoutMessage("");
        setWorkoutDeleteMessage("");
    }

    function cancelEditWorkout() {
        setEditingWorkoutId(null);
        setEditingWorkoutName("");
        setEditingWorkoutType("Strength");
        setEditingDuration("");
        setEditingWorkoutDate("");
    }

    async function handleUpdateWorkout(event) {
        event.preventDefault();
        setWorkoutMessage("");

        if (!editingWorkoutName.trim()) {
            setWorkoutMessage("Workout name is required.");
            return;
        }

        try {
            setUpdatingWorkout(true);
            const token = localStorage.getItem("fitzone_token");
            const response = await fetch(`${API_URL}/api/workouts/${editingWorkoutId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    workout_name: editingWorkoutName.trim(),
                    workout_type: editingWorkoutType,
                    duration: editingDuration ? Number(editingDuration) : null,
                    workout_date: editingWorkoutDate || null,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setWorkoutMessage(data.message || "Failed to update workout.");
                return;
            }

            cancelEditWorkout();
            setWorkoutMessage("Workout updated successfully! âœ“");
            await loadDashboard(token, false);
        } catch (error) {
            console.error("Update workout error:", error);
            setWorkoutMessage("Unable to connect to the server.");
        } finally {
            setUpdatingWorkout(false);
        }
    }

    function openWorkoutDeleteConfirm(workout) {
        setWorkoutToDelete(workout);
        setWorkoutDeleteMessage("");
        setShowWorkoutDeleteConfirm(true);
    }

    function closeWorkoutDeleteConfirm() {
        if (deletingWorkoutId) return;
        setShowWorkoutDeleteConfirm(false);
        setWorkoutToDelete(null);
    }

    async function handleDeleteWorkout() {
        if (!workoutToDelete?.id) return;

        try {
            setDeletingWorkoutId(workoutToDelete.id);
            const token = localStorage.getItem("fitzone_token");
            const response = await fetch(`${API_URL}/api/workouts/${workoutToDelete.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (!response.ok) {
                setWorkoutDeleteMessage(data.message || "Failed to delete workout.");
                return;
            }

            setShowWorkoutDeleteConfirm(false);
            setWorkoutToDelete(null);
            setWorkoutDeleteMessage("Workout deleted successfully! âœ“");
            await loadDashboard(token, false);
        } catch (error) {
            console.error("Delete workout error:", error);
            setWorkoutDeleteMessage("Unable to connect to the server.");
        } finally {
            setDeletingWorkoutId(null);
        }
    }

    async function handleUpdateProfile(event) {
        event.preventDefault();
        setProfileMessage("");

        if (!profileName.trim()) {
            setProfileMessage("Name is required.");
            return;
        }

        if (!profileEmail.trim()) {
            setProfileMessage("Email is required.");
            return;
        }

        try {
            setUpdatingProfile(true);
            const token = localStorage.getItem("fitzone_token");

            const response = await fetch("${API_URL}/api/profile", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: profileName.trim(),
                    email: profileEmail.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setProfileMessage(data.message || "Failed to update profile.");
                return;
            }

            const updatedUser = data.user;
            setUser(updatedUser);
            setProfileName(updatedUser.name || "");
            setProfileEmail(updatedUser.email || "");
            localStorage.setItem("fitzone_user", JSON.stringify(updatedUser));
            setProfileMessage("Profile updated successfully! âœ“");
        } catch (error) {
            console.error("Profile update error:", error);
            setProfileMessage("Unable to connect to the server.");
        } finally {
            setUpdatingProfile(false);
        }
    }

    async function handleChangePassword(event) {
        event.preventDefault();
        setPasswordMessage("");

        if (!currentPassword) {
            setPasswordMessage("Enter your current password.");
            return;
        }

        if (!newPassword) {
            setPasswordMessage("Enter a new password.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage("New password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage("New passwords do not match.");
            return;
        }

        try {
            setChangingPassword(true);
            const token = localStorage.getItem("fitzone_token");

            const response = await fetch("${API_URL}/api/profile/password", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setPasswordMessage(data.message || "Failed to change password.");
                return;
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordMessage("Password changed successfully! âœ“");
        } catch (error) {
            console.error("Password change error:", error);
            setPasswordMessage("Unable to connect to the server.");
        } finally {
            setChangingPassword(false);
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
                "${API_URL}/api/progress",
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
                "Progress updated successfully! ðŸ’ª"
            );

            await loadDashboard(token, false);
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
                "${API_URL}/api/memberships",
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
                "Membership updated successfully! ðŸ’ª"
            );

            await loadDashboard(token, false);
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

    const membershipDaysRemaining = membership?.end_date
        ? Math.ceil(
            (new Date(`${membership.end_date}T23:59:59`) - new Date())
            / (1000 * 60 * 60 * 24)
        )
        : null;

    const dashboardAlerts = [];

    if (!membership) {
        dashboardAlerts.push({
            type: "info",
            icon: "ðŸ’³",
            title: "No active membership",
            text: "Update your membership details to keep your account information current.",
            target: "membership-section",
        });
    } else if (membershipStatus !== "active") {
        dashboardAlerts.push({
            type: "warning",
            icon: "âš ï¸",
            title: "Membership is not active",
            text: "Check your membership details below.",
            target: "membership-section",
        });
    } else if (membershipDaysRemaining !== null && membershipDaysRemaining <= 7 && membershipDaysRemaining >= 0) {
        dashboardAlerts.push({
            type: "warning",
            icon: "â°",
            title: "Membership ending soon",
            text: `${membershipDaysRemaining} day${membershipDaysRemaining === 1 ? "" : "s"} remaining on your current membership.`,
            target: "membership-section",
        });
    }

    if (recentWorkouts.length === 0) {
        dashboardAlerts.push({
            type: "info",
            icon: "ðŸ‹ï¸",
            title: "Start your workout history",
            text: "You have not recorded a workout yet.",
            target: "workout-section",
        });
    }

    if (goal >= 100) {
        dashboardAlerts.push({
            type: "success",
            icon: "ðŸŽ¯",
            title: "Goal progress reached 100%",
            text: "Your recorded goal progress has reached the target.",
            target: "progress-section",
        });
    }

    function getWorkoutIcon(type) {
        const icons = {
            Chest: "ðŸ’ª",
            Back: "ðŸ‹ï¸",
            Legs: "ðŸ¦µ",
            Shoulders: "ðŸ‹ï¸",
            Arms: "ðŸ’ª",
            Cardio: "ðŸƒ",
            Strength: "ðŸ”¥",
            "Full Body": "âš¡",
        };

        return icons[type] || "ðŸ‹ï¸";
    }

    function formatDate(date) {
        if (!date) return "â€”";

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

                {/* DASHBOARD ALERTS */}

                <section className="dashboard-alerts-section">

                    <div className="dashboard-alerts-header">
                        <div>
                            <span>ATTENTION</span>
                            <h2>Dashboard Alerts</h2>
                        </div>

                        <span className="activity-count">
                            {dashboardAlerts.length > 0
                                ? `${dashboardAlerts.length} alert${dashboardAlerts.length === 1 ? "" : "s"}`
                                : "All clear"}
                        </span>
                    </div>

                    {dashboardAlerts.length > 0 ? (
                        <div className="dashboard-alerts-list">
                            {dashboardAlerts.map((alert, index) => (
                                <button
                                    type="button"
                                    className={`dashboard-alert ${alert.type}`}
                                    key={`${alert.title}-${index}`}
                                    onClick={() =>
                                        document
                                            .getElementById(alert.target)
                                            ?.scrollIntoView({ behavior: "smooth" })
                                    }
                                >
                                    <span className="dashboard-alert-icon">
                                        {alert.icon}
                                    </span>

                                    <span className="dashboard-alert-content">
                                        <strong>{alert.title}</strong>
                                        <span>{alert.text}</span>
                                    </span>

                                    <span className="dashboard-alert-arrow">
                                        â†’
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="dashboard-alerts-clear">
                            <div className="dashboard-alerts-clear-icon">
                                âœ“
                            </div>

                            <div>
                                <strong>You're all caught up</strong>
                                <p>
                                    Your membership, workouts, and progress
                                    currently look good. Keep up the consistency!
                                </p>
                            </div>
                        </div>
                    )}

                </section>

                {/* OVERVIEW */}

                <section className="overview-grid">

                    <div className="overview-card">
                        <div className="overview-icon membership-icon">
                            ðŸ’³
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
                            ðŸ‹ï¸
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
                            ðŸ“ˆ
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
                            âš–ï¸
                        </div>

                        <div>
                            <span>WEIGHT</span>

                            <strong>
                                {progress?.weight
                                    ? `${progress.weight}`
                                    : "â€”"}
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
                                    : "â€”"}
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

                <section className="dashboard-section" id="membership-section">

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
                                    : "Update Membership â†’"}
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
                                : "Save Progress â†’"}
                        </button>

                        {progressMessage && (
                            <p className="form-message">
                                {progressMessage}
                            </p>
                        )}

                    </form>

                </section>

                {/* ACTIVITY CENTER */}

                <section className="dashboard-section activity-center-section">
                    <div className="section-heading">
                        <div>
                            <span>YOUR ACTIVITY</span>
                            <h2>Activity Center</h2>
                        </div>
                        <span className="activity-count">
                            {recentWorkouts.length} recent workouts
                        </span>
                    </div>

                    <div className="activity-summary-grid">
                        <div className="activity-summary-card">
                            <div className="activity-summary-icon">ðŸ”¥</div>
                            <div>
                                <span>LAST WORKOUT</span>
                                <strong>
                                    {recentWorkouts.length > 0
                                        ? recentWorkouts[0].workout_name
                                        : "No workout yet"}
                                </strong>
                                <small>
                                    {recentWorkouts.length > 0
                                        ? `${recentWorkouts[0].workout_type || "Workout"} â€¢ ${formatDate(recentWorkouts[0].workout_date)}`
                                        : "Add your first workout to get started"}
                                </small>
                            </div>
                        </div>

                        <div className="activity-summary-card">
                            <div className="activity-summary-icon">ðŸ“ˆ</div>
                            <div>
                                <span>GOAL PROGRESS</span>
                                <strong>{goal}% complete</strong>
                                <small>
                                    {goal >= 100
                                        ? "Goal completed"
                                        : `${100 - goal}% remaining to reach your goal`}
                                </small>
                            </div>
                        </div>

                        <div className="activity-summary-card">
                            <div className="activity-summary-icon">ðŸ’³</div>
                            <div>
                                <span>MEMBERSHIP</span>
                                <strong>
                                    {membership?.plan || "No plan"}
                                </strong>
                                <small>
                                    {membership?.end_date
                                        ? `Ends ${formatDate(membership.end_date)}`
                                        : "No end date recorded"}
                                </small>
                            </div>
                        </div>

                        <div className="activity-summary-card">
                            <div className="activity-summary-icon">âš–ï¸</div>
                            <div>
                                <span>CURRENT WEIGHT</span>
                                <strong>
                                    {progress?.weight
                                        ? `${progress.weight} kg`
                                        : "Not recorded"}
                                </strong>
                                <small>
                                    {progress?.updated_at
                                        ? `Updated ${new Date(progress.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                                        : "Update your progress to track it"}
                                </small>
                            </div>
                        </div>
                    </div>

                    <div className="activity-timeline">
                        <div className="activity-timeline-header">
                            <div>
                                <span>RECENT ACTIVITY</span>
                                <h3>What you've been doing</h3>
                            </div>
                        </div>

                        {recentWorkouts.length === 0 ? (
                            <div className="activity-empty">
                                <div className="activity-empty-icon">ðŸ‹ï¸</div>
                                <div>
                                    <strong>Your activity will appear here</strong>
                                    <p>Log a workout and your latest training activity will show up in this timeline.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="activity-timeline-list">
                                {recentWorkouts.slice(0, 4).map((workout) => (
                                    <div className="activity-timeline-item" key={`activity-${workout.id}`}>
                                        <div className="activity-timeline-dot">
                                            {getWorkoutIcon(workout.workout_type)}
                                        </div>
                                        <div className="activity-timeline-content">
                                            <strong>
                                                {workout.workout_name}
                                            </strong>
                                            <span>
                                                {workout.workout_type || "Workout"}
                                                {workout.duration ? ` â€¢ ${workout.duration} min` : ""}
                                            </span>
                                        </div>
                                        <time>
                                            {formatDate(workout.workout_date)}
                                        </time>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* PROFILE & SECURITY */}

                <section className="dashboard-section profile-section">
                    <div className="section-heading">
                        <div>
                            <span>ACCOUNT</span>
                            <h2>Profile & Security</h2>
                        </div>
                    </div>

                    <div className="profile-management-grid">
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <div className="profile-large-avatar">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <span>YOUR ACCOUNT</span>
                                    <h3>{user.name}</h3>
                                    <p>{user.email}</p>
                                </div>
                            </div>

                            <div className="profile-details-list">
                                <div>
                                    <span>ROLE</span>
                                    <strong>{user.role || "member"}</strong>
                                </div>
                                <div>
                                    <span>MEMBER SINCE</span>
                                    <strong>
                                        {user.created_at
                                            ? new Date(user.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                            : "â€”"}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <form className="dashboard-form profile-form" onSubmit={handleUpdateProfile}>
                            <div className="profile-form-title">
                                <span>PERSONAL INFORMATION</span>
                                <h3>Edit Profile</h3>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={profileName}
                                        onChange={(event) => setProfileName(event.target.value)}
                                        placeholder="Your name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={profileEmail}
                                        onChange={(event) => setProfileEmail(event.target.value)}
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <button className="primary-btn" type="submit" disabled={updatingProfile}>
                                {updatingProfile ? "Saving..." : "Save Profile â†’"}
                            </button>

                            {profileMessage && (
                                <p className="form-message">{profileMessage}</p>
                            )}
                        </form>
                    </div>

                    <form className="dashboard-form password-form" onSubmit={handleChangePassword}>
                        <div className="profile-form-title">
                            <span>ACCOUNT SECURITY</span>
                            <h3>Change Password</h3>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(event) => setCurrentPassword(event.target.value)}
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    placeholder="Minimum 6 characters"
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder="Repeat new password"
                                />
                            </div>
                        </div>

                        <button className="primary-btn" type="submit" disabled={changingPassword}>
                            {changingPassword ? "Changing..." : "Change Password â†’"}
                        </button>

                        {passwordMessage && (
                            <p className="form-message">{passwordMessage}</p>
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
                                : "Add Workout â†’"}
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
                            <div>ðŸ‹ï¸</div>
                            <h3>No workouts yet</h3>
                            <p>
                                Add your first workout to start building your training history.
                            </p>
                        </div>
                    ) : (
                        <div className="workout-list">
                            {recentWorkouts.map((workout) => (
                                <div className="workout-item dashboard-workout-item" key={workout.id}>
                                    {editingWorkoutId === workout.id ? (
                                        <form className="dashboard-workout-edit" onSubmit={handleUpdateWorkout}>
                                            <div className="workout-icon">
                                                {getWorkoutIcon(workout.workout_type)}
                                            </div>
                                            <div className="dashboard-workout-edit-grid">
                                                <input
                                                    value={editingWorkoutName}
                                                    onChange={(event) => setEditingWorkoutName(event.target.value)}
                                                    placeholder="Workout name"
                                                />
                                                <select
                                                    value={editingWorkoutType}
                                                    onChange={(event) => setEditingWorkoutType(event.target.value)}
                                                >
                                                    <option value="Strength">Strength</option>
                                                    <option value="Cardio">Cardio</option>
                                                    <option value="Chest">Chest</option>
                                                    <option value="Back">Back</option>
                                                    <option value="Legs">Legs</option>
                                                    <option value="Shoulders">Shoulders</option>
                                                    <option value="Arms">Arms</option>
                                                    <option value="Full Body">Full Body</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={editingDuration}
                                                    onChange={(event) => setEditingDuration(event.target.value)}
                                                    placeholder="Minutes"
                                                />
                                                <input
                                                    type="date"
                                                    value={editingWorkoutDate}
                                                    onChange={(event) => setEditingWorkoutDate(event.target.value)}
                                                />
                                                <div className="dashboard-workout-edit-actions">
                                                    <button className="dashboard-save-btn" disabled={updatingWorkout}>
                                                        {updatingWorkout ? "Saving..." : "Save"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="dashboard-cancel-btn"
                                                        onClick={cancelEditWorkout}
                                                        disabled={updatingWorkout}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="workout-icon">
                                                {getWorkoutIcon(workout.workout_type)}
                                            </div>
                                            <div className="workout-info">
                                                <strong>{workout.workout_name}</strong>
                                                <span>{workout.workout_type || "Workout"}</span>
                                            </div>
                                            <div className="workout-meta">
                                                <strong>
                                                    {workout.duration ? `${workout.duration} min` : "â€”"}
                                                </strong>
                                                <span>{formatDate(workout.workout_date)}</span>
                                            </div>
                                            <div className="dashboard-workout-actions">
                                                <button
                                                    type="button"
                                                    className="dashboard-edit-btn"
                                                    onClick={() => startEditWorkout(workout)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="dashboard-delete-btn"
                                                    onClick={() => openWorkoutDeleteConfirm(workout)}
                                                    disabled={deletingWorkoutId === workout.id}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {workoutMessage && (
                        <p className="form-message">{workoutMessage}</p>
                    )}

                    {workoutDeleteMessage && (
                        <p className="form-message">{workoutDeleteMessage}</p>
                    )}
                </section>

            </main>

            {showWorkoutDeleteConfirm && (
                <div className="dashboard-modal-overlay" onClick={closeWorkoutDeleteConfirm}>
                    <div
                        className="dashboard-delete-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="dashboard-delete-icon">âš ï¸</div>
                        <span>WORKOUT ACTION</span>
                        <h2>Delete Workout?</h2>
                        <p>
                            Are you sure you want to delete <strong>{workoutToDelete?.workout_name}</strong>?
                        </p>
                        <div className="dashboard-delete-actions">
                            <button
                                type="button"
                                className="dashboard-cancel-delete"
                                onClick={closeWorkoutDeleteConfirm}
                                disabled={!!deletingWorkoutId}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="dashboard-confirm-delete"
                                onClick={handleDeleteWorkout}
                                disabled={!!deletingWorkoutId}
                            >
                                {deletingWorkoutId ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;

