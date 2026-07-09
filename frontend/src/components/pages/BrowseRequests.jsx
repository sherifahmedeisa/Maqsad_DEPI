import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

function BrowseRequests() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language.startsWith('ar');

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    "All",
    "Software Development",
    "IT Infrastructure",
    "Marketing & Design",
    "Legal & Auditing",
    "General Services",
  ];

  const categoryKeys = {
    "All": "all",
    "Software Development": "software",
    "IT Infrastructure": "infrastructure",
    "Marketing & Design": "marketing",
    "Legal & Auditing": "legal",
    "General Services": "general"
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/providers");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Error fetching providers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = requests
    .filter((provider) => {
      const matchSearch =
        (provider.companyName && provider.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (provider.description && provider.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (provider.user?.fullName && provider.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory =
        selectedCategory === "All" ||
        (provider.serviceTags && provider.serviceTags.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()))) ||
        (provider.description && provider.description.toLowerCase().includes(selectedCategory.toLowerCase()));
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.avgRating || 0) - (a.avgRating || 0);
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  if (loading) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {isRTL ? "جاري تحميل الخدمات..." : "Loading services..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl flex flex-col gap-xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div className="flex items-start gap-3">
          <button onClick={() => window.history.back()} className="mt-1 p-2 border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center justify-center shrink-0">
            <span className={`material-symbols-outlined text-[20px] ${isRTL ? 'rotate-180' : ''}`}>arrow_back</span>
          </button>
          <div>
            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-xs">
              {isRTL ? "تصفح الخدمات B2B" : "Browse B2B Services"}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {isRTL ? "ابحث عن مقدمي الخدمات المحترفين وأرسل طلب عروضك" : "Search professional service providers and send targeted RFP requests"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-sm">
          <div className="relative">
            <span className={`material-symbols-outlined absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]`}>
              search
            </span>
            <input
              className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary w-full md:w-72 transition-shadow`}
              placeholder={isRTL ? "البحث عن خدمات ومقدمين..." : "Search services and providers..."}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm sticky top-20">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">{isRTL ? "الفلاتر" : "Filters"}</h3>

            {/* Category Filter */}
            <div className="mb-lg">
              <h4 className="font-label-md text-label-md text-on-surface-variant mb-sm">
                {isRTL ? "التصنيف" : "Category"}
              </h4>
              <div className="flex flex-col gap-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`text-${isRTL ? 'right' : 'left'} px-md py-sm rounded-lg font-body-sm text-body-sm transition-colors ${
                      selectedCategory === cat
                        ? "bg-secondary-container text-on-secondary-container font-semibold"
                        : "text-on-surface-variant hover:bg-surface-container-low"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {t(cat === "All" ? "browseRequests.filters.all" : `browseCatalog.categories.${categoryKeys[cat]}`, cat)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h4 className="font-label-md text-label-md text-on-surface-variant mb-sm">
                {isRTL ? "ترتيب حسب" : "Sort By"}
              </h4>
              <select
                className={`w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-sm text-body-sm text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">{isRTL ? "الأعلى تقييماً" : "Highest Rated"}</option>
                <option value="newest">{isRTL ? "الأحدث" : "Newest Partners"}</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Request Cards Grid */}
        <div className="lg:col-span-9">
          {filtered.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-3">
                search_off
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                {isRTL ? "لا توجد نتائج" : "No Service Providers Found"}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {isRTL ? "جرب تصفية مختلفة أو فئة أخرى" : "Try adjusting your search criteria or select another category"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                {isRTL ? `تم العثور على ${filtered.length} شريك موثوق` : `Found ${filtered.length} verified B2B partners`}
              </p>
              {filtered.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:shadow-md transition-shadow relative group"
                >
                  <div className={`absolute ${isRTL ? 'right-0 rounded-r-xl' : 'left-0 rounded-l-xl'} top-0 bottom-0 w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-md">
                    <div className="flex-1">
                      <div className="flex items-center gap-sm mb-xs flex-wrap">
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          {provider.companyName || provider.user?.fullName || "Verified Provider"}
                        </span>
                        <div className="flex items-center text-secondary gap-xs">
                          <span
                            className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span className="font-label-sm text-label-sm font-bold">
                            {provider.avgRating && provider.avgRating > 0 ? provider.avgRating.toFixed(1) : "5.0"}
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          ({provider.totalProposals || 0} {t("browseCatalog.featured.jobs")})
                        </span>
                      </div>
                      <h4 className="font-body-lg text-body-lg text-primary font-semibold mb-xs">
                        {provider.companyName ? provider.user?.fullName : "Certified B2B Partner"}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 max-w-3xl">
                        {provider.description || "No description provided."}
                      </p>
                      <div className="flex flex-wrap items-center gap-xs mt-md">
                        {Array.isArray(provider.serviceTags) && provider.serviceTags.map((tag) => (
                          <span key={tag} className="font-label-sm text-label-sm text-secondary bg-secondary-container px-2 py-[2px] rounded border border-secondary-fixed">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-sm md:items-end min-w-[150px] shrink-0 mt-md md:mt-0">
                      <Link
                        to={`/rfp/new?providerId=${provider.userId}`}
                        className="px-md py-sm bg-primary text-on-primary font-label-md text-label-md rounded border border-primary hover:bg-on-surface transition-colors text-center text-decoration-none w-full"
                      >
                        {isRTL ? "طلب تقديم عرض" : "Request Proposal"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrowseRequests;
