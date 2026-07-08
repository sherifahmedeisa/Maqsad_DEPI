import { useState } from "react";
import "./ProviderDashboard.css";
import logo from "../../assets/maqsad-logo.png";

function ProviderDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const metrics = [
    {
      id: 1,
      icon: "",
      number: 12,
      label: "New RFPs Received",
      badge: "+13 today",
      badgeColor: "badge-teal",
    },
    {
      id: 2,
      icon: "",
      number: 8,
      label: "Active Proposals",
      badge: "In progress",
      badgeColor: "badge-blue",
    },
    {
      id: 3,
      icon: "",
      number: 2,
      label: "Upcoming Deadlines (48h)",
      badge: "Action required",
      badgeColor: "badge-red",
    },
  ];

  const incomingRequests = [
    {
      id: 1,
      company: "Acme Corp Logistics",
      priority: "High Priority",
      timeAgo: "Received 2h ago",
      title: "Enterprise Financial Audit 2024",
      description:
        "Comprehensive financial audit required for Q3-Q4. Looking for a certified provider with experience in logistics and supply chain. Must include compliance review.",
      budget: "$50,000 - $75,000",
      deadline: "Oct 15, 2024",
      location: "New York, NY (Hybrid)",
    },
    {
      id: 2,
      company: "TechNova Solutions",
      priority: "High Priority",
      timeAgo: "Received 1d ago",
      title: "Cloud Infrastructure Migration",
      description:
        "Seeking a partner to migrate legacy on-premises servers to AWS. Project includes architecture design, data transfer, and post-migration support for 3 months.",
      budget: "$120,000 - $180,000",
      deadline: "Oct 22, 2024",
      location: "Remote",
    },
    {
      id: 3,
      company: "Global Retail Partners",
      priority: "Standard",
      timeAgo: "Received 2d ago",
      title: "Employee Training Program Development",
      description:
        "Need a comprehensive training module developed for our new customer service representatives. Must include interactive elements and assessment tools.",
      budget: "$20,000 - $35,000",
      deadline: "Oct 18, 2024",
      location: "Chicago, IL",
    },
  ];

  const filteredRequests = incomingRequests.filter(
    (req) =>
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="provider-dashboard">
      {/* Sidebar */}
      <aside className={`pd-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="pd-sidebar-header">
          <img src={logo} alt="Maqsad Logo" className="sidebar-logo" />
          <h2 className="pd-logo">Maqsad</h2>
        </div>

        <div className="pd-user-section">
          <div className="pd-user-avatar">PA</div>
          <div className="pd-user-info">
            <p className="pd-user-name">Pro Solutions Ltd</p>
            <p className="pd-user-badge">✓ Verified Provider</p>
          </div>
        </div>

        <button className="pd-btn-add-service">
          <span className="pd-plus">+</span> Add New Service
        </button>

        <nav className="pd-nav">
          <ul>
            <li>
              <a href="#" className="pd-nav-item active">
                <span className="pd-nav-icon"></span>
                <span className="pd-nav-text">Overview</span>
              </a>
            </li>

            <li>
              <a href="#" className="pd-nav-item">
                <span className="pd-nav-icon"></span>
                <span className="pd-nav-text">Active RFPs</span>
              </a>
            </li>

            <li>
              <a href="#" className="pd-nav-item">
                <span className="pd-nav-icon"></span>
                <span className="pd-nav-text">Proposal History</span>
              </a>
            </li>

            <li>
              <a href="#" className="pd-nav-item">
                <span className="pd-nav-icon"></span>
                <span className="pd-nav-text">Contract Manager</span>
              </a>
            </li>

            <li>
              <a href="#" className="pd-nav-item">
                <span className="pd-nav-icon"></span>
                <span className="pd-nav-text">Analytics</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="pd-sidebar-footer">
          <a href="#" className="pd-footer-item">
            <span className="pd-footer-icon"></span>
            <span className="pd-footer-text">Help Center</span>
          </a>

          <a href="#" className="pd-footer-item">
            <span className="pd-footer-icon"></span>
            <span className="pd-footer-text">Log Out</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pd-main">
        {/* Header */}
        <div className="pd-header">
          <div className="pd-header-left">
            <button
              className="pd-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>

            <h1 className="pd-page-title">Dashboard Overview</h1>
          </div>

          <div className="pd-header-right">
            <div className="pd-search-box">
              <span className="pd-search-icon"></span>

              <input
                type="text"
                placeholder="Search RFPs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pd-search-input"
              />
            </div>

            <button className="pd-header-btn"></button>
          </div>
        </div>

        <p className="pd-subtitle">
          Welcome back, Pro Solutions Ltd. Here is your current pipeline.
        </p>

        {/* Metrics Grid */}
        <div className="pd-metrics-grid">
          {metrics.map((metric) => (
            <div key={metric.id} className="pd-metric-card">
              <div className="pd-metric-icon">{metric.icon}</div>

              <div className="pd-metric-content">
                <span className={`pd-metric-badge ${metric.badgeColor}`}>
                  {metric.badge}
                </span>

                <p className="pd-metric-number">{metric.number}</p>
                <p className="pd-metric-label">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Incoming Requests Section */}
        <div className="pd-section">
          <div className="pd-section-header">
            <h2>Incoming Requests</h2>

            <a href="#" className="pd-view-all">
              View All
            </a>
          </div>

          <div className="pd-requests-list">
            {filteredRequests.length === 0 ? (
              <div className="pd-empty-state">
                <p>No RFPs match your search</p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div key={request.id} className="pd-request-card">
                  <div className="pd-request-header">
                    <div className="pd-request-title-section">
                      <p className="pd-request-company">
                        {request.company}
                        <span className="pd-priority-badge">
                          {request.priority}
                        </span>
                      </p>

                      <p className="pd-request-time">{request.timeAgo}</p>
                    </div>
                  </div>

                  <h3 className="pd-request-title">{request.title}</h3>

                  <p className="pd-request-description">
                    {request.description}
                  </p>

                  <div className="pd-request-meta">
                    <div className="pd-meta-item">
                      <span className="pd-meta-icon"></span>
                      <span className="pd-meta-value">{request.budget}</span>
                    </div>

                    <div className="pd-meta-item">
                      <span className="pd-meta-icon"></span>
                      <span className="pd-meta-value">
                        Deadline: {request.deadline}
                      </span>
                    </div>

                    <div className="pd-meta-item">
                      <span className="pd-meta-icon"></span>
                      <span className="pd-meta-value">{request.location}</span>
                    </div>
                  </div>

                  <div className="pd-request-actions">
                    <button className="pd-btn-respond">
                      Review & Respond
                    </button>

                    <button className="pd-btn-decline">Decline</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pd-footer">
        <div className="pd-footer-content">
          <p>
            <strong>Maqsad</strong> © 2024 Maqsad B2B Marketplace. All rights
            reserved.
          </p>

          <div className="pd-footer-links">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Provider Guidelines</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ProviderDashboard;