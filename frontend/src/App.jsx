import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ProviderSignup from "./components/pages/ProviderSignup";
import BeneficiarySignup from "./components/pages/BeneficiarySignup";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import ProposalHistory from "./components/pages/ProposalHistory";
import ContractManager from "./components/pages/ContractManager";
import Analytics from "./components/pages/Analytics";
import RfpDetails from "./components/pages/RfpDetails";
import RfpForm from "./components/pages/RfpForm";
import ChatPortal from "./components/pages/ChatPortal";
import Faq from "./components/pages/Faq";
import AdminPanel from "./components/pages/AdminPanel";
import BrowseRequests from "./components/pages/BrowseRequests";
import BrowseServiceCatalog from "./components/pages/BrowseServiceCatalog";
import LandingPage from "./components/pages/LandingPage";
import Profile from "./components/pages/Profile";

// Protected Route Guard
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

// Role-restricted Route Guard
function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

// Public-only Route Guard (redirects to dashboard if logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  const { user, loading } = useAuth();
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language.startsWith('ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Loading Maqsad Workspace...
          </p>
        </div>
      </div>
    );
  }

  // Provider gets sidebar layout (no top nav, no shared footer)
  const isProvider = user?.role === "provider";

  return (
    <div className={`${isProvider ? "" : "flex flex-col min-h-screen"} bg-background`}>
      {/* Top Nav — only for non-providers */}
      <Nav />

      <main className={isProvider ? "" : "flex-grow"}>
        <Routes>
          {/* Public Landing Page */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LandingPage />
              )
            }
          />

          {/* Guest / Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/provider-login" element={<Navigate to="/login" replace />} />
          <Route path="/beneficiary-login" element={<Navigate to="/login" replace />} />
          <Route path="/provider-signup" element={<PublicRoute><ProviderSignup /></PublicRoute>} />
          <Route path="/beneficiary-signup" element={<PublicRoute><BeneficiarySignup /></PublicRoute>} />

          {/* Browse pages — accessible to all logged-in users */}
          <Route path="/browse-requests" element={<PrivateRoute><BrowseRequests /></PrivateRoute>} />
          <Route path="/browse-services" element={<BrowseServiceCatalog />} />

          {/* Authenticated Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/rfp/:id" element={<PrivateRoute><RfpDetails /></PrivateRoute>} />
          <Route path="/rfp/new" element={<RoleRoute allowedRoles={["provider"]}><RfpForm /></RoleRoute>} />
          <Route path="/rfp/edit/:id" element={<RoleRoute allowedRoles={["provider"]}><RfpForm /></RoleRoute>} />
          <Route path="/chat" element={<PrivateRoute><ChatPortal /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Provider Sidebar Routes */}
          <Route path="/proposal-history" element={<RoleRoute allowedRoles={["provider"]}><ProposalHistory /></RoleRoute>} />
          <Route path="/contract-manager" element={<RoleRoute allowedRoles={["provider"]}><ContractManager /></RoleRoute>} />
          <Route path="/analytics" element={<RoleRoute allowedRoles={["provider"]}><Analytics /></RoleRoute>} />
          <Route path="/faq" element={<PrivateRoute><Faq /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminPanel /></RoleRoute>} />

          {/* Fallbacks */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
      </main>

      {/* Footer — only for non-providers (provider has its own footer in Dashboard) */}
      {!isProvider && <Footer />}
    </div>
  );
}

export default App;
