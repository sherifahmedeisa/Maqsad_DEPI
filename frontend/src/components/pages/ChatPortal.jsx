import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ChatWindow from "../ChatWindow";
import ProviderSidebar from "../ProviderSidebar";

function ChatPortal() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isRTL = i18n.language.startsWith('ar');
  const isProvider = user?.role === "provider";

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/messages/threads");
      if (!res.ok) throw new Error("Failed to load message threads");
      const data = await res.json();
      setThreads(data);
    } catch (err) {
      console.error(err);
      setError(err.message || t("chatPortal.error.title"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    const loaderContent = (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="font-body-md text-body-md text-on-surface-variant">{t("chatPortal.loading")}</p>
      </div>
    );
    if (isProvider) {
      return (
        <div className="flex bg-[#f8fafc] min-h-screen w-full">
          <ProviderSidebar />
          <div className="flex-grow flex flex-col min-h-screen overflow-hidden provider-main-content w-full">
            {loaderContent}
          </div>
        </div>
      );
    }
    return loaderContent;
  }
        <p className="font-body-md text-body-md text-on-surface-variant">{t("chatPortal.loading")}</p>
      </div>
    );
  }

  if (error) {
    const errorContent = (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="bg-error-container text-on-error-container p-lg rounded-xl border border-error/20">
          <h4 className="font-headline-sm text-headline-sm font-semibold mb-2">{t("chatPortal.error.title")}</h4>
          <p className="font-body-md text-body-md mb-4">{error}</p>
          <button className="bg-error text-white font-label-md text-label-md px-lg py-md rounded-lg hover:opacity-90 transition-opacity" onClick={fetchThreads}>
            {t("chatPortal.error.retry")}
          </button>
        </div>
      </div>
    );
    if (isProvider) {
      return (
        <div className="flex bg-[#f8fafc] min-h-screen w-full">
          <ProviderSidebar />
          <div className="flex-grow flex flex-col min-h-screen overflow-hidden provider-main-content w-full">
            {errorContent}
          </div>
        </div>
      );
    }
    return errorContent;
  }

  const mainContent = (
    <div className={`flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <header className="mb-lg flex items-center justify-between">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">
            {t("chatPortal.title")}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t("chatPortal.subtitle")}
          </p>
        </div>
      </header>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row" style={{ height: "calc(100vh - 160px)", minHeight: "450px" }}>
        
        {/* Left Side: Threads List */}
        <div className={`w-full md:w-1/3 border-b md:border-b-0 ${isRTL ? 'md:border-l' : 'md:border-r'} border-outline-variant flex flex-col h-full bg-surface-bright`}>
          <div className="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <h4 className="font-headline-sm text-sm font-bold flex items-center gap-1.5 text-on-surface">
              <span className="material-symbols-outlined text-secondary text-[20px]">forum</span> {t("chatPortal.sidebar.title")}
            </h4>
          </div>

          <div className="flex-grow overflow-y-auto divide-y divide-outline-variant/60">
            {threads.length === 0 ? (
              <div className="p-lg text-center flex flex-col items-center gap-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl">forum</span>
                <p className="font-body-sm text-xs leading-relaxed max-w-[200px]">
                  {t("chatPortal.sidebar.empty")}
                </p>
              </div>
            ) : (
              threads.map((t) => {
                const otherUser = user.role === "beneficiary" ? t.provider : t.beneficiary;
                const isActive = activeThread?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveThread(t)}
                    className={`w-full p-md ${isRTL ? 'text-right' : 'text-left'} transition-colors flex items-center gap-3 ${isRTL ? 'border-r-4' : 'border-l-4'} ${
                      isActive 
                        ? "bg-surface-container-low/60 border-secondary" 
                        : "bg-transparent border-transparent hover:bg-surface-container-low/20"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shrink-0">
                      {otherUser?.fullName?.charAt(0) || "U"}
                    </div>
                    <div className="flex-grow overflow-hidden flex flex-col gap-0.5">
                      <div className="flex justify-between items-baseline gap-xs">
                        <strong className="font-label-md text-label-md text-on-surface font-semibold truncate">{otherUser?.fullName}</strong>
                        <span className="font-body-sm text-xs text-on-surface-variant shrink-0">
                          {new Date(t.lastMessageAt || t.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <span className="font-body-sm text-xs text-on-surface-variant truncate">
                        {t("chatPortal.sidebar.project")} <span className="font-semibold text-on-surface">{t.rfp?.title}</span>
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Chat Window */}
        <div className="w-full md:w-2/3 flex flex-col h-full bg-surface-bright">
          {activeThread ? (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-md border-b border-outline-variant bg-surface-container-low flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {(user.role === "beneficiary" ? activeThread.provider : activeThread.beneficiary)?.fullName?.charAt(0) || "U"}
                </div>
                <div className="overflow-hidden">
                  <h6 className="font-label-md text-label-md text-on-surface font-semibold truncate">
                    {(user.role === "beneficiary" ? activeThread.provider : activeThread.beneficiary)?.fullName}
                  </h6>
                  <span className="font-body-sm text-xs text-on-surface-variant truncate block">
                    {t("chatPortal.main.subject")} <strong>{activeThread.rfp?.title}</strong>
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <ChatWindow
                  rfpId={activeThread.rfpId}
                  targetUserId={user.role === "beneficiary" ? activeThread.providerId : activeThread.beneficiaryId}
                />
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-lg gap-md text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl">chat</span>
              <div className="flex flex-col gap-xs">
                <h5 className="font-headline-sm text-headline-sm text-on-surface">{t("chatPortal.main.placeholder.title")}</h5>
                <p className="font-body-sm text-body-sm max-w-xs">
                  {t("chatPortal.main.placeholder.desc")}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  if (isProvider) {
    return (
      <div className="flex bg-[#f8fafc] min-h-screen w-full">
        <ProviderSidebar />
        <div className="flex-grow flex flex-col min-h-screen overflow-hidden provider-main-content w-full">
          {mainContent}
        </div>
      </div>
    );
  }

  return mainContent;
}

export default ChatPortal;
