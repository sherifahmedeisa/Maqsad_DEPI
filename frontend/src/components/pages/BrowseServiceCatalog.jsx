import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const serviceCategories = [
  {
    icon: "code",
    title: "Software Development",
    description: "Custom applications, APIs, and enterprise systems",
    count: "24 providers",
  },
  {
    icon: "cloud",
    title: "IT Infrastructure",
    description: "Cloud migration, networking, and systems architecture",
    count: "18 providers",
  },
  {
    icon: "campaign",
    title: "Marketing & Design",
    description: "Branding, digital campaigns, and creative services",
    count: "31 providers",
  },
  {
    icon: "gavel",
    title: "Legal & Auditing",
    description: "Compliance, financial audits, and legal advisory",
    count: "12 providers",
  },
  {
    icon: "account_balance",
    title: "Financial Services",
    description: "Accounting, tax planning, and financial consulting",
    count: "15 providers",
  },
  {
    icon: "engineering",
    title: "General Services",
    description: "Consulting, training, and operational support",
    count: "22 providers",
  },
];

function BrowseServiceCatalog() {
  const { user } = useAuth();

  return (
    <div className="flex-grow w-full">
      {/* Hero Search Section */}
      <div className="bg-primary-container py-2xl px-margin-mobile md:px-lg">
        <div className="max-w-container-max mx-auto text-center">
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-primary-container mb-md">
            Browse Service Catalog
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container/80 mb-xl max-w-2xl mx-auto">
            Explore our curated marketplace of verified service providers across industries. Find
            the perfect match for your project needs.
          </p>
          <div className="max-w-xl mx-auto relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[24px]">
              search
            </span>
            <input
              className="w-full pl-12 pr-6 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all shadow-sm"
              placeholder="Search services, providers, or categories..."
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Service Categories Grid */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="mb-xl">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
            Service Categories
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Browse by category to find specialized providers for your project.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg mb-2xl">
          {serviceCategories.map((cat) => (
            <Link
              key={cat.title}
              to={`/browse-requests?category=${encodeURIComponent(cat.title)}`}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:shadow-md hover:border-secondary transition-all cursor-pointer group text-decoration-none"
            >
              <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-md text-secondary group-hover:bg-secondary-container transition-colors">
                <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs group-hover:text-primary transition-colors">
                {cat.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
                {cat.description}
              </p>
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-xs">
                {cat.count}
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
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
                Featured Providers
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Top-rated providers with verified credentials and proven track records.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {[
              { name: "Pro Solutions Ltd", specialty: "IT Infrastructure", rating: "4.9", jobs: 42 },
              { name: "Digital Craft Co", specialty: "Software Development", rating: "5.0", jobs: 28 },
              { name: "AuditPro Group", specialty: "Legal & Auditing", rating: "4.8", jobs: 35 },
              { name: "Creative Studio X", specialty: "Marketing & Design", rating: "4.7", jobs: 19 },
            ].map((provider) => (
              <div
                key={provider.name}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-md mb-md">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      {provider.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-semibold">
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
                        {provider.rating} ({provider.jobs} jobs)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {provider.specialty}
                  </span>
                  <span
                    className="material-symbols-outlined text-[14px] text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {!user && (
          <div className="bg-surface-container border border-outline-variant rounded-xl p-xl text-center">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">
              Ready to get started?
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg max-w-xl mx-auto">
              Join Maqsad to post your service request and receive proposals from qualified
              providers within hours.
            </p>
            <div className="flex justify-center gap-md">
              <Link
                to="/beneficiary-signup"
                className="bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg hover:opacity-90 transition-opacity text-decoration-none"
              >
                Sign Up as Client
              </Link>
              <Link
                to="/provider-signup"
                className="border border-outline-variant text-on-surface font-label-md text-label-md px-lg py-md rounded-lg hover:bg-surface-container-low transition-colors text-decoration-none"
              >
                Join as Provider
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseServiceCatalog;
