import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../ProviderSidebar";

function ContractManager() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isRTL = i18n.language.startsWith('ar');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/proposals/received");
      if (!res.ok) throw new Error("Failed to load active contracts");
      const data = await res.json();
      // Filter accepted proposals as active contracts
      const accepted = data.filter((p) => p.status === "accepted");
      setContracts(accepted);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred fetching contracts.");
    } finally {
      setLoading(false);
    }
  };

  const totalContractValue = contracts.reduce((acc, curr) => acc + Number(curr.proposedBudget || 0), 0);

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      {/* Sidebar Navigation */}
      <ProviderSidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-hidden pl-0 lg:pl-0">
        <main className="flex-grow p-lg md:p-xl max-w-container-max w-full mx-auto flex flex-col gap-lg">
          
          {/* Header */}
          <div className="flex justify-between items-end border-b border-outline-variant pb-md">
            <div>
              <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface font-bold leading-tight">
                {t("contractManager.title")}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t("contractManager.subtitle")}
              </p>
            </div>
            <div className={`text-${isRTL ? 'left' : 'right'}`}>
              <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t("contractManager.totalValue")}</div>
              <div className="text-2xl font-black text-secondary-container bg-secondary px-3 py-1 rounded-lg mt-xs">
                ${totalContractValue.toLocaleString()}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mb-3"></div>
              <p className="text-on-surface-variant text-sm">{t("contractManager.loading")}</p>
            </div>
          ) : error ? (
            <div className="bg-error-container text-on-error-container p-lg rounded-xl border border-error/25">
              <h4 className="font-label-md text-label-md font-bold mb-xs">{t("contractManager.syncFailed")}</h4>
              <p className="font-body-sm text-body-sm">{error}</p>
            </div>
          ) : contracts.length === 0 ? (
            <div className="bg-white border border-outline-variant rounded-xl p-2xl text-center flex flex-col items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-md">handshake</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{t("contractManager.empty.title")}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mt-xs">
                {t("contractManager.empty.desc")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {contracts.map((contract) => (
                <div key={contract.id} className="bg-white border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow gap-md">
                  <div>
                    {/* Top Row: Client & Status */}
                    <div className="flex justify-between items-start border-b border-outline-variant pb-sm mb-sm">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                          {contract.provider?.fullName?.charAt(0) || "C"}
                        </div>
                        <div>
                          <div className="font-label-md text-label-md text-on-surface font-bold leading-tight">
                            {contract.provider?.fullName || t("contractManager.card.clientUser")}
                          </div>
                          <div className="text-xs text-on-surface-variant">{t("contractManager.card.sponsor")}</div>
                        </div>
                      </div>
                      <span className="inline-flex px-2.5 py-1 bg-[#e8f5e9] text-[#2e7d32] rounded-full font-label-sm text-xs font-bold uppercase">
                        {t("contractManager.card.activeAgreement")}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold mb-xs">
                      {contract.rfp?.title || t("contractManager.card.customScope")}
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      {t("contractManager.card.agreementId")}: <span className="font-mono">{contract.id.slice(0, 8).toUpperCase()}</span>
                    </p>

                    {/* Milestones Checklist UI */}
                    <div className="mt-md flex flex-col gap-sm bg-[#f8fafc] p-md rounded-xl border border-outline-variant/60">
                      <h4 className="font-label-sm text-label-sm text-on-surface font-bold">{t("contractManager.card.milestones")}</h4>
                      
                      <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
                        <span className="flex items-center gap-xs font-medium text-[#2e7d32]">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          {t("contractManager.card.scoping")}
                        </span>
                        <span className="text-xs bg-[#e8f5e9] text-[#2e7d32] px-2 py-0.5 rounded font-bold">{t("contractManager.card.completed")}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
                        <span className="flex items-center gap-xs font-medium text-primary">
                          <span className="material-symbols-outlined text-[16px] text-primary">pending</span>
                          {t("contractManager.card.execution")}
                        </span>
                        <span className="text-xs bg-primary-container text-primary px-2 py-0.5 rounded font-bold">{t("contractManager.card.inProgress")}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-body-sm text-[#94a3b8]">
                        <span className="flex items-center gap-xs font-medium">
                          <span className="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
                          {t("contractManager.card.handover")}
                        </span>
                        <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded">{t("contractManager.card.pending")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Details & Quick Chat */}
                  <div className="border-t border-outline-variant pt-md flex justify-between items-center">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{t("contractManager.card.finalizedBudget")}</div>
                      <div className="font-headline-md text-headline-sm text-primary font-black">
                        ${Number(contract.proposedBudget).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-xs">
                      <Link
                        to="/chat"
                        className="px-md py-2 border border-outline-variant text-on-surface hover:bg-[#f8fafc] rounded-xl text-decoration-none font-semibold font-label-md flex items-center gap-xs transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        {t("contractManager.card.clientChat")}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ContractManager;
