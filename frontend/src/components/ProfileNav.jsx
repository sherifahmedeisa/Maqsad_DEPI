import { NavLink, Routes, Route, Navigate, Link } from "react-router-dom";
import "./Page.css";
import "./LandingNav.css";
function ProfileNav() {
  return (
    <nav className="navbar nbar">
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center">
          <NavLink
            to="/"
            className="navbar-brand d-flex align-items-center fw-bold me-5 text-decoration-none"
          >
            <div className="square me-2">
              <div className="circle"></div>
            </div>

            <span>Maqsad</span>
          </NavLink>

          <ul className="navbar-nav flex-row gap-4">
            <li className="nav-item ">
              <NavLink
                to="/beneficiary-dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/service-requests"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                Browse Requests
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default ProfileNav;
