import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const serviceCategories = [
  {
    icon: "code",
    key: "software",
    title: "Software Development",
  },
  {
    icon: "cloud",
    key: "infrastructure",
    title: "IT Infrastructure",
  },
  {
    icon: "campaign",
    key: "marketing",
    title: "Marketing & Design",
  },
  {
    icon: "gavel",
    key: "legal",
    title: "Legal & Auditing",
  },
  {
    icon: "account_balance",
    key: "financial",
    title: "Financial Services",
  },
  {
    icon: "engineering",
    key: "general",
    title: "General Services",
  },
];

function BrowseServiceCatalog() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [providers, setProviders] = useState([]);
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);

  const isRTL = i18n.language.startsWith('ar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [providersRes, rfpsRes] = await Promise.all([
          fetch("/api/providers"),
          fetch("/api/requests")
        ]);

        if (providersRes.ok) {
          const providersData = await providersRes.json();
          setProviders(providersData);
        }
        if (rfpsRes.ok) {
          const rfpsData = await rfpsRes.json();
          setRfps(rfpsData);
        }
      } catch (err) {
        console.error("Error loading service catalog data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProviderCount = (categoryTitle) => {
    const filteredRfps = rfps.filter(
      (r) => r.category?.toLowerCase() === categoryTitle.toLowerCase()
    );
    // Find unique provider IDs (stored in beneficiaryId due to role inversion)
    const uniqueProviderIds = new Set(filteredRfps.map((r) => r.beneficiaryId));
    const size = uniqueProviderIds.size;
    return t("browseCatalog.providerCount", { count: size });
  };

  const getFeaturedProviders = () => {
    if (providers && providers.length > 0) {
      return providers.slice(0, 4).map((p) => {
        const tags = Array.isArray(p.serviceTags) ? p.serviceTags : [];
        const specialty = tags.length > 0 ? tags[0] : "General Services";
        return {
          id: p.id,
          name: p.companyName || p.user?.fullName || t("browseCatalog.featured.verified"),
          specialty: specialty,
          rating: p.avgRating && p.avgRating > 0 ? p.avgRating.toFixed(1) : "5.0",
          jobs: p.totalProposals || 0,
        };
      });
    }

    return [];
  };

  return (
    <div className="flex-grow w-full">
      {/* Hero Search Section */}
      <div className="bg-primary-container py-2xl px-margin-mobile md:px-lg">
        <div className="max-w-container-max mx-auto text-center">
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-primary-container mb-md">
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
              placeholder={t("browseCatalog.searchPlaceholder")}
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Service Categories Grid */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="mb-xl">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
            {t("browseCatalog.categories.title")}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t("browseCatalog.categories.subtitle")}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mb-2"></div>
            <p className="text-on-surface-variant text-sm">{t("browseCatalog.loading")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg mb-2xl">
              {serviceCategories.map((cat) => (
                <Link
                  key={cat.key}
                  to={`/browse-requests?category=${encodeURIComponent(cat.title)}`}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:shadow-md hover:border-secondary transition-all cursor-pointer group text-decoration-none"
                >
                  <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-md text-secondary group-hover:bg-secondary-container transition-colors">
                    <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs group-hover:text-primary transition-colors">
                    {t(`browseCatalog.categories.${cat.key}`, cat.title)}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
                    {t(`browseCatalog.categories.${cat.key}Desc`, cat.description)}
                  </p>
                  <span className="font-label-sm text-label-sm text-secondary flex items-center gap-xs">
                    {getProviderCount(cat.title)}
                    <span className={`material-symbols-outlined text-sm transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`}>
                      arrow_forward
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Featured Providers Section */}
            <div className="mb-xl">
              <div className="flex justify-between items-center mb-lg">
                <div>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
                    {t("browseCatalog.featured.title")}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {t("browseCatalog.featured.subtitle")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
                {getFeaturedProviders().length === 0 ? (
                  <div className="col-span-full py-8 text-center text-on-surface-variant font-body-md bg-surface-container-low rounded-xl border border-outline-variant/60">
                    {t("browseCatalog.featured.noProviders")}
                  </div>
                ) : (
                  getFeaturedProviders().map((provider, index) => (
                    <div
                      key={provider.id || index}
                      className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center gap-md mb-md">
                        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant">
                          <span className="font-label-md text-label-md text-on-surface font-bold">
                            {provider.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-label-md text-label-md text-on-surface font-semibold truncate max-w-[150px]">
                            {provider.name}
                          </h4>
                          <div className="flex items-center text-secondary gap-xs">
                            <span
                              className="material-symbols-outlined text-sm"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            <span className="font-label-sm text-label-sm">
                              {provider.rating} ({provider.jobs} {t("browseCatalog.featured.jobs")})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {t(`browseCatalog.categories.${provider.specialty.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`, provider.specialty)}
                        </span>
                        <span
                          className="material-symbols-outlined text-[14px] text-secondary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                      </div>
                    </div>
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
