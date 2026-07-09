import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const categoryIcons = {
  "Software Development": "code",
  "IT Infrastructure": "cloud",
  "Marketing & Design": "campaign",
  "Legal & Auditing": "gavel",
  "General Services": "engineering"
};

const categoryKeys = {
  "Software Development": "software",
  "IT Infrastructure": "infrastructure",
  "Marketing & Design": "marketing",
  "Legal & Auditing": "legal",
  "General Services": "general"
};

function RfpForm() {
  const { user } = useAuth();
  const { id } = useParams(); // Exists if we are editing
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const isEdit = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [providerId, setProviderId] = useState(searchParams.get("providerId") || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Software Development");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("30");
  const [status, setStatus] = useState("open");

  const [certifications, setCertifications] = useState("");
  const [experience, setExperience] = useState("");
  const [securityClearance, setSecurityClearance] = useState("");
  const [locationVal, setLocationVal] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isRTL = i18n.language.startsWith('ar');

  useEffect(() => {
    if (isEdit) {
      fetchRfpData();
    }
  }, [id]);

  const fetchRfpData = async () => {
    try {
      const res = await fetch(`/api/requests/${id}`);
      if (!res.ok) throw new Error(t("rfpForm.errors.submissionError"));
      const rfp = await res.json();

      // Security check: only the beneficiary who created it can edit it
      if (rfp.beneficiaryId !== user.id) {
        throw new Error(t("rfpForm.errors.noPermission"));
      }

      setTitle(rfp.title);
      setDescription(rfp.description);
      setCategory(rfp.category || "Software Development");
      setBudgetMin(rfp.budgetMin);
      setBudgetMax(rfp.budgetMax);
      setProviderId(rfp.providerId || "");
      if (rfp.deadline) {
        const diffTime = Math.abs(new Date(rfp.deadline) - new Date(rfp.createdAt || Date.now()));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setEstimatedDays(String(diffDays || 30));
      }
      setStatus(rfp.status);

      let tagsObj = {};
      if (rfp.tags) {
        try {
          tagsObj = typeof rfp.tags === "string" ? JSON.parse(rfp.tags) : rfp.tags;
        } catch (e) {
          tagsObj = {};
        }
      }
      setCertifications(tagsObj.certifications || "");
      setExperience(tagsObj.experience || "");
      setSecurityClearance(tagsObj.securityClearance || "");
      setLocationVal(tagsObj.location || "");
    } catch (err) {
      console.error(err);
      setError(err.message || t("rfpForm.errors.submissionError"));
    } finally {
      setFetching(false);
    }
  };

  const handleNext = () => {
    setError("");
    if (currentStep === 1) {
      if (!title || !category) {
        setError(t("rfpForm.errors.titleCategory"));
        return;
      }
      if (!description || description.length < 20) {
        setError(t("rfpForm.errors.description"));
        return;
      }
    } else if (currentStep === 2) {
      if (!budgetMin || !budgetMax || !estimatedDays) {
        setError(t("rfpForm.errors.budgetTimeline"));
        return;
      }
      if (Number(budgetMin) <= 0 || Number(budgetMax) <= 0) {
        setError(t("rfpForm.errors.budgetPositive"));
        return;
      }
      if (Number(budgetMin) > Number(budgetMax)) {
        setError(t("rfpForm.errors.budgetOrder"));
        return;
      }
      if (Number(estimatedDays) <= 0) {
        setError(t("rfpForm.errors.durationPositive"));
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + Number(estimatedDays));

      const payload = {
        providerId: providerId || null,
        title,
        description,
        category,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        deadline: targetDate.toISOString(),
        status,
        tags: {
          certifications,
          experience,
          securityClearance,
          location: locationVal,
        },
      };

      const url = isEdit ? `/api/requests/${id}` : "/api/requests";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("rfpForm.errors.publishFailed"));
      }

      setSuccess(isEdit ? t("rfpForm.success.updated") : t("rfpForm.success.published"));
      setTimeout(() => {
        navigate(isEdit ? `/rfp/${id}` : "/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || t("rfpForm.errors.submissionError"));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="font-body-md text-body-md text-on-surface-variant">{t("rfpForm.loadingFetch")}</p>
      </div>
    );
  }

  const catKey = categoryKeys[category] || "software";

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl md:py-2xl">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-xl text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => navigate(-1)} className="p-2 border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <span className={`material-symbols-outlined text-[18px] ${isRTL ? 'rotate-180' : ''}`}>arrow_back</span>
            </button>
            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface">
              {isEdit ? t("rfpForm.header.editTitle") : t("rfpForm.header.createTitle")}
            </h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t("rfpForm.header.subtitle")}
          </p>
        </div>

        {/* Category banner box matching Stitch */}
        <div className="mb-lg p-md bg-surface-container-low border border-outline-variant rounded-xl flex items-center gap-md">
          <div className="w-16 h-16 bg-surface-container-highest rounded-lg flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[32px]">{categoryIcons[category] || "account_balance"}</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{t(`rfpForm.categories.${catKey}`, t("rfpForm.defaultScope"))}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t(`rfpForm.categoryDescriptions.${catKey}`, t("rfpForm.defaultScopeDesc"))}
            </p>
          </div>
        </div>

        {/* Stepper Navigation Indicator */}
        <div className="mb-2xl relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-high -translate-y-1/2 z-0 hidden sm:block"></div>
          <div 
            className={`absolute top-1/2 ${isRTL ? 'right-0' : 'left-0'} h-0.5 bg-secondary -translate-y-1/2 z-0 transition-all duration-300 hidden sm:block`}
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
          
          <div className="flex justify-between relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-sm flex-1 sm:flex-none">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-sm text-label-sm border-2 transition-colors ${
                currentStep > 1 ? "bg-secondary text-white border-secondary" : "bg-secondary text-white border-secondary"
              }`}>
                {currentStep > 1 ? <span className="material-symbols-outlined text-[16px]">check</span> : "1"}
              </div>
              <span className={`font-label-sm text-label-sm hidden sm:block ${currentStep >= 1 ? "text-secondary font-semibold" : "text-on-surface-variant"}`}>{t("rfpForm.steps.step1")}</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-sm flex-1 sm:flex-none">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-label-sm text-label-sm transition-colors ${
                currentStep > 2 ? "bg-secondary text-white border-secondary" :
                currentStep === 2 ? "bg-secondary text-white border-secondary" : "bg-surface-container-lowest text-on-surface-variant border-outline-variant"
              }`}>
                {currentStep > 2 ? <span className="material-symbols-outlined text-[16px]">check</span> : "2"}
              </div>
              <span className={`font-label-sm text-label-sm hidden sm:block ${currentStep >= 2 ? "text-secondary font-semibold" : "text-on-surface-variant"}`}>{t("rfpForm.steps.step2")}</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-sm flex-1 sm:flex-none">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-label-sm text-label-sm transition-colors ${
                currentStep === 3 ? "bg-secondary text-white border-secondary" : "bg-surface-container-lowest text-on-surface-variant border-outline-variant"
              }`}>
                "3"
              </div>
              <span className={`font-label-sm text-label-sm hidden sm:block ${currentStep === 3 ? "text-secondary font-semibold" : "text-on-surface-variant"}`}>{t("rfpForm.steps.step3")}</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl shadow-sm">
          {error && <div className="bg-error-container text-on-error-container p-md rounded-lg mb-lg border border-error/10 font-body-sm">{error}</div>}
          {success && <div className="bg-secondary-container text-on-secondary-container p-md rounded-lg mb-lg border border-secondary/15 font-body-sm">{success}</div>}

          <form onSubmit={(e) => e.preventDefault()}>
            
            {/* Step 1: Project Scope */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs border-b border-outline-variant pb-2">{t("rfpForm.steps.step1")}</h2>
                <div>
                  <label className="block font-label-md text-label-md text-on-background mb-xs" htmlFor="request-title">
                    {t("rfpForm.form.titleLabel")} <span className="text-error">*</span>
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors placeholder:text-on-surface-variant"
                    id="request-title"
                    placeholder={t("rfpForm.form.titlePlaceholder")}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-background mb-xs" htmlFor="category">
                    {t("rfpForm.form.categoryLabel")} <span className="text-error">*</span>
                  </label>
                  <select
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Software Development">{t("rfpForm.categories.software")}</option>
                    <option value="IT Infrastructure">{t("rfpForm.categories.infrastructure")}</option>
                    <option value="Marketing & Design">{t("rfpForm.categories.marketing")}</option>
                    <option value="Legal & Auditing">{t("rfpForm.categories.legal")}</option>
                    <option value="General Services">{t("rfpForm.categories.general")}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-background mb-xs" htmlFor="description">
                    {t("rfpForm.form.descLabel")} <span className="text-error">*</span>
                  </label>
                  <textarea
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors placeholder:text-on-surface-variant resize-y"
                    id="description"
                    placeholder={t("rfpForm.form.descPlaceholder")}
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={2000}
                  ></textarea>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">{t("rfpForm.form.descHint")}</p>
                </div>
              </div>
            )}

            {/* Step 2: Budget & Timeline */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs border-b border-outline-variant pb-2">{t("rfpForm.steps.step2")}</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-background mb-xs">
                      {t("rfpForm.form.minBudget")} <span className="text-error">*</span>
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                      type="number"
                      placeholder="Min"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-background mb-xs">
                      {t("rfpForm.form.maxBudget")} <span className="text-error">*</span>
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                      type="number"
                      placeholder="Max"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-background mb-xs">
                    {t("rfpForm.form.estimatedDuration")} <span className="text-error">*</span>
                  </label>
                  <input
                    className="w-full sm:w-1/2 bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                    type="number"
                    min="1"
                    placeholder={t("rfpForm.form.durationPlaceholder")}
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                  />
                </div>

                {isEdit && (
                  <div>
                    <label className="block font-label-md text-label-md text-on-background mb-xs">
                      {t("rfpForm.form.statusLabel")}
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 font-body-md cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="open"
                          checked={status === "open"}
                          onChange={() => setStatus("open")}
                        />
                        <span>{t("rfpForm.form.statusOpen")}</span>
                      </label>
                      <label className="flex items-center gap-2 font-body-md cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="closed"
                          checked={status === "closed"}
                          onChange={() => setStatus("closed")}
                        />
                        <span>{t("rfpForm.form.statusClosed")}</span>
                      </label>
                    </div>
                  </div>
                )}
                <div className="border-t border-outline-variant pt-lg mt-md">
                  <h3 className="font-label-md text-label-md text-secondary font-bold uppercase mb-md">
                    {isRTL ? "متطلبات العميل (اختياري)" : "Client Requirements (Optional)"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-md text-label-md text-on-background mb-xs">
                        {isRTL ? "الشهادات المطلوبة" : "Required Certifications"}
                      </label>
                      <input
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                        type="text"
                        placeholder={isRTL ? "مثال: AWS Advanced Tier" : "e.g. AWS Advanced Tier"}
                        value={certifications}
                        onChange={(e) => setCertifications(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-background mb-xs">
                        {isRTL ? "الخبرة المطلوبة" : "Required Experience"}
                      </label>
                      <input
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                        type="text"
                        placeholder={isRTL ? "مثال: حد أدنى 3 سنوات" : "e.g. Minimum 3 years"}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mt-md">
                    <div>
                      <label className="block font-label-md text-label-md text-on-background mb-xs">
                        {isRTL ? "التصاريح الأمنية" : "Security Clearances"}
                      </label>
                      <input
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                        type="text"
                        placeholder={isRTL ? "مثال: ISO 27001 compliance" : "e.g. ISO 27001 compliance"}
                        value={securityClearance}
                        onChange={(e) => setSecurityClearance(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-background mb-xs">
                        {isRTL ? "النطاق الجغرافي" : "Preferred Location"}
                      </label>
                      <input
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                        type="text"
                        placeholder={isRTL ? "مثال: الشرق الأوسط أو عن بعد" : "e.g. NA or EU timezones"}
                        value={locationVal}
                        onChange={(e) => setLocationVal(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review Summary */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs border-b border-outline-variant pb-2">{t("rfpForm.review.title")}</h2>
                <div className="bg-surface-container-low rounded-lg p-lg border border-outline-variant flex flex-col gap-md">
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">{t("rfpForm.review.category")}</h3>
                    <p className="font-body-md text-body-md text-on-surface">{t(`rfpForm.categories.${catKey}`)}</p>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">{t("rfpForm.review.projectTitle")}</h3>
                    <p className="font-body-md text-body-md text-on-surface font-semibold">{title}</p>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">{t("rfpForm.review.projectScope")}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface whitespace-pre-line">{description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">{t("rfpForm.review.budget")}</h3>
                      <p className="font-body-md text-body-md text-on-surface font-semibold">
                        ${Number(budgetMin).toLocaleString()} - ${Number(budgetMax).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">{t("rfpForm.review.estimatedDuration")}</h3>
                      <p className="font-body-md text-body-md text-on-surface font-semibold">{estimatedDays} {t("rfpForm.review.days")}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Action buttons */}
            <div className="mt-xl flex justify-between items-center border-t border-outline-variant pt-lg">
              {currentStep > 1 ? (
                <button
                  className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface px-lg py-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors"
                  type="button"
                  onClick={handleBack}
                >
                  {t("rfpForm.buttons.back")}
                </button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <button
                  className="bg-primary hover:bg-on-background text-on-primary font-label-md text-label-md px-lg py-2 rounded-lg hover:opacity-90 transition-opacity"
                  type="button"
                  onClick={handleNext}
                >
                  {t("rfpForm.buttons.next")}
                </button>
              ) : (
                <button
                  className="bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md px-lg py-2 rounded-lg hover:opacity-90 transition-opacity text-white font-semibold flex items-center justify-center"
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <span className={`animate-spin rounded-full h-4 w-4 border-b-2 border-white ${isRTL ? 'ml-2' : 'mr-2'}`}></span>
                      {t("rfpForm.buttons.posting")}
                    </>
                  ) : (
                    isEdit ? t("rfpForm.buttons.update") : t("rfpForm.buttons.post")
                  )}
                </button>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default RfpForm;
