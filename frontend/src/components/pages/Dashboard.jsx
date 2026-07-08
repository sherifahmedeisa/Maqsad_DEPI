import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [userRole, setUserRole] = useState("beneficiary");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/dashboard/summary", {
        credentials: "include",
      });
      const data = await response.json();
      setSummary(data);
      setUserRole(data.user.role);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Welcome back! Here's your overview.</p>
      </div>

      <div className="metrics-grid">
        {userRole === "beneficiary" ? (
          <>
            <div className="metric-card">
              <div className="metric-icon"></div>
              <div className="metric-content">
                <h3>Total RFPs</h3>
                <p className="metric-value">{summary?.metrics?.totalRFPs || 0}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon"></div>
              <div className="metric-content">
                <h3>Open RFPs</h3>
                <p className="metric-value">{summary?.metrics?.openRFPs || 0}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon"></div>
              <div className="metric-content">
                <h3>Proposals Received</h3>
                <p className="metric-value">{summary?.metrics?.proposalsReceived || 0}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="metric-card">
              <div className="metric-icon"></div>
              <div className="metric-content">
                <h3>Total Proposals</h3>
                <p className="metric-value">{summary?.metrics?.totalProposals || 0}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon"></div>
              <div className="metric-content">
                <h3>Submitted Proposals</h3>
                <p className="metric-value">{summary?.metrics?.submittedProposals || 0}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon"></div>
              <div className="metric-content">
                <h3>Recommended RFPs</h3>
                <p className="metric-value">{summary?.metrics?.recommendedRFPs || 0}</p>
              </div>
            </div>
          </>
        )}

        <div className="metric-card">
          <div className="metric-icon"></div>
          <div className="metric-content">
            <h3>Notifications</h3>
            <p className="metric-value">{summary?.metrics?.unreadNotifications || 0}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        {userRole === "beneficiary" ? (
          <>
            <button className="action-btn primary">Create New RFP</button>
            <button className="action-btn secondary">Browse Providers</button>
          </>
        ) : (
          <>
            <button className="action-btn primary">View Recommended RFPs</button>
            <button className="action-btn secondary">My Proposals</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
