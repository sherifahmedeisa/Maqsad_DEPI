import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-surface-container border-t border-outline-variant w-full py-xl px-lg mt-auto">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-md font-body-sm text-body-sm text-on-surface">
        {/* Brand */}
        <div className="font-headline-sm text-headline-sm font-bold text-primary mb-md md:mb-0">
          {t("footer.maqsad")}
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-md">
          <a
            className="text-on-surface-variant hover:text-secondary transition-all duration-200 text-decoration-none"
            href="#"
          >
            {t("footer.about")}
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-all duration-200 text-decoration-none"
            href="#"
          >
            {t("footer.terms")}
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-all duration-200 text-decoration-none"
            href="#"
          >
            {t("footer.privacy")}
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-all duration-200 text-decoration-none"
            href="#"
          >
            {t("footer.support")}
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-all duration-200 text-decoration-none"
            href="/faq"
          >
            {t("footer.helpCenter")}
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-md md:mt-0 text-center md:text-left text-on-surface-variant">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
