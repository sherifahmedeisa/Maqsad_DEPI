import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import ProviderLogin from "./pages/ProviderLogin";
import BeneficiaryLogin from "./pages/BeneficiaryLogin";
import ProviderSignup from "./pages/ProviderSignup";
import BeneficiarySignup from "./pages/BeneficiarySignup";
import CreateService from "./pages/CreateService";
import Dashboard from "./pages/Dashboard";
import ServiceRequests from "./pages/ServiceRequests";
import Providers from "./pages/Providers";
import MyProposals from "./pages/MyProposals";
import Profile from "./pages/Profile";
import SubmitProposal from "./pages/SubmitProposal";
import ProviderDashboard from "./pages/ProviderDashboard";
import "./Page.css";

function Page() {
  return (
    <>
      <ul className="nav nav-underline gap-4 py-2">
        <li className="nav-item ms-5 me-3">
          <NavLink className="nav-link" to="/dashboard">
            Dashboard
          </NavLink>
        </li>

        <li className="nav-item me-3">
          <NavLink className="nav-link" to="/service-requests">
            Service Requests
          </NavLink>
        </li>

        <li className="nav-item me-3">
          <NavLink className="nav-link" to="/providers">
            Providers
          </NavLink>
        </li>

        <li className="nav-item me-3">
          <NavLink className="nav-link" to="/my-proposals">
            My Proposals
          </NavLink>
        </li>

        <li className="nav-item me-3">
          <NavLink className="nav-link" to="/create-service">
            Create Service
          </NavLink>
        </li>

        <li className="nav-item me-3">
          <NavLink className="nav-link" to="/profile">
            Profile
          </NavLink>
        </li>

        <li className="nav-item me-3">
          <NavLink className="nav-link" to="/submit-proposal">
            Submit Proposal
          </NavLink>
        </li>

        <li className="nav-item me-3">
          <NavLink className="nav-link" to="/provider-dashboard">
            Provider Dashboard
          </NavLink>
        </li>
      </ul>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/service-requests" element={<ServiceRequests />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/my-proposals" element={<MyProposals />} />
        <Route path="/create-service" element={<CreateService />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/submit-proposal" element={<SubmitProposal />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/provider-login" element={<ProviderLogin />} />
        <Route path="/beneficiary-login" element={<BeneficiaryLogin />} />
        <Route path="/provider-signup" element={<ProviderSignup />} />
        <Route path="/beneficiary-signup" element={<BeneficiarySignup />} />
      </Routes>
    </>
  );
}
export default Page;
