import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MemberDetails.css";

function MemberDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [member, setMember] = useState(null);
    const [membership, setMembership] = useState(null);
    const [progress, setProgress] = useState(null);
    const [workouts, setWorkouts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Edit member
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editRole, setEditRole] = useState("member");
    const [editMessage, setEditMessage] = useState("");
    const [updatingMember, setUpdatingMember] = useState(false);

    // Delete member
    const [deleteMessage, setDeleteMessage] = useState("");
    const [deletingMember, setDeletingMember] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] =
        useState(false);

    useEffect(() => {
        const token = localStorage.getItem("fitzone_token");
        const savedUser = localStorage.getItem("fitzone_user");

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

    async function loadMemberDetails(token) {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:5000/api/admin/members/${id}`,
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

                if (response.status === 403) {
                    navigate("/dashboard");
                    return;
                }

                throw new Error(
                    data.message || "Failed to load member"
                );
            }

            setMember(data.member);
            setMembership(data.membership);
            setProgress(data.progress);
            setWorkouts(data.workouts || []);

            setEditName(data.member?.name || "");
            setEditEmail(data.member?.email || "");
            setEditRole(data.member?.role || "member");
        } catch (error) {
            console.error(
                "Member details error:",
                error
            );

            setError("Unable to load member details.");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateMember(event) {
        event.preventDefault();

        setEditMessage("");

        if (!editName.trim()) {
            setEditMessage("Name cannot be empty.");
            return;
        }

        if (!editEmail.trim()) {
            setEditMessage("Email cannot be empty.");
            return;
        }

        try {
            setUpdatingMember(true);

            const token = localStorage.getItem(
                "fitzone_token"
            );

            const response = await fetch(
                `http://localhost:5000/api/admin/members/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: editName.trim(),
                        email: editEmail.trim().toLowerCase(),
                        role: editRole,
                    }),
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

                if (response.status === 403) {
                    navigate("/dashboard");
                    return;
                }

                setEditMessage(
                    data.message || "Failed to update member."
                );

                return;
            }

            setMember(data.member);

            setEditName(data.member.name);
            setEditEmail(data.member.email);
            setEditRole(data.member.role);

            setEditMessage(
                "Member updated successfully! ✓"
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

    async function handleDeleteMember() {
        setDeleteMessage("");

        try {
            setDeletingMember(true);

            const token = localStorage.getItem(
                "fitzone_token"
            );

            const response = await fetch(
                `http://localhost:5000/api/admin/members/${id}`,
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
                if (response.status === 401) {
                    localStorage.removeItem("fitzone_token");
                    localStorage.removeItem("fitzone_user");

                    navigate("/login");
                    return;
                }

                if (response.status === 403) {
                    navigate("/dashboard");
                    return;
                }

                setDeleteMessage(
                    data.message || "Failed to delete member."
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

    if (loading) {
        return (
            <div className="member-details-loading">
                <h2>Loading Member...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="member-details-loading">
                <h2>{error}</h2>

                <button
                    onClick={() => navigate("/admin")}
                >
                    Back to Admin
                </button>
            </div>
        );
    }

    return (
        <div className="member-details-page">
            <main className="member-details-content">

                <button
                    className="back-admin-btn"
                    onClick={() => navigate("/admin")}
                >
                    ← Back to Members
                </button>

                {/* PROFILE HEADER */}

                <section className="member-profile-header">
                    <p>MEMBER PROFILE</p>

                    <h1>
                        {member?.name}
                    </h1>

                    <span
                        className={`member-role-badge ${member?.role === "admin"
                                ? "profile-admin"
                                : "profile-member"
                            }`}
                    >
                        {member?.role}
                    </span>
                </section>

                {/* EDIT MEMBER */}

                <section className="member-info-section edit-member-section">
                    <h2>Edit Member</h2>

                    <p className="edit-member-description">
                        Update this member's account information.
                    </p>

                    <form
                        className="edit-member-form"
                        onSubmit={handleUpdateMember}
                    >
                        <div className="edit-input-group">
                            <label>Name</label>

                            <input
                                type="text"
                                value={editName}
                                onChange={(event) =>
                                    setEditName(event.target.value)
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
                                    setEditEmail(event.target.value)
                                }
                                placeholder="Member email"
                            />
                        </div>

                        <div className="edit-input-group">
                            <label>Role</label>

                            <select
                                value={editRole}
                                onChange={(event) =>
                                    setEditRole(event.target.value)
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
                            disabled={updatingMember}
                        >
                            {updatingMember
                                ? "Updating..."
                                : "Save Changes →"}
                        </button>
                    </form>

                    {editMessage && (
                        <p className="edit-member-message">
                            {editMessage}
                        </p>
                    )}
                </section>

                {/* DELETE MEMBER */}

                <section className="member-info-section delete-member-section">
                    <h2>Danger Zone</h2>

                    <p className="delete-description">
                        Permanently delete this member and all
                        of their membership, progress, and
                        workout data.
                    </p>

                    <button
                        className="delete-member-btn"
                        onClick={() =>
                            setShowDeleteConfirm(true)
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

                {/* ACCOUNT INFORMATION */}

                <section className="member-info-section">
                    <h2>Account Information</h2>

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
                                {member?.created_at
                                    ? new Date(
                                        member.created_at
                                    ).toLocaleDateString()
                                    : "N/A"}
                            </strong>
                        </div>
                    </div>
                </section>

                {/* MEMBERSHIP */}

                <section className="member-info-section">
                    <h2>Membership</h2>

                    {!membership ? (
                        <div className="member-empty">
                            <p>
                                This member has no membership.
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

                                <strong>
                                    {membership.status}
                                </strong>
                            </div>

                            <div className="member-info-card">
                                <span>Start Date</span>

                                <strong>
                                    {membership.start_date ||
                                        "N/A"}
                                </strong>
                            </div>

                            <div className="member-info-card">
                                <span>End Date</span>

                                <strong>
                                    {membership.end_date ||
                                        "N/A"}
                                </strong>
                            </div>
                        </div>
                    )}
                </section>

                {/* PROGRESS */}

                <section className="member-info-section">
                    <h2>Progress</h2>

                    {!progress ? (
                        <div className="member-empty">
                            <p>
                                No progress information yet.
                            </p>
                        </div>
                    ) : (
                        <div className="member-info-grid">
                            <div className="member-info-card">
                                <span>Weight</span>

                                <strong>
                                    {progress.weight
                                        ? `${progress.weight} kg`
                                        : "N/A"}
                                </strong>
                            </div>

                            <div className="member-info-card">
                                <span>Goal Progress</span>

                                <strong>
                                    {progress.goal_percentage || 0}%
                                </strong>
                            </div>

                            <div className="member-info-card member-notes-card">
                                <span>Notes</span>

                                <strong>
                                    {progress.notes ||
                                        "No notes"}
                                </strong>
                            </div>
                        </div>
                    )}
                </section>

                {/* WORKOUT HISTORY */}

                <section className="member-info-section">
                    <h2>Workout History</h2>

                    {workouts.length === 0 ? (
                        <div className="member-empty">
                            <p>
                                No workouts recorded.
                            </p>
                        </div>
                    ) : (
                        <div className="member-workouts">
                            {workouts.map((workout) => (
                                <div
                                    className="member-workout"
                                    key={workout.id}
                                >
                                    <div className="workout-icon">
                                        🏋️
                                    </div>

                                    <div className="workout-details">
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

                                        <span>
                                            {workout.workout_date ||
                                                "No date"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </main>

            {/* DELETE CONFIRMATION */}

            {showDeleteConfirm && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <div className="delete-modal-icon">
                            ⚠️
                        </div>

                        <h2>Delete Member?</h2>

                        <p>
                            Are you sure you want to permanently
                            delete{" "}
                            <strong>{member?.name}</strong>?
                        </p>

                        <p className="delete-warning">
                            This will also delete their membership,
                            progress, and workout history.
                        </p>

                        <div className="delete-modal-actions">
                            <button
                                className="cancel-delete-btn"
                                onClick={() =>
                                    setShowDeleteConfirm(false)
                                }
                                disabled={deletingMember}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-delete-btn"
                                onClick={handleDeleteMember}
                                disabled={deletingMember}
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