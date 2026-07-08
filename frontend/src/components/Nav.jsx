import "./Nav.css";
import logo from "../assets/maqsad-logo.png";

function Nav() {
  return (
    <nav className="navbar nbar">
      <div className="container-fluid nav-container">
        <a className="navbar-brand nav-brand" href="#">
          <img src={logo} alt="Maqsad Logo" className="nav-logo" />
          <span>Maqsad</span>
        </a>

        <div className="nav-right">
          <a href="#" className="nav-link text-secondary">
            For Businesses
          </a>

          <a href="#" className="nav-link text-secondary">
            For Providers
          </a>

          <button className="btn btn-dark rounded-pill px-4 fw-semibold">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;