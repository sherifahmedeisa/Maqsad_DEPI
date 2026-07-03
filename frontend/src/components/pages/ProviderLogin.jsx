import "../LoginForm.css";
import illustration1 from "../../assets/illustration1.png";
import "./ProviderLogin.css";
import { useState } from "react";

function ProviderLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container-fluid  ">
      <div className="row h-100 ">
        <div className="col-lg-6 left-side d-flex flex-column justify-content-between d-none d-lg-flex p-5">
          <div className="d-flex align-items-center">
            {/* <div className="square footer-square me-2">
              <div className="circle footer-circle"></div>
            </div>

            <h4 className="text-white fw-bold m-0">Maqsad</h4> */}
          </div>

          <div>
            <p className="text-white  display-6 fw-bold">
              Join 10,000+ verified
              <br />
              service providers
            </p>

            <p className="text-secondary fs-4 mt-3">
              Connect with enterprise clients, manage projects, and grow your
              business on one unified platform.
            </p>

            <div className="mt-4">
              <div className="feature d-flex align-items-center mb-3 ">
                <div className="icon-circle d-flex align-items-center justify-content-center me-3">
                  <span className="material-symbols-outlined picon">
                    shield
                  </span>
                </div>
                <span text-white fs-5>
                  Verified business credentials
                </span>
              </div>
              <div className="feature d-flex align-items-center mb-3 ">
                <div className="icon-circle d-flex align-items-center justify-content-center me-3">
                  <span class="material-symbols-outlined picon">language</span>
                </div>
                <span text-white fs-5>
                  Performance-based visibility
                </span>
              </div>
              <div className="feature d-flex align-items-center mb-3 ">
                <div className="icon-circle d-flex align-items-center justify-content-center me-3">
                  <span class="material-symbols-outlined picon">star</span>
                </div>
                <span text-white fs-5>
                  Access to global enterprise clients
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="col-lg-6 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#f8fafc" }}
        >
          <div className="login-card">
            <div className="p">
              <span className="portal-badge portal-badge d-inline-flex align-items-center gap-2">
                <span class="material-symbols-outlined picon">work</span>
                Service Provider Portal
              </span>
            </div>

            <h1 className="mt-4 fw-bold">Welcome back</h1>
            <p className="text-secondary mb-4">
              Sign in to your provider account to manage projects.
            </p>
            <form className="border p-4 rounded-4 shadow-sm bg-white ">
              <div className="mb-3 position-relative">
                <label className="form-label fw-semibold">
                  Business Email <span className="text-info">*</span>
                </label>
                <span className="material-symbols-outlined input-icon text-secondary">
                  mail
                </span>
                <input
                  type="email"
                  className="form-control ps-5"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3 position-relative">
                <label className="form-label fw-semibold">
                  Password <span className="text-info">*</span>
                </label>
                <span class="material-symbols-outlined input-icon">
                  password
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control ps-5 pe-5"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-secondary">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember"
                  />

                  <label className="form-check-label" htmlFor="remember">
                    Remember me
                  </label>
                </div>

                <a href="#" className="text-decoration-none s ">
                  Forgot password?
                </a>
              </div>

              <button className="btn btn-info w-100 text-white fw-semibold py-3 rounded-pill">
                Sign In to Provider Portal →
              </button>

              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1" />
                <span className="mx-3 text-secondary">New to Maqsad?</span>
                <hr className="flex-grow-1" />
              </div>

              <button
                type="button"
                className="btn btn-light border w-100 py-3 rounded-pill fw-semibold"
              >
                Create a Provider Account
              </button>
            </form>

            <p className="text-center mt-4">
              Looking to hire services?
              <a href="#" className="text-decoration-none ms-1 s">
                Sign in as a client
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderLogin;
