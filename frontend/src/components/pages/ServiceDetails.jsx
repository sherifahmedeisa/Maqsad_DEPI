import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

function ServiceDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showRfpModal, setShowRfpModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);

  const isRTL = i18n.language.startsWith('ar');

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/services/${id}`);
        if (!res.ok) {
          throw new Error(isRTL ? "فشل في تحميل تفاصيل الخدمة" : "Failed to load service details");
        }
        const data = await res.json();
        setService(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, isRTL]);

  const handleRfpSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: service.provider?.id,
          title: `Request for: ${service.title}`,
          description: notes || (isRTL ? `مهتم بخدمتك: ${service.title}` : `Interested in your service: ${service.title}`),
          category: service.category,
          status: "open",
          tags: service.tags || []
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit request");
      }

      setSubmitSuccess(true);
      setNotes("");
    } catch (err) {
      console.error(err);
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="font-body-md text-body-md text-on-surface-variant">{isRTL ? "جاري التحميل..." : "Loading service..."}</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="bg-error-container text-on-error-container p-lg rounded-xl border border-error/20 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-4xl mb-4">error</span>
          <h4 className="font-headline-sm text-headline-sm font-semibold mb-2">
            {isRTL ? "عذراً، لم نتمكن من العثور على الخدمة" : "Sorry, we couldn't find the service"}
          </h4>
          <p className="font-body-md text-body-md mb-6 max-w-md mx-auto">{error || "Service not found."}</p>
          <button 
            onClick={() => navigate('/browse-catalog')}
            className="bg-primary text-on-primary font-label-md px-lg py-md rounded-xl hover:opacity-90 transition-opacity"
          >
            {isRTL ? "العودة إلى الكتالوج" : "Back to Catalog"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-grow bg-[#f8fafc] w-full pb-2xl ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-primary-container pt-xl pb-32 px-margin-mobile md:px-lg relative">
        <div className="max-w-container-max mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-lg">
            <button 
              onClick={() => window.history.back()} 
              className={`p-2 border border-outline-variant/30 rounded-full text-on-primary-container hover:bg-on-primary-container/10 transition-colors flex items-center justify-center`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isRTL ? 'rotate-180' : ''}`}>arrow_back</span>
            </button>
            <span className="font-label-md text-label-md text-on-primary-container/80">
              {isRTL ? "الرجوع إلى الكتالوج" : "Back to Catalog"}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-lg justify-between items-start">
            <div>
              <span className="inline-block bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full mb-md">
                {service.category}
              </span>
              <h1 className="font-headline-xl text-headline-xl text-on-primary-container mb-xs max-w-3xl">
                {service.title}
              </h1>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Main Content Content */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-lg -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-lg">
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl shadow-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
                {isRTL ? "وصف الخدمة" : "Service Description"}
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                {service.description}
              </p>
            </div>
            
            {service.tags && service.tags.length > 0 && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
                  {isRTL ? "العلامات" : "Tags"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, i) => (
                    <span key={i} className="bg-surface-container-low border border-outline-variant text-on-surface-variant font-label-md px-3 py-1.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Actions & Provider Info */}
          <div className="space-y-lg">
            <div 
              className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl shadow-sm flex flex-col items-center text-center cursor-pointer hover:bg-surface-container-low transition-colors"
              onClick={() => setShowProviderModal(true)}
              title={isRTL ? "عرض الملف الشخصي" : "View Provider Profile"}
            >
              <div className="w-20 h-20 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-headline-md text-3xl mb-4 border-4 border-surface-container-lowest shadow-sm">
                {service.provider?.fullName?.charAt(0) || "P"}
              </div>
              
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                {service.provider?.fullName || "Verified Provider"}
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                {isRTL ? "مقدم خدمة معتمد" : "Verified Provider"}
              </p>

              <div className="w-full border-t border-outline-variant pt-lg mb-lg">
                <div className="flex justify-between items-center mb-sm">
                  <span className="font-body-md text-on-surface-variant">{isRTL ? "سعر الخدمة" : "Service Price"}:</span>
                  <span className="font-title-lg text-title-lg text-primary font-bold">
                    {service.price ? `$${service.price}` : (isRTL ? "سعر متغير" : "Variable")}
                  </span>
                </div>
              </div>

              {(!user || user.role === 'beneficiary') ? (
                <button
                  onClick={() => setShowRfpModal(true)}
                  className="w-full bg-primary text-on-primary font-label-lg text-label-lg px-xl py-4 rounded-xl hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
                >
                  {isRTL ? "طلب عرض سعر (RFP)" : "Request Proposal (RFP)"}
                  <span className={`material-symbols-outlined ${isRTL ? 'rotate-180' : ''}`}>arrow_forward</span>
                </button>
              ) : (
                <div className="w-full bg-surface-variant text-on-surface-variant font-label-md px-xl py-4 rounded-xl text-center">
                  {isRTL ? "متوفر فقط للعملاء" : "Available only for clients"}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* RFP Modal */}
      {showRfpModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg overflow-hidden shadow-lg flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-lg border-b border-outline-variant">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                {isRTL ? "إرسال ملاحظات لطلب الخدمة" : "Send Notes for Request"}
              </h2>
              <button onClick={() => { setShowRfpModal(false); setSubmitSuccess(false); setSubmitError(""); }} className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="p-lg overflow-y-auto">
              {submitSuccess ? (
                <div className="bg-emerald-50 text-emerald-800 p-lg rounded-xl flex flex-col items-center text-center py-xl">
                  <span className="material-symbols-outlined text-5xl mb-4 text-emerald-500">check_circle</span>
                  <h3 className="font-headline-sm text-headline-sm font-semibold mb-2">
                    {isRTL ? "تم إرسال الطلب بنجاح!" : "Request Sent Successfully!"}
                  </h3>
                  <p className="font-body-md">
                    {isRTL ? "سيتواصل معك مقدم الخدمة قريباً بعرض السعر." : "The provider will contact you shortly with a proposal."}
                  </p>
                  <button 
                    onClick={() => { setShowRfpModal(false); setSubmitSuccess(false); }}
                    className="mt-lg bg-emerald-600 text-white font-label-md px-lg py-3 rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    {isRTL ? "إغلاق" : "Close"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRfpSubmit} className="flex flex-col gap-lg">
                  {submitError && (
                    <div className="bg-error-container text-on-error-container p-md rounded-lg font-body-sm">
                      {submitError}
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-on-surface font-semibold">
                      {isRTL ? "ملاحظات إضافية للمشروع (اختياري)" : "Project Notes (Optional)"}
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={isRTL ? "اشرح بشكل مبسط ما تحتاجه من هذه الخدمة..." : "Briefly describe what you need from this service..."}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors min-h-[120px] resize-y"
                    />
                  </div>

                  <div className="flex gap-md pt-sm border-t border-outline-variant mt-sm">
                    <button 
                      type="button" 
                      onClick={() => setShowRfpModal(false)}
                      className="flex-1 py-3 border border-outline-variant text-on-surface font-label-md rounded-xl hover:bg-surface-container-low transition-colors"
                    >
                      {isRTL ? "إلغاء" : "Cancel"}
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-primary text-on-primary font-label-md rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">send</span>
                      )}
                      {isRTL ? "إرسال الطلب" : "Submit Request"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Provider Profile Modal */}
      {showProviderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md overflow-hidden shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-lg border-b border-outline-variant">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                {isRTL ? "الملف الشخصي لمقدم الخدمة" : "Provider Profile"}
              </h2>
              <button onClick={() => setShowProviderModal(false)} className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="p-lg flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-headline-md text-4xl mb-4">
                {service.provider?.fullName?.charAt(0) || "P"}
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">
                {service.provider?.fullName}
              </h3>
              
              {service.provider?.providerProfile?.companyName && (
                <p className="font-body-md text-body-md text-on-surface-variant font-semibold mb-2">
                  {service.provider.providerProfile.companyName}
                </p>
              )}
              
              <div className="w-full text-left bg-surface-container-low p-md rounded-xl mt-md flex flex-col gap-sm">
                {!service.provider?.providerProfile?.description && !service.provider?.country && !service.provider?.providerProfile?.websiteUrl ? (
                  <div className="text-center py-sm text-on-surface-variant font-body-sm italic">
                    {isRTL ? "لم يقم مقدم الخدمة بإضافة تفاصيل إضافية بعد." : "This provider has not added any additional profile details yet."}
                  </div>
                ) : (
                  <>
                    {service.provider?.providerProfile?.description && (
                      <div className="flex items-start gap-sm">
                        <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>info</span>
                        <div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant">{isRTL ? "نبذة" : "About"}</div>
                          <div className="font-body-sm text-body-sm text-on-surface whitespace-pre-wrap">{service.provider.providerProfile.description}</div>
                        </div>
                      </div>
                    )}
                    
                    {service.provider?.country && (
                      <div className="flex items-start gap-sm">
                        <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>location_on</span>
                        <div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant">{isRTL ? "الموقع" : "Location"}</div>
                          <div className="font-body-sm text-body-sm text-on-surface">{service.provider.city ? `${service.provider.city}, ` : ''}{service.provider.country}</div>
                        </div>
                      </div>
                    )}

                    {service.provider?.providerProfile?.websiteUrl && (
                      <div className="flex items-start gap-sm">
                        <span className="material-symbols-outlined text-on-surface-variant mt-[2px]" style={{ fontSize: "20px" }}>language</span>
                        <div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant">{isRTL ? "الموقع الإلكتروني" : "Website"}</div>
                          <a href={service.provider.providerProfile.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-body-sm text-body-sm text-secondary hover:underline break-all">
                            {service.provider.providerProfile.websiteUrl}
                          </a>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="p-md border-t border-outline-variant bg-surface flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowProviderModal(false)}
                className="px-lg py-sm font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors"
              >
                {isRTL ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceDetails;
