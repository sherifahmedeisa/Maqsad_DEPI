import { useState } from "react";
import "./SubmitProposal.css";

function SubmitProposal() {
  const [proposal, setProposal] = useState({
    executiveSummary: "",
    proposedBudget: "",
    timeline: "",
    documentUploaded: false,
    agreedToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProposal((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveDraft = async () => {
    try {
      // Save draft logic
      console.log("Saving draft:", proposal);
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleSubmitProposal = async () => {
    if (!proposal.executiveSummary || !proposal.proposedBudget) {
      alert("Please fill in all required fields");
      return;
    }

    if (!proposal.agreedToTerms) {
      alert("You must agree to the terms before submitting");
      return;
    }

    try {
      setIsSubmitting(true);
      // Submit proposal logic
      console.log("Submitting proposal:", proposal);
      alert("Proposal submitted successfully!");
      setProposal({
        executiveSummary: "",
        proposedBudget: "",
        timeline: "",
        documentUploaded: false,
        agreedToTerms: false,
      });
    } catch (error) {
      console.error("Error submitting proposal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-proposal-page">
      <div className="sp-container">
        {/* Header */}
        <div className="sp-breadcrumb">
          <span>Active RFPs</span>
          <span className="separator">›</span>
          <span>Enterprise Cloud Migration</span>
        </div>

        <div className="sp-top-bar">
          <div className="sp-rfp-info">
            <h2 className="sp-rfp-title">Enterprise Cloud Migration Strategy & Execution</h2>
            <p className="sp-rfp-id">RFP-2024-089</p>
          </div>
          <div className="sp-actions">
            <button className="sp-btn-icon">Save</button>
            <button className="sp-btn-icon">Share</button>
          </div>
        </div>

        <div className="sp-content-wrapper">
          {/* Main Content */}
          <div className="sp-main">
            {/* RFP Details Section */}
            <div className="sp-card">
              <h3 className="sp-section-title">RFP Details</h3>

              <div className="sp-details-grid">
                <div className="sp-detail-item">
                  <h4>Project Scope</h4>
                  <p>
                    The selected vendor will be responsible for end-to-end migration services,
                    including but not limited to:
                  </p>
                  <ul>
                    <li>Assessment of current infrastructure (3 data centers, 500+ servers)</li>
                    <li>Development of a detailed migration strategy (AWS/Azure hybrid preferred)</li>
                    <li>Execution of migration waves with minimal downtime</li>
                    <li>Testing and validation of all systems</li>
                    <li>Knowledge transfer and internal team training</li>
                  </ul>
                </div>

                <div className="sp-detail-item">
                  <h4>Client Requirements</h4>
                  <div className="sp-requirements">
                    <div className="sp-req-group">
                      <span className="sp-req-title">CERTIFICATIONS:</span>
                      <p>AWS Advanced Tier or Azure Gold Partner status required.</p>
                    </div>
                    <div className="sp-req-group">
                      <span className="sp-req-title">EXPERIENCE:</span>
                      <p>Minimum 3 enterprise migrations in the last 2 years.</p>
                    </div>
                    <div className="sp-req-group">
                      <span className="sp-req-title">SECURITY CLEARANCE:</span>
                      <p>ISO 27001 compliance and SOC 2 Type II certified.</p>
                    </div>
                    <div className="sp-req-group">
                      <span className="sp-req-title">LOCATION:</span>
                      <p>Primary team must be located in North America or Europe (UTC+5 timezones).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Proposal Section */}
            <div className="sp-card submit-proposal-card">
              <h3 className="sp-section-title">Submit Proposal</h3>
              <p className="sp-section-description">
                Provide a detailed proposal addressing the requirements outlined in the RFP.
              </p>

              <div className="sp-form-group">
                <label className="sp-form-label">
                  Executive Summary & Approach
                  <span className="sp-required">*</span>
                </label>
                <textarea
                  name="executiveSummary"
                  value={proposal.executiveSummary}
                  onChange={handleInputChange}
                  placeholder="Detail your methodology, team structure, and why you are the best fit for this project."
                  className="sp-textarea"
                  rows="8"
                />
                <div className="sp-char-count">
                  {proposal.executiveSummary.length} / 5000 characters
                </div>
              </div>

              <div className="sp-form-row">
                <div className="sp-form-group">
                  <label className="sp-form-label">
                    Proposed Total Budget (USD)
                    <span className="sp-required">*</span>
                  </label>
                  <div className="sp-input-wrapper">
                    <span className="sp-currency">$</span>
                    <input
                      type="number"
                      name="proposedBudget"
                      value={proposal.proposedBudget}
                      onChange={handleInputChange}
                      placeholder="e.g., 123,000"
                      className="sp-input"
                    />
                  </div>
                </div>

                <div className="sp-form-group">
                  <label className="sp-form-label">Estimated Timeline (Months)</label>
                  <input
                    type="number"
                    name="timeline"
                    value={proposal.timeline}
                    onChange={handleInputChange}
                    placeholder="e.g., 18"
                    className="sp-input"
                  />
                </div>
              </div>

              <div className="sp-form-group">
                <label className="sp-form-label">Upload Detailed Proposal Document</label>
                <div className="sp-upload-box">
                  <input
                    type="file"
                    id="proposalFile"
                    className="sp-file-input"
                    onChange={(e) => {
                      setProposal((prev) => ({
                        ...prev,
                        documentUploaded: !!e.target.files.length,
                      }));
                    }}
                  />
                  <label htmlFor="proposalFile" className="sp-upload-label">
                    📎 Click to upload or drag and drop
                    <br />
                    <small>PDF, DOCX, or PPTX (Max 50MB)</small>
                  </label>
                  {proposal.documentUploaded && (
                    <div className="sp-upload-success">
                      ✓ Document uploaded successfully
                    </div>
                  )}
                </div>
              </div>

              <div className="sp-info-box">
                <span className="sp-info-icon">ℹ️</span>
                <div>
                  <strong>Click to upload a file and drag</strong>
                  <p>
                    PDF, DOCX, or PPTX formats supported.
                    <br />
                    Technical specs, pricing breakdowns, and team bios
                  </p>
                </div>
              </div>

              <div className="sp-checkbox-group">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreedToTerms"
                  checked={proposal.agreedToTerms}
                  onChange={handleInputChange}
                  className="sp-checkbox"
                />
                <label htmlFor="agreeTerms" className="sp-checkbox-label">
                  I confirm that the proposal meets all mandatory requirements outlined in the
                  RFP, and the pricing provided is valid for 30 days from submission.
                </label>
              </div>

              <div className="sp-form-actions">
                <button className="sp-btn sp-btn-draft" onClick={handleSaveDraft}>
                  Save Draft
                </button>
                <button
                  className="sp-btn sp-btn-submit"
                  onClick={handleSubmitProposal}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Proposal"}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sp-sidebar">
            <div className="sp-key-details-card">
              <h3>Key Details</h3>

              <div className="sp-detail">
                <span className="sp-detail-label">Buyer</span>
                <span className="sp-detail-value">TechCorp Global</span>
              </div>

              <div className="sp-detail">
                <span className="sp-detail-label">Team Profile</span>
                <span className="sp-detail-value">Enterprise</span>
              </div>

              <div className="sp-detail">
                <span className="sp-detail-label">Budget</span>
                <span className="sp-detail-value">$250k – $400k</span>
              </div>

              <div className="sp-detail">
                <span className="sp-detail-label">Timeline</span>
                <span className="sp-detail-value" style={{ color: "#dc2626" }}>
                  Oct 15, 2024 (13 Days left)
                </span>
              </div>

              <div className="sp-detail">
                <span className="sp-detail-label">Status</span>
                <span className="sp-badge">RFP Published</span>
              </div>

              <button className="sp-btn-ready">Ready to bid?</button>
              <p className="sp-sidebar-note">Review all requirements before starting your proposal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitProposal;
