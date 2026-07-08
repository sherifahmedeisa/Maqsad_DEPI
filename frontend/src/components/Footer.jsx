function Footer() {
  return (
    <footer className="bg-surface-container border-t border-outline-variant w-full py-xl px-lg mt-auto">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-md font-body-sm text-body-sm text-on-surface">
        {/* Brand */}
        <div className="font-headline-sm text-headline-sm font-bold text-primary mb-md md:mb-0">
          Maqsad
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-md">
          <a
            className="text-on-surface-variant hover:text-secondary transition-all duration-200 text-decoration-none"
            href="#"
          >
            About Us
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-all duration-200 text-decoration-none"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-all duration-200 text-decoration-none"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-all duration-200 text-decoration-none"
            href="#"
          >
            Contact Support
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-all duration-200 text-decoration-none"
            href="#"
          >
            Help Center
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-all duration-200 text-decoration-none"
            href="/admin"
          >
            Admin Portal
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-md md:mt-0 text-center md:text-right text-on-surface-variant">
          © {new Date().getFullYear()} Maqsad. Reliability, Efficiency, Clarity.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
