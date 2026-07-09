import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import illustration2 from "../../assets/illustration2.png";
import logo from "../../assets/maqsad-logo.png";

function BeneficiarySignup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailInUse, setEmailInUse] = useState(false);
  const [loading, setLoading] = useState(false);

  const isRTL = i18n.language.startsWith("ar");
  const fontStyle = isRTL ? { fontFamily: "Tajawal, sans-serif" } : { fontFamily: "Inter, sans-serif" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailInUse(false);

    if (!fullName || !email || !password || !confirmPassword) {
      setError(t("auth.clientSignup.errorMissing"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.clientSignup.errorMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("auth.clientSignup.errorShort"));
      return;
    }

    setLoading(true);
    try {
      await register(email, password, fullName, "beneficiary");
      navigate("/dashboard", { state: { justRegistered: true } });
    } catch (err) {
      console.error(err);
      const msg = err.message || "";
      if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("email already") || msg.toLowerCase().includes("in use")) {
        setEmailInUse(true);
        setError(t("auth.clientSignup.errorEmailInUse"));
      } else {
        setError(msg || t("auth.clientSignup.errorFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background" style={fontStyle}>
      
      {/* Left Info Column */}
      <div 
        className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden" 
        style={{ 
          backgroundImage: `url(${illustration2})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: "100vh" 
        }}
      >
        <div className="absolute inset-0 bg-[#0f172a]/55 z-0"></div>
        
        <div className="relative z-10">
          <Link className="font-headline-md text-headline-md font-bold text-white text-decoration-none flex items-center gap-2 w-fit" to="/">
            <img src={logo} alt="Maqsad Logo" className="h-8 w-auto" />
            <span className="font-bold font-headline-md text-white">Maqsad</span>
          </Link>
        </div>

        <div className={`relative z-10 my-auto flex flex-col gap-md max-w-lg ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-white text-4xl font-bold leading-tight" dangerouslySetInnerHTML={{ __html: t("auth.clientSignup.heroTitle") }}></h1>
          <p className="text-slate-300 text-lg">
            {t("auth.clientSignup.heroSubtitle")}
          </p>
          
          <div className="flex flex-col gap-sm mt-md">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-[#14b8a6]/20 text-[#14b8a6] rounded-[40%] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">apartment</span>
              </div>
              <span className="text-white text-lg">{t("auth.clientSignup.heroFeature1")}</span>
            </div>
            
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-[#14b8a6]/20 text-[#14b8a6] rounded-[40%] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">check</span>
              </div>
              <span className="text-white text-lg">{t("auth.clientSignup.heroFeature2")}</span>
            </div>
          </div>
        </div>

        <div className={`relative z-10 text-white/60 font-body-sm ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </div>
      </div>

      {/* Right Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#f8fafc]">
        <div className="w-full max-w-[450px] flex flex-col gap-lg">
          
          <div className="flex flex-col gap-xs">
            <div className={`rounded-[20px] w-fit bg-[#e4e9e9] px-4 py-2 border-0 ${isRTL ? 'self-start' : 'self-start'}`}>
              <span className="inline-flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <span className="material-symbols-outlined text-[22px] text-slate-700">apartment</span>
                {t("auth.clientSignup.portalTitle")}
              </span>
            </div>
            <h2 className={`text-3xl text-on-surface font-bold mt-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t("auth.clientSignup.title")}</h2>
            <p className={`text-slate-500 font-body-md ${isRTL ? 'text-right' : 'text-left'}`}>{t("auth.clientSignup.subtitle")}</p>
          </div>

          {error && (
            <div className={`p-md rounded-xl border font-body-sm flex gap-3 items-start ${emailInUse ? 'bg-red-50 border-red-200 text-red-800' : 'bg-error-container text-on-error-container border-error/10'}`}>
              <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0" style={{ color: emailInUse ? '#b91c1c' : 'inherit' }}>error</span>
              <div className="flex flex-col gap-1">
                <span>{error}</span>
                {emailInUse && (
                  <Link to="/login" className="text-red-700 hover:text-red-900 font-semibold underline text-decoration-none">
                    {t("auth.clientSignup.signIn")} →
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="border border-[#e2e8f0] p-6.5 rounded-2xl shadow-sm bg-white flex flex-col gap-4">
            
            {/* Company Name */}
            <div className="flex flex-col gap-xs">
              <label className={`font-semibold text-sm text-[#0b1c30] ${isRTL ? 'text-right' : 'text-left'}`} htmlFor="name-input">
                {t("auth.clientSignup.nameLabel")} <span className="text-error">*</span>
              </label>
              <input
                id="name-input"
                type="text"
                className="w-full px-4 py-3 bg-white border border-[#cbd5e1] rounded-xl focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none transition-colors font-body-md text-body-md text-on-surface"
                placeholder={t("auth.clientSignup.namePlaceholder")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Business Email */}
            <div className="flex flex-col gap-xs">
              <label className={`font-semibold text-sm ${emailInUse ? 'text-red-600' : 'text-[#0b1c30]'} ${isRTL ? 'text-right' : 'text-left'}`} htmlFor="email-input">
                {t("auth.clientSignup.emailLabel")} <span className="text-error">*</span>
              </label>
              <input
                id="email-input"
                type="email"
                className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-colors font-body-md text-body-md text-on-surface ${emailInUse ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-300 bg-red-50' : 'border-[#cbd5e1] focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6]'}`}
                placeholder={t("auth.clientSignup.emailPlaceholder")}
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailInUse) { setEmailInUse(false); setError(""); } }}
              />
              {emailInUse && (
                <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  {t("auth.clientSignup.errorEmailInUse")}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-xs">
              <label className={`font-semibold text-sm text-[#0b1c30] ${isRTL ? 'text-right' : 'text-left'}`} htmlFor="password-input">
                {t("auth.clientSignup.passwordLabel")} <span className="text-error">*</span>
              </label>
              <input
                id="password-input"
                type="password"
                className="w-full px-4 py-3 bg-white border border-[#cbd5e1] rounded-xl focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none transition-colors font-body-md text-body-md text-on-surface"
                placeholder={t("auth.clientSignup.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-xs">
              <label className={`font-semibold text-sm text-[#0b1c30] ${isRTL ? 'text-right' : 'text-left'}`} htmlFor="confirm-input">
                {t("auth.clientSignup.confirmLabel")} <span className="text-error">*</span>
              </label>
              <input
                id="confirm-input"
                type="password"
                className="w-full px-4 py-3 bg-white border border-[#cbd5e1] rounded-xl focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none transition-colors font-body-md text-body-md text-on-surface"
                placeholder={t("auth.clientSignup.confirmPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#14b8a6] hover:bg-[#0ea897] text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2 border-0 mt-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  {t("auth.clientSignup.loadingButton")}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {isRTL ? t("auth.clientSignup.submitButton").replace("→", "←") : t("auth.clientSignup.submitButton")}
                </div>
              )}
            </button>
          </form>

          <p className="text-center font-body-sm text-body-sm text-slate-500 mt-2">
            {t("auth.clientSignup.hasAccount")}{" "}
            <Link to="/login" className="text-[#14b8a6] hover:text-[#0ea897] font-semibold text-decoration-none">
              {t("auth.clientSignup.signIn")}
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default BeneficiarySignup;
