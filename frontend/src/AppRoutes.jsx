import { Routes, Route } from "react-router-dom";

import LandingLayout from "./layouts/LandingLayout";
import RegistrationLayout from "./layouts/RegistrationLayout";
import ProfileLayout from "./layouts/MainLayout";

import LandingPage from "./components/pages/LandingPage";

import ProviderLogin from "./components/pages/ProviderLogin";
import BeneficiaryLogin from "./components/pages/BeneficiaryLogin";
import BeneficiarySignup from "./components/pages/BeneficiarySignup";
import ProviderSignup from "./components/pages/ProviderSignup";

import BeneficiaryDashboard from "./components/pages/BeneficiaryDashboard";
import ProviderDashboard from "./components/pages/ProviderDashboard";
import SubmitProposal from "./components/pages/SubmitProposal";
import ServiceRequests from "./components/pages/ServiceRequests";
import Providers from "./components/pages/Providers";
import Profile from "./components/pages/Profile";
import MyProposals from "./components/pages/MyProposals";
import Dashboard from "./components/pages/Dashboard";
import CreateService from "./components/pages/CreateService";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route element={<ProfileLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/beneficiary-dashboard"
          element={<BeneficiaryDashboard />}
        />
        <Route path="/create-service" element={<CreateService />} />

        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/service-requests" element={<ServiceRequests />} />
      </Route>
      <Route path="/my-proposals" element={<MyProposals />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/providers" element={<Providers />} />
      <Route path="/submit-proposal" element={<SubmitProposal />} />
      <Route element={<RegistrationLayout />}>
        <Route path="/provider-login" element={<ProviderLogin />} />
        <Route path="/beneficiary-login" element={<BeneficiaryLogin />} />
        <Route path="/provider-signup" element={<ProviderSignup />} />
        <Route path="/beneficiary-signup" element={<BeneficiarySignup />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
