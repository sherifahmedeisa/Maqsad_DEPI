import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import logo from "../assets/maqsad-logo.png";

function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // If beneficiary is logged in, don't render top nav (they use sidebar)
  if (user && user.role === "beneficiary") return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("ar") ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `font-medium hover:text-secondary transition-colors cursor-pointer text-decoration-none text-body-md ${
      isActive
        ? "text-primary font-bold border-b-2 border-secondary pb-1"
        : "text-on-surface-variant"
    }`;

  const isRTL = i18n.language.startsWith("ar");

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant w-full sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-lg max-w-container-max mx-auto h-16">
        {/* Brand + Nav Links */}
        <div className="flex items-center gap-lg">
          <Link
            className="flex items-center gap-sm font-headline-md text-headline-md font-bold text-primary text-decoration-none"
            to={user ? "/dashboard" : "/"}
          >
            <img src={logo} alt={t("nav.maqsad")} className="h-8 w-auto" />
            <span>{t("nav.maqsad")}</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-md font-body-md text-body-md">
            {user ? (
              <>
                <NavLink className={navLinkClass} to="/dashboard">
                  {t("nav.dashboard")}
                </NavLink>
                {user.role === "provider" ? (
                  <NavLink className={navLinkClass} to="/browse-requests">
                    {isRTL ? "تصفح الطلبات" : "Browse Requests"}
                  </NavLink>
                ) : (
                  <NavLink className={navLinkClass} to="/browse-services">
                    {t("nav.browseServices")}
                  </NavLink>
                )}
                <NavLink className={navLinkClass} to="/chat">
                  {t("nav.messages")}
                </NavLink>
                {user.role === "admin" && (
                  <NavLink className={navLinkClass} to="/admin">
                    {t("nav.admin")}
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <NavLink className={navLinkClass} to="/browse-services">
                  {t("nav.browseServices")}
                </NavLink>
                <NavLink className={navLinkClass} to="/login">
                  {t("nav.login")}
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-md">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="hidden md:flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors"
            title={t("nav.language")}
          >
            <span className="material-symbols-outlined text-[20px]">language</span>
            <span>{isRTL ? t("nav.english") : t("nav.arabic")}</span>
          </button>

          {user ? (
            <>
              {/* Search Icon */}
              <button
                aria-label="بحث"
                className="hidden md:flex text-on-surface-variant hover:text-secondary transition-colors"
              >
                <span className="material-symbols-outlined">search</span>
              </button>

              {/* Notification Bell + Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  aria-label={t("nav.notifications")}
                  className="text-on-surface-variant hover:text-secondary transition-colors relative"
                  onClick={() => setShowNotifs(!showNotifs)}
                >
                  <span className="material-symbols-outlined">notifications</span>
                  {/* Badge dot */}
                  <span className={`absolute -top-0.5 ${isRTL ? '-left-0.5' : '-right-0.5'} w-2 h-2 bg-error rounded-full`}></span>
                </button>

                {/* Notification Popover */}
                {showNotifs && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden`}>
                    <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center">
                      <h4 className="font-headline-sm text-headline-sm text-on-surface text-[16px]">
                        {t("nav.notifications")}
                      </h4>
                      <button className="font-label-sm text-label-sm text-secondary hover:underline">
                        {t("nav.markAllRead")}
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {/* Placeholder for notifications (since we don't have real i18n ones yet) */}
                      <div className="px-md py-sm hover:bg-surface-container-low transition-colors border-b border-outline-variant">
                        <p className="font-body-sm text-body-sm text-on-surface">
                          {isRTL ? "تم استلام عرض جديد لطلبك" : "New proposal received for your request"}
                        </p>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {isRTL ? "منذ دقيقتين" : "2 mins ago"}
                        </span>
                      </div>
                    </div>
                    <div className="px-lg py-sm border-t border-outline-variant text-center">
                      <button className="font-label-md text-label-md text-secondary hover:underline">
                        {t("nav.viewAllNotifs")}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar + Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center gap-sm cursor-pointer"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="h-8 w-8 rounded-full bg-surface-variant overflow-hidden flex items-center justify-center border border-outline-variant">
                    <span className="font-label-md text-label-md text-on-surface font-bold uppercase">
                      {user.fullName?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="hidden md:block font-label-md text-label-md text-on-surface">
                    {user.fullName}
                  </span>
                </button>

                {showUserMenu && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden`}>
                    <div className="px-md py-sm border-b border-outline-variant">
                      <div className="font-label-md text-label-md text-on-surface font-semibold">
                        {user.fullName}
                      </div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                        {user.role === "beneficiary" ? t("nav.client") : user.role === "provider" ? t("nav.provider") : t("nav.adminRole")}
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className={`w-full px-md py-sm flex items-center gap-sm text-on-surface-variant hover:bg-surface-container-low transition-colors font-label-md text-label-md text-decoration-none ${isRTL ? 'text-right' : 'text-left'}`}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      {t("nav.profile")}
                    </Link>
                    <button
                      className={`w-full px-md py-sm flex items-center gap-sm text-error hover:bg-error-container/30 transition-colors font-label-md text-label-md ${isRTL ? 'text-right' : 'text-left'}`}
                      onClick={handleLogout}
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:opacity-90 text-decoration-none transition-opacity"
            >
              {t("nav.login")}
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant px-lg py-md flex flex-col gap-sm">
          {/* Mobile Language Switcher */}
          <button
            onClick={() => {
              toggleLanguage();
              setMobileMenuOpen(false);
            }}
            className={`font-body-md text-body-md text-secondary py-sm ${isRTL ? 'text-right' : 'text-left'} flex items-center gap-xs`}
          >
            <span className="material-symbols-outlined text-[18px]">language</span>
            {isRTL ? t("nav.english") : t("nav.arabic")}
          </button>
          
          {user ? (
            <>
              <NavLink
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary py-sm text-decoration-none"
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.dashboard")}
              </NavLink>
              <NavLink
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary py-sm text-decoration-none"
                to="/browse-services"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.browseServices")}
              </NavLink>
              <NavLink
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary py-sm text-decoration-none"
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.messages")}
              </NavLink>
              <button
                className={`font-body-md text-body-md text-error hover:opacity-80 py-sm ${isRTL ? 'text-right' : 'text-left'}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <NavLink
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary py-sm text-decoration-none"
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.login")}
              </NavLink>
              <NavLink
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary py-sm text-decoration-none"
                to="/beneficiary-signup"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.clientPortal")}
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Nav;
