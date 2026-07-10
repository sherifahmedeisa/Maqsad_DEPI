import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Faq() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const isRTL = i18n.language.startsWith('ar');

  const faqs = [
    {
      category: "general",
      question: t("faq.questions.q1.question"),
      answer: t("faq.questions.q1.answer")
    },
    {
      category: "general",
      question: t("faq.questions.q2.question"),
      answer: t("faq.questions.q2.answer")
    },
    {
      category: "services",
      question: t("faq.questions.q3.question"),
      answer: t("faq.questions.q3.answer")
    },
    {
      category: "services",
      question: t("faq.questions.q4.question"),
      answer: t("faq.questions.q4.answer")
    },
    {
      category: "proposals",
      question: t("faq.questions.q5.question"),
      answer: t("faq.questions.q5.answer")
    },
    {
      category: "proposals",
      question: t("faq.questions.q6.question"),
      answer: t("faq.questions.q6.answer")
    },
    {
      category: "contracts",
      question: t("faq.questions.q7.question"),
      answer: t("faq.questions.q7.answer")
    },
    {
      category: "contracts",
      question: t("faq.questions.q8.question"),
      answer: t("faq.questions.q8.answer")
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const filteredFaqs = faqs.filter((faq) => {
    if (activeCategory === "all") return true;
    return faq.category === activeCategory;
  });

  return (
    <div className={`flex flex-col min-h-screen bg-[#f8fafc] ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Main Content Area */}
      <main className="flex-grow p-lg md:p-xl max-w-container-max w-full mx-auto flex flex-col gap-lg">
          
          {/* Header */}
          <div className="border-b border-outline-variant pb-md relative">
            <button 
              onClick={() => navigate(-1)} 
              className="mb-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 font-body-md text-body-md w-fit"
            >
              <span className={`material-symbols-outlined text-[18px] ${isRTL ? 'rotate-180' : ''}`}>arrow_back</span>
              {isRTL ? "رجوع" : "Back"}
            </button>

            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface font-bold leading-tight flex items-center gap-xs">
              <span className="material-symbols-outlined text-secondary text-[36px]">help_center</span>
              {t("faq.header.title")}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("faq.header.subtitle")}
            </p>
          </div>

          {/* FAQ Tabs */}
          <div className="flex gap-xs bg-surface-container-lowest p-sm border border-outline-variant rounded-xl w-fit flex-wrap">
            {[
              { id: "all", label: t("faq.tabs.all") },
              { id: "general", label: t("faq.tabs.general") },
              { id: "services", label: t("faq.tabs.services") },
              { id: "proposals", label: t("faq.tabs.proposals") },
              { id: "contracts", label: t("faq.tabs.contracts") }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setExpandedFaq(null);
                }}
                className={`px-md py-1.5 rounded-lg text-label-sm font-semibold transition-all cursor-pointer border-0 ${
                  activeCategory === tab.id
                    ? "bg-secondary text-white shadow-sm"
                    : "bg-transparent text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Accordion Questions List */}
          <div className="flex flex-col gap-md max-w-3xl">
            {filteredFaqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm transition-all hover:border-secondary"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className={`w-full ${isRTL ? 'text-right' : 'text-left'} p-md md:p-lg flex justify-between items-center bg-transparent border-0 cursor-pointer`}
                  >
                    <span className="font-label-md text-label-md text-on-surface font-bold leading-snug">
                      {faq.question}
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-200" style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0)"
                    }}>
                      expand_more
                    </span>
                  </button>
                  
                  <div
                    className="transition-all duration-300 ease-in-out overflow-hidden"
                    style={{
                      maxHeight: isOpen ? "200px" : "0",
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <div className={`p-md md:p-lg pt-0 text-body-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/40 bg-slate-50/50 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Support Section */}
          <div className="bg-surface-container border border-outline-variant rounded-2xl p-lg flex flex-col md:flex-row items-center justify-between gap-md max-w-3xl mt-md">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">{t("faq.support.title")}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
                {t("faq.support.subtitle")}
              </p>
            </div>
            <a
              href="mailto:support@maqsad.com"
              className="bg-secondary hover:bg-on-secondary-container text-white px-lg py-2.5 rounded-xl font-bold font-label-md text-decoration-none shadow-sm transition-all text-center"
            >
              {t("faq.support.button")}
            </a>
          </div>

        </main>
    </div>
  );
}

export default Faq;
