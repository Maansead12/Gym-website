import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MemberDetails.css";

const API_URL = import.meta.env.VITE_API_URL;

function MemberDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [member, setMember] = useState(null);
    const [membership, setMembership] = useState(null);
    const [progress, setProgress] = useState(null);
    const [workouts, setWorkouts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* =========================
       EDIT MEMBER
    ========================= */

    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editRole, setEditRole] = useState("member");
    const [editMessage, setEditMessage] = useState("");
    const [updatingMember, setUpdatingMember] = useState(false);


    /* =========================
       WORKOUT MANAGEMENT
    ========================= */

    async function handleAddWorkout(event) {
        event.preventDefault();
        setWorkoutMessage("");

        if (!workoutName.trim()) {
            setWorkoutMessage("Workout name is required.");
            return;
        }

        try {
            setAddingWorkout(true);
            const token = localStorage.getItem("fitzone_token");

            const response = await fetch(
                `${API_URL}/api/admin/members/${id}/workouts`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        workout_name: workoutName.trim(),
                        workout_type: workoutType,
                        duration: workoutDuration ? Number(workoutDuration) : null,
                        workout_date: workoutDate || null,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setWorkoutMessage(data.message || "Failed to add workout.");
                return;
            }

            setWorkoutMessage("Workout added successfully! âœ“");
            setWorkoutName("");
            setWorkoutType("Strength");
            setWorkoutDuration("");
            setWorkoutDate(new Date().toISOString().split("T")[0]);

            await loadMemberDetails(token, false);
        } catch (error) {
            console.error("Admin add workout error:", error);
            setWorkoutMessage("Unable to connect to the server.");
        } finally {
            setAddingWorkout(false);
        }
    }

    function startEditWorkout(workout) {
        setEditingWorkoutId(workout.id);
        setEditingWorkoutName(workout.workout_name || "");
        setEditingWorkoutType(workout.workout_type || "Strength");
        setEditingWorkoutDuration(workout.duration ?? "");
        setEditingWorkoutDate(workout.workout_date || "");
        setEditingWorkoutMessage("");
    }

    function cancelEditWorkout() {
        setEditingWorkoutId(null);
        setEditingWorkoutName("");
        setEditingWorkoutType("Strength");
        setEditingWorkoutDuration("");
        setEditingWorkoutDate("");
        setEditingWorkoutMessage("");
    }

    async function handleUpdateWorkout(event) {
        event.preventDefault();
        setEditingWorkoutMessage("");

        if (!editingWorkoutName.trim()) {
            setEditingWorkoutMessage("Workout name is required.");
            return;
        }

        try {
            setUpdatingWorkout(true);
            const token = localStorage.getItem("fitzone_token");

            const response = await fetch(
                `${API_URL}/api/admin/workouts/${editingWorkoutId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        workout_name: editingWorkoutName.trim(),
                        workout_type: editingWorkoutType,
                        duration: editingWorkoutDuration
                            ? Number(editingWorkoutDuration)
                            : null,
                        workout_date: editingWorkoutDate || null,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setEditingWorkoutMessage(
                    data.message || "Failed to update workout."
                );
                return;
            }

            setEditingWorkoutMessage("Workout updated successfully! âœ“");
            await loadMemberDetails(token, false);

            setTimeout(() => {
                cancelEditWorkout();
            }, 500);
        } catch (error) {
            console.error("Admin update workout error:", error);
            setEditingWorkoutMessage("Unable to connect to the server.");
        } finally {
            setUpdatingWorkout(false);
        }
    }

    function openWorkoutDeleteConfirm(workout) {
        setWorkoutToDelete(workout);
        setShowWorkoutDeleteConfirm(true);
        setWorkoutDeleteMessage("");
    }

    function closeWorkoutDeleteConfirm() {
        if (deletingWorkoutId) {
            return;
        }

        setShowWorkoutDeleteConfirm(false);
        setWorkoutToDelete(null);
    }

    async function handleDeleteWorkout() {
        if (!workoutToDelete?.id) {
            return;
        }

        try {
            setDeletingWorkoutId(workoutToDelete.id);
            setWorkoutDeleteMessage("");

            const token = localStorage.getItem("fitzone_token");

            const response = await fetch(
                `${API_URL}/api/admin/workouts/${workoutToDelete.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setWorkoutDeleteMessage(
                    data.message || "Failed to delete workout."
                );
                return;
            }

            if (editingWorkoutId === workoutToDelete.id) {
                cancelEditWorkout();
            }

            setShowWorkoutDeleteConfirm(false);
            setWorkoutToDelete(null);
            setWorkoutDeleteMessage("Workout deleted successfully! âœ“");

            await loadMemberDetails(token, false);
        } catch (error) {
            console.error("Admin delete workout error:", error);
            setWorkoutDeleteMessage("Unable to connect to the server.");
        } finally {
            setDeletingWorkoutId(null);
        }
    }

    /* =========================
       DELETE MEMBER
    ========================= */

    const [deleteMessage, setDeleteMessage] = useState("");
    const [deletingMember, setDeletingMember] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    /* =========================
       MEMBERSHIP
    ========================= */

    const [membershipPlan, setMembershipPlan] = useState("Basic");
    const [membershipStatus, setMembershipStatus] =
        useState("active");
    const [membershipStartDate, setMembershipStartDate] =
        useState("");
    const [membershipEndDate, setMembershipEndDate] =
        useState("");
    const [membershipMessage, setMembershipMessage] =
        useState("");
    const [updatingMembership, setUpdatingMembership] =
        useState(false);

    /* =========================
       PROGRESS
    ========================= */

    const [progressGoal, setProgressGoal] = useState("0");
    const [progressWeight, setProgressWeight] = useState("");
    const [progressNotes, setProgressNotes] = useState("");
    const [progressMessage, setProgressMessage] =
        useState("");
    const [updatingProgress, setUpdatingProgress] =
        useState(false);

    /* =========================
       WORKOUT MANAGEMENT
    ========================= */

    const [workoutName, setWorkoutName] = useState("");
    const [workoutType, setWorkoutType] = useState("Strength");
    const [workoutDuration, setWorkoutDuration] = useState("");
    const [workoutDate, setWorkoutDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [workoutMessage, setWorkoutMessage] = useState("");
    const [addingWorkout, setAddingWorkout] = useState(false);

    const [editingWorkoutId, setEditingWorkoutId] = useState(null);
    const [editingWorkoutName, setEditingWorkoutName] = useState("");
    const [editingWorkoutType, setEditingWorkoutType] = useState("Strength");
    const [editingWorkoutDuration, setEditingWorkoutDuration] = useState("");
    const [editingWorkoutDate, setEditingWorkoutDate] = useState("");
    const [editingWorkoutMessage, setEditingWorkoutMessage] = useState("");
    const [updatingWorkout, setUpdatingWorkout] = useState(false);

    const [deletingWorkoutId, setDeletingWorkoutId] = useState(null);
    const [workoutDeleteMessage, setWorkoutDeleteMessage] = useState("");
    const [showWorkoutDeleteConfirm, setShowWorkoutDeleteConfirm] = useState(false);
    const [workoutToDelete, setWorkoutToDelete] = useState(null);

    /* =========================
       LOAD MEMBER
    ========================= */

    useEffect(() => {
        const token = localStorage.getItem("fitzone_token");
        const savedUser =
            localStorage.getItem("fitzone_user");

        if (!token || !savedUser) {
            navigate("/login");
            return;
        }

        const currentUser = JSON.parse(savedUser);

        if (currentUser.role !== "admin") {
            navigate("/dashboard");
            return;
        }

        loadMemberDetails(token);
    }, [id, navigate]);

    async function loadMemberDetails(token, showPageLoading = true) {
        try {
            if (showPageLoading) {
                setLoading(true);
            }
            setError("");

            const response = await fetch(
                `${API_URL}/api/admin/members/${id}`,
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
                    localStorage.removeItem(
                        "fitzone_token"
                    );
                    localStorage.removeItem(
                        "fitzone_user"
                    );
                    navigate("/login");
                    return;
                }

                if (response.status === 403) {
                    navigate("/dashboard");
                    return;
                }

                throw new Error(
                    data.message ||
                    "Failed to load member"
                );
            }

            setMember(data.member);
            setMembership(data.membership);
            setProgress(data.progress);
            setWorkouts(data.workouts || []);

            setEditName(data.member?.name || "");
            setEditEmail(data.member?.email || "");
            setEditRole(
                data.member?.role || "member"
            );

            setMembershipPlan(
                data.membership?.plan || "Basic"
            );
            setMembershipStatus(
                data.membership?.status || "active"
            );
            setMembershipStartDate(
                data.membership?.start_date || ""
            );
            setMembershipEndDate(
                data.membership?.end_date || ""
            );

            setProgressGoal(
                data.progress?.goal_percentage !==
                    undefined &&
                    data.progress?.goal_percentage !==
                    null
                    ? String(
                        data.progress
                            .goal_percentage
                    )
                    : "0"
            );

            setProgressWeight(
                data.progress?.weight !==
                    undefined &&
                    data.progress?.weight !==
                    null
                    ? String(
                        data.progress.weight
                    )
                    : ""
            );

            setProgressNotes(
                data.progress?.notes || ""
            );
        } catch (error) {
            console.error(
                "Member details error:",
                error
            );

            setError(
                "Unable to load member details."
            );
        } finally {
            if (showPageLoading) {
                setLoading(false);
            }
        }
    }

    /* =========================
       UPDATE MEMBER
    ========================= */

    async function handleUpdateMember(event) {
        event.preventDefault();

        setEditMessage("");

        if (!editName.trim()) {
            setEditMessage(
                "Name cannot be empty."
            );
            return;
        }

        if (!editEmail.trim()) {
            setEditMessage(
                "Email cannot be empty."
            );
            return;
        }

        try {
            setUpdatingMember(true);

            const token =
                localStorage.getItem(
                    "fitzone_token"
                );

            const response = await fetch(
                `${API_URL}/api/admin/members/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name: editName.trim(),
                        email: editEmail
                            .trim()
                            .toLowerCase(),
                        role: editRole,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem(
                        "fitzone_token"
                    );
                    localStorage.removeItem(
                        "fitzone_user"
                    );
                    navigate("/login");
                    return;
                }

                if (response.status === 403) {
                    navigate("/dashboard");
                    return;
                }

                setEditMessage(
                    data.message ||
                    "Failed to update member."
                );

                return;
            }

            setMember(data.member);
            setEditName(data.member.name);
            setEditEmail(data.member.email);
            setEditRole(data.member.role);

            setEditMessage(
                "Member updated successfully! âœ“"
            );
        } catch (error) {
            console.error(
                "Update member error:",
                error
            );

            setEditMessage(
                "Unable to connect to the server."
            );
        } finally {
            setUpdatingMember(false);
        }
    }

    /* =========================
       UPDATE MEMBERSHIP
    ========================= */

    async function handleUpdateMembership(event) {
        event.preventDefault();

        setMembershipMessage("");

        if (!membershipPlan) {
            setMembershipMessage(
                "Please select a membership plan."
            );
            return;
        }

        if (!membershipStatus) {
            setMembershipMessage(
                "Please select a membership status."
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
                "End date cannot be before the start date."
            );
            return;
        }

        try {
            setUpdatingMembership(true);

            const token =
                localStorage.getItem(
                    "fitzone_token"
                );

            const response = await fetch(
                `${API_URL}/api/admin/members/${id}/membership`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        plan: membershipPlan,
                        status: membershipStatus,
                        start_date:
                            membershipStartDate,
                        end_date:
                            membershipEndDate ||
                            null,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem(
                        "fitzone_token"
                    );
                    localStorage.removeItem(
                        "fitzone_user"
                    );
                    navigate("/login");
                    return;
                }

                if (response.status === 403) {
                    navigate("/dashboard");
                    return;
                }

                setMembershipMessage(
                    data.message ||
                    "Failed to update membership."
                );

                return;
            }

            setMembership(data.membership);
            setMembershipPlan(
                data.membership.plan
            );
            setMembershipStatus(
                data.membership.status
            );
            setMembershipStartDate(
                data.membership.start_date || ""
            );
            setMembershipEndDate(
                data.membership.end_date || ""
            );

            setMembershipMessage(
                "Membership updated successfully! âœ“"
            );
        } catch (error) {
            console.error(
                "Update membership error:",
                error
            );

            setMembershipMessage(
                "Unable to connect to the server."
            );
        } finally {
            setUpdatingMembership(false);
        }
    }

    /* =========================
       UPDATE PROGRESS
    ========================= */

    async function handleUpdateProgress(event) {
        event.preventDefault();

        setProgressMessage("");

        if (
            progressGoal === "" ||
            progressGoal === null
        ) {
            setProgressMessage(
                "Goal percentage is required."
            );
            return;
        }

        const goal = Number(progressGoal);

        if (
            Number.isNaN(goal) ||
            goal < 0 ||
            goal > 100
        ) {
            setProgressMessage(
                "Goal percentage must be between 0 and 100."
            );
            return;
        }

        if (
            progressWeight !== "" &&
            Number(progressWeight) <= 0
        ) {
            setProgressMessage(
                "Weight must be greater than 0."
            );
            return;
        }

        try {
            setUpdatingProgress(true);

            const token =
                localStorage.getItem(
                    "fitzone_token"
                );

            const response = await fetch(
                `${API_URL}/api/admin/members/${id}/progress`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        goal_percentage: goal,
                        weight:
                            progressWeight === ""
                                ? null
                                : Number(
                                    progressWeight
                                ),
                        notes:
                            progressNotes.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem(
                        "fitzone_token"
                    );
                    localStorage.removeItem(
                        "fitzone_user"
                    );
                    navigate("/login");
                    return;
                }

                if (response.status === 403) {
                    navigate("/dashboard");
                    return;
                }

                setProgressMessage(
                    data.message ||
                    "Failed to update progress."
                );

                return;
            }

            setProgress(data.progress);

            setProgressGoal(
                String(
                    data.progress
                        .goal_percentage ?? 0
                )
            );

            setProgressWeight(
                data.progress.weight !== null &&
                    data.progress.weight !==
                    undefined
                    ? String(
                        data.progress.weight
                    )
                    : ""
            );

            setProgressNotes(
                data.progress.notes || ""
            );

            setProgressMessage(
                "Progress updated successfully! âœ“"
            );
        } catch (error) {
            console.error(
                "Update progress error:",
                error
            );

            setProgressMessage(
                "Unable to connect to the server."
            );
        } finally {
            setUpdatingProgress(false);
        }
    }

    /* =========================
       DELETE MEMBER
    ========================= */

    async function handleDeleteMember() {
        setDeleteMessage("");

        try {
            setDeletingMember(true);

            const token =
                localStorage.getItem(
                    "fitzone_token"
                );

            const response = await fetch(
                `${API_URL}/api/admin/members/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem(
                        "fitzone_token"
                    );
                    localStorage.removeItem(
                        "fitzone_user"
                    );
                    navigate("/login");
                    return;
                }

                if (response.status === 403) {
                    navigate("/dashboard");
                    return;
                }

                setDeleteMessage(
                    data.message ||
                    "Failed to delete member."
                );

                setShowDeleteConfirm(false);
                return;
            }

            setShowDeleteConfirm(false);
            navigate("/admin");
        } catch (error) {
            console.error(
                "Delete member error:",
                error
            );

            setDeleteMessage(
                "Unable to connect to the server."
            );

            setShowDeleteConfirm(false);
        } finally {
            setDeletingMember(false);
        }
    }

    /* =========================
       HELPERS
    ========================= */

    function getInitials(name) {
        if (!name) return "?";

        return name
            .trim()
            .split(" ")
            .slice(0, 2)
            .map((part) =>
                part.charAt(0).toUpperCase()
            )
            .join("");
    }

    function formatDate(date) {
        if (!date) return "N/A";

        return new Date(
            date
        ).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    function getMembershipClass(status) {
        return `status-${status || "unknown"}`;
    }

    function getWorkoutIcon(type) {
        const value =
            type?.toLowerCase() || "";

        if (value.includes("cardio")) return "ðŸƒ";
        if (value.includes("strength")) return "ðŸ‹ï¸";
        if (value.includes("legs")) return "ðŸ¦µ";
        if (value.includes("chest")) return "ðŸ’ª";
        if (value.includes("back")) return "ðŸ”©";
        if (value.includes("yoga")) return "ðŸ§˜";

        return "ðŸ‹ï¸";
    }

    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <div className="member-details-loading">
                <div className="loading-spinner"></div>
                <h2>Loading Member Profile...</h2>
                <p>
                    Preparing member information
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="member-details-loading">
                <h2>{error}</h2>

                <button
                    onClick={() =>
                        navigate("/admin")
                    }
                >
                    Back to Admin
                </button>
            </div>
        );
    }

    const progressPercentage = Math.min(
        100,
        Math.max(
            0,
            Number(
                progress?.goal_percentage || 0
            )
        )
    );

    return (
        <div className="member-details-page">
            <main className="member-details-content">

                {/* =========================
                    TOP NAV
                ========================= */}

                <div className="member-topbar">
                    <button
                        className="back-admin-btn"
                        onClick={() =>
                            navigate("/admin")
                        }
                    >
                        â† Back to Members
                    </button>

                    <span className="profile-reference">
                        MEMBER ID: {id.slice(0, 8)}
                    </span>
                </div>

                {/* =========================
                    PROFILE HERO
                ========================= */}

                <section className="member-profile-hero">
                    <div className="profile-avatar-large">
                        {getInitials(member?.name)}
                    </div>

                    <div className="profile-hero-info">
                        <p>MEMBER PROFILE</p>

                        <h1>{member?.name}</h1>

                        <div className="profile-meta">
                            <span>
                                {member?.email}
                            </span>

                            <span className="meta-dot">
                                â€¢
                            </span>

                            <span>
                                Joined{" "}
                                {formatDate(
                                    member?.created_at
                                )}
                            </span>
                        </div>
                    </div>

                    <span
                        className={`member-role-badge ${member?.role === "admin"
                            ? "profile-admin"
                            : "profile-member"
                            }`}
                    >
                        {member?.role}
                    </span>
                </section>

                {/* =========================
                    QUICK OVERVIEW
                ========================= */}

                <section className="quick-overview-grid">

                    <div className="overview-card">
                        <span className="overview-icon">
                            ðŸ‘¤
                        </span>

                        <div>
                            <span className="overview-label">
                                Account
                            </span>

                            <strong>
                                {member?.role ===
                                    "admin"
                                    ? "Administrator"
                                    : "Member"}
                            </strong>
                        </div>
                    </div>

                    <div className="overview-card">
                        <span className="overview-icon">
                            ðŸ†
                        </span>

                        <div>
                            <span className="overview-label">
                                Membership
                            </span>

                            <strong>
                                {membership?.plan ||
                                    "Not Set"}
                            </strong>
                        </div>
                    </div>

                    <div className="overview-card">
                        <span className="overview-icon">
                            ðŸ“ˆ
                        </span>

                        <div>
                            <span className="overview-label">
                                Goal Progress
                            </span>

                            <strong>
                                {progressPercentage}%
                            </strong>
                        </div>
                    </div>

                    <div className="overview-card">
                        <span className="overview-icon">
                            ðŸ‹ï¸
                        </span>

                        <div>
                            <span className="overview-label">
                                Workouts
                            </span>

                            <strong>
                                {workouts.length}
                            </strong>
                        </div>
                    </div>

                </section>

                {/* =========================
                    CURRENT STATUS
                ========================= */}

                <section className="status-dashboard">

                    <div className="status-panel membership-status-panel">
                        <div className="panel-heading">
                            <div>
                                <span>
                                    MEMBERSHIP
                                </span>
                                <h2>
                                    Current Plan
                                </h2>
                            </div>

                            {membership && (
                                <span
                                    className={`membership-status-badge ${getMembershipClass(
                                        membership.status
                                    )}`}
                                >
                                    {membership.status}
                                </span>
                            )}
                        </div>

                        {!membership ? (
                            <div className="status-empty">
                                No membership assigned.
                            </div>
                        ) : (
                            <div className="membership-summary">
                                <strong>
                                    {membership.plan}
                                </strong>

                                <div className="membership-dates">
                                    <span>
                                        Start{" "}
                                        {formatDate(
                                            membership.start_date
                                        )}
                                    </span>

                                    <span>
                                        End{" "}
                                        {formatDate(
                                            membership.end_date
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="status-panel progress-status-panel">
                        <div className="panel-heading">
                            <div>
                                <span>
                                    FITNESS PROGRESS
                                </span>
                                <h2>
                                    Goal Completion
                                </h2>
                            </div>

                            <strong className="progress-number">
                                {progressPercentage}%
                            </strong>
                        </div>

                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${progressPercentage}%`,
                                }}
                            ></div>
                        </div>

                        <div className="progress-footer">
                            <span>
                                Current weight
                            </span>

                            <strong>
                                {progress?.weight
                                    ? `${progress.weight} kg`
                                    : "Not recorded"}
                            </strong>
                        </div>
                    </div>

                </section>

                {/* =========================
                    EDIT MEMBER
                ========================= */}

                <section className="member-info-section edit-member-section">
                    <div className="section-heading">
                        <div>
                            <span>
                                ACCOUNT MANAGEMENT
                            </span>

                            <h2>Edit Member</h2>

                            <p>
                                Update this member's
                                account information.
                            </p>
                        </div>

                        <span className="section-number">
                            01
                        </span>
                    </div>

                    <form
                        className="edit-member-form"
                        onSubmit={
                            handleUpdateMember
                        }
                    >
                        <div className="edit-input-group">
                            <label>Name</label>

                            <input
                                type="text"
                                value={editName}
                                onChange={(event) =>
                                    setEditName(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Member name"
                            />
                        </div>

                        <div className="edit-input-group">
                            <label>Email</label>

                            <input
                                type="email"
                                value={editEmail}
                                onChange={(event) =>
                                    setEditEmail(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Member email"
                            />
                        </div>

                        <div className="edit-input-group">
                            <label>Role</label>

                            <select
                                value={editRole}
                                onChange={(event) =>
                                    setEditRole(
                                        event.target
                                            .value
                                    )
                                }
                            >
                                <option value="member">
                                    Member
                                </option>

                                <option value="admin">
                                    Admin
                                </option>
                            </select>
                        </div>

                        <button
                            className="update-member-btn"
                            type="submit"
                            disabled={
                                updatingMember
                            }
                        >
                            {updatingMember
                                ? "Updating..."
                                : "Save Changes â†’"}
                        </button>
                    </form>

                    {editMessage && (
                        <p className="edit-member-message">
                            {editMessage}
                        </p>
                    )}
                </section>

                {/* =========================
                    MEMBERSHIP MANAGEMENT
                ========================= */}

                <section className="member-info-section">
                    <div className="section-heading">
                        <div>
                            <span>
                                MEMBERSHIP MANAGEMENT
                            </span>

                            <h2>
                                Membership Settings
                            </h2>

                            <p>
                                Create or update this
                                member's gym
                                membership.
                            </p>
                        </div>

                        <span className="section-number">
                            02
                        </span>
                    </div>

                    <form
                        className="edit-member-form"
                        onSubmit={
                            handleUpdateMembership
                        }
                    >
                        <div className="edit-input-group">
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

                        <div className="edit-input-group">
                            <label>Status</label>

                            <select
                                value={
                                    membershipStatus
                                }
                                onChange={(event) =>
                                    setMembershipStatus(
                                        event.target
                                            .value
                                    )
                                }
                            >
                                <option value="active">
                                    Active
                                </option>
                                <option value="expired">
                                    Expired
                                </option>
                                <option value="cancelled">
                                    Cancelled
                                </option>
                            </select>
                        </div>

                        <div className="edit-input-group">
                            <label>Start Date</label>

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

                        <div className="edit-input-group">
                            <label>End Date</label>

                            <input
                                type="date"
                                value={
                                    membershipEndDate
                                }
                                min={
                                    membershipStartDate ||
                                    undefined
                                }
                                onChange={(event) =>
                                    setMembershipEndDate(
                                        event.target
                                            .value
                                    )
                                }
                            />
                        </div>

                        <button
                            className="update-member-btn"
                            type="submit"
                            disabled={
                                updatingMembership
                            }
                        >
                            {updatingMembership
                                ? "Saving Membership..."
                                : "Save Membership â†’"}
                        </button>
                    </form>

                    {membershipMessage && (
                        <p className="edit-member-message">
                            {membershipMessage}
                        </p>
                    )}
                </section>

                {/* =========================
                    PROGRESS MANAGEMENT
                ========================= */}

                <section className="member-info-section">
                    <div className="section-heading">
                        <div>
                            <span>
                                FITNESS MANAGEMENT
                            </span>

                            <h2>
                                Progress Tracking
                            </h2>

                            <p>
                                Maintain professional
                                fitness progress
                                records and member
                                observations.
                            </p>
                        </div>

                        <span className="section-number">
                            03
                        </span>
                    </div>

                    <form
                        className="edit-member-form"
                        onSubmit={
                            handleUpdateProgress
                        }
                    >
                        <div className="edit-input-group">
                            <label>
                                Goal Progress (%)
                            </label>

                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={
                                    progressGoal
                                }
                                onChange={(event) =>
                                    setProgressGoal(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="0 - 100"
                            />
                        </div>

                        <div className="edit-input-group">
                            <label>
                                Weight (kg)
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={
                                    progressWeight
                                }
                                onChange={(event) =>
                                    setProgressWeight(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Enter current weight"
                            />
                        </div>

                        <div className="edit-input-group progress-notes-group">
                            <label>
                                Progress Notes
                            </label>

                            <textarea
                                value={
                                    progressNotes
                                }
                                onChange={(event) =>
                                    setProgressNotes(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Enter professional progress notes, observations, recommendations, or training updates..."
                                rows="6"
                            />

                            <span className="input-help-text">
                                Record relevant
                                observations about
                                training, nutrition,
                                consistency,
                                recovery, progress,
                                or current goals.
                            </span>
                        </div>

                        <button
                            className="update-member-btn"
                            type="submit"
                            disabled={
                                updatingProgress
                            }
                        >
                            {updatingProgress
                                ? "Saving Progress..."
                                : "Save Progress â†’"}
                        </button>
                    </form>

                    {progressMessage && (
                        <p className="edit-member-message">
                            {progressMessage}
                        </p>
                    )}
                </section>

                {/* =========================
                    ACCOUNT INFORMATION
                ========================= */}

                <section className="member-info-section">
                    <div className="section-heading">
                        <div>
                            <span>
                                MEMBER INFORMATION
                            </span>

                            <h2>
                                Account Information
                            </h2>
                        </div>

                        <span className="section-number">
                            04
                        </span>
                    </div>

                    <div className="member-info-grid">
                        <div className="member-info-card">
                            <span>Name</span>
                            <strong>
                                {member?.name}
                            </strong>
                        </div>

                        <div className="member-info-card">
                            <span>Email</span>
                            <strong>
                                {member?.email}
                            </strong>
                        </div>

                        <div className="member-info-card">
                            <span>Role</span>
                            <strong>
                                {member?.role}
                            </strong>
                        </div>

                        <div className="member-info-card">
                            <span>Joined</span>
                            <strong>
                                {formatDate(
                                    member?.created_at
                                )}
                            </strong>
                        </div>
                    </div>
                </section>

                {/* =========================
                    CURRENT MEMBERSHIP
                ========================= */}

                <section className="member-info-section">
                    <div className="section-heading">
                        <div>
                            <span>
                                MEMBERSHIP
                            </span>

                            <h2>
                                Current Membership
                            </h2>
                        </div>

                        <span className="section-number">
                            05
                        </span>
                    </div>

                    {!membership ? (
                        <div className="member-empty">
                            <p>
                                This member has no
                                membership yet.
                            </p>
                        </div>
                    ) : (
                        <div className="member-info-grid">
                            <div className="member-info-card">
                                <span>Plan</span>
                                <strong>
                                    {membership.plan}
                                </strong>
                            </div>

                            <div className="member-info-card">
                                <span>Status</span>

                                <strong
                                    className={`status-text ${getMembershipClass(
                                        membership.status
                                    )}`}
                                >
                                    {membership.status}
                                </strong>
                            </div>

                            <div className="member-info-card">
                                <span>
                                    Start Date
                                </span>

                                <strong>
                                    {formatDate(
                                        membership.start_date
                                    )}
                                </strong>
                            </div>

                            <div className="member-info-card">
                                <span>
                                    End Date
                                </span>

                                <strong>
                                    {formatDate(
                                        membership.end_date
                                    )}
                                </strong>
                            </div>
                        </div>
                    )}
                </section>

                {/* =========================
                    CURRENT PROGRESS
                ========================= */}

                <section className="member-info-section">
                    <div className="section-heading">
                        <div>
                            <span>
                                PROGRESS
                            </span>

                            <h2>
                                Current Progress
                            </h2>
                        </div>

                        <span className="section-number">
                            06
                        </span>
                    </div>

                    {!progress ? (
                        <div className="member-empty">
                            <p>
                                No progress information
                                yet.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="member-info-grid">
                                <div className="member-info-card">
                                    <span>
                                        Weight
                                    </span>

                                    <strong>
                                        {progress.weight
                                            ? `${progress.weight} kg`
                                            : "N/A"}
                                    </strong>
                                </div>

                                <div className="member-info-card">
                                    <span>
                                        Goal Progress
                                    </span>

                                    <strong>
                                        {
                                            progress.goal_percentage
                                        }
                                        %
                                    </strong>
                                </div>
                            </div>

                            <div className="notes-display">
                                <span>
                                    PROFESSIONAL NOTES
                                </span>

                                <p>
                                    {progress.notes ||
                                        "No notes recorded"}
                                </p>
                            </div>
                        </>
                    )}
                </section>

                {/* =========================
                    WORKOUT MANAGEMENT
                ========================= */}

                <section className="member-info-section workout-management-section">
                    <div className="section-heading">
                        <div>
                            <span>TRAINING MANAGEMENT</span>
                            <h2>Workout Management</h2>
                            <p>Add, edit, and remove workouts for this member.</p>
                        </div>
                        <span className="section-number">07</span>
                    </div>

                    <form
                        className="edit-member-form workout-admin-form"
                        onSubmit={handleAddWorkout}
                    >
                        <div className="edit-input-group">
                            <label>Workout Name</label>
                            <input
                                type="text"
                                value={workoutName}
                                onChange={(event) => setWorkoutName(event.target.value)}
                                placeholder="e.g. Chest Workout"
                            />
                        </div>

                        <div className="edit-input-group">
                            <label>Workout Type</label>
                            <select
                                value={workoutType}
                                onChange={(event) => setWorkoutType(event.target.value)}
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
                        </div>

                        <div className="edit-input-group">
                            <label>Duration (minutes)</label>
                            <input
                                type="number"
                                min="1"
                                value={workoutDuration}
                                onChange={(event) => setWorkoutDuration(event.target.value)}
                                placeholder="60"
                            />
                        </div>

                        <div className="edit-input-group">
                            <label>Workout Date</label>
                            <input
                                type="date"
                                value={workoutDate}
                                onChange={(event) => setWorkoutDate(event.target.value)}
                            />
                        </div>

                        <button
                            className="update-member-btn"
                            type="submit"
                            disabled={addingWorkout}
                        >
                            {addingWorkout ? "Adding Workout..." : "Add Workout â†’"}
                        </button>
                    </form>

                    {workoutMessage && (
                        <p className="edit-member-message">{workoutMessage}</p>
                    )}

                    {workoutDeleteMessage && (
                        <p className="edit-member-message">{workoutDeleteMessage}</p>
                    )}

                    <div className="workout-history-header">
                        <div>
                            <span className="workout-history-label">ACTIVITY HISTORY</span>
                            <h3>
                                {workouts.length} recorded workout
                                {workouts.length === 1 ? "" : "s"}
                            </h3>
                        </div>
                    </div>

                    {workouts.length === 0 ? (
                        <div className="member-empty">
                            <p>No workouts recorded.</p>
                        </div>
                    ) : (
                        <div className="member-workouts">
                            {workouts.map((workout) => (
                                <div
                                    className="member-workout workout-admin-item"
                                    key={workout.id}
                                >
                                    <div className="workout-icon">
                                        {getWorkoutIcon(workout.workout_type)}
                                    </div>

                                    {editingWorkoutId === workout.id ? (
                                        <form
                                            className="workout-edit-form"
                                            onSubmit={handleUpdateWorkout}
                                        >
                                            <div className="workout-edit-grid">
                                                <input
                                                    type="text"
                                                    value={editingWorkoutName}
                                                    onChange={(event) =>
                                                        setEditingWorkoutName(event.target.value)
                                                    }
                                                    placeholder="Workout name"
                                                />

                                                <select
                                                    value={editingWorkoutType}
                                                    onChange={(event) =>
                                                        setEditingWorkoutType(event.target.value)
                                                    }
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
                                                    value={editingWorkoutDuration}
                                                    onChange={(event) =>
                                                        setEditingWorkoutDuration(event.target.value)
                                                    }
                                                    placeholder="Minutes"
                                                />

                                                <input
                                                    type="date"
                                                    value={editingWorkoutDate}
                                                    onChange={(event) =>
                                                        setEditingWorkoutDate(event.target.value)
                                                    }
                                                />
                                            </div>

                                            <div className="workout-edit-actions">
                                                <button
                                                    className="update-member-btn workout-save-btn"
                                                    type="submit"
                                                    disabled={updatingWorkout}
                                                >
                                                    {updatingWorkout ? "Saving..." : "Save Changes"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="workout-cancel-btn"
                                                    onClick={cancelEditWorkout}
                                                    disabled={updatingWorkout}
                                                >
                                                    Cancel
                                                </button>
                                            </div>

                                            {editingWorkoutMessage && (
                                                <p className="edit-member-message">
                                                    {editingWorkoutMessage}
                                                </p>
                                            )}
                                        </form>
                                    ) : (
                                        <>
                                            <div className="workout-details">
                                                <strong>{workout.workout_name}</strong>
                                                <p>
                                                    {workout.workout_type || "Workout"}
                                                    {workout.duration
                                                        ? ` â€¢ ${workout.duration} min`
                                                        : ""}
                                                </p>
                                                <span>{formatDate(workout.workout_date)}</span>
                                            </div>

                                            <div className="workout-duration">
                                                {workout.duration
                                                    ? `${workout.duration} min`
                                                    : "â€”"}
                                            </div>

                                            <div className="workout-admin-actions">
                                                <button
                                                    type="button"
                                                    className="workout-edit-btn"
                                                    onClick={() => startEditWorkout(workout)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="workout-delete-btn"
                                                    onClick={() => openWorkoutDeleteConfirm(workout)}
                                                    disabled={deletingWorkoutId === workout.id}
                                                >
                                                    {deletingWorkoutId === workout.id ? "..." : "Delete"}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* =========================
                    DANGER ZONE
                ========================= */}

                <section className="member-info-section delete-member-section">
                    <div className="section-heading">
                        <div>
                            <span>
                                ACCOUNT ACTIONS
                            </span>

                            <h2>Danger Zone</h2>

                            <p>
                                Permanently remove this
                                member from FitZone.
                            </p>
                        </div>
                    </div>

                    <p className="delete-description">
                        Deleting this member will also
                        remove their membership,
                        progress, and workout data.
                    </p>

                    <button
                        className="delete-member-btn"
                        onClick={() =>
                            setShowDeleteConfirm(
                                true
                            )
                        }
                        disabled={deletingMember}
                    >
                        Delete Member
                    </button>

                    {deleteMessage && (
                        <p className="delete-member-message">
                            {deleteMessage}
                        </p>
                    )}
                </section>
            </main>

            {/* =========================
                WORKOUT DELETE MODAL
            ========================= */}

            {showWorkoutDeleteConfirm && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal workout-delete-modal">
                        <div className="delete-modal-icon">
                            âš ï¸
                        </div>

                        <span className="modal-label">
                            WORKOUT ACTION
                        </span>

                        <h2>
                            Delete Workout?
                        </h2>

                        <p>
                            Are you sure you want to
                            delete{" "}
                            <strong>
                                {workoutToDelete?.workout_name}
                            </strong>
                            ?
                        </p>

                        <p className="delete-warning">
                            This workout will be permanently
                            removed from this member's
                            workout history.
                        </p>

                        {workoutDeleteMessage && (
                            <p className="delete-member-message">
                                {workoutDeleteMessage}
                            </p>
                        )}

                        <div className="delete-modal-actions">
                            <button
                                className="cancel-delete-btn"
                                onClick={closeWorkoutDeleteConfirm}
                                disabled={!!deletingWorkoutId}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-delete-btn"
                                onClick={handleDeleteWorkout}
                                disabled={!!deletingWorkoutId}
                            >
                                {deletingWorkoutId
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================
                DELETE MODAL
            ========================= */}

            {showDeleteConfirm && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <div className="delete-modal-icon">
                            âš ï¸
                        </div>

                        <span className="modal-label">
                            PERMANENT ACTION
                        </span>

                        <h2>
                            Delete Member?
                        </h2>

                        <p>
                            Are you sure you want
                            to permanently delete{" "}
                            <strong>
                                {member?.name}
                            </strong>
                            ?
                        </p>

                        <p className="delete-warning">
                            This will also delete
                            their membership,
                            progress, and workout
                            history.
                        </p>

                        <div className="delete-modal-actions">
                            <button
                                className="cancel-delete-btn"
                                onClick={() =>
                                    setShowDeleteConfirm(
                                        false
                                    )
                                }
                                disabled={
                                    deletingMember
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-delete-btn"
                                onClick={
                                    handleDeleteMember
                                }
                                disabled={
                                    deletingMember
                                }
                            >
                                {deletingMember
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MemberDetails;

