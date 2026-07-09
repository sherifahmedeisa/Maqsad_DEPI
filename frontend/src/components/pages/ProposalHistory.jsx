import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../ProviderSidebar";
import Footer from "../Footer";

function ProposalHistory() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const isRTL = i18n.language.startsWith('ar');

  useEffect(() => {
    fetchReceivedProposals();
  }, []);

  const fetchReceivedProposals = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/proposals/received");
      if (!res.ok) throw new Error("Failed to load received bookings history");
      const data = await res.json();
      setProposals(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred retrieving proposals.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (proposalId, newStatus) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }
      // Refresh list
      fetchReceivedProposals();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const filteredProposals = proposals.filter((p) => {
    if (filterStatus === "all") return true;
    return p.status === filterStatus;
  });

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      {/* Sidebar Navigation */}
      <ProviderSidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-hidden pl-0 lg:pl-0">
        <main className="flex-grow p-lg md:p-xl max-w-container-max w-full mx-auto flex flex-col gap-lg">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-outline-variant pb-md">
            <div>
              <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface font-bold leading-tight">
                {t("proposalHistory.title")}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t("proposalHistory.subtitle")}
              </p>
            </div>
            <button
              onClick={fetchReceivedProposals}
              className="p-2 border border-outline-variant hover:bg-surface-container-low rounded-lg transition-colors flex items-center justify-center bg-white"
              aria-label={t("proposalHistory.refreshList")}
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">refresh</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex gap-xs bg-surface-container-lowest p-sm border border-outline-variant rounded-xl w-fit">
            {["all", "submitted", "shortlisted", "accepted", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-md py-1.5 rounded-lg text-label-sm font-semibold transition-all cursor-pointer border-0 capitalize ${
                  filterStatus === status
                    ? "bg-secondary text-white shadow-sm"
                    : "bg-transparent text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {t(`proposalHistory.filters.${status}`)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mb-3"></div>
              <p className="text-on-surface-variant text-sm">{t("proposalHistory.loading")}</p>
            </div>
          ) : error ? (
            <div className="bg-error-container text-on-error-container p-lg rounded-xl border border-error/25">
              <h4 className="font-label-md text-label-md font-bold mb-xs">{t("proposalHistory.syncFailed")}</h4>
              <p className="font-body-sm text-body-sm">{error}</p>
            </div>
          ) : filteredProposals.length === 0 ? (
            <div className="bg-white border border-outline-variant rounded-xl p-2xl text-center flex flex-col items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-md">inbox</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{t("proposalHistory.empty.title")}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mt-xs">
                {filterStatus === "all"
                  ? t("proposalHistory.empty.descAll")
                  : t("proposalHistory.empty.descStatus", { status: t(`proposalHistory.filters.${filterStatus}`) })}
              </p>
            </div>
          ) : (
            <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className={`w-full border-collapse ${isRTL ? 'text-right' : 'text-left'}`}>
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-bold">{t("proposalHistory.table.client")}</th>
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-bold">{t("proposalHistory.table.listing")}</th>
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-bold">{t("proposalHistory.table.offerDetails")}</th>
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-bold">{t("proposalHistory.table.receivedDate")}</th>
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-bold">{t("proposalHistory.table.status")}</th>
                      <th className={`p-md font-label-sm text-label-sm text-on-surface-variant font-bold ${isRTL ? 'text-left' : 'text-right'}`}>{t("proposalHistory.table.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProposals.map((prop) => (
                      <tr key={prop.id} className="border-b border-outline-variant hover:bg-[#f8fafc]/50 transition-colors">
                        <td className="p-md">
                          <div className="flex items-center gap-md">
                            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                              {prop.provider?.fullName?.charAt(0) || "C"}
                            </div>
                            <div>
                              <div className="font-label-md text-label-md text-on-surface font-semibold">
                                {prop.provider?.fullName || t("proposalHistory.defaults.clientUser")}
                              </div>
                              <div className="text-xs text-on-surface-variant">{prop.provider?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-md">
                          <Link to={`/rfp/${prop.rfpId}`} className="text-secondary hover:underline font-semibold font-label-md">
                            {prop.rfp?.title || t("proposalHistory.defaults.customOffer")}
                          </Link>
                        </td>
                        <td className="p-md">
                          <div className="font-label-md text-label-md font-bold text-primary">
                            ${Number(prop.proposedBudget || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-on-surface-variant">{t("proposalHistory.defaults.requiredScope")}</div>
                        </td>
                        <td className="p-md font-body-sm text-body-sm text-on-surface-variant">
                          {new Date(prop.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="p-md">
                          <span className={`inline-flex px-2 py-0.5 rounded-full font-label-sm text-label-sm text-xs capitalize ${
                            prop.status === "accepted" ? "bg-[#e8f5e9] text-[#2e7d32]" :
                            prop.status === "rejected" ? "bg-[#ffebee] text-[#c62828]" :
                            prop.status === "shortlisted" ? "bg-[#e8f0fe] text-[#1565c0]" : "bg-[#f5f5f5] text-[#616161]"
                          }`}>
                            {t(`proposalHistory.filters.${prop.status}`, prop.status)}
                          </span>
                        </td>
                        <td className={`p-md ${isRTL ? 'text-left' : 'text-right'}`}>
                          <div className={`flex gap-xs ${isRTL ? 'justify-start' : 'justify-end'}`}>
                            <Link
                              to="/chat"
                              className="p-1.5 border border-[#cbd5e1] rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center text-decoration-none"
                              title={t("proposalHistory.actions.chat")}
                            >
                              <span className="material-symbols-outlined text-[18px]">chat</span>
                            </Link>

                            {prop.status === "submitted" && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(prop.id, "shortlisted")}
                                  className="px-2.5 py-1.5 bg-[#e8f0fe] text-[#1565c0] rounded-lg font-label-sm text-xs font-bold border-0 hover:bg-[#d2e3fc] transition-colors"
                                >
                                  {t("proposalHistory.actions.shortlist")}
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(prop.id, "accepted")}
                                  className="px-2.5 py-1.5 bg-[#e8f5e9] text-[#2e7d32] rounded-lg font-label-sm text-xs font-bold border-0 hover:bg-[#c8e6c9] transition-colors"
                                >
                                  {t("proposalHistory.actions.accept")}
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(prop.id, "rejected")}
                                  className="p-1.5 border border-[#ffebee] bg-[#ffebee] text-[#c62828] rounded-lg hover:bg-[#ffcdd2] transition-colors flex items-center justify-center"
                                  title={t("proposalHistory.actions.reject")}
                                >
                                  <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                              </>
                            )}

                            {prop.status === "shortlisted" && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(prop.id, "accepted")}
                                  className="px-2.5 py-1.5 bg-[#e8f5e9] text-[#2e7d32] rounded-lg font-label-sm text-xs font-bold border-0 hover:bg-[#c8e6c9] transition-colors"
                                >
                                  {t("proposalHistory.actions.accept")}
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(prop.id, "rejected")}
                                  className="p-1.5 border border-[#ffebee] bg-[#ffebee] text-[#c62828] rounded-lg hover:bg-[#ffcdd2] transition-colors flex items-center justify-center"
                                  title={t("proposalHistory.actions.reject")}
                                >
                                  <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProposalHistory;
