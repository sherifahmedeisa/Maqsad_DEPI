import { Link } from "react-router-dom";

import "../Form.css";
import ProviderLeftSide from "./ProviderLeftSide";
import "./ProviderLogin.css";
import { useState } from "react";

function ProviderLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container-fluid  ">
      <div className="row h-100 ">
        <ProviderLeftSide />
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
              <Link
                to="/provider-signup"
                type="button"
                className="btn btn-light border w-100 py-3 rounded-pill fw-semibold"
              >
                Create a Provider Account
              </Link>
            </form>

            <p className="text-center mt-4">
              Looking to hire services?
              <a
                href="/beneficiary-login"
                className="text-decoration-none ms-1 s"
              >
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
