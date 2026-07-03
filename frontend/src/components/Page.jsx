import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import ProviderLogin from "./pages/ProviderLogin";
import BeneficiaryLogin from "./pages/BeneficiaryLogin";
import ProviderSignup from "./pages/ProviderSignup";
import BeneficiarySignup from "./pages/BeneficiarySignup";
import "./Page.css";

function Page() {
  return (
    <>
      <ul className="nav nav-underline  gap-4 py-2">
        <li className="nav-item ms-5 me-3">
          <NavLink className="nav-link" to="/provider-login">
            Provider Login
          </NavLink>
        </li>

        <li className="nav-item me-3">
          <NavLink className="nav-link" to="/beneficiary-login">
            Client Login
          </NavLink>
        </li>

        <li className="nav-item me-3">
          <NavLink className="nav-link" to="/provider-signup">
            Provider Sign Up
          </NavLink>
        </li>

        <li className="nav-item me-3">
          <NavLink className="nav-link" to="/beneficiary-signup">
            Client Sign Up
          </NavLink>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<Navigate to="/provider-login" replace />} />
        <Route path="/provider-login" element={<ProviderLogin />} />
        <Route path="/beneficiary-login" element={<BeneficiaryLogin />} />
        <Route path="/provider-signup" element={<ProviderSignup />} />
        <Route path="/beneficiary-signup" element={<BeneficiarySignup />} />
      </Routes>
    </>
  );
}
export default Page;
