import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import logo from "../assets/maqsad-logo.png";

function ProviderSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("ar") ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const isRTL = i18n.language.startsWith("ar");

  const sideNavLink = ({ isActive }) =>
    `flex items-center gap-md px-md py-sm rounded-lg transition-all cursor-pointer ${
      isActive
        ? "bg-secondary-container text-on-secondary-container"
        : "text-on-surface-variant hover:bg-surface-container-high"
    }`;

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`hidden md:flex flex-col h-screen w-64 fixed top-0 bg-surface border-outline-variant p-md space-y-sm z-50 ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}`}>
        {/* Brand + Profile */}
        <div className="mb-lg">
          <div className="flex items-center gap-xs mb-xs">
            <img src={logo} alt={t("sidebar.maqsad")} className="h-8 w-auto" />
            <h1 className="font-headline-sm text-headline-sm font-extrabold text-primary m-0">
              {t("sidebar.maqsad")}
            </h1>
          </div>
          <div className="flex items-center gap-sm mt-md p-sm bg-surface-container-low rounded-lg border border-outline-variant">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant overflow-hidden">
              <span className="font-label-md text-label-md text-on-surface font-bold uppercase">
                {user?.fullName?.charAt(0) || (isRTL ? "م" : "P")}
              </span>
            </div>
            <div>
              <div className="font-label-md text-label-md text-on-surface font-semibold">
                {user?.fullName || t("sidebar.provider")}
              </div>
              <div className="font-label-sm text-label-sm text-secondary flex items-center mt-xs">
                <span
                  className={`material-symbols-outlined text-[14px] ${isRTL ? 'ml-[2px]' : 'mr-[2px]'}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                {t("sidebar.verifiedProvider")}
              </div>
            </div>
          </div>
        </div>

        {/* Post New Service CTA */}
        <NavLink
          to="/profile"
          className="w-full bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md py-sm px-md rounded-lg flex items-center justify-center transition-colors mb-md text-decoration-none"
        >
          <span className={`material-symbols-outlined text-[18px] ${isRTL ? 'ml-sm' : 'mr-sm'}`}>edit</span>
          {isRTL ? "تحديث الخدمات" : "Update Profile & Services"}
        </NavLink>

        {/* Navigation Items */}
        <div className="flex-grow space-y-xs overflow-y-auto">
          <NavLink className={sideNavLink} to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">{t("sidebar.overview")}</span>
          </NavLink>
          <NavLink className={sideNavLink} to="/provider-services">
            <span className="material-symbols-outlined">design_services</span>
            <span className="font-label-md text-label-md">{isRTL ? "خدماتي" : "My Services"}</span>
          </NavLink>
          <NavLink className={sideNavLink} to="/chat">
            <span className="material-symbols-outlined">chat</span>
            <span className="font-label-md text-label-md">{t("sidebar.messages")}</span>
          </NavLink>
          <NavLink className={sideNavLink} to="/proposal-history">
            <span className="material-symbols-outlined">description</span>
            <span className="font-label-md text-label-md">{t("sidebar.proposalHistory")}</span>
          </NavLink>
          <NavLink className={sideNavLink} to="/contract-manager">
            <span className="material-symbols-outlined">handshake</span>
            <span className="font-label-md text-label-md">{t("sidebar.contractManager")}</span>
          </NavLink>
          <NavLink className={sideNavLink} to="/analytics">
            <span className="material-symbols-outlined">insights</span>
            <span className="font-label-md text-label-md">{t("sidebar.analytics")}</span>
          </NavLink>
          <NavLink className={sideNavLink} to="/profile">
            <span className="material-symbols-outlined">person</span>
            <span className="font-label-md text-label-md">{t("sidebar.profile")}</span>
          </NavLink>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto space-y-xs pt-md border-t border-outline-variant">
          <button
            onClick={toggleLanguage}
            className={`w-full flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <span className="material-symbols-outlined">language</span>
            <span className="font-label-md text-label-md">{isRTL ? t("sidebar.english") : t("sidebar.arabic")}</span>
          </button>
          <NavLink
            className={sideNavLink}
            to="/faq"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-md text-label-md">{t("sidebar.helpCenter")}</span>
          </NavLink>
          <button
            className={`w-full flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">{t("sidebar.logout")}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <header className="md:hidden flex justify-between items-center px-lg py-sm bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-40">
        <div className="flex items-center gap-xs font-headline-md text-headline-md font-bold text-on-surface">
          <img src={logo} alt={t("sidebar.maqsad")} className="h-6 w-auto" />
          <span>{t("sidebar.maqsad")}</span>
        </div>
        <div className="flex items-center gap-md">
          <button onClick={toggleLanguage} className="text-on-surface-variant">
            <span className="material-symbols-outlined">language</span>
          </button>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">
            notifications
          </span>
          <Link to="/profile" className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant text-decoration-none">
            <span className="font-label-sm text-label-sm text-on-surface font-bold uppercase">
              {user?.fullName?.charAt(0) || (isRTL ? "م" : "P")}
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant z-50 flex justify-around items-center h-16 px-md">
        <NavLink
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full ${
              isActive ? "text-secondary" : "text-on-surface-variant hover:text-primary"
            }`
          }
          to="/dashboard"
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <div className="bg-secondary-container px-4 py-1 rounded-full mb-1">
                  <span
                    className="material-symbols-outlined text-[24px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    dashboard
                  </span>
                </div>
              ) : (
                <span className="material-symbols-outlined text-[24px] mb-1">dashboard</span>
              )}
              <span className="font-label-sm text-label-sm text-[10px]">{t("sidebar.overview")}</span>
            </>
          )}
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full ${
              isActive ? "text-secondary" : "text-on-surface-variant hover:text-primary"
            }`
          }
          to="/provider-services"
        >
          <span className="material-symbols-outlined text-[24px] mb-1">design_services</span>
          <span className="font-label-sm text-label-sm text-[10px]">{isRTL ? "خدماتي" : "Services"}</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full ${
              isActive ? "text-secondary" : "text-on-surface-variant hover:text-primary"
            }`
          }
          to="/profile"
        >
          <span className="material-symbols-outlined text-[24px] mb-1">edit</span>
          <span className="font-label-sm text-label-sm text-[10px]">{isRTL ? "الملف الشخصي" : "My Profile"}</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full ${
              isActive ? "text-secondary" : "text-on-surface-variant hover:text-primary"
            }`
          }
          to="/chat"
        >
          <span className="material-symbols-outlined text-[24px] mb-1">chat</span>
          <span className="font-label-sm text-label-sm text-[10px]">{t("sidebar.messages")}</span>
        </NavLink>
        <a className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-[24px] mb-1">menu</span>
          <span className="font-label-sm text-label-sm text-[10px]">{t("sidebar.more")}</span>
        </a>
      </nav>
    </>
  );
}

export default ProviderSidebar;
