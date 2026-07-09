import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [rfps, setRfps] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const isRTL = i18n.language.startsWith('ar');

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "users") {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to retrieve platform users list");
        const data = await res.json();
        setUsers(data);
      } else if (activeTab === "rfps") {
        const res = await fetch("/api/requests");
        if (!res.ok) throw new Error("Failed to retrieve platform services catalog");
        const data = await res.json();
        setRfps(data);
      } else if (activeTab === "proposals") {
        const res = await fetch("/api/proposals");
        if (!res.ok) throw new Error("Failed to retrieve platform bookings list");
        const data = await res.json();
        setProposals(data);
      } else {
        const res = await fetch("/api/dashboard/reports");
        if (!res.ok) throw new Error("Failed to compile system metrics reports");
        const data = await res.json();
        setReport(data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred fetching admin panel data.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update account status");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, accountStatus: newStatus } : u))
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDeleteRfp = async (rfpId) => {
    if (!window.confirm("Are you sure you want to delete this service post? This will also delete any associated booking requests!")) {
      return;
    }
    try {
      const res = await fetch(`/api/requests/${rfpId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete service post");
      }
      setRfps((prev) => prev.filter((r) => r.id !== rfpId));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDeleteProposal = async (propId) => {
    if (!window.confirm("Are you sure you want to delete this booking request?")) {
      return;
    }
    try {
      const res = await fetch(`/api/proposals/${propId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete booking request");
      }
      setProposals((prev) => prev.filter((p) => p.id !== propId));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRfps = rfps.filter(
    (r) =>
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.category?.toLowerCase().includes(search.toLowerCase()) ||
      r.beneficiary?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProposals = proposals.filter(
    (p) =>
      p.rfp?.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.provider?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      p.coverLetter?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className={`flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-32 flex flex-col items-center justify-center ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="font-body-md text-body-md text-on-surface-variant">{t("adminPanel.loading")}</p>
      </div>
    );
  }

  return (
    <div className={`flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl flex flex-col gap-xl ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Header */}
      <header className="flex flex-col gap-xs">
        <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface font-bold">
          {t("adminPanel.header.title")}
        </h1>
        <p className="font-body-lg text-on-surface-variant">
          {t("adminPanel.header.subtitle")}
        </p>
      </header>

      {error && (
        <div className="bg-error-container text-on-error-container p-md rounded-lg border border-error/10 font-body-sm">
          {error}
        </div>
      )}

      {/* Tabs Switcher */}
      <div className={`flex flex-wrap bg-surface-container-low p-1 rounded-xl border border-outline-variant ${isRTL ? 'self-end' : 'self-start'} gap-1`}>
        <button
          onClick={() => { setActiveTab("users"); setSearch(""); }}
          className={`px-lg py-2 rounded-lg font-label-md text-label-md transition-all ${
            activeTab === "users" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {t("adminPanel.tabs.users")}
        </button>
        <button
          onClick={() => { setActiveTab("rfps"); setSearch(""); }}
          className={`px-lg py-2 rounded-lg font-label-md text-label-md transition-all ${
            activeTab === "rfps" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {t("adminPanel.tabs.rfps", { count: rfps.length || 0 })}
        </button>
        <button
          onClick={() => { setActiveTab("proposals"); setSearch(""); }}
          className={`px-lg py-2 rounded-lg font-label-md text-label-md transition-all ${
            activeTab === "proposals" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {t("adminPanel.tabs.proposals", { count: proposals.length || 0 })}
        </button>
        <button
          onClick={() => { setActiveTab("reports"); setSearch(""); }}
          className={`px-lg py-2 rounded-lg font-label-md text-label-md transition-all ${
            activeTab === "reports" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {t("adminPanel.tabs.reports")}
        </button>
      </div>

      {/* 1. User Management View */}
      {activeTab === "users" && (
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col gap-md">
          <div className="px-lg py-md border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center bg-surface-bright gap-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{t("adminPanel.users.title")}</h3>
            <div className="relative w-full sm:w-64">
              <span className={`material-symbols-outlined absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]`}>search</span>
              <input
                type="text"
                className={`${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-1.5 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-secondary w-full transition-shadow`}
                placeholder={t("adminPanel.users.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface font-label-md text-label-md">
                  <th className={`p-md ${isRTL ? 'pr-lg' : 'pl-lg'}`}>{t("adminPanel.users.table.details")}</th>
                  <th className="p-md">{t("adminPanel.users.table.email")}</th>
                  <th className="p-md">{t("adminPanel.users.table.role")}</th>
                  <th className="p-md">{t("adminPanel.users.table.status")}</th>
                  <th className={`p-md ${isRTL ? 'pl-lg text-left' : 'pr-lg text-right'}`}>{t("adminPanel.users.table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface-variant">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-lg text-center text-on-surface-variant">
                      {t("adminPanel.users.empty")}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-container-low/20 transition-colors">
                      <td className={`p-md ${isRTL ? 'pr-lg' : 'pl-lg'}`}>
                        <div className="font-semibold text-on-surface text-body-md">{u.fullName}</div>
                        <div className="text-xs">ID: {u.id.substring(0, 8)}...</div>
                      </td>
                      <td className="p-md">{u.email}</td>
                      <td className="p-md">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          u.role === "admin" ? "bg-primary text-white" :
                          u.role === "provider" ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-md">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          u.accountStatus === "active" ? "bg-secondary-container text-on-secondary-container" :
                          u.accountStatus === "suspended" ? "bg-error-container text-on-error-container" : "bg-surface-variant text-on-surface"
                        }`}>
                          {u.accountStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className={`p-md ${isRTL ? 'pl-lg text-left' : 'pr-lg text-right'}`}>
                        {u.role !== "admin" && (
                          <div className={`inline-flex gap-1.5 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                            <button
                              onClick={() => handleStatusChange(u.id, "active")}
                              className="px-2.5 py-1 bg-secondary-container text-on-secondary-container hover:opacity-90 rounded font-label-sm text-xs transition-opacity"
                            >
                              {t("adminPanel.users.actions.activate")}
                            </button>
                            <button
                              onClick={() => handleStatusChange(u.id, "pending")}
                              className="px-2.5 py-1 bg-surface-variant text-on-surface hover:opacity-90 rounded font-label-sm text-xs transition-opacity"
                            >
                              {t("adminPanel.users.actions.flag")}
                            </button>
                            <button
                              onClick={() => handleStatusChange(u.id, "suspended")}
                              className="px-2.5 py-1 bg-error-container text-on-error-container hover:opacity-90 rounded font-label-sm text-xs transition-opacity"
                            >
                              {t("adminPanel.users.actions.suspend")}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 2. Services Moderation Tab */}
      {activeTab === "rfps" && (
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col gap-md">
          <div className="px-lg py-md border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center bg-surface-bright gap-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{t("adminPanel.rfps.title")}</h3>
            <div className="relative w-full sm:w-64">
              <span className={`material-symbols-outlined absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]`}>search</span>
              <input
                type="text"
                className={`${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-1.5 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-secondary w-full transition-shadow`}
                placeholder={t("adminPanel.rfps.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface font-label-md text-label-md">
                  <th className={`p-md ${isRTL ? 'pr-lg' : 'pl-lg'}`}>{t("adminPanel.rfps.table.details")}</th>
                  <th className="p-md">{t("adminPanel.rfps.table.category")}</th>
                  <th className="p-md">{t("adminPanel.rfps.table.provider")}</th>
                  <th className="p-md">{t("adminPanel.rfps.table.budget")}</th>
                  <th className={`p-md ${isRTL ? 'pl-lg text-left' : 'pr-lg text-right'}`}>{t("adminPanel.rfps.table.moderation")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface-variant">
                {filteredRfps.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-lg text-center text-on-surface-variant">
                      {t("adminPanel.rfps.empty")}
                    </td>
                  </tr>
                ) : (
                  filteredRfps.map((rfp) => (
                    <tr key={rfp.id} className="hover:bg-surface-container-low/20 transition-colors">
                      <td className={`p-md ${isRTL ? 'pr-lg' : 'pl-lg'}`}>
                        <Link to={`/rfp/${rfp.id}`} className="font-semibold text-on-surface text-body-md hover:text-primary transition-colors text-decoration-none">
                          {rfp.title}
                        </Link>
                        <div className="text-xs max-w-sm truncate mt-xs text-on-surface-variant">{rfp.description}</div>
                      </td>
                      <td className="p-md">
                        <span className="font-label-sm text-label-sm text-secondary bg-secondary-container px-2 py-0.5 rounded border border-secondary-fixed">
                          {rfp.category}
                        </span>
                      </td>
                      <td className="p-md font-semibold text-on-surface">
                        {rfp.beneficiary?.fullName || "Verified Provider"}
                      </td>
                      <td className="p-md font-bold text-primary">
                        ${Number(rfp.budgetMin).toLocaleString()} - ${Number(rfp.budgetMax).toLocaleString()}
                      </td>
                      <td className={`p-md ${isRTL ? 'pl-lg text-left' : 'pr-lg text-right'}`}>
                        <button
                          onClick={() => handleDeleteRfp(rfp.id)}
                          className="px-3 py-1.5 bg-error-container hover:bg-error text-on-error-container hover:text-white rounded font-label-md text-body-sm transition-all"
                        >
                          {t("adminPanel.rfps.actions.delete")}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 3. Bookings Moderation Tab */}
      {activeTab === "proposals" && (
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col gap-md">
          <div className="px-lg py-md border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center bg-surface-bright gap-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{t("adminPanel.proposals.title")}</h3>
            <div className="relative w-full sm:w-64">
              <span className={`material-symbols-outlined absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]`}>search</span>
              <input
                type="text"
                className={`${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-1.5 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-secondary w-full transition-shadow`}
                placeholder={t("adminPanel.proposals.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface font-label-md text-label-md">
                  <th className={`p-md ${isRTL ? 'pr-lg' : 'pl-lg'}`}>{t("adminPanel.proposals.table.service")}</th>
                  <th className="p-md">{t("adminPanel.proposals.table.client")}</th>
                  <th className="p-md">{t("adminPanel.proposals.table.budget")}</th>
                  <th className="p-md">{t("adminPanel.proposals.table.status")}</th>
                  <th className={`p-md ${isRTL ? 'pl-lg text-left' : 'pr-lg text-right'}`}>{t("adminPanel.proposals.table.moderation")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface-variant">
                {filteredProposals.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-lg text-center text-on-surface-variant">
                      {t("adminPanel.proposals.empty")}
                    </td>
                  </tr>
                ) : (
                  filteredProposals.map((prop) => (
                    <tr key={prop.id} className="hover:bg-surface-container-low/20 transition-colors">
                      <td className={`p-md ${isRTL ? 'pr-lg' : 'pl-lg'}`}>
                        <Link to={`/rfp/${prop.rfpId}`} className="font-semibold text-on-surface text-body-md hover:text-primary transition-colors text-decoration-none">
                          {prop.rfp?.title || "Deleted Service"}
                        </Link>
                        <div className="text-xs max-w-sm truncate mt-xs text-on-surface-variant">{prop.coverLetter}</div>
                      </td>
                      <td className="p-md font-semibold text-on-surface">
                        {prop.provider?.fullName || "Enterprise Client"}
                      </td>
                      <td className="p-md font-bold text-primary">
                        ${Number(prop.proposedBudget).toLocaleString()}
                      </td>
                      <td className="p-md">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          prop.status === "accepted" ? "bg-secondary-container text-on-secondary-container" :
                          prop.status === "rejected" ? "bg-error-container text-on-error-container" :
                          prop.status === "shortlisted" ? "bg-primary-container text-on-primary-container" : "bg-surface-variant text-on-surface"
                        }`}>
                          {prop.status.toUpperCase()}
                        </span>
                      </td>
                      <td className={`p-md ${isRTL ? 'pl-lg text-left' : 'pr-lg text-right'}`}>
                        <button
                          onClick={() => handleDeleteProposal(prop.id)}
                          className="px-3 py-1.5 bg-error-container hover:bg-error text-on-error-container hover:text-white rounded font-label-md text-body-sm transition-all"
                        >
                          {t("adminPanel.proposals.actions.delete")}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 4. Reports and Metrics View */}
      {activeTab === "reports" && report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          
          {/* User Breakdown */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-md">
            <h5 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-xs">
              <span className="material-symbols-outlined text-secondary">group</span> {t("adminPanel.reports.accounts.title")}
            </h5>
            <div className="flex flex-col gap-2 font-body-sm text-body-sm">
              <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.accounts.total")}</span>
                <strong className="text-on-surface font-semibold">{report.users.total}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.accounts.providers")}</span>
                <strong className="text-on-surface font-semibold">{report.users.byRole.provider}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.accounts.clients")}</span>
                <strong className="text-on-surface font-semibold">{report.users.byRole.beneficiary}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.accounts.admins")}</span>
                <strong className="text-on-surface font-semibold">{report.users.byRole.admin}</strong>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.accounts.suspended")}</span>
                <strong className="text-error font-semibold">{report.users.byStatus.suspended}</strong>
              </div>
            </div>
          </div>

          {/* RFP Stats */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-md">
            <h5 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-xs">
              <span className="material-symbols-outlined text-secondary">assignment</span> {t("adminPanel.reports.rfps.title")}
            </h5>
            <div className="flex flex-col gap-2 font-body-sm text-body-sm">
              <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.rfps.total")}</span>
                <strong className="text-on-surface font-semibold">{report.rfps.total}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.rfps.open")}</span>
                <strong className="text-secondary font-semibold">{report.rfps.byStatus.open}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.rfps.draft")}</span>
                <strong className="text-on-surface font-semibold">{report.rfps.byStatus.draft}</strong>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.rfps.closed")}</span>
                <strong className="text-on-surface-variant font-semibold">{report.rfps.byStatus.closed}</strong>
              </div>
            </div>
          </div>

          {/* Proposals Stats */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-md">
            <h5 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-xs">
              <span className="material-symbols-outlined text-secondary">rate_review</span> {t("adminPanel.reports.proposals.title")}
            </h5>
            <div className="flex flex-col gap-2 font-body-sm text-body-sm">
              <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.proposals.total")}</span>
                <strong className="text-on-surface font-semibold">{report.proposals.total}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.proposals.accepted")}</span>
                <strong className="text-secondary font-semibold">{report.proposals.byStatus.accepted}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.proposals.shortlisted")}</span>
                <strong className="text-on-surface font-semibold">{report.proposals.byStatus.shortlisted}</strong>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-on-surface-variant">{t("adminPanel.reports.proposals.rejected")}</span>
                <strong className="text-error font-semibold">{report.proposals.byStatus.rejected}</strong>
              </div>
            </div>
          </div>

          {/* Messaging activity stream */}
          <div className="md:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-md">
            <h5 className="font-headline-sm text-headline-sm text-on-surface">{t("adminPanel.reports.messaging.title")}</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div className="p-md bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/40">
                <div>
                  <span className="text-on-surface-variant text-xs block">{t("adminPanel.reports.messaging.threads")}</span>
                  <strong className="font-headline-md text-on-surface font-bold">{report.messaging.totalThreads}</strong>
                </div>
                <span className="material-symbols-outlined text-secondary text-3xl">forum</span>
              </div>
              <div className="p-md bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/40">
                <div>
                  <span className="text-on-surface-variant text-xs block">{t("adminPanel.reports.messaging.messages")}</span>
                  <strong className="font-headline-md text-on-surface font-bold">{report.messaging.totalMessages}</strong>
                </div>
                <span className="material-symbols-outlined text-secondary text-3xl">mail</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default AdminPanel;
