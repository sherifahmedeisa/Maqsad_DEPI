import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // If provider is logged in, don't render top nav (they use sidebar)
  if (user && user.role === "provider") return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/provider-login");
    } catch (err) {
      console.error("Sign out failed", err);
    }
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

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant w-full sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-lg max-w-container-max mx-auto h-16">
        {/* Brand + Nav Links */}
        <div className="flex items-center gap-lg">
          <Link
            className="font-headline-md text-headline-md font-bold text-primary text-decoration-none"
            to={user ? "/dashboard" : "/"}
          >
            Maqsad
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-md font-body-md text-body-md">
            {user ? (
              <>
                <NavLink className={navLinkClass} to="/dashboard">
                  Dashboard
                </NavLink>
                <NavLink className={navLinkClass} to="/browse-services">
                  Browse Services
                </NavLink>
                <NavLink className={navLinkClass} to="/chat">
                  Messages
                </NavLink>
                {user.role === "admin" && (
                  <NavLink className={navLinkClass} to="/admin">
                    Admin
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <NavLink className={navLinkClass} to="/beneficiary-login">
                  Client Portal
                </NavLink>
                <NavLink className={navLinkClass} to="/provider-login">
                  Provider Portal
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-md">
          {user ? (
            <>
              {/* Search Icon */}
              <button
                aria-label="Search"
                className="hidden md:flex text-on-surface-variant hover:text-secondary transition-colors"
              >
                <span className="material-symbols-outlined">search</span>
              </button>

              {/* Notification Bell + Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  aria-label="Notifications"
                  className="text-on-surface-variant hover:text-secondary transition-colors relative"
                  onClick={() => setShowNotifs(!showNotifs)}
                >
                  <span className="material-symbols-outlined">notifications</span>
                  {/* Badge dot */}
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full"></span>
                </button>

                {/* Notification Popover */}
                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center">
                      <h4 className="font-headline-sm text-headline-sm text-on-surface text-[16px]">
                        Notifications
                      </h4>
                      <button className="font-label-sm text-label-sm text-secondary hover:underline">
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-md py-sm hover:bg-surface-container-low transition-colors border-b border-outline-variant">
                        <p className="font-body-sm text-body-sm text-on-surface">
                          New proposal received for your request
                        </p>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          2 minutes ago
                        </span>
                      </div>
                      <div className="px-md py-sm hover:bg-surface-container-low transition-colors border-b border-outline-variant">
                        <p className="font-body-sm text-body-sm text-on-surface">
                          Your RFP deadline is approaching
                        </p>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          1 hour ago
                        </span>
                      </div>
                      <div className="px-md py-sm hover:bg-surface-container-low transition-colors">
                        <p className="font-body-sm text-body-sm text-on-surface">
                          Proposal status updated to shortlisted
                        </p>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          3 hours ago
                        </span>
                      </div>
                    </div>
                    <div className="px-lg py-sm border-t border-outline-variant text-center">
                      <button className="font-label-md text-label-md text-secondary hover:underline">
                        View All Notifications
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
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      {user.fullName?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="hidden md:block font-label-md text-label-md text-on-surface">
                    {user.fullName}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-md py-sm border-b border-outline-variant">
                      <div className="font-label-md text-label-md text-on-surface font-semibold">
                        {user.fullName}
                      </div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                        {user.role}
                      </div>
                    </div>
                    <button
                      className="w-full px-md py-sm text-left flex items-center gap-sm text-error hover:bg-error-container/30 transition-colors font-label-md text-label-md"
                      onClick={handleLogout}
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/provider-login"
              className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:opacity-90 text-decoration-none transition-opacity"
            >
              Sign In
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
          {user ? (
            <>
              <NavLink
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary py-sm text-decoration-none"
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary py-sm text-decoration-none"
                to="/browse-services"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Services
              </NavLink>
              <NavLink
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary py-sm text-decoration-none"
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
              >
                Messages
              </NavLink>
              <button
                className="font-body-md text-body-md text-error hover:opacity-80 py-sm text-left"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary py-sm text-decoration-none"
                to="/beneficiary-login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Client Portal
              </NavLink>
              <NavLink
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary py-sm text-decoration-none"
                to="/provider-login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Provider Portal
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Nav;
