import "./Footer.css";
function Footer() {
  return (
    <footer className="footer  py-4">
      <div className="container d-flex justify-content-between align-items-center">
        <a
          className="navbar-brand d-flex align-items-center fw-bold text-white mb-0"
          href="#"
        >
          <div className="square footer-square me-2">
            <div className="circle footer-circle"></div>
          </div>
          <span>Maqsad</span>
        </a>

        <div className="d-flex gap-4">
          <a href="#" className="footer-link">
            Privacy Policy
          </a>
          <a href="#" className="footer-link">
            Terms of Service
          </a>
          <a href="#" className="footer-link">
            Help Center
          </a>
        </div>

        <p className="mb-0 text-secondary">{/* © Maqsad.  */}</p>
      </div>
    </footer>
  );
}
export default Footer;
