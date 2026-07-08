import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="flex-grow w-full">
      {/* Hero Section */}
      <section className="bg-primary-container py-2xl md:py-[80px] px-margin-mobile md:px-lg">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-xl">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-xs font-label-sm text-label-sm text-secondary bg-secondary-container px-3 py-1 rounded-full mb-lg">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Trusted B2B Marketplace
            </span>
            <h1 className="font-headline-xl text-headline-lg-mobile md:text-[48px] md:leading-[56px] text-on-primary-container font-bold mb-md">
              Discover and Book Professional Services
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary-container/80 mb-xl max-w-xl">
              Maqsad streamlines how organizations browse, select, and book verified service
              providers. Find services, specify requirements, and book providers directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-md justify-center md:justify-start">
              <Link
                to="/beneficiary-signup"
                className="bg-primary text-on-primary font-label-md text-label-md px-xl py-md rounded-lg hover:opacity-90 transition-opacity text-decoration-none text-center shadow-sm"
              >
                Join as Client
              </Link>
              <Link
                to="/provider-signup"
                className="border border-outline-variant bg-surface-container-lowest text-on-surface font-label-md text-label-md px-xl py-md rounded-lg hover:bg-surface-container-low transition-colors text-decoration-none text-center"
              >
                Post a Service Offer
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex-1 hidden md:flex justify-center">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-lg max-w-md w-full">
              <div className="flex items-center gap-md mb-md">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <div className="w-3 h-3 bg-[#f59e0b] rounded-full"></div>
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
              </div>
              <div className="space-y-md">
                <div className="bg-surface-container rounded-lg p-md">
                  <div className="flex items-center gap-sm mb-sm">
                    <span className="material-symbols-outlined text-secondary text-[20px]">request_quote</span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">New RFP</span>
                  </div>
                  <div className="h-2 bg-surface-container-high rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-surface-container-high rounded w-1/2"></div>
                </div>
                <div className="bg-surface-container rounded-lg p-md">
                  <div className="flex items-center gap-sm mb-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">3 Proposals</span>
                  </div>
                  <div className="flex gap-sm">
                    <div className="flex-1 h-8 bg-secondary-container rounded-lg"></div>
                    <div className="flex-1 h-8 bg-surface-container-high rounded-lg"></div>
                    <div className="flex-1 h-8 bg-surface-container-high rounded-lg"></div>
                  </div>
                </div>
                <div className="bg-secondary-container rounded-lg p-md flex items-center gap-sm">
                  <span className="material-symbols-outlined text-on-secondary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-label-md text-label-md text-on-secondary-container font-semibold">Provider Selected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-2xl px-margin-mobile md:px-lg">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-sm">
              How Maqsad Works
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
              A streamlined process from requirement to execution, built for enterprise reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {[
              {
                icon: "explore",
                step: "01",
                title: "Browse Service Offerings",
                desc: "Explore a catalog of verified services posted directly by professional providers, including budgets and details.",
              },
              {
                icon: "edit_document",
                step: "02",
                title: "Request Service Booking",
                desc: "Choose a service, specify your custom timeline and budget parameters, and send a booking request.",
              },
              {
                icon: "handshake",
                step: "03",
                title: "Approve & Execute",
                desc: "Providers review and accept your booking requests, finalizing parameters via direct negotiation chat.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg text-center hover:shadow-md transition-shadow group"
              >
                <div className="w-14 h-14 bg-surface-container-high rounded-xl flex items-center justify-center mx-auto mb-lg text-secondary group-hover:bg-secondary-container transition-colors">
                  <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary mb-sm inline-block">
                  STEP {item.step}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">
                  {item.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary-container py-xl px-margin-mobile md:px-lg">
        <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-lg text-center">
          {[
            { value: "500+", label: "Verified Providers" },
            { value: "1,200+", label: "Completed Projects" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "24h", label: "Avg. Response Time" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-primary-container font-bold">
                {stat.value}
              </div>
              <div className="font-label-md text-label-md text-on-primary-container/70 mt-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-2xl px-margin-mobile md:px-lg">
        <div className="max-w-container-max mx-auto text-center">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-md">
            Ready to Transform Your Procurement?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-2xl mx-auto">
            Join hundreds of organizations that trust Maqsad to connect them with the right service
            providers, every time.
          </p>
          <div className="flex flex-col sm:flex-row gap-md justify-center">
            <Link
              to="/beneficiary-signup"
              className="bg-primary text-on-primary font-label-md text-label-md px-xl py-md rounded-lg hover:opacity-90 transition-opacity text-decoration-none shadow-sm"
            >
              Get Started Free
            </Link>
            <Link
              to="/browse-services"
              className="border border-outline-variant text-on-surface font-label-md text-label-md px-xl py-md rounded-lg hover:bg-surface-container-low transition-colors text-decoration-none"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
