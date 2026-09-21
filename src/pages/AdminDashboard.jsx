import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
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

        if (currentUser.role !== "admin") {
            navigate("/dashboard");
            return;
        }

        loadMembers(token);
    }, [navigate]);

    async function loadMembers(token) {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/admin/members",
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
                    data.message || "Failed to load members"
                );
            }

            setMembers(data.members || []);
        } catch (error) {
            console.error("Admin members error:", error);

            setError("Unable to load members.");
        } finally {
            setLoading(false);
        }
    }

    function openMember(memberId) {
        navigate(`/admin/members/${memberId}`);
    }

    if (loading) {
        return (
            <div className="admin-loading">
                <h2>Loading Admin Dashboard...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-loading">
                <h2>{error}</h2>

                <button
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <main className="admin-content">

                <section className="admin-header">
                    <p>ADMIN PANEL</p>

                    <h1>
                        Member <span>Management</span>
                    </h1>

                    <p>
                        Manage FitZone members and view their account
                        information.
                    </p>
                </section>

                <section className="admin-stats">

                    <div className="admin-stat-card">
                        <h3>Total Users</h3>

                        <strong>
                            {members.length}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <h3>Admins</h3>

                        <strong>
                            {
                                members.filter(
                                    (member) =>
                                        member.role === "admin"
                                ).length
                            }
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <h3>Members</h3>

                        <strong>
                            {
                                members.filter(
                                    (member) =>
                                        member.role === "member"
                                ).length
                            }
                        </strong>
                    </div>

                </section>

                <section className="members-section">

                    <div className="members-header">
                        <div>
                            <h2>All Users</h2>

                            <p>
                                Click a user to view their complete
                                profile.
                            </p>
                        </div>
                    </div>

                    {members.length === 0 ? (
                        <div className="members-empty">
                            <p>No users found.</p>
                        </div>
                    ) : (
                        <div className="members-table-wrapper">

                            <table className="members-table">

                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {members.map((member) => (
                                        <tr key={member.id}>

                                            <td>
                                                <strong>
                                                    {member.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {member.email}
                                            </td>

                                            <td>
                                                <span
                                                    className={`role-badge ${member.role === "admin"
                                                            ? "admin-role"
                                                            : "member-role"
                                                        }`}
                                                >
                                                    {member.role}
                                                </span>
                                            </td>

                                            <td>
                                                {new Date(
                                                    member.created_at
                                                ).toLocaleDateString()}
                                            </td>

                                            <td>
                                                <button
                                                    className="view-member-btn"
                                                    onClick={() =>
                                                        openMember(member.id)
                                                    }
                                                >
                                                    View →
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </main>
        </div>
    );
}

export default AdminDashboard;