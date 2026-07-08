import "./ProviderSignup.css";
import ProviderLeftSide from "./ProviderLeftSide";
import { useState } from "react";
import "../Form.css";

function ProviderSignup() {
  const [showConfirm, setShowConfirm] = useState(false);
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
              <span className=" portal-badge d-inline-flex align-items-center gap-2">
                <span className="material-symbols-outlined picon">work</span>
                Service Provider Portal
              </span>
            </div>
            <h2 className="mt-4 fw-bold">Create your provider account</h2>
            <p className="text-secondary mb-4">
              Join our network of verified enterprise service providers.
            </p>
            <form className="border rounded-4 shadow-sm bg-white p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Full Name <span className="text-info">*</span>
                  </label>
                  <div className="position-relative">
                    <span className="material-symbols-outlined input-icon2 ">
                      person
                    </span>
                    <input
                      type="text"
                      className="form-control custom-input ps-5"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Company Name <span className="text-info">*</span>
                  </label>
                  <div className="position-relative">
                    <span className="material-symbols-outlined input-icon2">
                      apartment
                    </span>
                    <input
                      type="text"
                      className="form-control custom-input ps-5"
                      placeholder="Company Name"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Business Email <span className="text-info">*</span>
                  </label>
                  <div className="position-relative">
                    <span className="material-symbols-outlined input-icon2">
                      mail
                    </span>
                    <input
                      type="email"
                      className="form-control custom-input ps-5"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Phone Number <span className="text-info">*</span>
                  </label>
                  <div className="position-relative">
                    <span className="material-symbols-outlined input-icon2">
                      phone
                    </span>
                    <input
                      type="text"
                      className="form-control custom-input ps-5"
                      placeholder="+00 000 000 0000"
                    />
                  </div>
                </div>
                {/* <div className="col-12">
                  <label className="form-label fw-semibold">
                    Service Category <span className="text-info">*</span>
                  </label>
                  <select className="form-select custom-input">
                    <option>Select your primary service</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Years of Experience <span className="text-info">*</span>
                  </label>
                  <select className="form-select custom-input">
                    <option>Select experience range</option>
                  </select>
                </div> */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Password <span className="text-info">*</span>
                  </label>
                  <div className="position-relative">
                    <span className="material-symbols-outlined input-icon2">
                      lock
                    </span>
                    <input
                      type="password"
                      className="form-control custom-input ps-5 pe-5"
                      placeholder="Min. 8 characters"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Confirm Password <span className="text-info">*</span>
                  </label>
                  <div className="position-relative">
                    <span className="material-symbols-outlined input-icon2">
                      lock
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="form-control custom-input ps-5 pe-5"
                      placeholder="Repeat password"
                    />
                  </div>
                </div>
                {/* <div className="col-12">
                  <label className="form-label fw-semibold">
                    Business License <span className="text-info">*</span>
                  </label>
                  <input type="file" className="form-control custom-input" />
                </div> */}
                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="terms"
                    />
                    <label className="form-check-label" htmlFor="terms">
                      I agree to Maqsad's <a href="#">Terms of Service</a> and{" "}
                      <a href="#">Privacy Policy</a>
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn w-100 rounded-pill py-3 fw-semibold text-white"
                    style={{ background: "#20C5B5" }}
                  >
                    Create a Provider Account →
                  </button>
                </div>
                <div className="col-12">
                  <p className="text-center mt-4">
                    Already have an account?
                    <a
                      href="/provider-login"
                      className="text-decoration-none ms-1 s"
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </form>
            <p className="text-center mt-4">
              Signing up as a client?
              <a
                href="/beneficiary-signup"
                className="text-decoration-none ms-1 s"
              >
                Create a client account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderSignup;
