import { useState, useEffect } from "react";
import "./MyProposals.css";

function MyProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProposals();
  }, [filter]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:4000/api/proposals/me";
      if (filter !== "all") {
        url += `?status=${filter}`;
      }

      const response = await fetch(url, { credentials: "include" });
      const data = await response.json();
      setProposals(data);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-proposals-container">
      <div className="mp-header">
        <h1>My Proposals</h1>
        <p className="subtitle">Track and manage your submitted proposals</p>
      </div>

      <div className="filter-tabs">
        {["all", "submitted", "accepted", "rejected"].map((status) => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? "active" : ""}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading proposals...</div>
      ) : proposals.length === 0 ? (
        <div className="empty-state">
          <p>No proposals found</p>
        </div>
      ) : (
        <div className="proposals-list">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="proposal-card">
              <div className="proposal-header">
                <h3 className="proposal-title">{proposal.rfp?.title}</h3>
                <span className={`proposal-status ${proposal.status}`}>
                  {proposal.status}
                </span>
              </div>

              <p className="proposal-rfp">RFP: {proposal.rfp?.title}</p>

              <p className="proposal-message">{proposal.message}</p>

              <div className="proposal-amount">
                <span className="label">Proposed Amount:</span>
                <span className="value">${proposal.proposedAmount}</span>
              </div>

              <div className="proposal-actions">
                <button className="btn-secondary">View Details</button>
                <button className="btn-secondary">Withdraw</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProposals;
