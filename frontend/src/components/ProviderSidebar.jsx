import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import logo from "../assets/maqsad-logo.png";

function ProviderSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isCollapsed]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

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

  const calculateProfileProgress = () => {
    if (!user) return 0;
    
    let fields = [];
    if (user.role === "provider") {
      const pp = user.providerProfile || {};
      fields = [
        user.fullName,
        user.phone,
        user.country,
        user.city,
        pp.companyName,
        pp.websiteUrl,
        pp.serviceTags,
        pp.description
      ];
    } else {
      const bp = user.beneficiaryProfile || {};
      fields = [
        user.fullName,
        user.phone,
        user.country,
        user.city,
        bp.organizationName,
        bp.industry,
        bp.companySize,
        bp.bio
      ];
    }
    
    const filledFields = fields.filter(field => {
      if (Array.isArray(field)) return field.length > 0;
      if (typeof field === 'string') return field.trim().length > 0;
      return !!field;
    });
    
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const profileProgress = calculateProfileProgress();

  const sideNavLink = ({ isActive }) =>
    `flex items-center gap-md px-md py-sm rounded-lg transition-all cursor-pointer ${
      isActive
        ? "bg-secondary-container text-on-secondary-container"
        : "text-on-surface-variant hover:bg-surface-container-high"
    }`;

  return (
    <>
      <style>{`
        :root {
          --sidebar-width: ${isCollapsed ? '5rem' : '16rem'};
        }
        @media (min-width: 768px) {
          .provider-main-content {
            margin-left: ${isRTL ? '0' : 'var(--sidebar-width)'};
            margin-right: ${isRTL ? 'var(--sidebar-width)' : '0'};
            transition: margin 300ms ease;
          }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <nav className={`hidden md:flex flex-col h-screen fixed top-0 bg-surface border-outline-variant py-md px-sm space-y-sm z-50 transition-all duration-300 ${isCollapsed ? 'w-20 items-center' : 'w-64'} ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}`}>
        
        {/* Toggle Button */}
        <button 
          onClick={toggleSidebar} 
          className={`absolute top-6 ${isRTL ? '-left-3' : '-right-3'} bg-surface border border-outline-variant rounded-full w-6 h-6 flex items-center justify-center z-50 hover:bg-surface-container-high text-on-surface-variant shadow-sm`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isCollapsed ? (isRTL ? 'chevron_left' : 'chevron_right') : (isRTL ? 'chevron_right' : 'chevron_left')}
          </span>
        </button>

        {/* Brand + Profile */}
        <div className={`mb-lg w-full flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
          <div className={`flex items-center gap-xs mb-xs ${isCollapsed ? 'justify-center' : ''}`}>
            <img src={logo} alt={t("sidebar.maqsad")} className="h-8 w-auto shrink-0" />
            {!isCollapsed && (
              <h1 className="font-headline-sm text-headline-sm font-extrabold text-primary m-0 whitespace-nowrap overflow-hidden">
                {t("sidebar.maqsad")}
              </h1>
            )}
          </div>
          <div className={`flex items-center gap-sm mt-md p-sm bg-surface-container-low rounded-lg border border-outline-variant w-full ${isCollapsed ? 'justify-center p-2' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant overflow-hidden shrink-0">
              <span className="font-label-md text-label-md text-on-surface font-bold uppercase">
                {user?.fullName?.charAt(0) || (isRTL ? "م" : "P")}
              </span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  {user?.fullName || t("sidebar.provider")}
                </div>
                <div className="font-label-sm text-label-sm text-secondary flex items-center mt-xs whitespace-nowrap">
                  <span
                    className={`material-symbols-outlined text-[14px] ${isRTL ? 'ml-[2px]' : 'mr-[2px]'}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  {t("sidebar.verifiedProvider")}
                </div>
              </div>
            )}
          </div>
          
          {/* Profile Setup Progress Bar */}
          {!isCollapsed && profileProgress < 100 && (
            <div 
              className="mt-sm p-sm bg-surface-container-low rounded-lg border border-outline-variant w-full cursor-pointer hover:border-secondary transition-colors group"
              onClick={() => navigate('/profile?edit=true')}
              title={t("sidebar.finishSetup")}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium group-hover:text-secondary transition-colors">
                  {t("sidebar.finishSetup")}
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-bold">
                  {profileProgress}%
                </span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-secondary h-1.5 rounded-full transition-all duration-500 ease-in-out" 
                  style={{ width: `${profileProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Post New Service CTA */}
        <NavLink
          to="/profile"
          className={`w-full bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md rounded-lg flex items-center transition-colors mb-md text-decoration-none ${isCollapsed ? 'py-sm justify-center' : 'py-sm px-md justify-center'}`}
          title={isCollapsed ? (isRTL ? "تحديث الخدمات" : "Update Profile & Services") : undefined}
        >
          <span className={`material-symbols-outlined text-[18px] ${!isCollapsed ? (isRTL ? 'ml-sm' : 'mr-sm') : ''}`}>edit</span>
          {!isCollapsed && <span>{isRTL ? "تحديث الخدمات" : "Update Profile & Services"}</span>}
        </NavLink>

        {/* Navigation Items */}
        <div className="flex-grow space-y-xs overflow-y-auto w-full">
          <NavLink className={sideNavLink} to="/dashboard" title={isCollapsed ? t("sidebar.overview") : undefined}>
            <span className="material-symbols-outlined shrink-0">dashboard</span>
            {!isCollapsed && <span className="font-label-md text-label-md whitespace-nowrap">{t("sidebar.overview")}</span>}
          </NavLink>
          <NavLink className={sideNavLink} to="/provider-services" title={isCollapsed ? (isRTL ? "خدماتي" : "My Services") : undefined}>
            <span className="material-symbols-outlined shrink-0">design_services</span>
            {!isCollapsed && <span className="font-label-md text-label-md whitespace-nowrap">{isRTL ? "خدماتي" : "My Services"}</span>}
          </NavLink>
          <NavLink className={sideNavLink} to="/chat" title={isCollapsed ? t("sidebar.messages") : undefined}>
            <span className="material-symbols-outlined shrink-0">chat</span>
            {!isCollapsed && <span className="font-label-md text-label-md whitespace-nowrap">{t("sidebar.messages")}</span>}
          </NavLink>
          <NavLink className={sideNavLink} to="/proposal-history" title={isCollapsed ? t("sidebar.proposalHistory") : undefined}>
            <span className="material-symbols-outlined shrink-0">description</span>
            {!isCollapsed && <span className="font-label-md text-label-md whitespace-nowrap">{t("sidebar.proposalHistory")}</span>}
          </NavLink>
          <NavLink className={sideNavLink} to="/profile" title={isCollapsed ? t("sidebar.profile") : undefined}>
            <span className="material-symbols-outlined shrink-0">person</span>
            {!isCollapsed && <span className="font-label-md text-label-md whitespace-nowrap">{t("sidebar.profile")}</span>}
          </NavLink>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto space-y-xs pt-md border-t border-outline-variant w-full">
          <button
            onClick={toggleLanguage}
            className={`w-full flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer ${isCollapsed ? 'justify-center' : (isRTL ? 'text-right' : 'text-left')}`}
            title={isCollapsed ? (isRTL ? t("sidebar.english") : t("sidebar.arabic")) : undefined}
          >
            <span className="material-symbols-outlined shrink-0">language</span>
            {!isCollapsed && <span className="font-label-md text-label-md whitespace-nowrap">{isRTL ? t("sidebar.english") : t("sidebar.arabic")}</span>}
          </button>
          <NavLink
            className={sideNavLink}
            to="/faq"
            title={isCollapsed ? t("sidebar.helpCenter") : undefined}
          >
            <span className="material-symbols-outlined shrink-0">help</span>
            {!isCollapsed && <span className="font-label-md text-label-md whitespace-nowrap">{t("sidebar.helpCenter")}</span>}
          </NavLink>
          <button
            className={`w-full flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer ${isCollapsed ? 'justify-center' : (isRTL ? 'text-right' : 'text-left')}`}
            onClick={handleLogout}
            title={isCollapsed ? t("sidebar.logout") : undefined}
          >
            <span className="material-symbols-outlined shrink-0">logout</span>
            {!isCollapsed && <span className="font-label-md text-label-md whitespace-nowrap">{t("sidebar.logout")}</span>}
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
