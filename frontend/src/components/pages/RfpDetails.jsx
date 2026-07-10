import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ChatWindow from "../ChatWindow";
import ProviderSidebar from "../ProviderSidebar";

function RfpDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [rfp, setRfp] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isRTL = i18n.language.startsWith('ar');

  // Submit Proposal state (Provider)
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [proposalDetails, setProposalDetails] = useState("");
  const [estimatedDaysVal, setEstimatedDaysVal] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmCompliance, setConfirmCompliance] = useState(false);
  const [saveDraftSuccess, setSaveDraftSuccess] = useState(false);

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
        if (rfpRes.status === 404) throw new Error(t("rfpDetails.errors.notFound"));
        throw new Error(t("rfpDetails.errors.loadFailed"));
      }
      const rfpData = await rfpRes.json();

      let tagsObj = {};
      if (rfpData.tags) {
        try {
          tagsObj = typeof rfpData.tags === "string" ? JSON.parse(rfpData.tags) : rfpData.tags;
        } catch (e) {
          tagsObj = {};
        }
      }
      rfpData.parsedTags = tagsObj;
      setRfp(rfpData);

      if (user.role === "beneficiary" && rfpData.beneficiaryId === user.id) {
        const propRes = await fetch(`/api/requests/${id}/proposals`);
        if (propRes.ok) {
          const propData = await propRes.json();
          setProposals(propData);
        }
      } else if (user.role === "provider") {
        const propRes = await fetch("/api/proposals/mine");
        if (propRes.ok) {
          const propData = await propRes.json();
          const matching = propData.filter((p) => p.rfpId === id);
          setProposals(matching);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || t("rfpDetails.errors.fetchError"));
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
        throw new Error(data.error || t("rfpDetails.errors.updateFailed"));
      }
      fetchRfpAndProposals();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const getEstimatedDays = (rfpObj) => {
    if (!rfpObj || !rfpObj.deadline) return 0;
    const diffTime = Math.abs(new Date(rfpObj.deadline) - new Date(rfpObj.createdAt || Date.now()));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!bidAmount || !proposalDetails || !estimatedDaysVal) {
      setSubmitError(isRTL ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    if (Number(bidAmount) <= 0) {
      setSubmitError(t("rfpDetails.errors.submitPositive"));
      return;
    }

    if (!confirmCompliance) {
      setSubmitError(t("rfpDetails.errors.submitCompliance"));
      return;
    }

    setSubmittingProposal(true);
    try {
      const res = await fetch(`/api/requests/${id}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposedBudget: Number(bidAmount),
          coverLetter: proposalDetails,
          estimatedDays: Number(estimatedDaysVal) * 30, // Months to days
          attachmentUrl: attachmentUrl || null,
          currency: "USD",
          status: "submitted",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t("rfpDetails.errors.submitFailed"));
      }

      setShowSubmitForm(false);
      setBidAmount("");
      setProposalDetails("");
      setEstimatedDaysVal("");
      setUploadedFile(null);
      setConfirmCompliance(false);
      fetchRfpAndProposals();
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || t("rfpDetails.errors.submissionError"));
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleSaveDraft = () => {
    setSaveDraftSuccess(true);
    setTimeout(() => setSaveDraftSuccess(false), 3000);
  };

  const initiateChat = (providerId) => {
    setActiveChatProviderId(providerId);
  };

  if (loading) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="font-body-md text-body-md text-on-surface-variant">{t("rfpDetails.loadingFetch")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="bg-error-container text-on-error-container p-lg rounded-xl border border-error/20">
          <h4 className="font-headline-sm text-headline-sm font-semibold mb-2">{t("rfpDetails.errors.title")}</h4>
          <p className="font-body-md text-body-md mb-4">{error}</p>
          <button className="bg-error text-white font-label-md text-label-md px-lg py-md rounded-lg hover:opacity-90 transition-opacity" onClick={() => navigate("/dashboard")}>
            {t("rfpDetails.header.back")}
          </button>
        </div>
      </div>
    );
  }

  const existingProposal = user.role === "provider" && proposals.length > 0 ? proposals[0] : null;
  const isOwner = user.role === "beneficiary" && rfp.beneficiaryId === user.id;

  const renderContent = () => {
    return (
      <div className="flex flex-col gap-xl">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-outline-variant pb-md">
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs font-body-sm text-body-sm text-on-surface-variant">
              <button onClick={() => navigate(-1)} className="hover:text-primary transition-colors text-decoration-none text-on-surface-variant flex items-center gap-1 bg-transparent border-none cursor-pointer p-0">
                <span className={`material-symbols-outlined text-[16px] ${isRTL ? 'rotate-180' : ''}`}>arrow_back</span>
                {isRTL ? "رجوع" : "Back"}
              </button>
              <span className="text-outline-variant">|</span>
              <Link to="/dashboard" className="hover:text-primary transition-colors text-decoration-none text-on-surface-variant">
                {isRTL ? "الرئيسية" : "Dashboard"}
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-semibold">{rfp.title}</span>
            </div>
            <div className="flex items-center gap-sm mt-xs">
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container border border-secondary">
                {rfp.category}
              </span>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full font-label-sm text-label-sm text-xs font-semibold ${rfp.status === "open" ? "bg-emerald-100 text-emerald-800" : "bg-error-container text-on-error-container"
                }`}>
                {rfp.status === "open" ? (isRTL ? "نشط" : "Open") : (isRTL ? "مغلق" : "Closed")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-sm">
            <button className="flex items-center gap-xs px-md py-sm border border-outline-variant hover:bg-surface-container-low rounded-lg font-label-md text-label-md transition-colors bg-surface">
              <span className="material-symbols-outlined text-[18px]">bookmark</span>
              {isRTL ? "حفظ" : "Save"}
            </button>
            <button className="flex items-center gap-xs px-md py-sm border border-outline-variant hover:bg-surface-container-low rounded-lg font-label-md text-label-md transition-colors bg-surface">
              <span className="material-symbols-outlined text-[18px]">share</span>
              {isRTL ? "مشاركة" : "Share"}
            </button>
          </div>
        </div>

        {/* Main Details Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
          {/* Left Column: Scope & Requirements */}
          <div className="lg:col-span-8 flex flex-col gap-lg">

            {/* Project Scope Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg md:p-xl shadow-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-secondary">target</span>
                {isRTL ? "نطاق المشروع" : "Project Scope"}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line leading-relaxed">
                {rfp.description}
              </p>

              {isOwner && (
                <div className="border-t border-outline-variant pt-lg mt-md flex gap-sm">
                  <Link to={`/rfp/edit/${rfp.id}`} className="bg-transparent border border-outline text-on-surface hover:bg-surface-container-low font-label-md text-label-md px-lg py-2 rounded-lg text-decoration-none transition-colors">
                    {t("rfpDetails.header.editSpecs")}
                  </Link>
                </div>
              )}
            </div>



            {/* Received Proposals / Bids (Client Owner Only) */}
            {isOwner && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg md:p-xl shadow-sm flex flex-col gap-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface border-b border-outline-variant pb-md">
                  {t("rfpDetails.proposals.received", { count: proposals.length })}
                </h2>

                {proposals.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-2">inbox</span>
                    <p className="font-body-md text-body-md text-on-surface-variant">{t("rfpDetails.proposals.noProposals")}</p>
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
                              <span className="text-on-surface-variant font-body-sm text-body-sm block mt-xs">
                                {isRTL ? "ميزانية تقديم العرض المقترحة:" : "Proposed Budget:"} <strong className="text-primary font-bold">${Number(prop.proposedBudget).toLocaleString()}</strong>
                              </span>
                              <span className="text-on-surface-variant font-body-sm text-body-sm block mt-xxs">
                                {isRTL ? "الجدول الزمني المقدر:" : "Estimated Timeline:"} <strong>{Number(prop.estimatedDays) / 30} {isRTL ? "أشهر" : "Months"}</strong>
                              </span>
                            </div>
                          </div>

                          <span className={`inline-flex px-2 py-0.5 rounded-full font-label-sm text-label-sm text-xs ${prop.status === "accepted" ? "bg-secondary-container text-on-secondary-container" :
                              prop.status === "rejected" ? "bg-error-container text-on-error-container" :
                                prop.status === "shortlisted" ? "bg-primary-container text-on-primary-container" : "bg-surface-variant text-on-surface"
                            }`}>
                            {t(prop.status.toUpperCase(), prop.status.toUpperCase())}
                          </span>
                        </div>

                        <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-md rounded-lg border border-outline-variant/35 whitespace-pre-line leading-relaxed">
                          {prop.coverLetter}
                        </p>

                        <div className="flex justify-between items-center border-t border-outline-variant/40 pt-md mt-sm">
                          <button
                            type="button"
                            onClick={() => initiateChat(prop.providerId)}
                            className="text-secondary hover:text-on-secondary-container font-label-md text-label-md flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">forum</span> {t("rfpDetails.proposals.chatVendor")}
                          </button>

                          <div className="flex gap-2">
                            {prop.status === "submitted" && (
                              <>
                                <button
                                  onClick={() => handleProposalStatusUpdate(prop.id, "shortlisted")}
                                  className="px-3 py-1.5 border border-outline-variant hover:bg-surface-container-low rounded-lg font-label-md text-label-md transition-colors"
                                >
                                  {t("rfpDetails.proposals.shortlist")}
                                </button>
                                <button
                                  onClick={() => handleProposalStatusUpdate(prop.id, "accepted")}
                                  className="px-3 py-1.5 bg-secondary text-white font-semibold rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                                >
                                  {t("rfpDetails.proposals.accept")}
                                </button>
                                <button
                                  onClick={() => handleProposalStatusUpdate(prop.id, "rejected")}
                                  className="px-3 py-1.5 border border-error text-error hover:bg-error-container/20 rounded-lg font-label-md text-label-md transition-colors"
                                >
                                  {t("rfpDetails.proposals.reject")}
                                </button>
                              </>
                            )}
                            {prop.status === "shortlisted" && (
                              <>
                                <button
                                  onClick={() => handleProposalStatusUpdate(prop.id, "accepted")}
                                  className="px-3 py-1.5 bg-secondary text-white font-semibold rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                                >
                                  {t("rfpDetails.proposals.accept")}
                                </button>
                                <button
                                  onClick={() => handleProposalStatusUpdate(prop.id, "rejected")}
                                  className="px-3 py-1.5 border border-error text-error hover:bg-error-container/20 rounded-lg font-label-md text-label-md transition-colors"
                                >
                                  {t("rfpDetails.proposals.reject")}
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

          {/* Right Column: Key Details & Ready to Bid card */}
          <div className="lg:col-span-4 flex flex-col gap-lg">

            {/* Key Details Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col gap-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface border-b border-outline-variant/60 pb-xs">
                {isRTL ? "تفاصيل هامة" : "Key Details"}
              </h3>
              <div className="flex flex-col gap-md">

                <div className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>business</span>
                  <div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">{isRTL ? "العميل" : "Client"}</div>
                    <div className="font-body-md text-body-md text-on-surface font-semibold">
                      {rfp.beneficiary?.fullName || "B2B Client"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>payments</span>
                  <div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">{isRTL ? "نطاق الميزانية" : "Budget Range"}</div>
                    <div className="font-body-md text-body-md text-on-surface font-semibold">
                      ${Number(rfp.budgetMin).toLocaleString()} - ${Number(rfp.budgetMax).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>calendar_today</span>
                  <div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">{isRTL ? "آخر موعد للتقديم" : "Submission Deadline"}</div>
                    <div className="font-body-md text-body-md text-on-surface font-semibold">
                      {new Date(rfp.deadline).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                    </div>
                  </div>
                </div>

                {rfp.attachmentUrl && (
                  <div className="flex items-start gap-sm border-t border-outline-variant/40 pt-md mt-sm">
                    <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>picture_as_pdf</span>
                    <div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">{isRTL ? "المرفقات" : "Attachments"}</div>
                      <a href={rfp.attachmentUrl} target="_blank" rel="noopener noreferrer" className="font-body-sm text-body-sm text-primary font-semibold hover:underline block mt-xxs">
                        {isRTL ? "تنزيل المرفق" : "Download Attached RFP Document"}
                      </a>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Client Profile Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col gap-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface border-b border-outline-variant/60 pb-xs">
                {isRTL ? "الملف الشخصي للعميل" : "Client Profile"}
              </h3>
              <div className="flex flex-col gap-md">

                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
                    {rfp.beneficiary?.fullName?.charAt(0) || "C"}
                  </div>
                  <div>
                    <div className="font-body-md text-body-md text-on-surface font-semibold">
                      {rfp.beneficiary?.fullName}
                    </div>
                    {rfp.beneficiary?.beneficiaryProfile?.organizationName && (
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        {rfp.beneficiary.beneficiaryProfile.organizationName}
                      </div>
                    )}
                  </div>
                </div>

                {rfp.beneficiary?.beneficiaryProfile?.industry && (
                  <div className="flex items-start gap-sm mt-xs">
                    <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>domain</span>
                    <div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">{isRTL ? "الصناعة / المجال" : "Industry"}</div>
                      <div className="font-body-sm text-body-sm text-on-surface">{rfp.beneficiary.beneficiaryProfile.industry}</div>
                    </div>
                  </div>
                )}

                {rfp.beneficiary?.country && (
                  <div className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>location_on</span>
                    <div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">{isRTL ? "الموقع" : "Location"}</div>
                      <div className="font-body-sm text-body-sm text-on-surface">{rfp.beneficiary.city ? `${rfp.beneficiary.city}, ` : ''}{rfp.beneficiary.country}</div>
                    </div>
                  </div>
                )}

                {rfp.beneficiary?.beneficiaryProfile?.websiteUrl && (
                  <div className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>language</span>
                    <div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">{isRTL ? "الموقع الإلكتروني" : "Website"}</div>
                      <a href={rfp.beneficiary.beneficiaryProfile.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-body-sm text-body-sm text-secondary hover:underline break-all">
                        {rfp.beneficiary.beneficiaryProfile.websiteUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ready to Bid card (Provider Mode) */}
            {user.role === "provider" && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm sticky top-20 flex flex-col gap-md">
                {existingProposal ? (
                  <div className="flex flex-col gap-md">
                    <h4 className="font-headline-sm text-headline-sm text-secondary font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined">check_circle</span>
                      {isRTL ? "تم إرسال العرض بنجاح" : "Proposal Sent"}
                    </h4>
                    <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant flex flex-col gap-sm">
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-on-surface-variant">{isRTL ? "ميزانيتك المقترحة:" : "Your Offered Rate:"}</span>
                        <strong className="text-primary">${Number(existingProposal.proposedBudget).toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-on-surface-variant">{isRTL ? "حالة العرض:" : "Proposal Status:"}</span>
                        <span className={`inline-flex px-2 py-0.5 rounded-full font-label-sm text-label-sm text-xs ${existingProposal.status === "accepted" ? "bg-secondary-container text-on-secondary-container" :
                            existingProposal.status === "rejected" ? "bg-error-container text-on-error-container" :
                              existingProposal.status === "shortlisted" ? "bg-primary-container text-on-primary-container" : "bg-surface-variant text-on-surface"
                          }`}>
                          {t(existingProposal.status.toUpperCase(), existingProposal.status.toUpperCase())}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-sm mt-xs">
                      <button
                        onClick={() => initiateChat(rfp.beneficiaryId)}
                        className="bg-primary hover:bg-on-background text-on-primary font-label-md text-label-md py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm text-white text-decoration-none"
                      >
                        <span className="material-symbols-outlined">forum</span> {t("rfpDetails.sidebar.openChat")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-md text-center">
                    <div className="font-headline-sm text-headline-sm text-on-surface">{isRTL ? "هل أنت جاهز للتقديم؟" : "Ready to bid?"}</div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-xs leading-relaxed">
                      {isRTL ? "يرجى مراجعة كافة متطلبات المشروع بدقة قبل تعبئة وتقديم عرضك الفني والمالي." : "Review all client requirements carefully before starting to write your service proposal."}
                    </p>
                    <button
                      onClick={() => {
                        setShowSubmitForm(true);
                        setTimeout(() => {
                          document.getElementById("submit-proposal-section")?.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                      className="w-full bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md py-2.5 rounded-lg font-bold transition-colors text-white border border-primary"
                      disabled={rfp.status !== "open"}
                    >
                      {isRTL ? "تقديم عرض جديد" : "Start Proposal"}
                    </button>
                    <span className="font-body-xs text-body-xs text-on-surface-variant block mt-xs">
                      {proposals.length} {isRTL ? "مقدمين قدموا عروضاً بالفعل" : "vendors have already bid"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Negotiation Chat Pane */}
            {activeChatProviderId && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col sticky top-20" style={{ height: "450px" }}>
                <div className="bg-primary text-white p-3 flex justify-between items-center">
                  <h5 className="m-0 font-bold font-headline-sm text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-sm">forum</span> {t("rfpDetails.sidebar.negotiationChat")}
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

        {/* Submit Proposal Bottom Section (Provider Mode only) */}
        {user.role === "provider" && showSubmitForm && !existingProposal && (
          <div id="submit-proposal-section" className="bg-[#f0f4f8] border border-[#d9e2ec] p-lg md:p-xl rounded-2xl flex flex-col gap-lg mt-xl shadow-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-[#102a43] mb-xs font-bold">
                {isRTL ? "تقديم عرض تقديم خدمات" : "Submit Proposal"}
              </h2>
              <p className="font-body-md text-body-md text-[#486581]">
                {isRTL ? "قدم مقترحاً تفصيلياً يوضح منهجية العمل والجدول الزمني لتلبية احتياجات المشروع." : "Provide a detailed response addressing the requirements outlined in the RFP."}
              </p>
            </div>

            {submitError && (
              <div className="bg-error-container text-on-error-container p-md rounded-lg border border-error/20 font-body-sm">
                {submitError}
              </div>
            )}

            {saveDraftSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-md rounded-lg border border-emerald-200 font-body-sm flex items-center gap-sm">
                <span className="material-symbols-outlined text-[18px]">done</span>
                {isRTL ? "تم حفظ المسودة بنجاح" : "Draft saved successfully!"}
              </div>
            )}

            <form onSubmit={handleProposalSubmit} className="flex flex-col gap-lg">

              <div>
                <label className="block font-label-md text-label-md text-[#102a43] font-semibold mb-xs">
                  {isRTL ? "الملخص التنفيذي ومنهجية العمل" : "Executive Summary & Approach"} <span className="text-error">*</span>
                </label>
                <div className="bg-surface border border-outline-variant rounded-xl p-xs">
                  <div className="flex items-center gap-xs border-b border-outline-variant pb-xs mb-xs px-xs text-on-surface-variant">
                    <button type="button" className="p-xs hover:bg-surface-container-low rounded"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                    <button type="button" className="p-xs hover:bg-surface-container-low rounded"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                    <button type="button" className="p-xs hover:bg-surface-container-low rounded"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                    <button type="button" className="p-xs hover:bg-surface-container-low rounded"><span className="material-symbols-outlined text-[18px]">format_list_numbered</span></button>
                    <button type="button" className="p-xs hover:bg-surface-container-low rounded"><span className="material-symbols-outlined text-[18px]">link</span></button>
                  </div>
                  <textarea
                    className="w-full bg-transparent border-0 font-body-md text-body-md text-on-surface focus:outline-none px-md py-sm placeholder:text-on-surface-variant resize-y"
                    placeholder={isRTL ? "اكتب منهجية العمل، هيكلية الفريق، وسبب كونك الشريك الأفضل للمشروع..." : "Detail your methodology, team structure, and why you are the best fit for this project..."}
                    rows="8"
                    maxLength={5000}
                    value={proposalDetails}
                    onChange={(e) => setProposalDetails(e.target.value)}
                  ></textarea>
                  <div className={`text-${isRTL ? 'left' : 'right'} font-body-xs text-body-xs text-on-surface-variant p-xs`}>
                    {proposalDetails.length} / 5000 {isRTL ? "حرف" : "characters"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                <div>
                  <label className="block font-label-md text-label-md text-[#102a43] font-semibold mb-xs">
                    {isRTL ? "الميزانية الإجمالية المقترحة (USD)" : "Proposed Total Budget (USD)"} <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold`}>$</span>
                    <input
                      type="number"
                      className={`w-full bg-surface border border-outline-variant rounded-lg ${isRTL ? 'pr-8 pl-4' : 'pl-8 pr-4'} py-2.5 font-body-md text-body-md text-on-surface focus:border-secondary outline-none`}
                      placeholder={isRTL ? "مثال: 325,000" : "e.g. 325,000"}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-[#102a43] font-semibold mb-xs">
                    {isRTL ? "الجدول الزمني المقدر (بالأشهر)" : "Estimated Timeline (Months)"} <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px]`}>schedule</span>
                    <input
                      type="number"
                      className={`w-full bg-surface border border-outline-variant rounded-lg ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 font-body-md text-body-md text-on-surface focus:border-secondary outline-none`}
                      placeholder={isRTL ? "مثال: 18" : "e.g. 18"}
                      value={estimatedDaysVal}
                      onChange={(e) => setEstimatedDaysVal(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-[#102a43] font-semibold mb-xs">
                  {isRTL ? "تحميل وثيقة العرض الفني بالتفصيل" : "Upload Detailed Proposal Document"}
                </label>
                <div
                  onClick={() => {
                    setUploadedFile("proposal_specification_document.pdf");
                    setAttachmentUrl("/uploads/proposal.pdf");
                  }}
                  className="border-2 border-dashed border-[#bcccdc] rounded-xl p-lg flex flex-col items-center justify-center bg-surface hover:bg-[#f0f4f8] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#486581] text-[36px] mb-xs">cloud_upload</span>
                  <span className="font-label-md text-label-md text-[#102a43] font-bold">
                    {uploadedFile ? uploadedFile : (isRTL ? "اضغط لرفع الملف أو اسحبه هنا" : "Click to upload or drag and drop")}
                  </span>
                  <span className="font-body-xs text-body-xs text-[#627d98] mt-xxs">
                    {isRTL ? "PDF, DOCX أو PPTX (حد أقصى 25 ميجابايت). يشمل التفاصيل الفنية والمالية وهيكل الفريق." : "PDF, DOCX, or PPTX (Max 25MB). Includes detailed technical specs, pricing breakdowns, and team bios."}
                  </span>
                </div>
              </div>

              <div className="bg-surface p-md rounded-xl border border-outline-variant flex items-start gap-sm">
                <input
                  type="checkbox"
                  id="complianceCheck"
                  className="w-4 h-4 text-secondary border-outline-variant rounded focus:ring-secondary mt-1 cursor-pointer"
                  checked={confirmCompliance}
                  onChange={(e) => setConfirmCompliance(e.target.checked)}
                />
                <label htmlFor="complianceCheck" className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none leading-relaxed">
                  {isRTL
                    ? "أؤكد أن هذا العرض يلبي كافة الشروط والمواصفات الموضحة في طلب العميل، وأن الأسعار المقدمة صالحة لمدة 90 يوماً من تاريخ الإرسال."
                    : "I confirm that this proposal meets all mandatory requirements outlined in the RFP, and the pricing provided is valid for 90 days from submission."}
                </label>
              </div>

              <div className="flex justify-end gap-sm border-t border-outline-variant pt-lg mt-md">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-lg py-2.5 border border-[#bcccdc] bg-surface text-[#102a43] hover:bg-surface-container-low rounded-lg font-label-md text-label-md transition-colors"
                >
                  {isRTL ? "حفظ كمسودة" : "Save Draft"}
                </button>
                <button
                  type="submit"
                  disabled={submittingProposal}
                  className="bg-primary hover:bg-[#102a43] text-on-primary font-label-md text-label-md px-xl py-2.5 rounded-lg transition-colors font-semibold text-white flex items-center justify-center border border-primary"
                >
                  {submittingProposal ? (
                    <>
                      <span className={`animate-spin rounded-full h-4 w-4 border-b-2 border-white ${isRTL ? 'ml-2' : 'mr-2'}`}></span>
                      {isRTL ? "جاري الإرسال..." : "Submitting..."}
                    </>
                  ) : (
                    isRTL ? "إرسال العرض النهائي" : "Submit Proposal"
                  )}
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    );
  };

  if (user.role === "provider") {
    return (
      <div className="flex min-h-screen bg-background w-full">
        <ProviderSidebar />

        <main className={`flex-1 ${isRTL ? 'md:mr-64' : 'md:ml-64'} bg-background min-h-screen flex flex-col`}>
          <div className="max-w-container-max w-full mx-auto px-margin-mobile md:px-lg py-xl flex flex-col gap-xl flex-grow">
            {renderContent()}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
      {renderContent()}
    </div>
  );
}

export default RfpDetails;
