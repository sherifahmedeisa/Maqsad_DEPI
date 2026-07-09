import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../ProviderSidebar";
import Footer from "../Footer";

function ProposalHistory() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const isRTL = i18n.language.startsWith('ar');

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  const fetchReceivedRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/requests/received");
      if (!res.ok) throw new Error("Failed to load incoming requests");
      const data = await res.json();
      setRfps(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred retrieving incoming requests.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRfps = rfps.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  return (
    <div className="flex bg-[#f8fafc] min-h-screen w-full">
      {/* Sidebar Navigation */}
      <ProviderSidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-hidden provider-main-content w-full">
        <main className="flex-grow p-lg md:p-xl max-w-container-max w-full mx-auto flex flex-col gap-lg">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-outline-variant pb-md">
            <div>
              <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface font-bold leading-tight">
                {isRTL ? "طلبات العروض الواردة" : "Incoming RFPs"}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {isRTL ? "راجع طلبات تقديم العروض التي أرسلها العملاء إليك مباشرة" : "Review project requests sent directly to you by clients"}
              </p>
            </div>
            <button
              onClick={fetchReceivedRequests}
              className="p-2 border border-outline-variant hover:bg-surface-container-low rounded-lg transition-colors flex items-center justify-center bg-white"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">refresh</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex gap-xs bg-surface-container-lowest p-sm border border-outline-variant rounded-xl w-fit">
            {["all", "open", "closed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-md py-1.5 rounded-lg text-label-sm font-semibold transition-all cursor-pointer border-0 capitalize ${
                  filterStatus === status
                    ? "bg-secondary text-white shadow-sm"
                    : "bg-transparent text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {status === "all" ? (isRTL ? "الكل" : "All") : (status === "open" ? (isRTL ? "نشط" : "Open") : (isRTL ? "مغلق" : "Closed"))}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mb-3"></div>
              <p className="text-on-surface-variant text-sm">{isRTL ? "جاري تحميل طلبات العروض..." : "Loading incoming RFPs..."}</p>
            </div>
          ) : error ? (
            <div className="bg-error-container text-on-error-container p-lg rounded-xl border border-error/25">
              <h4 className="font-label-md text-label-md font-bold mb-xs">{isRTL ? "فشل التزامن" : "Sync Failed"}</h4>
              <p className="font-body-sm text-body-sm">{error}</p>
            </div>
          ) : filteredRfps.length === 0 ? (
            <div className="bg-white border border-outline-variant rounded-xl p-2xl text-center flex flex-col items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-md">inbox</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{isRTL ? "لا توجد طلبات واردة" : "No Incoming RFPs"}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mt-xs">
                {isRTL ? "ستظهر طلبات تقديم العروض الموجهة إليك هنا بمجرد إرسالها من قبل العملاء." : "RFPs directed to you by clients will appear here once submitted."}
              </p>
            </div>
          ) : (
            <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className={`w-full border-collapse ${isRTL ? 'text-right' : 'text-left'}`}>
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-bold">{isRTL ? "العميل" : "Client"}</th>
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-bold">{isRTL ? "عنوان المشروع" : "Project Title"}</th>
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-bold">{isRTL ? "نطاق الميزانية" : "Budget Range"}</th>
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-bold">{isRTL ? "تاريخ الاستلام" : "Received Date"}</th>
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-bold">{isRTL ? "الحالة" : "Status"}</th>
                      <th className={`p-md font-label-sm text-label-sm text-on-surface-variant font-bold ${isRTL ? 'text-left' : 'text-right'}`}>{isRTL ? "الإجراء" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRfps.map((rfp) => (
                      <tr key={rfp.id} className="border-b border-outline-variant hover:bg-[#f8fafc]/50 transition-colors">
                        <td className="p-md">
                          <div className="flex items-center gap-md">
                            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                              {rfp.beneficiary?.fullName?.charAt(0) || "C"}
                            </div>
                            <div>
                              <div className="font-label-md text-label-md text-on-surface font-semibold">
                                {rfp.beneficiary?.fullName || "B2B Client"}
                              </div>
                              <div className="text-xs text-on-surface-variant">{rfp.beneficiary?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-md">
                          <Link to={`/rfp/${rfp.id}`} className="text-secondary hover:underline font-semibold font-label-md">
                            {rfp.title}
                          </Link>
                        </td>
                        <td className="p-md">
                          <div className="font-label-md text-label-md font-bold text-primary">
                            ${Number(rfp.budgetMin || 0).toLocaleString()} - ${Number(rfp.budgetMax || 0).toLocaleString()}
                          </div>
                        </td>
                        <td className="p-md font-body-sm text-body-sm text-on-surface-variant">
                          {new Date(rfp.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="p-md">
                          <span className={`inline-flex px-2 py-0.5 rounded-full font-label-sm text-label-sm text-xs capitalize ${
                            rfp.status === "open" ? "bg-emerald-50 text-emerald-800" : "bg-error-container text-on-error-container"
                          }`}>
                            {rfp.status === "open" ? (isRTL ? "نشط" : "Open") : (isRTL ? "مغلق" : "Closed")}
                          </span>
                        </td>
                        <td className={`p-md ${isRTL ? 'text-left' : 'text-right'}`}>
                          <Link
                            to={`/rfp/${rfp.id}`}
                            className="px-3 py-1.5 bg-primary text-on-primary rounded-lg font-label-sm text-xs font-bold border-0 hover:bg-on-surface transition-colors text-decoration-none text-white inline-block"
                          >
                            {isRTL ? "مراجعة وتقديم عرض" : "Review & Respond"}
                          </Link>
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
