import "./Footer.css";
import logo from "../assets/maqsad-logo.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <a className="footer-brand" href="#">
          <img src={logo} alt="Maqsad Logo" className="footer-logo" />
          <span>Maqsad</span>
        </a>

        <div className="footer-links">
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
      </div>
    </footer>
  );
}

export default Footer;