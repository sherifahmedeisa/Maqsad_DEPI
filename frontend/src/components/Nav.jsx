import "./Nav.css";
function nav() {
  return (
    <nav className="navbar nbar ">
      <div className="container-fluid ms-4">
        <a className="navbar-brand d-flex align-items-center fw-bold" href="#">
          <div className="square me-2">
            <div className="circle"></div>
          </div>
          <span>Maqsad</span>
        </a>
        <div className="d-flex align-items-center gap-5">
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
export default nav;
