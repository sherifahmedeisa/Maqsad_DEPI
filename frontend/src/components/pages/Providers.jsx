import { useState, useEffect } from "react";
import "./Providers.css";

function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/providers", {
        credentials: "include",
      });
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(
    (provider) =>
      provider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="providers-container">
      <div className="providers-header">
        <h1>Service Providers</h1>
        <p className="subtitle">Discover and connect with verified service providers</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search providers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading providers...</div>
      ) : filteredProviders.length === 0 ? (
        <div className="empty-state">
          <p>No providers found</p>
        </div>
      ) : (
        <div className="providers-grid">
          {filteredProviders.map((provider) => (
            <div key={provider.id} className="provider-card">
              <div className="provider-avatar">
                {provider.fullName.charAt(0).toUpperCase()}
              </div>

              <h3 className="provider-name">{provider.fullName}</h3>

              <p className="provider-email">{provider.email}</p>

              <div className="provider-stats">
                <div className="stat">
                  <span className="stat-label">Proposals</span>
                  <span className="stat-value">{provider.completedProposals || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">{provider.rating || "4.8"}</span>
                </div>
              </div>

              <div className="provider-actions">
                <button className="btn-view">View Profile</button>
                <button className="btn-contact">Send Message</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Providers;
