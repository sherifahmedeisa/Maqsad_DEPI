import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProviderSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/provider-login");
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const sideNavLink = ({ isActive }) =>
    `flex items-center space-x-md px-md py-sm rounded-lg transition-all cursor-pointer ${
      isActive
        ? "bg-secondary-container text-on-secondary-container"
        : "text-on-surface-variant hover:bg-surface-container-high"
    }`;

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface border-r border-outline-variant p-md space-y-sm z-50">
        {/* Brand + Profile */}
        <div className="mb-lg">
          <h1 className="font-headline-sm text-headline-sm font-extrabold text-primary mb-xs">
            Maqsad
          </h1>
          <div className="flex items-center space-x-sm mt-md p-sm bg-surface-container-low rounded-lg border border-outline-variant">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant overflow-hidden">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                {user?.fullName?.charAt(0) || "P"}
              </span>
            </div>
            <div>
              <div className="font-label-md text-label-md text-on-surface font-semibold">
                {user?.fullName || "Provider"}
              </div>
              <div className="font-label-sm text-label-sm text-secondary flex items-center mt-xs">
                <span
                  className="material-symbols-outlined text-[14px] mr-[2px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                Verified Provider
              </div>
            </div>
          </div>
        </div>

        {/* Post New Service CTA */}
        <NavLink
          to="/rfp/new"
          className="w-full bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md py-sm px-md rounded-lg flex items-center justify-center transition-colors mb-md text-decoration-none"
        >
          <span className="material-symbols-outlined mr-sm text-[18px]">add</span>
          Post New Service
        </NavLink>

        {/* Navigation Items */}
        <div className="flex-grow space-y-xs overflow-y-auto">
          <NavLink className={sideNavLink} to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">Overview</span>
          </NavLink>
          <NavLink className={sideNavLink} to="/chat">
            <span className="material-symbols-outlined">chat</span>
            <span className="font-label-md text-label-md">Messages</span>
          </NavLink>
          <a
            className="flex items-center space-x-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer"
            href="#"
          >
            <span className="material-symbols-outlined">description</span>
            <span className="font-label-md text-label-md">Proposal History</span>
          </a>
          <a
            className="flex items-center space-x-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer"
            href="#"
          >
            <span className="material-symbols-outlined">handshake</span>
            <span className="font-label-md text-label-md">Contract Manager</span>
          </a>
          <a
            className="flex items-center space-x-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer"
            href="#"
          >
            <span className="material-symbols-outlined">insights</span>
            <span className="font-label-md text-label-md">Analytics</span>
          </a>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto space-y-xs pt-md border-t border-outline-variant">
          <a
            className="flex items-center space-x-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer"
            href="#"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-md text-label-md">Help Center</span>
          </a>
          <button
            className="w-full flex items-center space-x-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer text-left"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Log Out</span>
          </button>
        </div>
      </nav>

      {/* Mobile Top Bar (for providers) */}
      <header className="md:hidden flex justify-between items-center px-lg py-sm bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-40">
        <div className="font-headline-md text-headline-md font-bold text-on-surface">Maqsad</div>
        <div className="flex items-center space-x-md">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">
            notifications
          </span>
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant">
            <span className="font-label-sm text-label-sm text-on-surface font-bold">
              {user?.fullName?.charAt(0) || "P"}
            </span>
          </div>
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
              <span className="font-label-sm text-label-sm text-[10px]">Overview</span>
            </>
          )}
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full ${
              isActive ? "text-secondary" : "text-on-surface-variant hover:text-primary"
            }`
          }
          to="/rfp/new"
        >
          <span className="material-symbols-outlined text-[24px] mb-1">add_box</span>
          <span className="font-label-sm text-label-sm text-[10px]">Post Service</span>
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
          <span className="font-label-sm text-label-sm text-[10px]">Messages</span>
        </NavLink>
        <a className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-[24px] mb-1">menu</span>
          <span className="font-label-sm text-label-sm text-[10px]">More</span>
        </a>
      </nav>
    </>
  );
}

export default ProviderSidebar;
