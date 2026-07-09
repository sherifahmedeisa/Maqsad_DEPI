import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../ProviderSidebar";

function Analytics() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [proposals, setProposals] = useState([]);
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isRTL = i18n.language.startsWith('ar');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError("");
    try {
      const [proposalsRes, rfpsRes] = await Promise.all([
        fetch("/api/proposals/received"),
        fetch("/api/requests/me")
      ]);

      if (proposalsRes.ok) {
        const pData = await proposalsRes.json();
        setProposals(pData);
      }
      if (rfpsRes.ok) {
        const rData = await rfpsRes.json();
        setRfps(rData);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || t("analytics.syncFailed"));
    } finally {
      setLoading(false);
    }
  };

  const contracts = proposals.filter((p) => p.status === "accepted");
  const shortlisted = proposals.filter((p) => p.status === "shortlisted");
  const pending = proposals.filter((p) => p.status === "submitted");

  const totalRevenue = contracts.reduce((acc, curr) => acc + Number(curr.proposedBudget || 0), 0);
  const averageDealSize = contracts.length > 0 ? Math.round(totalRevenue / contracts.length) : 0;
  const conversionRate = proposals.length > 0 ? Math.round((contracts.length / proposals.length) * 100) : 0;

  // Compute category distributions
  const categoryCounts = contracts.reduce((acc, curr) => {
    const cat = curr.rfp?.category || "General Services";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoriesData = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
    percentage: contracts.length > 0 ? Math.round((count / contracts.length) * 100) : 0,
  }));

  return (
    <div className={`flex bg-[#f8fafc] min-h-screen ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar Navigation */}
      <ProviderSidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-hidden pl-0 lg:pl-0">
        <main className="flex-grow p-lg md:p-xl max-w-container-max w-full mx-auto flex flex-col gap-lg">
          
          {/* Header */}
          <div className="border-b border-outline-variant pb-md">
            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface font-bold leading-tight">
              {t("analytics.title")}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("analytics.subtitle")}
            </p>
          </div>

          {loading ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mb-3"></div>
              <p className="text-on-surface-variant text-sm">{t("analytics.loading")}</p>
            </div>
          ) : error ? (
            <div className="bg-error-container text-on-error-container p-lg rounded-xl border border-error/25">
              <h4 className="font-label-md text-label-md font-bold mb-xs">{t("analytics.syncFailed")}</h4>
              <p className="font-body-sm text-body-sm">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-lg">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
                {/* Metric 1 */}
                <div className="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
                  <span className="material-symbols-outlined text-[#0ea897] mb-sm text-2xl bg-[#0ea897]/10 p-2 rounded-lg">payments</span>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t("analytics.metrics.totalRevenue")}</div>
                  <div className="text-2xl font-black text-on-surface mt-xs">${totalRevenue.toLocaleString()}</div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
                  <span className="material-symbols-outlined text-[#2563eb] mb-sm text-2xl bg-[#2563eb]/10 p-2 rounded-lg">trending_up</span>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t("analytics.metrics.conversionRate")}</div>
                  <div className="text-2xl font-black text-on-surface mt-xs">{conversionRate}%</div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
                  <span className="material-symbols-outlined text-[#7c3aed] mb-sm text-2xl bg-[#7c3aed]/10 p-2 rounded-lg">price_change</span>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t("analytics.metrics.averageDealSize")}</div>
                  <div className="text-2xl font-black text-on-surface mt-xs">${averageDealSize.toLocaleString()}</div>
                </div>

                {/* Metric 4 */}
                <div className="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
                  <span className="material-symbols-outlined text-[#059669] mb-sm text-2xl bg-[#059669]/10 p-2 rounded-lg">handshake</span>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t("analytics.metrics.activeContracts")}</div>
                  <div className="text-2xl font-black text-on-surface mt-xs">{contracts.length}</div>
                </div>
              </div>

              {/* Charts & Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                
                {/* Distribution Chart */}
                <div className="bg-white border border-outline-variant rounded-2xl p-lg shadow-sm lg:col-span-2 flex flex-col gap-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold flex items-center gap-xs">
                    <span className="material-symbols-outlined text-secondary">bar_chart</span>
                    {t("analytics.distribution.title")}
                  </h3>
                  <p className="text-sm text-on-surface-variant">{t("analytics.distribution.subtitle")}</p>
                  
                  {categoriesData.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center py-12 text-on-surface-variant text-sm bg-slate-50 border border-dashed rounded-xl">
                      {t("analytics.distribution.empty")}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-lg mt-md">
                      {categoriesData.map((cat, idx) => (
                        <div key={idx} className="flex flex-col gap-xs">
                          <div className="flex justify-between text-body-sm font-semibold text-on-surface">
                            <span>{cat.name} ({cat.count})</span>
                            <span>{cat.percentage}%</span>
                          </div>
                          <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-secondary h-full rounded-full transition-all duration-500"
                              style={{ width: `${cat.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col gap-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold flex items-center gap-xs">
                    <span className="material-symbols-outlined text-secondary">filter_list</span>
                    {t("analytics.funnel.title")}
                  </h3>
                  <p className="text-sm text-on-surface-variant">{t("analytics.funnel.subtitle")}</p>

                  <div className="flex flex-col gap-md mt-md">
                    {/* Received */}
                    <div className="flex items-center justify-between p-sm bg-slate-50 rounded-lg border border-outline-variant/60">
                      <div className="flex items-center gap-sm">
                        <span className="w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                        <span className="font-label-sm text-label-sm text-on-surface font-bold">{t("analytics.funnel.received")}</span>
                      </div>
                      <span className="font-mono text-sm font-black text-on-surface">{proposals.length}</span>
                    </div>

                    {/* Shortlisted */}
                    <div className="flex items-center justify-between p-sm bg-[#e8f0fe] rounded-lg border border-[#d2e3fc]">
                      <div className="flex items-center gap-sm">
                        <span className="w-2.5 h-2.5 bg-[#1565c0] rounded-full"></span>
                        <span className="font-label-sm text-label-sm text-[#1565c0] font-bold">{t("analytics.funnel.shortlisted")}</span>
                      </div>
                      <span className="font-mono text-sm font-black text-[#1565c0]">{shortlisted.length}</span>
                    </div>

                    {/* Accepted */}
                    <div className="flex items-center justify-between p-sm bg-[#e8f5e9] rounded-lg border border-[#c8e6c9]">
                      <div className="flex items-center gap-sm">
                        <span className="w-2.5 h-2.5 bg-[#2e7d32] rounded-full"></span>
                        <span className="font-label-sm text-label-sm text-[#2e7d32] font-bold">{t("analytics.funnel.accepted")}</span>
                      </div>
                      <span className="font-mono text-sm font-black text-[#2e7d32]">{contracts.length}</span>
                    </div>

                    {/* Pending review */}
                    <div className="flex items-center justify-between p-sm bg-[#fff8e1] rounded-lg border border-[#ffe082]">
                      <div className="flex items-center gap-sm">
                        <span className="w-2.5 h-2.5 bg-[#f57f17] rounded-full"></span>
                        <span className="font-label-sm text-label-sm text-[#f57f17] font-bold">{t("analytics.funnel.pending")}</span>
                      </div>
                      <span className="font-mono text-sm font-black text-[#f57f17]">{pending.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Analytics;
