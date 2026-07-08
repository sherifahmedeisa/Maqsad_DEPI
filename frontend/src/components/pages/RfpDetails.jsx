import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ChatWindow from "../ChatWindow";

function RfpDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rfp, setRfp] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Submit Proposal state (Provider)
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [proposalDetails, setProposalDetails] = useState("");
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmCompliance, setConfirmCompliance] = useState(false);

  // Embedded messaging state
  const [activeChatProviderId, setActiveChatProviderId] = useState(null);

  useEffect(() => {
    fetchRfpAndProposals();
  }, [id, user]);

  const fetchRfpAndProposals = async () => {
    setLoading(true);
    setError("");
    try {
      const rfpRes = await fetch(`/api/requests/${id}`);
      if (!rfpRes.ok) {
        if (rfpRes.status === 404) throw new Error("RFP not found");
        throw new Error("Failed to load request details");
      }
      const rfpData = await rfpRes.json();
      setRfp(rfpData);

      if (user.role === "provider" && rfpData.beneficiaryId === user.id) {
        const propRes = await fetch(`/api/requests/${id}/proposals`);
        if (propRes.ok) {
          const propData = await propRes.json();
          setProposals(propData);
        }
      } else if (user.role === "beneficiary") {
        const propRes = await fetch("/api/proposals/mine");
        if (propRes.ok) {
          const propData = await propRes.json();
          const matching = propData.filter((p) => p.rfpId === id);
          setProposals(matching);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred fetching RFP data.");
    } finally {
      setLoading(false);
    }
  };

  const handleProposalStatusUpdate = async (proposalId, status) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update proposal status");
      }
      fetchRfpAndProposals();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!bidAmount || !proposalDetails) {
      setSubmitError("Please fill out both the bid amount and proposed timeline details.");
      return;
    }

    if (Number(bidAmount) <= 0) {
      setSubmitError("Bid amount must be a positive number.");
      return;
    }

    if (!confirmCompliance) {
      setSubmitError("You must confirm compliance with the requirements.");
      return;
    }

    setSubmittingProposal(true);
    try {
      const res = await fetch(`/api/requests/${id}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bidAmount: Number(bidAmount),
          proposalDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit proposal");
      }

      setShowSubmitModal(false);
      setBidAmount("");
      setProposalDetails("");
      setConfirmCompliance(false);
      fetchRfpAndProposals();
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "An error occurred submitting the proposal.");
    } finally {
      setSubmittingProposal(false);
    }
  };

  const initiateChat = (providerId) => {
    setActiveChatProviderId(providerId);
  };

  if (loading) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="font-body-md text-body-md text-on-surface-variant">Fetching RFP and bidding data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="bg-error-container text-on-error-container p-lg rounded-xl border border-error/20">
          <h4 className="font-headline-sm text-headline-sm font-semibold mb-2">Data Fetch Error</h4>
          <p className="font-body-md text-body-md mb-4">{error}</p>
          <button className="bg-error text-white font-label-md text-label-md px-lg py-md rounded-lg hover:opacity-90 transition-opacity" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const existingProposal = user.role === "beneficiary" && proposals.length > 0 ? proposals[0] : null;
  const isOwner = user.role === "provider" && rfp.beneficiaryId === user.id;

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        
        {/* Left Side Details Panel */}
        <div className={activeChatProviderId ? "lg:col-span-7 flex flex-col gap-lg" : "lg:col-span-8 flex flex-col gap-lg"}>
          
          {/* Header Info */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl shadow-sm flex flex-col gap-md">
            <div className="flex justify-between items-center">
              <Link to="/dashboard" className="text-on-surface-variant hover:text-secondary font-label-md text-label-md flex items-center gap-1 text-decoration-none transition-colors">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
              </Link>
              <span className={`inline-flex px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
                rfp.status === "open" ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container"
              }`}>
                {rfp.status.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col gap-xs">
              <span className="font-label-sm text-label-sm text-secondary bg-secondary-container px-2.5 py-1 rounded align-self-start border border-secondary-fixed">
                {rfp.category || "General Services"}
              </span>
              <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface font-bold leading-tight">{rfp.title}</h1>
            </div>

            {/* Scope / requirements details */}
            <div className="border-t border-outline-variant pt-lg mt-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm flex items-center gap-xs">
                <span className="material-symbols-outlined text-secondary">target</span> Project Scope & Requirements
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line leading-relaxed">
                {rfp.description}
              </p>
            </div>

            {/* Owner controls */}
            {isOwner && (
              <div className="border-t border-outline-variant pt-lg mt-md flex gap-sm">
                <Link to={`/rfp/edit/${rfp.id}`} className="bg-transparent border border-outline text-on-surface hover:bg-surface-container-low font-label-md text-label-md px-lg py-2 rounded-lg text-decoration-none transition-colors">
                  Edit Specifications
                </Link>
              </div>
            )}
          </div>

          {/* Received Bids (Client Owner Only) */}
          {isOwner && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl shadow-sm flex flex-col gap-lg">
              <h2 className="font-headline-sm text-headline-sm text-on-surface border-b border-outline-variant pb-md">
                Proposals Received ({proposals.length})
              </h2>

              {proposals.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-2">inbox</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">No proposals received yet. Vendors will appear here once bids are submitted.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {proposals.map((prop) => (
                    <div key={prop.id} className="border border-outline-variant rounded-xl p-lg hover:shadow-md transition-shadow bg-surface-bright flex flex-col gap-md">
                      <div className="flex justify-between items-start gap-md">
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm">
                            {prop.provider?.fullName?.charAt(0) || "P"}
                          </div>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-semibold mb-0">
                              {prop.provider?.fullName || "Service Vendor"}
                            </h4>
                            <span className="text-on-surface-variant font-body-sm text-body-sm">
                              Proposed Bid: <strong className="text-primary font-bold">${Number(prop.bidAmount).toLocaleString()}</strong>
                            </span>
                          </div>
                        </div>

                        <span className={`inline-flex px-2 py-0.5 rounded-full font-label-sm text-label-sm text-xs ${
                          prop.status === "accepted" ? "bg-secondary-container text-on-secondary-container" :
                          prop.status === "rejected" ? "bg-error-container text-on-error-container" :
                          prop.status === "shortlisted" ? "bg-primary-container text-on-primary-container" : "bg-surface-variant text-on-surface"
                        }`}>
                          {prop.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-md rounded-lg border border-outline-variant/35 whitespace-pre-line">
                        {prop.proposalDetails}
                      </p>

                      <div className="flex justify-between items-center border-t border-outline-variant/40 pt-md mt-sm">
                        <button
                          type="button"
                          onClick={() => initiateChat(prop.providerId)}
                          className="text-secondary hover:text-on-secondary-container font-label-md text-label-md flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">forum</span> Chat with Vendor
                        </button>

                        <div className="flex gap-2">
                          {prop.status === "submitted" && (
                            <>
                              <button
                                onClick={() => handleProposalStatusUpdate(prop.id, "shortlisted")}
                                className="px-3 py-1.5 border border-outline-variant hover:bg-surface-container-low rounded-lg font-label-md text-label-md transition-colors"
                              >
                                Shortlist
                              </button>
                              <button
                                onClick={() => handleProposalStatusUpdate(prop.id, "accepted")}
                                className="px-3 py-1.5 bg-secondary text-white font-semibold rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleProposalStatusUpdate(prop.id, "rejected")}
                                className="px-3 py-1.5 border border-error text-error hover:bg-error-container/20 rounded-lg font-label-md text-label-md transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {prop.status === "shortlisted" && (
                            <>
                              <button
                                onClick={() => handleProposalStatusUpdate(prop.id, "accepted")}
                                className="px-3 py-1.5 bg-secondary text-white font-semibold rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleProposalStatusUpdate(prop.id, "rejected")}
                                className="px-3 py-1.5 border border-error text-error hover:bg-error-container/20 rounded-lg font-label-md text-label-md transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side Sidebar (Details / Action Cards / Messaging Panel) */}
        <div className={activeChatProviderId ? "lg:col-span-5 flex flex-col gap-lg" : "lg:col-span-4 flex flex-col gap-lg"}>
          
          {/* Key Details Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Key Details</h3>
            <div className="flex flex-col gap-md">
              <div className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>payments</span>
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Service Rate / Budget</div>
                  <div className="font-body-md text-body-md text-on-surface font-semibold">
                    ${Number(rfp.budgetMin).toLocaleString()} - ${Number(rfp.budgetMax).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>calendar_month</span>
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Estimated Delivery / Target Date</div>
                  <div className="font-body-md text-body-md text-on-surface font-semibold">
                    {new Date(rfp.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>corporate_fare</span>
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Service Provider</div>
                  <div className="font-body-md text-body-md text-on-surface font-semibold">
                    {rfp.beneficiary?.fullName || "Verified Provider"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Booking Card (Client Mode) */}
          {user.role === "beneficiary" && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm sticky top-6 flex flex-col gap-md">
              {existingProposal ? (
                <div className="flex flex-col gap-md">
                  <h4 className="font-headline-sm text-headline-sm text-secondary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined">check_circle</span> Request Submitted
                  </h4>
                  <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant flex flex-col gap-sm">
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-on-surface-variant">Offered Rate:</span>
                      <strong className="text-primary">${Number(existingProposal.bidAmount).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-on-surface-variant">Request Status:</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full font-label-sm text-label-sm text-xs ${
                        existingProposal.status === "accepted" ? "bg-secondary-container text-on-secondary-container" :
                        existingProposal.status === "rejected" ? "bg-error-container text-on-error-container" :
                        existingProposal.status === "shortlisted" ? "bg-primary-container text-on-primary-container" : "bg-surface-variant text-on-surface"
                      }`}>
                        {existingProposal.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="border-t border-outline-variant/40 pt-sm text-body-sm mt-1 text-on-surface-variant">
                      <strong>Your Specifications:</strong>
                      <p className="mt-1 text-xs line-clamp-3">{existingProposal.proposalDetails}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => initiateChat(rfp.beneficiaryId)}
                    className="bg-primary hover:bg-on-background text-on-primary font-label-md text-label-md py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm text-white text-decoration-none"
                  >
                    <span className="material-symbols-outlined">forum</span> Open Negotiation Chat
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-md text-center">
                  <div className="font-headline-sm text-headline-sm text-on-surface">Interested in this service?</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">
                    Request custom scheduling and cost parameters to book this provider.
                  </p>
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="bg-primary hover:bg-on-background text-on-primary font-label-md text-label-md py-2.5 rounded-lg hover:opacity-90 transition-opacity font-semibold text-white"
                    disabled={rfp.status !== "open"}
                  >
                    {rfp.status === "open" ? "Book / Request Service" : "Booking Closed"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Negotiation Chat Pane */}
          {activeChatProviderId && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col sticky top-6" style={{ height: "450px" }}>
              <div className="bg-primary text-white p-3 flex justify-between items-center">
                <h5 className="m-0 font-bold font-headline-sm text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-sm">forum</span> Negotiation Chat
                </h5>
                <button
                  type="button"
                  onClick={() => setActiveChatProviderId(null)}
                  className="text-white hover:text-secondary-container transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col bg-surface-bright">
                <ChatWindow
                  rfpId={id}
                  targetUserId={activeChatProviderId === user.id ? rfp.beneficiaryId : activeChatProviderId}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Client Book/Request Service Form Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-lg p-lg md:p-xl shadow-xl flex flex-col gap-lg">
            
            <div className="flex justify-between items-center border-b border-outline-variant pb-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface">Book / Request Service</h2>
              <button
                type="button"
                className="text-on-surface-variant hover:text-error transition-colors"
                onClick={() => setShowSubmitModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleProposalSubmit} className="flex flex-col gap-md">
              {submitError && (
                <div className="bg-error-container text-on-error-container p-sm rounded border border-error/10 font-body-sm">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block font-label-md text-label-md text-on-background mb-xs">
                  Your Budget Offer (USD) <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. 15000"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-background mb-xs">
                  Request Details & Custom Scoping Specifications <span className="text-error">*</span>
                </label>
                <textarea
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors resize-y"
                  placeholder="Specify details, scheduling requirements, or custom variations you need..."
                  rows="4"
                  value={proposalDetails}
                  onChange={(e) => setProposalDetails(e.target.value)}
                ></textarea>
              </div>

              <div className="bg-surface-container-low p-md rounded border border-outline-variant flex items-start gap-sm">
                <input
                  type="checkbox"
                  id="complianceCheck"
                  className="w-4 h-4 text-secondary border-outline-variant rounded focus:ring-secondary mt-0.5 cursor-pointer"
                  checked={confirmCompliance}
                  onChange={(e) => setConfirmCompliance(e.target.checked)}
                />
                <label htmlFor="complianceCheck" className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none">
                  I confirm the accuracy of my requested specifications and timeline parameters.
                </label>
              </div>

              <div className="flex justify-end gap-sm border-t border-outline-variant pt-lg mt-md">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-lg py-2 border border-outline-variant hover:bg-surface-container-low rounded-lg font-label-md text-label-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProposal}
                  className="bg-primary hover:bg-on-background text-on-primary font-label-md text-label-md px-lg py-2 rounded-lg hover:opacity-90 transition-opacity font-semibold text-white flex items-center justify-center"
                >
                  {submittingProposal ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Submitting request...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default RfpDetails;
