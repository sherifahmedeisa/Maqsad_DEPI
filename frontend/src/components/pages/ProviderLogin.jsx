import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import illustration1 from "../../assets/illustration1.png";

function ProviderLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill out both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid credentials. Please try again.");
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
          backgroundImage: `url(${illustration1})`, 
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
            Join 10,000+ verified
            <br />
            service providers
          </h1>
          <p className="text-slate-300 text-lg">
            Connect with enterprise clients, manage projects, and grow your business on one unified platform.
          </p>
          
          <div className="flex flex-col gap-sm mt-md">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-[#14b8a6]/20 text-[#14b8a6] rounded-[40%] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">shield</span>
              </div>
              <span className="text-white text-lg">Verified business credentials</span>
            </div>
            
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-[#14b8a6]/20 text-[#14b8a6] rounded-[40%] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">language</span>
              </div>
              <span className="text-white text-lg">Performance-based visibility</span>
            </div>

            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-[#14b8a6]/20 text-[#14b8a6] rounded-[40%] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">star</span>
              </div>
              <span className="text-white text-lg">Access to global enterprise clients</span>
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
            <div className="rounded-[20px] w-fit bg-[#e1f3f3] px-4 py-2 border-0">
              <span className="inline-flex items-center gap-2 text-[#14b8a6] font-semibold text-sm">
                <span className="material-symbols-outlined text-[22px]">work</span>
                Service Provider Portal
              </span>
            </div>
            <h2 className="text-3xl text-on-surface font-bold mt-4">Welcome back</h2>
            <p className="text-slate-500 font-body-md">Sign in to your provider account to manage projects.</p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-md rounded-lg border border-error/10 font-body-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="border border-[#e2e8f0] p-6.5 rounded-2xl shadow-sm bg-white flex flex-col gap-4">
            
            {/* Business Email */}
            <div className="flex flex-col gap-xs">
              <label className="font-semibold text-sm text-[#0b1c30]" htmlFor="email-input">
                Business Email <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#14b8a6] text-xl">mail</span>
                <input
                  id="email-input"
                  type="email"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#cbd5e1] rounded-xl focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none transition-colors font-body-md text-body-md text-on-surface"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-xs">
              <label className="font-semibold text-sm text-[#0b1c30]" htmlFor="password-input">
                Password <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#14b8a6] text-xl">lock</span>
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3 bg-white border border-[#cbd5e1] rounded-xl focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none transition-colors font-body-md text-body-md text-on-surface"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center text-sm my-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-[#14b8a6] focus:ring-[#14b8a6] cursor-pointer" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-[#14b8a6] hover:text-[#0ea897] font-semibold text-decoration-none">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#14b8a6] hover:bg-[#0ea897] text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2 border-0"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Signing In...
                </>
              ) : (
                "Sign In to Provider Portal →"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-2 text-on-surface-variant font-body-sm text-body-sm">
              <div className="flex-1 h-px bg-outline-variant"></div>
              <span className="mx-3 text-slate-500">New to Maqsad?</span>
              <div className="flex-1 h-px bg-outline-variant"></div>
            </div>

            {/* Signup Link */}
            <Link
              to="/provider-signup"
              className="w-full py-3 border border-outline-variant hover:bg-surface-container-low rounded-full font-semibold text-center text-decoration-none text-slate-700 block transition-colors"
            >
              Create a Provider Account
            </Link>
          </form>

          <p className="text-center font-body-sm text-body-sm text-slate-500 mt-2">
            Looking to hire services?
            <Link to="/beneficiary-login" className="text-[#14b8a6] hover:text-[#0ea897] font-semibold ml-1 text-decoration-none">
              Sign in as a client
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default ProviderLogin;
