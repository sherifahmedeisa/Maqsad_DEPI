import { Routes, Route } from "react-router-dom";

import LandingLayout from "./layouts/LandingLayout";
import RegistrationLayout from "./layouts/RegistrationLayout";

import LandingPage from "./components/pages/LandingPage";
import BeneficiaryDashboard from "./components/pages/BeneficiaryDashboard";

import ProviderLogin from "./components/pages/ProviderLogin";
import BeneficiaryLogin from "./components/pages/BeneficiaryLogin";
import BeneficiarySignup from "./components/pages/BeneficiarySignup";
import ProviderSignup from "./components/pages/ProviderSignup";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>
      {/* <Route element={<MainLayout />}>
       
        <Route
          path="/beneficiary/dashboard"
          element={<BeneficiaryDashboard />}
        />
      </Route> */}
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
