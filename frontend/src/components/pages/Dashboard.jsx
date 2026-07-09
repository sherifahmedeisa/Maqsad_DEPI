import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../ProviderSidebar";
import Footer from "../Footer";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [summary, setSummary] = useState(null);
  const [myRfps, setMyRfps] = useState([]);
  const [feed, setFeed] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const isRTL = i18n.language.startsWith('ar');

  const workflowCards = [
    {
      icon: "explore",
      title: t("dashboard.client.workflow.step1Title"),
      description: t("dashboard.client.workflow.step1Desc"),
      btnText: t("dashboard.client.workflow.step1Btn"),
      btnLink: "/browse-services",
      colorClass: "text-[#0d9488] bg-[#0d9488]/10"
    },
    {
      icon: "assignment",
      title: t("dashboard.client.workflow.step2Title"),
      description: t("dashboard.client.workflow.step2Desc"),
      btnText: t("dashboard.client.workflow.step2Btn"),
      btnLink: "/browse-services",
      colorClass: "text-[#2563eb] bg-[#2563eb]/10"
    },
    {
      icon: "forum",
      title: t("dashboard.client.workflow.step3Title"),
      description: t("dashboard.client.workflow.step3Desc"),
      btnText: t("dashboard.client.workflow.step3Btn"),
      btnLink: "/chat",
      colorClass: "text-[#7c3aed] bg-[#7c3aed]/10"
    },
    {
      icon: "handshake",
      title: t("dashboard.client.workflow.step4Title"),
      description: t("dashboard.client.workflow.step4Desc"),
      btnText: t("dashboard.client.workflow.step4Btn"),
      btnLink: null,
      colorClass: "text-[#059669] bg-[#059669]/10"
    }
  ];

  const handleNextWorkflowStep = (e) => {
    e.stopPropagation();
    setActiveWorkflowStep((prev) => (prev + 1) % workflowCards.length);
  };

  const handlePrevWorkflowStep = (e) => {
    e.stopPropagation();
    setActiveWorkflowStep((prev) => (prev - 1 + workflowCards.length) % workflowCards.length);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const summaryRes = await fetch("/api/dashboard/summary");
      if (!summaryRes.ok) throw new Error("Failed to load dashboard summary");
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      if (user.role === "beneficiary") {
        const feedRes = await fetch("/api/dashboard/feed");
        if (feedRes.ok) {
          const feedData = await feedRes.json();
          setFeed(feedData);
        }
        const propRes = await fetch("/api/proposals/mine");
        if (propRes.ok) {
          const propData = await propRes.json();
          setMyProposals(propData);
        }
      } else if (user.role === "provider") {
        const rfpsRes = await fetch("/api/requests/me");
        if (rfpsRes.ok) {
          const rfpsData = await rfpsRes.json();
          setMyRfps(rfpsData);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred loading the dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const filteredFeed = feed.filter(
    (rfp) =>
      rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rfp.category && rfp.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredRfps = myRfps.filter((rfp) =>
    rfp.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProposals = myProposals.filter((p) =>
    p.rfp?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {t("dashboard.loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="bg-error-container text-on-error-container p-lg rounded-xl border border-error/20">
          <h4 className="font-headline-sm text-headline-sm font-semibold mb-2">
            {t("dashboard.errorTitle")}
          </h4>
          <p className="font-body-md text-body-md mb-4">{error}</p>
          <button
            className="bg-error text-white font-label-md text-label-md px-lg py-md rounded-lg hover:opacity-90 transition-opacity"
            onClick={fetchDashboardData}
          >
            {t("dashboard.retrySync")}
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // BENEFICIARY (CLIENT) DASHBOARD — matches Stitch exactly
  // ============================================================
  if (user.role === "beneficiary") {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl flex flex-col gap-xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">
              {t("dashboard.client.welcome", { name: user.fullName })}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {t("dashboard.client.subtitle")}
            </p>
          </div>
          <Link
            to="/browse-services"
            className="bg-primary hover:bg-on-background text-on-primary font-label-md text-label-md px-lg py-md rounded-lg flex items-center gap-sm transition-colors shadow-sm hover:shadow-md text-decoration-none text-white font-semibold"
          >
            <span className="material-symbols-outlined">explore</span>
            {t("dashboard.client.exploreCatalog")}
          </Link>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
          {/* Summary Stats Panel (left/right depending on RTL) */}
          <section className="md:col-span-4 flex flex-col gap-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-sm shadow-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                {t("dashboard.client.activeBookings")}
              </span>
              <div className="flex items-end gap-sm">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">
                  {myProposals.filter((p) => p.status === "accepted").length}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant pb-1">
                  {t("dashboard.client.confirmedCurrently")}
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-sm shadow-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                {t("dashboard.client.pendingBookings")}
              </span>
              <div className="flex items-end gap-sm">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">
                  {myProposals.filter((p) => p.status === "submitted" || p.status === "shortlisted").length}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant pb-1">
                  {t("dashboard.client.pendingConfirmation")}
                </span>
              </div>
            </div>

            {/* Interactive Workflow Guide */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-lg flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md min-h-[300px]">
              {/* Card Header */}
              <div className="relative z-10 flex justify-between items-center mb-md border-b border-outline-variant/60 pb-sm">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-secondary">menu_book</span>
                  {t("dashboard.client.guideTitle")}
                </span>
                <span className="text-xs font-bold text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded-full">
                  {t("dashboard.client.guideStep", { step: activeWorkflowStep + 1, total: workflowCards.length })}
                </span>
              </div>

              {/* Card Body */}
              <div className="relative z-10 flex-grow flex flex-col gap-md">
                <div className="flex items-center gap-md">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${workflowCards[activeWorkflowStep].colorClass}`}>
                    <span className="material-symbols-outlined text-[24px]">
                      {workflowCards[activeWorkflowStep].icon}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold leading-tight">
                    {workflowCards[activeWorkflowStep].title}
                  </h3>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed min-h-[72px]">
                  {workflowCards[activeWorkflowStep].description}
                </p>

                {workflowCards[activeWorkflowStep].btnLink && (
                  <Link
                    to={workflowCards[activeWorkflowStep].btnLink}
                    className="inline-flex items-center gap-xs text-secondary font-bold text-decoration-none text-body-sm mt-xs w-fit hover:gap-sm transition-all"
                  >
                    {workflowCards[activeWorkflowStep].btnText}
                    <span className={`material-symbols-outlined text-[16px] ${isRTL ? 'rotate-180' : ''}`}>arrow_forward</span>
                  </Link>
                )}
              </div>

              {/* Card Footer Navigation */}
              <div className="relative z-10 flex justify-between items-center mt-lg pt-md border-t border-outline-variant/60">
                {/* Dots Pagination */}
                <div className="flex gap-xs">
                  {workflowCards.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveWorkflowStep(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeWorkflowStep === idx ? "w-6 bg-secondary" : "w-2 bg-outline"
                      }`}
                      aria-label={`Go to step ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-xs">
                  <button
                    onClick={isRTL ? handleNextWorkflowStep : handlePrevWorkflowStep}
                    className="p-1 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors bg-surface-bright flex items-center justify-center"
                    aria-label="Previous step"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isRTL ? 'rotate-180' : ''}`}>chevron_left</span>
                  </button>
                  <button
                    onClick={isRTL ? handlePrevWorkflowStep : handleNextWorkflowStep}
                    className="p-1 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors bg-surface-bright flex items-center justify-center"
                    aria-label="Next step"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isRTL ? 'rotate-180' : ''}`}>chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

          </section>

          {/* Main Content Area */}
          <div className="md:col-span-8 flex flex-col gap-lg">
            {/* Active Bookings / Requests */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-md">
              <div className="flex justify-between items-center border-b border-outline-variant pb-md">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  {t("dashboard.client.bookedRequests")}
                </h2>
              </div>

              {filteredProposals.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-2">
                    assignment
                  </span>
                  <h5 className="font-headline-sm text-headline-sm text-on-surface">
                    {t("dashboard.client.noRequests")}
                  </h5>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                    {t("dashboard.client.noRequestsDesc")}
                  </p>
                  <Link
                    to="/browse-services"
                    className="bg-primary hover:bg-on-background text-on-primary font-label-md text-label-md px-md py-sm rounded-lg text-decoration-none text-white text-sm"
                  >
                    {t("dashboard.client.browseServicesBtn")}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredProposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="py-md border-b border-outline-variant last:border-b-0 flex flex-col sm:flex-row sm:items-center justify-between gap-md group"
                    >
                      <div className="flex flex-col gap-xs">
                        <Link
                          to={`/rfp/${prop.rfpId}`}
                          className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors cursor-pointer text-decoration-none"
                        >
                          {prop.rfp?.title}
                        </Link>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {t("dashboard.client.bookedOn", { date: new Date(prop.createdAt).toLocaleDateString() })}{" "}
                          <strong>{prop.rfp?.beneficiary?.fullName || "Verified Provider"}</strong>
                        </p>
                        <span className="text-xs text-on-surface-variant">
                          {t("dashboard.client.offered", { amount: Number(prop.bidAmount).toLocaleString() })}
                        </span>
                      </div>
                      <div className="flex items-center gap-md self-start sm:self-auto">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full font-label-sm text-label-sm ${
                            prop.status === "accepted"
                              ? "bg-secondary-container text-on-secondary-container"
                              : prop.status === "rejected"
                              ? "bg-error-container text-on-error-container"
                              : "bg-primary-container text-on-primary-container"
                          }`}
                        >
                          {t(prop.status.toUpperCase(), prop.status.toUpperCase())}
                        </span>
                        <button
                          aria-label="More options"
                          className="text-on-surface-variant hover:text-primary transition-colors"
                          onClick={() => navigate(`/rfp/${prop.rfpId}`)}
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Explore Services Promotion Cards */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-md">
              <div className="flex justify-between items-center border-b border-outline-variant pb-md">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  {t("dashboard.client.exploreProviders")}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md pt-sm">
                <div className="border border-outline-variant rounded-lg p-md hover:shadow-md hover:border-secondary transition-all cursor-pointer bg-surface-bright flex flex-col gap-sm" onClick={() => navigate("/browse-services")}>
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[28px]">explore</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        {t("dashboard.client.serviceCatalog")}
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary">
                        {t("dashboard.client.browseTop")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-sm">
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      {t("dashboard.client.catalogDesc")}
                    </p>
                  </div>
                </div>

                <div className="border border-outline-variant rounded-lg p-md hover:shadow-md hover:border-secondary transition-all cursor-pointer bg-surface-bright flex flex-col gap-sm" onClick={() => navigate("/chat")}>
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center border border-outline-variant">
                      <span className="material-symbols-outlined text-[28px]">forum</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        {t("dashboard.client.directMessaging")}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {t("dashboard.client.chatNegotiate")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-sm">
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      {t("dashboard.client.messagingDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // PROVIDER (VENDORS) DASHBOARD — matches Stitch exactly
  // ============================================================
  if (user.role === "provider") {
    return (
      <div className="flex min-h-screen bg-background">
        <ProviderSidebar />

        <main className={`flex-1 ${isRTL ? 'md:mr-64' : 'md:ml-64'} bg-background min-h-screen flex flex-col`}>
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-lg py-lg space-y-xl flex-grow">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
              <div>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                  {t("dashboard.provider.overview")}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                  {t("dashboard.provider.welcome", { name: user.fullName })}
                </p>
              </div>
              <div className="flex items-center gap-sm">
                <div className="relative">
                  <span className={`material-symbols-outlined absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]`}>
                    search
                  </span>
                  <input
                    className={`pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary w-full md:w-64 transition-shadow ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                    placeholder={t("dashboard.provider.searchPlaceholder")}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors bg-surface">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
            </div>

            {/* Metrics Bento Grid — Stitch exact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {/* Metric 1: New RFPs */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-md">
                  <div className="p-sm bg-surface-container-high rounded-lg text-secondary">
                    <span className="material-symbols-outlined text-[24px]">inbox</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary bg-secondary-container px-2 py-1 rounded-full flex items-center">
                    <span className={`material-symbols-outlined text-[12px] ${isRTL ? 'ml-1' : 'mr-1'}`}>trending_up</span>
                    {t("dashboard.provider.today", { count: feed.length })}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                    {feed.length}
                  </h3>
                  <p className="font-label-md text-label-md text-on-surface-variant mt-xs">
                    {t("dashboard.provider.newRfps")}
                  </p>
                </div>
              </div>

              {/* Metric 2: Active Proposals */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-md">
                  <div className="p-sm bg-surface-container-high rounded-lg text-primary">
                    <span className="material-symbols-outlined text-[24px]">assignment</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-variant px-2 py-1 rounded-full">
                    {t("dashboard.provider.inProgress")}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                    {myProposals.length}
                  </h3>
                  <p className="font-label-md text-label-md text-on-surface-variant mt-xs">
                    {t("dashboard.provider.activeProposals")}
                  </p>
                </div>
              </div>

              {/* Metric 3: Upcoming Deadlines */}
              <div className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col justify-between hover:shadow-md transition-shadow ${isRTL ? 'border-r-4 border-r-error' : 'border-l-4 border-l-error'}`}>
                <div className="flex justify-between items-start mb-md">
                  <div className="p-sm bg-error-container rounded-lg text-on-error-container">
                    <span className="material-symbols-outlined text-[24px]">timer</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-error bg-error-container/50 px-2 py-1 rounded-full">
                    {t("dashboard.provider.actionRequired")}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                    {myProposals.filter((p) => p.status === "pending").length}
                  </h3>
                  <p className="font-label-md text-label-md text-on-surface-variant mt-xs">
                    {t("dashboard.provider.upcomingDeadlines")}
                  </p>
                </div>
              </div>
            </div>

            {/* Incoming Requests List — Stitch exact */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {t("dashboard.provider.incomingRequests")}
                </h3>
                <Link
                  to="/browse-requests"
                  className="font-label-sm text-label-sm text-secondary hover:underline text-decoration-none"
                >
                  {t("dashboard.provider.viewAll")}
                </Link>
              </div>

              <div className="divide-y divide-outline-variant">
                {filteredFeed.length === 0 ? (
                  <div className="p-lg text-center flex flex-col items-center py-12">
                    <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-2">
                      campaign
                    </span>
                    <h5 className="font-headline-sm text-headline-sm text-on-surface">
                      {t("dashboard.provider.noRequests")}
                    </h5>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {t("dashboard.provider.noRequestsDesc")}
                    </p>
                  </div>
                ) : (
                  filteredFeed.map((rfp) => (
                    <div
                      key={rfp.id}
                      className="p-lg hover:bg-surface-container-lowest bg-surface transition-colors flex flex-col md:flex-row md:items-center justify-between gap-md relative group"
                    >
                      <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-sm mb-xs flex-wrap">
                          <span className="font-label-md text-label-md text-on-surface font-bold">
                            {rfp.beneficiary?.fullName || "Enterprise Client"}
                          </span>
                          <span className="font-label-sm text-label-sm text-secondary bg-secondary-container px-2 py-[2px] rounded border border-secondary-fixed">
                            {rfp.category || "General Services"}
                          </span>
                          <span className={`font-label-sm text-label-sm text-on-surface-variant ${isRTL ? 'mr-auto md:mr-0' : 'ml-auto md:ml-0'} flex items-center`}>
                            <span className={`material-symbols-outlined text-[14px] ${isRTL ? 'ml-1' : 'mr-1'}`}>
                              schedule
                            </span>
                            {t("dashboard.provider.posted", { date: new Date(rfp.createdAt).toLocaleDateString() })}
                          </span>
                        </div>
                        <h4 className="font-body-lg text-body-lg text-on-surface font-semibold mb-xs">
                          {rfp.title}
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 max-w-3xl">
                          {rfp.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-md mt-md">
                          <div className="flex items-center text-on-surface-variant font-label-sm text-label-sm">
                            <span className={`material-symbols-outlined text-[16px] ${isRTL ? 'ml-xs' : 'mr-xs'}`}>
                              payments
                            </span>
                            ${Number(rfp.budgetMin).toLocaleString()} - $
                            {Number(rfp.budgetMax).toLocaleString()}
                          </div>
                          <div className="flex items-center text-on-surface-variant font-label-sm text-label-sm">
                            <span className={`material-symbols-outlined text-[16px] ${isRTL ? 'ml-xs' : 'mr-xs'}`}>
                              calendar_today
                            </span>
                            {t("dashboard.provider.deadline", { date: new Date(rfp.deadline).toLocaleDateString() })}
                          </div>
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-sm md:items-end mt-md md:mt-0 min-w-[140px]">
                        <Link
                          to={`/rfp/${rfp.id}`}
                          className="w-full md:w-auto px-md py-sm bg-primary text-on-primary font-label-md text-label-md rounded border border-primary hover:bg-on-surface transition-colors text-center text-decoration-none"
                        >
                          {t("dashboard.provider.reviewRespond")}
                        </Link>
                        <button className="w-full md:w-auto px-md py-sm bg-transparent text-on-surface-variant font-label-md text-label-md rounded border border-outline-variant hover:bg-surface-container-low transition-colors">
                          {t("dashboard.provider.decline")}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Provider Footer */}
          <footer className="bg-surface-container-low border-t border-outline-variant mt-xl w-full">
            <div className="flex flex-col md:flex-row justify-between items-center px-lg py-md max-w-container-max mx-auto w-full gap-md">
              <div className="font-headline-sm text-headline-sm text-primary">{t("footer.maqsad")}</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant text-center">
                {t("dashboard.provider.rights", { year: new Date().getFullYear() })}
              </div>
              <div className="flex flex-wrap justify-center gap-md">
                <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-opacity duration-200 text-decoration-none" href="#">{t("footer.terms")}</a>
                <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-opacity duration-200 text-decoration-none" href="#">{t("footer.privacy")}</a>
                <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-opacity duration-200 text-decoration-none" href="#">{t("footer.support")}</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    );
  }

  // ============================================================
  // ADMIN DASHBOARD — kept as-is per user decision
  // ============================================================
  if (user.role === "admin") {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-24 flex flex-col items-center text-center">
        <span className="material-symbols-outlined text-on-surface-variant text-6xl mb-4">
          admin_panel_settings
        </span>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">
          {t("dashboard.admin.welcome")}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-8">
          {t("dashboard.admin.desc")}
        </p>
        <Link
          to="/admin"
          className="bg-primary hover:bg-on-background text-on-primary font-label-md text-label-md px-lg py-md rounded-lg shadow-sm hover:shadow-md text-decoration-none text-white"
        >
          {t("dashboard.admin.openCenter")}
        </Link>
      </div>
    );
  }

  return null;
}

export default Dashboard;
