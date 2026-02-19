import { useEffect, useState } from "react";
import { fetchAllUsers, fetchUserDetails } from "../services/adminService";
import { toast } from "sonner";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalBalance: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await fetchAllUsers();
            setUsers(data.users);
            setStats(data.stats);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (userId) => {
        setLoadingDetails(true);
        try {
            const user = await fetchUserDetails(userId);
            setSelectedUser(user);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingDetails(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "var(--text-secondary)" }}>
                Loading Admin Data...
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <h1 style={{ marginBottom: "2rem" }}>Admin Dashboard</h1>

            {/* Stats Cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem"
            }}>
                <div className="glass-card">
                    <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Total Users
                    </h3>
                    <p style={{ fontSize: "2.5rem", fontWeight: "700", margin: "0.5rem 0 0" }}>
                        {stats.totalUsers}
                    </p>
                </div>

                <div className="glass-card" style={{ position: "relative", overflow: "hidden" }}>
                    {/* Subtle gradient glow behind the text */}
                    <div style={{
                        position: "absolute",
                        top: "-20%",
                        right: "-10%",
                        width: "150px",
                        height: "150px",
                        background: "var(--accent-color)",
                        filter: "blur(60px)",
                        opacity: "0.2",
                        borderRadius: "50%"
                    }} />
                    <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Total Funds in System
                    </h3>
                    <p style={{
                        fontSize: "2.5rem",
                        fontWeight: "700",
                        margin: "0.5rem 0 0",
                        background: "var(--accent-gradient)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        ${stats.totalBalance.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass-card" style={{ padding: "0" }}>
                <div style={{ padding: "1.5rem", borderBottom: "var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontSize: "1.2rem", margin: 0 }}>User Management</h2>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                        Viewing {users.length} users
                    </span>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "rgba(0,0,0,0.2)", color: "var(--text-secondary)", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px" }}>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: "600" }}>Name</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: "600" }}>Email</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: "600" }}>Role</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: "600" }}>Balance</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: "600" }}>Joined</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: "600" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} style={{ borderBottom: "var(--glass-border)", transition: "background 0.2s" }} className="hover-row">
                                    <td style={{ padding: "1.2rem 1.5rem", fontWeight: "500" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={{
                                                width: "32px", height: "32px", borderRadius: "50%",
                                                background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.1)"
                                            }}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            {user.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: "1.2rem 1.5rem", color: "var(--text-secondary)" }}>{user.email}</td>
                                    <td style={{ padding: "1.2rem 1.5rem" }}>
                                        <span style={{
                                            padding: "4px 10px",
                                            borderRadius: "6px",
                                            fontSize: "0.75rem",
                                            fontWeight: "600",
                                            background: user.role === "admin" ? "rgba(139, 92, 246, 0.2)" : "rgba(59, 130, 246, 0.15)",
                                            color: user.role === "admin" ? "#c084fc" : "var(--accent-color)",
                                            border: user.role === "admin" ? "1px solid rgba(139, 92, 246, 0.3)" : "1px solid rgba(59, 130, 246, 0.3)"
                                        }}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: "1.2rem 1.5rem", fontFamily: "monospace", letterSpacing: "0.5px" }} className="text-success">
                                        ${user.balance.toLocaleString()}
                                    </td>
                                    <td style={{ padding: "1.2rem 1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: "1.2rem 1.5rem" }}>
                                        <button
                                            onClick={() => handleViewDetails(user._id)}
                                            style={{
                                                background: "transparent",
                                                border: "1px solid var(--accent-color)",
                                                color: "var(--accent-color)",
                                                padding: "6px 16px",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                fontSize: "0.85rem",
                                                transition: "all 0.2s"
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = "var(--accent-color)";
                                                e.currentTarget.style.color = "white";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = "transparent";
                                                e.currentTarget.style.color = "var(--accent-color)";
                                            }}
                                            disabled={loadingDetails}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
        .hover-row:hover {
          background: rgba(255,255,255,0.03);
        }
      `}</style>

            {/* User Details Modal */}
            {selectedUser && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 10000,
                    background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)",
                    display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem"
                }}>
                    <div className="glass-card animate-fade-in" style={{
                        width: "100%", maxWidth: "900px", maxHeight: "90vh", overflowY: "auto",
                        padding: "0", position: "relative", border: "1px solid rgba(255,255,255,0.15)"
                    }}>
                        <button
                            onClick={() => setSelectedUser(null)}
                            style={{
                                position: "absolute", top: "1.5rem", right: "1.5rem",
                                background: "rgba(255,255,255,0.1)", border: "none", color: "white",
                                width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10
                            }}
                        >
                            ✕
                        </button>

                        {/* Modal Header */}
                        <div style={{
                            padding: "2rem",
                            background: "linear-gradient(to right, rgba(59, 130, 246, 0.1), transparent)",
                            borderBottom: "var(--glass-border)", display: "flex", alignItems: "center", gap: "1.5rem"
                        }}>
                            <div style={{
                                width: "80px", height: "80px", borderRadius: "50%",
                                background: "var(--accent-gradient)", color: "white",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "2.5rem", boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
                            }}>
                                {selectedUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.8rem" }}>{selectedUser.name}</h2>
                                <p style={{ margin: 0, color: "var(--text-secondary)" }}>{selectedUser.email}</p>
                            </div>
                            <div style={{ marginLeft: "auto", textAlign: "right" }}>
                                <p style={{ margin: "0 0 0.2rem", color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "uppercase" }}>Current Balance</p>
                                <p style={{ margin: 0, fontSize: "2rem", fontWeight: "700" }} className="text-success">
                                    ${selectedUser.balance.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: "2rem" }}>
                            {/* Portfolio Section */}
                            <div style={{ marginBottom: "3rem" }}>
                                <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.8rem", marginBottom: "1.2rem" }}>
                                    Active Holdings
                                </h3>
                                {selectedUser.portfolio && selectedUser.portfolio.length > 0 ? (
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                                        <thead>
                                            <tr style={{ color: "var(--text-secondary)", textAlign: "left" }}>
                                                <th style={{ padding: "0.8rem" }}>Symbol</th>
                                                <th style={{ padding: "0.8rem" }}>Quantity</th>
                                                <th style={{ padding: "0.8rem" }}>Avg. Price</th>
                                                <th style={{ padding: "0.8rem" }}>Current Value (Est)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedUser.portfolio.map((stock, index) => (
                                                <tr key={index} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                                    <td style={{ padding: "1rem 0.8rem", fontWeight: "600" }}>{stock.symbol}</td>
                                                    <td style={{ padding: "1rem 0.8rem" }}>{stock.quantity}</td>
                                                    <td style={{ padding: "1rem 0.8rem" }}>${stock.avgPrice.toFixed(2)}</td>
                                                    <td style={{ padding: "1rem 0.8rem" }} className="text-success">
                                                        ${(stock.quantity * stock.avgPrice).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div style={{ padding: "2rem", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "12px", color: "var(--text-secondary)" }}>
                                        No active stock holdings found.
                                    </div>
                                )}
                            </div>

                            {/* Transaction History Section */}
                            <div>
                                <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.8rem", marginBottom: "1.2rem" }}>
                                    Transaction History
                                </h3>
                                {selectedUser.transactions && selectedUser.transactions.length > 0 ? (
                                    <div style={{ maxHeight: "300px", overflowY: "auto", paddingRight: "5px" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                                            <thead style={{ position: "sticky", top: 0, background: "#141928", zIndex: 1 }}>
                                                <tr style={{ color: "var(--text-secondary)", textAlign: "left" }}>
                                                    <th style={{ padding: "0.8rem" }}>Date</th>
                                                    <th style={{ padding: "0.8rem" }}>Type</th>
                                                    <th style={{ padding: "0.8rem" }}>Symbol</th>
                                                    <th style={{ padding: "0.8rem" }}>Qty</th>
                                                    <th style={{ padding: "0.8rem" }}>Price</th>
                                                    <th style={{ padding: "0.8rem" }}>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedUser.transactions.slice().reverse().map((tx, index) => (
                                                    <tr key={index} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                                        <td style={{ padding: "0.8rem", color: "var(--text-secondary)" }}>
                                                            {new Date(tx.date).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ padding: "0.8rem" }}>
                                                            <span style={{
                                                                padding: "4px 8px", borderRadius: "4px", fontWeight: "700", fontSize: "0.75rem",
                                                                background: tx.type === "BUY" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                                                color: tx.type === "BUY" ? "var(--success)" : "var(--danger)"
                                                            }}>
                                                                {tx.type}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "0.8rem", fontWeight: "600" }}>{tx.symbol}</td>
                                                        <td style={{ padding: "0.8rem" }}>{tx.quantity}</td>
                                                        <td style={{ padding: "0.8rem" }}>${tx.price.toFixed(2)}</td>
                                                        <td style={{ padding: "0.8rem" }}>
                                                            ${(tx.quantity * tx.price).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div style={{ padding: "2rem", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "12px", color: "var(--text-secondary)" }}>
                                        No transactions recorded.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.2)", borderTop: "var(--glass-border)", textAlign: "right" }}>
                            <button
                                onClick={() => setSelectedUser(null)}
                                style={{
                                    padding: "0.8rem 2rem",
                                    background: "var(--glass-bg)",
                                    border: "var(--glass-border)",
                                    color: "white",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    transition: "all 0.2s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                                onMouseOut={(e) => e.currentTarget.style.background = "var(--glass-bg)"}
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
