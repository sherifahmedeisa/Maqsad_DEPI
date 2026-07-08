import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const categoryIcons = {
  "Software Development": "code",
  "IT Infrastructure": "cloud",
  "Marketing & Design": "campaign",
  "Legal & Auditing": "gavel",
  "General Services": "engineering"
};

const categoryDescriptions = {
  "Software Development": "Custom software applications, API integrations, and enterprise software engineering services.",
  "IT Infrastructure": "Cloud infrastructure deployment, data networking solutions, and systems architecture consulting.",
  "Marketing & Design": "Creative branding, product design, digital marketing campaigns, and UI/UX design.",
  "Legal & Auditing": "Professional auditing and consulting services for corporate organizations and operations.",
  "General Services": "Operational consulting, organizational coaching, and general business consulting support."
};

function RfpForm() {
  const { user } = useAuth();
  const { id } = useParams(); // Exists if we are editing
  const navigate = useNavigate();
  const isEdit = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Software Development");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("open");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEdit) {
      fetchRfpData();
    }
  }, [id]);

  const fetchRfpData = async () => {
    try {
      const res = await fetch(`/api/requests/${id}`);
      if (!res.ok) throw new Error("Failed to fetch request information");
      const rfp = await res.json();

      // Security check: only the beneficiary who created it can edit it
      if (rfp.beneficiaryId !== user.id) {
        throw new Error("You do not have permission to edit this service request.");
      }

      setTitle(rfp.title);
      setDescription(rfp.description);
      setCategory(rfp.category || "Software Development");
      setBudgetMin(rfp.budgetMin);
      setBudgetMax(rfp.budgetMax);
      if (rfp.deadline) {
        setDeadline(new Date(rfp.deadline).toISOString().split("T")[0]);
      }
      setStatus(rfp.status);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred loading RFP data.");
    } finally {
      setFetching(false);
    }
  };

  const handleNext = () => {
    setError("");
    if (currentStep === 1) {
      if (!title || !category) {
        setError("Please provide a title and service category.");
        return;
      }
      if (!description || description.length < 20) {
        setError("Please provide a detailed description (minimum 20 characters).");
        return;
      }
    } else if (currentStep === 2) {
      if (!budgetMin || !budgetMax || !deadline) {
        setError("Please complete the budget parameters and timeline deadline.");
        return;
      }
      if (Number(budgetMin) <= 0 || Number(budgetMax) <= 0) {
        setError("Budgets must be positive numbers");
        return;
      }
      if (Number(budgetMin) > Number(budgetMax)) {
        setError("Minimum budget cannot be larger than maximum budget");
        return;
      }
      const deadlineDate = new Date(deadline);
      if (deadlineDate <= new Date() && !isEdit) {
        setError("Deadline must be a future date");
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
      const payload = {
        title,
        description,
        category,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        deadline: new Date(deadline).toISOString(),
        status,
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
        throw new Error(data.error || "Failed to publish service request");
      }

      setSuccess(`Request successfully ${isEdit ? "updated" : "published"}!`);
      setTimeout(() => {
        navigate(isEdit ? `/rfp/${id}` : "/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="font-body-md text-body-md text-on-surface-variant">Fetching RFP metadata details...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl md:py-2xl">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-xl text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => navigate(-1)} className="p-2 border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface">
              {isEdit ? "Edit Service Request" : "Request Service"}
            </h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Provide your project details to receive tailored proposals from our certified experts.
          </p>
        </div>

        {/* Category banner box matching Stitch */}
        <div className="mb-lg p-md bg-surface-container-low border border-outline-variant rounded-xl flex items-center gap-md">
          <div className="w-16 h-16 bg-surface-container-highest rounded-lg flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[32px]">{categoryIcons[category] || "account_balance"}</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{category || "Project Scope"}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {categoryDescriptions[category] || "Professional corporate auditing and consulting services."}
            </p>
          </div>
        </div>

        {/* Stepper Navigation Indicator */}
        <div className="mb-2xl relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-high -translate-y-1/2 z-0 hidden sm:block"></div>
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-secondary -translate-y-1/2 z-0 transition-all duration-300 hidden sm:block" 
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
              <span className={`font-label-sm text-label-sm hidden sm:block ${currentStep >= 1 ? "text-secondary font-semibold" : "text-on-surface-variant"}`}>Project Scope</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-sm flex-1 sm:flex-none">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-label-sm text-label-sm transition-colors ${
                currentStep > 2 ? "bg-secondary text-white border-secondary" :
                currentStep === 2 ? "bg-secondary text-white border-secondary" : "bg-surface-container-lowest text-on-surface-variant border-outline-variant"
              }`}>
                {currentStep > 2 ? <span className="material-symbols-outlined text-[16px]">check</span> : "2"}
              </div>
              <span className={`font-label-sm text-label-sm hidden sm:block ${currentStep >= 2 ? "text-secondary font-semibold" : "text-on-surface-variant"}`}>Budget & Timeline</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-sm flex-1 sm:flex-none">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-label-sm text-label-sm transition-colors ${
                currentStep === 3 ? "bg-secondary text-white border-secondary" : "bg-surface-container-lowest text-on-surface-variant border-outline-variant"
              }`}>
                "3"
              </div>
              <span className={`font-label-sm text-label-sm hidden sm:block ${currentStep === 3 ? "text-secondary font-semibold" : "text-on-surface-variant"}`}>Review</span>
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
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs border-b border-outline-variant pb-2">Project Scope</h2>
                <div>
                  <label className="block font-label-md text-label-md text-on-background mb-xs" htmlFor="request-title">
                    Request Title <span className="text-error">*</span>
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors placeholder:text-on-surface-variant"
                    id="request-title"
                    placeholder="e.g. Enterprise HR Portal Redesign"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-background mb-xs" htmlFor="category">
                    Service Category <span className="text-error">*</span>
                  </label>
                  <select
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Software Development">Software Development</option>
                    <option value="IT Infrastructure">IT Infrastructure</option>
                    <option value="Marketing & Design">Marketing & Design</option>
                    <option value="Legal & Auditing">Legal & Auditing</option>
                    <option value="General Services">General Services</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-background mb-xs" htmlFor="description">
                    Project Description <span className="text-error">*</span>
                  </label>
                  <textarea
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors placeholder:text-on-surface-variant resize-y"
                    id="description"
                    placeholder="Describe the specific goals, deliverables, and any constraints for this project..."
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={2000}
                  ></textarea>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Describe the deliverables and target outcomes clearly.</p>
                </div>
              </div>
            )}

            {/* Step 2: Budget & Timeline */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs border-b border-outline-variant pb-2">Budget & Timeline</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-background mb-xs">
                      Min Budget ($) <span className="text-error">*</span>
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
                      Max Budget ($) <span className="text-error">*</span>
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
                    Target Deadline <span className="text-error">*</span>
                  </label>
                  <input
                    className="w-full sm:w-1/2 bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>

                {isEdit && (
                  <div>
                    <label className="block font-label-md text-label-md text-on-background mb-xs">
                      RFP Status
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
                        <span>Open (Accepting Proposals)</span>
                      </label>
                      <label className="flex items-center gap-2 font-body-md cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="closed"
                          checked={status === "closed"}
                          onChange={() => setStatus("closed")}
                        />
                        <span>Closed</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review Summary */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs border-b border-outline-variant pb-2">Review Your Request</h2>
                <div className="bg-surface-container-low rounded-lg p-lg border border-outline-variant flex flex-col gap-md">
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Service Category</h3>
                    <p className="font-body-md text-body-md text-on-surface">{category}</p>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Project Title</h3>
                    <p className="font-body-md text-body-md text-on-surface font-semibold">{title}</p>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Project Scope</h3>
                    <p className="font-body-sm text-body-sm text-on-surface whitespace-pre-line">{description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Budget</h3>
                      <p className="font-body-md text-body-md text-on-surface font-semibold">
                        ${Number(budgetMin).toLocaleString()} - ${Number(budgetMax).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Deadline</h3>
                      <p className="font-body-md text-body-md text-on-surface">{new Date(deadline).toLocaleDateString()}</p>
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
                  Back
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
                  Next Step
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
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Posting Request...
                    </>
                  ) : (
                    isEdit ? "Update Request" : "Post Request"
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
