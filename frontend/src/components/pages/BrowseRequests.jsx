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
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = requests
    .filter((rfp) => {
      const matchSearch =
        rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rfp.description && rfp.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory =
        selectedCategory === "All" || rfp.category === selectedCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "budget") return (b.budgetMax || 0) - (a.budgetMax || 0);
      if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
      return 0;
    });

  if (loading) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {t("browseRequests.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl flex flex-col gap-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-xs">
            {t("browseRequests.title")}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t("browseRequests.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="relative">
            <span className={`material-symbols-outlined absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]`}>
              search
            </span>
            <input
              className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary w-full md:w-72 transition-shadow`}
              placeholder={t("browseRequests.searchPlaceholder")}
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
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">{t("browseRequests.filters.title")}</h3>

            {/* Category Filter */}
            <div className="mb-lg">
              <h4 className="font-label-md text-label-md text-on-surface-variant mb-sm">
                {t("browseRequests.filters.category")}
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
                {t("browseRequests.filters.sortBy")}
              </h4>
              <select
                className={`w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-sm text-body-sm text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">{t("browseRequests.filters.newest")}</option>
                <option value="budget">{t("browseRequests.filters.highestBudget")}</option>
                <option value="deadline">{t("browseRequests.filters.earliestDeadline")}</option>
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
                {t("browseRequests.empty.title")}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t("browseRequests.empty.subtitle")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                {t("browseRequests.results.count", { count: filtered.length })}
              </p>
              {filtered.map((rfp) => (
                <div
                  key={rfp.id}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:shadow-md transition-shadow relative group"
                >
                  <div className={`absolute ${isRTL ? 'right-0 rounded-r-xl' : 'left-0 rounded-l-xl'} top-0 bottom-0 w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-md">
                    <div className="flex-1">
                      <div className="flex items-center gap-sm mb-xs flex-wrap">
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          {rfp.beneficiary?.fullName || "Provider"}
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary bg-secondary-container px-2 py-[2px] rounded border border-secondary-fixed">
                          {t(`browseCatalog.categories.${categoryKeys[rfp.category] || "general"}`, rfp.category || "General")}
                        </span>
                        <span
                          className={`font-label-sm text-label-sm px-2 py-[2px] rounded-full ${
                            rfp.status === "open"
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-surface-variant text-on-surface"
                          }`}
                        >
                          {rfp.status === "open" ? t("browseRequests.results.open") : t(rfp.status, rfp.status)}
                        </span>
                      </div>
                      <Link
                        to={`/rfp/${rfp.id}`}
                        className="font-body-lg text-body-lg text-on-surface font-semibold mb-xs block hover:text-primary transition-colors text-decoration-none"
                      >
                        {rfp.title}
                      </Link>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 max-w-3xl">
                        {rfp.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-md mt-md">
                        <div className="flex items-center text-on-surface-variant font-label-sm text-label-sm">
                          <span className={`material-symbols-outlined text-[16px] ${isRTL ? 'ml-xs' : 'mr-xs'}`}>
                            payments
                          </span>
                          ${Number(rfp.budgetMin).toLocaleString()} - $
                          {Number(rfp.budgetMax).toLocaleString()}
                        </div>
                        <div className="flex items-center text-on-surface-variant font-label-sm text-label-sm">
                          <span className={`material-symbols-outlined text-[16px] ${isRTL ? 'ml-xs' : 'mr-xs'}`}>
                            calendar_today
                          </span>
                          {t("browseRequests.results.deadline")} {new Date(rfp.deadline).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                        </div>
                        <div className="flex items-center text-on-surface-variant font-label-sm text-label-sm">
                          <span className={`material-symbols-outlined text-[16px] ${isRTL ? 'ml-xs' : 'mr-xs'}`}>
                            schedule
                          </span>
                          {t("browseRequests.results.posted")} {new Date(rfp.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                        </div>
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-sm md:items-end min-w-[130px]">
                      <Link
                        to={`/rfp/${rfp.id}`}
                        className="px-md py-sm bg-primary text-on-primary font-label-md text-label-md rounded border border-primary hover:bg-on-surface transition-colors text-center text-decoration-none"
                      >
                        {t("browseRequests.results.viewDetails")}
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
