import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";


function BrowseServiceCatalog() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const isRTL = i18n.language.startsWith('ar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = "/api/services";
        if (searchQuery) {
          url += `?search=${encodeURIComponent(searchQuery)}`;
        }
        
        const [providersRes, servicesRes] = await Promise.all([
          fetch("/api/providers"),
          fetch(url)
        ]);

        if (providersRes.ok) {
          const providersData = await providersRes.json();
          setProviders(providersData);
        }
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData);
        }
      } catch (err) {
        console.error("Error loading service catalog data:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);


  return (
    <div className="flex-grow w-full">
      {/* Hero Search Section */}
      <div className="bg-primary-container py-2xl px-margin-mobile md:px-lg">
        <div className="max-w-container-max mx-auto text-center relative">
          <button onClick={() => window.history.back()} className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 p-2 border border-outline-variant/30 rounded-full text-on-primary-container hover:bg-on-primary-container/10 transition-colors flex items-center justify-center`}>
            <span className={`material-symbols-outlined text-[20px] ${isRTL ? 'rotate-180' : ''}`}>arrow_back</span>
          </button>
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-primary-container mb-md pt-2">
            {t("browseCatalog.title")}
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container/80 mb-xl max-w-2xl mx-auto">
            {t("browseCatalog.subtitle")}
          </p>
          <div className="max-w-xl mx-auto relative">
            <span className={`material-symbols-outlined absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-on-surface-variant text-[24px]`}>
              search
            </span>
            <input
              className={`w-full ${isRTL ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all shadow-sm`}
              placeholder={t("browseCatalog.searchPlaceholder", "Search services by title or tag...")}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mb-2"></div>
            <p className="text-on-surface-variant text-sm">{t("browseCatalog.loading")}</p>
          </div>
        ) : (
          <>
            {/* Featured Providers Section */}
            <div className="mb-xl">
              <div className="flex justify-between items-center mb-lg">
                <div>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
                    {isRTL ? "خدمات مميزة" : "Featured Services"}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {isRTL ? "تصفح أحدث الخدمات المضافة بواسطة مقدمي الخدمات" : "Browse the latest services posted by our providers"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
                {services && services.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-on-surface-variant font-body-md bg-surface-container-low rounded-xl border border-outline-variant/60">
                    {isRTL ? "لا توجد خدمات متاحة حالياً" : "No services available at the moment."}
                  </div>
                ) : (
                  services.map((service) => (
                    <Link
                      key={service.id}
                      to={`/service/${service.id}`}
                      className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col hover:shadow-md hover:border-secondary transition-all cursor-pointer h-full text-decoration-none"
                    >
                      <h4 className="font-label-lg text-label-lg text-on-surface font-semibold line-clamp-2 mb-xs group-hover:text-primary transition-colors">
                        {service.title}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-md flex-grow">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center gap-sm mb-md">
                        <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant">
                          <span className="font-label-sm text-label-sm text-on-surface font-bold uppercase">
                            {service.provider?.fullName?.charAt(0) || "P"}
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                          {service.provider?.fullName || "Verified Provider"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-outline-variant pt-sm">
                        <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                          {service.category}
                        </span>
                        <span className="font-label-md text-label-md text-primary font-bold">
                          {service.price ? `$${service.price}` : (isRTL ? "سعر متغير" : "Variable")}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* CTA */}
        {!user && (
          <div className="bg-surface-container border border-outline-variant rounded-xl p-xl text-center">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">
              {t("browseCatalog.cta.title")}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg max-w-xl mx-auto">
              {t("browseCatalog.cta.subtitle")}
            </p>
            <div className="flex justify-center gap-md">
              <Link
                to="/beneficiary-signup"
                className="bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg hover:opacity-90 transition-opacity text-decoration-none"
              >
                {t("browseCatalog.cta.signupClient")}
              </Link>
              <Link
                to="/provider-signup"
                className="border border-outline-variant text-on-surface font-label-md text-label-md px-lg py-md rounded-lg hover:bg-surface-container-low transition-colors text-decoration-none"
              >
                {t("browseCatalog.cta.joinProvider")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseServiceCatalog;
