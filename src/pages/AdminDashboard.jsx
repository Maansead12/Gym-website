import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeMemberships: 0,
        totalWorkouts: 0,
        membersWithProgress: 0,
    });

    const [recentMembers, setRecentMembers] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

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

        loadAdminData(token);
    }, [navigate]);

    async function loadAdminData(token) {
        try {
            setLoading(true);
            setError("");

            const [membersResponse, statsResponse] =
                await Promise.all([
                    fetch(
                        "http://localhost:5000/api/admin/members",
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    ),

                    fetch(
                        "http://localhost:5000/api/admin/stats",
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    ),
                ]);

            const membersData =
                await membersResponse.json();

            const statsData =
                await statsResponse.json();

            if (
                membersResponse.status === 401 ||
                statsResponse.status === 401
            ) {
                localStorage.removeItem("fitzone_token");
                localStorage.removeItem("fitzone_user");

                navigate("/login");
                return;
            }

            if (
                membersResponse.status === 403 ||
                statsResponse.status === 403
            ) {
                navigate("/dashboard");
                return;
            }

            if (!membersResponse.ok) {
                throw new Error(
                    membersData.message ||
                    "Failed to load members"
                );
            }

            if (!statsResponse.ok) {
                throw new Error(
                    statsData.message ||
                    "Failed to load statistics"
                );
            }

            setMembers(
                membersData.members || []
            );

            setStats(
                statsData.stats || {
                    totalUsers: 0,
                    activeMemberships: 0,
                    totalWorkouts: 0,
                    membersWithProgress: 0,
                }
            );

            setRecentMembers(
                statsData.recentMembers || []
            );
        } catch (error) {
            console.error(
                "Admin dashboard error:",
                error
            );

            setError(
                "Unable to load admin dashboard."
            );
        } finally {
            setLoading(false);
        }
    }

    function openMember(memberId) {
        navigate(`/admin/members/${memberId}`);
    }

    const filteredMembers = members.filter(
        (member) => {
            const search = searchTerm
                .trim()
                .toLowerCase();

            const matchesSearch =
                !search ||
                member.name
                    .toLowerCase()
                    .includes(search) ||
                member.email
                    .toLowerCase()
                    .includes(search);

            const matchesRole =
                roleFilter === "all" ||
                member.role === roleFilter;

            return matchesSearch && matchesRole;
        }
    );

    if (loading) {
        return (
            <div className="admin-loading">
                <h2>
                    Loading Admin Dashboard...
                </h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-loading">
                <h2>{error}</h2>

                <button
                    onClick={() =>
                        window.location.reload()
                    }
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <main className="admin-content">

                {/* HEADER */}

                <section className="admin-header">
                    <p>ADMIN PANEL</p>

                    <h1>
                        Gym <span>Overview</span>
                    </h1>

                    <p>
                        Monitor your FitZone members,
                        memberships, workouts, and
                        progress.
                    </p>
                </section>

                {/* STATISTICS */}

                <section className="admin-stats">

                    <div className="admin-stat-card">
                        <span className="admin-stat-icon">
                            👥
                        </span>

                        <h3>Total Users</h3>

                        <strong>
                            {stats.totalUsers}
                        </strong>

                        <p>
                            Registered accounts
                        </p>
                    </div>

                    <div className="admin-stat-card">
                        <span className="admin-stat-icon">
                            🟢
                        </span>

                        <h3>Active Memberships</h3>

                        <strong>
                            {stats.activeMemberships}
                        </strong>

                        <p>
                            Currently active
                        </p>
                    </div>

                    <div className="admin-stat-card">
                        <span className="admin-stat-icon">
                            🏋️
                        </span>

                        <h3>Total Workouts</h3>

                        <strong>
                            {stats.totalWorkouts}
                        </strong>

                        <p>
                            Workout records
                        </p>
                    </div>

                    <div className="admin-stat-card">
                        <span className="admin-stat-icon">
                            📈
                        </span>

                        <h3>Progress Tracking</h3>

                        <strong>
                            {stats.membersWithProgress}
                        </strong>

                        <p>
                            Members with progress
                        </p>
                    </div>

                </section>

                {/* RECENT MEMBERS */}

                <section className="recent-members-section">

                    <div className="recent-members-header">
                        <div>
                            <p>NEW MEMBERS</p>

                            <h2>
                                Recently Joined
                            </h2>
                        </div>

                        <span>
                            Latest 5
                        </span>
                    </div>

                    {recentMembers.length === 0 ? (
                        <div className="members-empty">
                            <p>
                                No members found.
                            </p>
                        </div>
                    ) : (
                        <div className="recent-members-list">
                            {recentMembers.map(
                                (member) => (
                                    <div
                                        className="recent-member-item"
                                        key={member.id}
                                    >
                                        <div className="recent-member-avatar">
                                            {member.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="recent-member-info">
                                            <strong>
                                                {member.name}
                                            </strong>

                                            <span>
                                                {member.email}
                                            </span>
                                        </div>

                                        <div className="recent-member-date">
                                            {new Date(
                                                member.created_at
                                            ).toLocaleDateString()}
                                        </div>

                                        <button
                                            className="view-member-btn"
                                            onClick={() =>
                                                openMember(
                                                    member.id
                                                )
                                            }
                                        >
                                            View →
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                </section>

                {/* ALL MEMBERS */}

                <section className="members-section">

                    <div className="members-header">
                        <div>
                            <h2>
                                All Users
                            </h2>

                            <p>
                                Manage FitZone members
                                and view their complete
                                profiles.
                            </p>
                        </div>
                    </div>

                    {/* SEARCH AND FILTER */}

                    <div className="members-controls">

                        <div className="member-search">
                            <span>🔎</span>

                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="member-filter">
                            <label>
                                Filter:
                            </label>

                            <select
                                value={roleFilter}
                                onChange={(event) =>
                                    setRoleFilter(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    All Users
                                </option>

                                <option value="member">
                                    Members
                                </option>

                                <option value="admin">
                                    Admins
                                </option>
                            </select>
                        </div>

                    </div>

                    <div className="member-results-count">
                        Showing{" "}
                        <strong>
                            {filteredMembers.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {members.length}
                        </strong>{" "}
                        users
                    </div>

                    {filteredMembers.length === 0 ? (
                        <div className="members-empty">
                            <p>
                                No users match your search.
                            </p>

                            <button
                                className="clear-search-btn"
                                onClick={() => {
                                    setSearchTerm("");
                                    setRoleFilter("all");
                                }}
                            >
                                Clear Search
                            </button>
                        </div>
                    ) : (
                        <div className="members-table-wrapper">

                            <table className="members-table">

                                <thead>
                                    <tr>
                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Role
                                        </th>

                                        <th>
                                            Joined
                                        </th>

                                        <th>
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredMembers.map(
                                        (member) => (
                                            <tr
                                                key={member.id}
                                            >
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
                                                        className={`role-badge ${member.role ===
                                                                "admin"
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
                                                            openMember(
                                                                member.id
                                                            )
                                                        }
                                                    >
                                                        View →
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
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