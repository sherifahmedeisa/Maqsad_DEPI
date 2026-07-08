import { useState, useEffect } from "react";
import "./ServiceRequests.css";

function ServiceRequests() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    search: "",
  });

  useEffect(() => {
    fetchRFPs();
  }, [filters]);

  const fetchRFPs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.category) params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(
        `http://localhost:4000/api/requests?${params}`,
        { credentials: "include" }
      );
      const data = await response.json();
      setRfps(data);
    } catch (error) {
      console.error("Error fetching RFPs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="service-requests-container">
      <div className="sr-header">
        <h1>Service Requests</h1>
        <p className="subtitle">Browse all available service requests</p>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by title or description..."
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          className="filter-input"
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="closed">Closed</option>
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="consulting">Consulting</option>
          <option value="development">Development</option>
          <option value="design">Design</option>
          <option value="marketing">Marketing</option>
          <option value="finance">Finance</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading service requests...</div>
      ) : rfps.length === 0 ? (
        <div className="empty-state">
          <p>No service requests found</p>
        </div>
      ) : (
        <div className="rfps-list">
          {rfps.map((rfp) => (
            <div key={rfp.id} className="rfp-card">
              <div className="rfp-header">
                <h3 className="rfp-title">{rfp.title}</h3>
                <span className={`status-badge ${rfp.status}`}>{rfp.status}</span>
              </div>

              <p className="rfp-description">{rfp.description}</p>

              <div className="rfp-meta">
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{rfp.category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Budget:</span>
                  <span className="meta-value">${rfp.budget}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Timeline:</span>
                  <span className="meta-value">{rfp.timeline}</span>
                </div>
              </div>

              <div className="rfp-footer">
                <small className="posted-by">
                  Posted by {rfp.beneficiary?.fullName}
                </small>
                <button className="view-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServiceRequests;
