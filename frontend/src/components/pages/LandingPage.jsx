import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../assets/maqsad-logo.png";

function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language.startsWith('ar');

  const categories = [
    { icon: "code", name: t("landing.categories.software"), color: "#2563eb" },
    { icon: "security", name: t("landing.categories.security"), color: "#7c3aed" },
    { icon: "campaign", name: t("landing.categories.marketing"), color: "#059669" },
    { icon: "gavel", name: t("landing.categories.legal"), color: "#d97706" },
    { icon: "account_balance", name: t("landing.categories.finance"), color: "#0ea5e9" },
    { icon: "school", name: t("landing.categories.training"), color: "#e11d48" },
  ];

  const testimonials = [
    {
      quote: isRTL ? "انتقلنا من البحث عن مزودي خدمات لمدة 6 أسابيع إلى حجز تدقيق أمني خلال 3 أيام فقط. المحادثة المباشرة مع مقدمي الخدمات وفّرت علينا أسابيع من المراسلات." : "We went from a 6-week provider search to booking a security audit in just 3 days. Direct messaging saved us weeks of email threads.",
      name: isRTL ? "ليلى حسان" : "Laila Hassan",
      role: isRTL ? "رئيسة قسم المشتريات التقنية" : "Head of IT Procurement",
      company: isRTL ? "مجموعة ثروة" : "Tharwa Group",
      initials: isRTL ? "لح" : "LH",
    },
    {
      quote: isRTL ? "كشركة استشارية صغيرة، كانت الظهور والوصول للعملاء أكبر تحدٍّ لنا. خلال شهرين على مقصد، حصلنا على ثلاثة عقود مؤسسية بقيمة تجاوزت 80 ألف دولار." : "As a boutique consultancy, visibility was our biggest challenge. Within two months on Maqsad, we secured three enterprise contracts worth over $80k.",
      name: isRTL ? "عمر فريد" : "Omar Farid",
      role: isRTL ? "الشريك الإداري" : "Managing Partner",
      company: isRTL ? "شركاء النيل للاستراتيجية" : "Nile Strategy Partners",
      initials: isRTL ? "عف" : "OF",
    },
    {
      quote: isRTL ? "سير العمل للعروض سلس وواضح — بدون قوالب معقدة أو مصطلحات غامضة. فريقنا يستمتع فعلاً باستخدام المنصة، وهذا يقول الكثير." : "The proposal workflow is frictionless—no convoluted templates or vague terminology. Our team actually enjoys using the platform, which says a lot.",
      name: isRTL ? "سارة الخوري" : "Sarah Al-Khoury",
      role: isRTL ? "مديرة العمليات" : "Operations Director",
      company: isRTL ? "حلول الطب التقني - الشرق الأوسط" : "MedTech Solutions ME",
      initials: isRTL ? "سخ" : "SA",
    },
  ];

  const faqs = [
    {
      q: isRTL ? "هل استخدام مقصد مجاني؟" : "Is Maqsad free to use?",
      a: isRTL ? "تصفّح الخدمات ونشر القوائم مجاني بالكامل. نحن نتقاضى رسوم منصة بسيطة فقط عند إتمام العقد بين العميل ومقدم الخدمة." : "Browsing services and posting listings is completely free. We only charge a small platform fee when a contract is finalized between a client and a provider."
    },
    {
      q: isRTL ? "كيف يتم التحقق من مقدمي الخدمات؟" : "How are providers verified?",
      a: isRTL ? "يمر كل مقدم خدمة بعملية التحقق من الوثائق ومراجعة الأعمال السابقة قبل تفعيل ملفه. نتحقق من السجل التجاري ونماذج العمل ومراجع العملاء." : "Every provider goes through document verification and portfolio review before their profile is activated. We check commercial registration, work samples, and client references."
    },
    {
      q: isRTL ? "هل يمكنني التفاوض على الأسعار مباشرة؟" : "Can I negotiate prices directly?",
      a: isRTL ? "نعم — بمجرد إرسال طلب الحجز، يمكنك أنت ومقدم الخدمة التفاوض على الميزانية والنطاق والجدول الزمني عبر نظام المراسلة المدمج قبل الالتزام." : "Yes — once you send a booking request, you and the provider can negotiate the budget, scope, and timeline via the built-in messaging system before committing."
    },
    {
      q: isRTL ? "ما هي القطاعات التي تغطونها؟" : "What sectors do you cover?",
      a: isRTL ? "تطوير البرمجيات، الأمن السيبراني، التسويق، الاستشارات القانونية، الخدمات المالية، الموارد البشرية والتدريب، البنية التحتية لتقنية المعلومات، والمزيد. إذا لم يكن قطاعك مدرجاً، يمكن لمقدمي الخدمات إنشاء فئات مخصصة." : "Software Development, Cybersecurity, Marketing, Legal Consulting, Financial Services, HR & Training, IT Infrastructure, and more. If your sector isn't listed, providers can create custom categories."
    },
  ];

  const fontStyle = isRTL ? { fontFamily: "Tajawal, sans-serif" } : { fontFamily: "Inter, sans-serif" };

  return (
    <div className="flex-grow w-full" style={fontStyle}>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}></div>

        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-lg py-2xl md:py-[96px]">
          <div className="flex flex-col lg:flex-row items-center gap-2xl">
            {/* Right/Left side: Copy */}
            <div className={`flex-1 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
              <h1 className="text-[40px] md:text-[56px] leading-[1.15] text-white font-extrabold mb-lg tracking-tight">
                {t("landing.hero.title1")}
                <br />
                <span style={{ color: "#34d399" }}>{t("landing.hero.title2")}</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-400 mb-xl max-w-lg leading-relaxed mx-auto lg:mx-0">
                {t("landing.hero.subtitle")}
              </p>

              <div className={`flex flex-col sm:flex-row gap-3 justify-center ${isRTL ? 'lg:justify-start' : 'lg:justify-start'}`}>
                <Link
                  to="/browse-services"
                  className="inline-flex items-center justify-center gap-2 text-[15px] font-bold px-7 py-3.5 rounded-xl text-decoration-none transition-all"
                  style={{ background: "#34d399", color: "#0f172a" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#6ee7b7"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#34d399"}
                >
                  {t("landing.hero.browseServices")}
                  <span className={`material-symbols-outlined text-[18px] ${isRTL ? 'rotate-0' : 'rotate-180'}`}>arrow_back</span>
                </Link>
                <Link
                  to="/provider-signup"
                  className="inline-flex items-center justify-center gap-2 text-[15px] font-bold px-7 py-3.5 rounded-xl border border-white/20 text-white hover:bg-white/[0.06] transition-colors text-decoration-none"
                >
                  {t("landing.hero.listServices")}
                </Link>
              </div>

              {/* Micro proof */}
              <div className={`mt-xl flex items-center gap-md justify-center ${isRTL ? 'lg:justify-start' : 'lg:justify-start'}`}>
                <div className={`flex -space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  {(isRTL ? ["أ", "ك", "م", "ر"] : ["A", "K", "M", "R"]).map((letter, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center text-[11px] font-bold text-white uppercase"
                      style={{ background: ["#2563eb", "#7c3aed", "#059669", "#d97706"][i] }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 text-sm">
                  <span className="text-slate-300 font-semibold">{t("landing.hero.providersCount")}</span>
                </p>
              </div>
            </div>

            {/* Product preview card */}
            <div className="flex-1 hidden lg:block max-w-md w-full" dir={isRTL ? "rtl" : "ltr"}>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60">
                <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={logo} alt="" className="h-5 w-auto opacity-70" />
                    <span className="text-[13px] font-semibold text-slate-500">{t("landing.preview.dashboard")}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  </div>
                </div>

                <div className="p-5 space-y-3.5">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] font-bold text-slate-800">{t("landing.preview.jobTitle")}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{t("landing.preview.offersCount")}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-[12px] text-slate-500">{t("landing.preview.budget")}</span>
                      <span className="text-[13px] font-bold text-slate-800">$12,000 – $18,000</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1.5 block">{t("landing.preview.deadline")}</span>
                  </div>

                  <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3.5 border border-blue-100">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0">
                      {isRTL ? "شن" : "NS"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-slate-800 truncate">{isRTL ? "شركاء النيل للاستراتيجية" : "Nile Strategy Partners"}</div>
                      <div className="text-[12px] text-slate-500">{t("landing.preview.shortlisted")}</div>
                    </div>
                    <span className="material-symbols-outlined text-blue-600 text-[20px]">chat</span>
                  </div>

                  <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3.5 border border-emerald-100">
                    <span className="material-symbols-outlined text-emerald-600 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <div>
                      <div className="text-[13px] font-bold text-emerald-800">{t("landing.preview.contractSigned")}</div>
                      <div className="text-[12px] text-emerald-600">{t("landing.preview.paymentTerms")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY STRIP ─── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-lg py-lg">
          <div className="flex items-center justify-between gap-lg overflow-x-auto scrollbar-hide">
            <span className="text-[13px] text-slate-400 font-medium whitespace-nowrap hidden md:block">{t("landing.trending")}</span>
            <div className={`flex items-center gap-3 flex-1 justify-center ${isRTL ? 'md:justify-start' : 'md:justify-start'}`}>
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to="/browse-services"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-decoration-none whitespace-nowrap group"
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ color: cat.color }}>{cat.icon}</span>
                  <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-2xl md:py-[80px] px-margin-mobile md:px-lg bg-white">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-2xl">
            <span className="text-[13px] font-semibold text-emerald-600 uppercase tracking-widest">{t("landing.howItWorks.subtitle")}</span>
            <h2 className="text-[32px] md:text-[40px] text-slate-900 font-extrabold mt-2 tracking-tight">
              {t("landing.howItWorks.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
            {[
              {
                num: "01",
                icon: "search",
                title: t("landing.howItWorks.step1Title"),
                desc: t("landing.howItWorks.step1Desc"),
                accent: "#2563eb",
              },
              {
                num: "02",
                icon: "edit_note",
                title: t("landing.howItWorks.step2Title"),
                desc: t("landing.howItWorks.step2Desc"),
                accent: "#7c3aed",
              },
              {
                num: "03",
                icon: "handshake",
                title: t("landing.howItWorks.step3Title"),
                desc: t("landing.howItWorks.step3Desc"),
                accent: "#059669",
              },
            ].map((step, i) => (
              <div key={step.num} className={`relative px-lg py-xl md:py-lg text-center ${isRTL ? 'md:text-right' : 'md:text-left'} group`}>
                {i < 2 && (
                  <div className={`hidden md:block absolute ${isRTL ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 w-px h-2/3 bg-slate-200`}></div>
                )}

                <div className={`flex flex-col items-center ${isRTL ? 'md:items-start' : 'md:items-start'} gap-md`}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: step.accent + "12" }}
                    >
                      <span className="material-symbols-outlined text-[24px]" style={{ color: step.accent }}>{step.icon}</span>
                    </div>
                    <span className="text-[40px] font-black text-slate-100 select-none">{step.num}</span>
                  </div>

                  <h3 className="text-[20px] font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-slate-500 leading-relaxed max-w-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF / TESTIMONIALS ─── */}
      <section className="py-2xl md:py-[80px] px-margin-mobile md:px-lg" style={{ background: "#f8fafb" }}>
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-2xl">
            <span className="text-[13px] font-semibold text-emerald-600 uppercase tracking-widest">{t("landing.testimonials.subtitle")}</span>
            <h2 className="text-[32px] md:text-[40px] text-slate-900 font-extrabold mt-2 tracking-tight">
              {t("landing.testimonials.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-lg border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div className={`flex gap-0.5 mb-md ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="material-symbols-outlined text-amber-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-[15px] text-slate-600 leading-relaxed mb-lg">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-md border-t border-slate-100">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0 uppercase"
                    style={{ background: ["#2563eb", "#7c3aed", "#059669"][i] }}
                  >
                    {testimonial.initials}
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <div className="text-[14px] font-bold text-slate-800">{testimonial.name}</div>
                    <div className="text-[12px] text-slate-400">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOR CLIENTS + FOR PROVIDERS ─── */}
      <section className="py-2xl md:py-[80px] px-margin-mobile md:px-lg bg-white">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-lg">
          {/* For Clients */}
          <div className="rounded-2xl p-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-md">
                {t("landing.forClients.badge")}
              </span>
              <h3 className="text-[24px] font-extrabold text-slate-900 mb-sm">
                {t("landing.forClients.title")}
              </h3>
              <p className="text-[15px] text-slate-500 leading-relaxed mb-lg">
                {t("landing.forClients.desc")}
              </p>
              <ul className="space-y-2.5 mb-xl">
                {[t("landing.forClients.point1"), t("landing.forClients.point2"), t("landing.forClients.point3"), t("landing.forClients.point4")].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-slate-600">
                    <span className="material-symbols-outlined text-emerald-500 text-[18px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/beneficiary-signup"
              className="inline-flex items-center justify-center gap-2 text-[14px] font-bold px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors text-decoration-none w-fit"
            >
              {t("landing.forClients.cta")}
              <span className={`material-symbols-outlined text-[16px] ${isRTL ? '' : 'rotate-180'}`}>arrow_back</span>
            </Link>
          </div>

          {/* For Providers */}
          <div className="rounded-2xl p-xl border border-emerald-200 flex flex-col justify-between" style={{ background: "linear-gradient(135deg, #ecfdf5, #f0fdf4)" }}>
            <div>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider mb-md">
                {t("landing.forProviders.badge")}
              </span>
              <h3 className="text-[24px] font-extrabold text-slate-900 mb-sm">
                {t("landing.forProviders.title")}
              </h3>
              <p className="text-[15px] text-slate-500 leading-relaxed mb-lg">
                {t("landing.forProviders.desc")}
              </p>
              <ul className="space-y-2.5 mb-xl">
                {[t("landing.forProviders.point1"), t("landing.forProviders.point2"), t("landing.forProviders.point3"), t("landing.forProviders.point4")].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-slate-600">
                    <span className="material-symbols-outlined text-emerald-500 text-[18px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/provider-signup"
              className="inline-flex items-center justify-center gap-2 text-[14px] font-bold px-6 py-3 rounded-xl text-decoration-none w-fit transition-all"
              style={{ background: "#059669", color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#047857"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#059669"}
            >
              {t("landing.forProviders.cta")}
              <span className={`material-symbols-outlined text-[16px] ${isRTL ? '' : 'rotate-180'}`}>arrow_back</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-2xl md:py-[72px] px-margin-mobile md:px-lg" style={{ background: "#f8fafb" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-2xl">
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-slate-900 tracking-tight">
              {t("landing.faq.title")}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-5 py-4 flex items-center justify-between bg-transparent border-0 cursor-pointer`}
                >
                  <span className="text-[15px] font-semibold text-slate-800">{faq.q}</span>
                  <span
                    className={`material-symbols-outlined text-slate-400 text-[20px] transition-transform duration-200 flex-shrink-0 ${isRTL ? 'mr-4' : 'ml-4'}`}
                    style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0)" }}
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: openFaq === i ? "200px" : "0", opacity: openFaq === i ? 1 : 0 }}
                >
                  <div className="px-5 pb-4 text-[14px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative overflow-hidden py-2xl md:py-[80px] px-margin-mobile md:px-lg" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}></div>

        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-[32px] md:text-[40px] font-extrabold text-white mb-md tracking-tight">
            {t("landing.finalCta.title")}
          </h2>
          <p className="text-[17px] text-slate-400 mb-xl leading-relaxed">
            {t("landing.finalCta.desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/beneficiary-signup"
              className="inline-flex items-center justify-center gap-2 text-[15px] font-bold px-7 py-3.5 rounded-xl text-decoration-none transition-all"
              style={{ background: "#34d399", color: "#0f172a" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#6ee7b7"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#34d399"}
            >
              {t("landing.finalCta.createAccount")}
            </Link>
            <Link
              to="/browse-services"
              className="inline-flex items-center justify-center gap-2 text-[15px] font-bold px-7 py-3.5 rounded-xl border border-white/20 text-white hover:bg-white/[0.06] transition-colors text-decoration-none"
            >
              {t("landing.finalCta.exploreServices")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
