import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import illustration2 from "../../assets/illustration2.png";

function BeneficiarySignup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, fullName, "beneficiary");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed. Email might be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      
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
          <Link className="font-headline-md text-headline-md font-bold text-white text-decoration-none flex items-center gap-2" to="/">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-[#0f172a] rounded-full"></div>
            </div>
            <span className="font-bold font-headline-md text-white">Maqsad</span>
          </Link>
        </div>

        <div className="relative z-10 my-auto flex flex-col gap-md max-w-lg">
          <h1 className="text-white text-4xl font-bold leading-tight">
            Book expert B2B services
            <br />
            for your enterprise
          </h1>
          <p className="text-slate-300 text-lg">
            Browse service offerings, request custom scopes, and book verified professionals — all in one place.
          </p>
          
          <div className="flex flex-col gap-sm mt-md">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-[#14b8a6]/20 text-[#14b8a6] rounded-[40%] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">apartment</span>
              </div>
              <span className="text-white text-lg">Tailored to enterprise procurement</span>
            </div>
            
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-[#14b8a6]/20 text-[#14b8a6] rounded-[40%] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">check</span>
              </div>
              <span className="text-white text-lg">100% verified enterprise partners</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/60 font-body-sm">
          © {new Date().getFullYear()} Maqsad. Reliability, Efficiency, Clarity.
        </div>
      </div>

      {/* Right Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#f8fafc]">
        <div className="w-full max-w-[450px] flex flex-col gap-lg">
          
          <div className="flex flex-col gap-xs">
            <div className="rounded-[20px] w-fit bg-[#e4e9e9] px-4 py-2 border-0">
              <span className="inline-flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <span className="material-symbols-outlined text-[22px] text-slate-700">apartment</span>
                Business Client Portal
              </span>
            </div>
            <h2 className="text-3xl text-on-surface font-bold mt-4">Create Client Account</h2>
            <p className="text-slate-500 font-body-md">Register to publish project RFPs and request proposals.</p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-md rounded-lg border border-error/10 font-body-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="border border-[#e2e8f0] p-6.5 rounded-2xl shadow-sm bg-white flex flex-col gap-4">
            
            {/* Company Name */}
            <div className="flex flex-col gap-xs">
              <label className="font-semibold text-sm text-[#0b1c30]" htmlFor="name-input">
                Company / Full Name <span className="text-error">*</span>
              </label>
              <input
                id="name-input"
                type="text"
                className="w-full px-4 py-3 bg-white border border-[#cbd5e1] rounded-xl focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none transition-colors font-body-md text-body-md text-on-surface"
                placeholder="e.g. Acme Corporation"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Business Email */}
            <div className="flex flex-col gap-xs">
              <label className="font-semibold text-sm text-[#0b1c30]" htmlFor="email-input">
                Business Email <span className="text-error">*</span>
              </label>
              <input
                id="email-input"
                type="email"
                className="w-full px-4 py-3 bg-white border border-[#cbd5e1] rounded-xl focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none transition-colors font-body-md text-body-md text-on-surface"
                placeholder="client@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-xs">
              <label className="font-semibold text-sm text-[#0b1c30]" htmlFor="password-input">
                Password <span className="text-error">*</span>
              </label>
              <input
                id="password-input"
                type="password"
                className="w-full px-4 py-3 bg-white border border-[#cbd5e1] rounded-xl focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none transition-colors font-body-md text-body-md text-on-surface"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-xs">
              <label className="font-semibold text-sm text-[#0b1c30]" htmlFor="confirm-input">
                Confirm Password <span className="text-error">*</span>
              </label>
              <input
                id="confirm-input"
                type="password"
                className="w-full px-4 py-3 bg-white border border-[#cbd5e1] rounded-xl focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none transition-colors font-body-md text-body-md text-on-surface"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#14b8a6] hover:bg-[#0ea897] text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2 border-0 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Creating Account...
                </>
              ) : (
                "Register Client Account →"
              )}
            </button>
          </form>

          <p className="text-center font-body-sm text-body-sm text-slate-500 mt-2">
            Already have a client account?
            <Link to="/beneficiary-login" className="text-[#14b8a6] hover:text-[#0ea897] font-semibold ml-1 text-decoration-none">
              Sign In
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default BeneficiarySignup;
