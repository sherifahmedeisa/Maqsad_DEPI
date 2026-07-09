import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../ProviderSidebar";

function ProviderServices() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith("ar");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Software Development",
    description: "",
    price: "",
    tags: "",
  });
  
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { value: "Software Development", label: t("rfpForm.categories.software", "Software Development") },
    { value: "IT Infrastructure", label: t("rfpForm.categories.infrastructure", "IT Infrastructure") },
    { value: "Marketing & Design", label: t("rfpForm.categories.marketing", "Marketing & Design") },
    { value: "Legal & Auditing", label: t("rfpForm.categories.legal", "Legal & Auditing") },
    { value: "Financial Services", label: t("rfpForm.categories.financial", "Financial Services") },
    { value: "General Services", label: t("rfpForm.categories.general", "General Services") },
  ];

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/services/mine");
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLimitReached(false);
    
    try {
      const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : null,
        tags: tagsArray,
      };

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 403) {
        const errData = await res.json();
        if (errData.error === 'LIMIT_REACHED') {
          setLimitReached(true);
          setShowForm(false);
          return;
        }
      }

      if (!res.ok) {
        throw new Error("Failed to create service");
      }

      // Success
      setShowForm(false);
      setFormData({ title: "", category: "Software Development", description: "", price: "", tags: "" });
      fetchServices();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteService = async (id) => {
    if (!confirm(isRTL ? "هل أنت متأكد من حذف هذه الخدمة؟" : "Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen w-full">
      <ProviderSidebar />
      <div className="flex-grow flex flex-col min-h-screen overflow-hidden provider-main-content w-full">
        <div className="flex-grow bg-surface-container-lowest p-margin-mobile md:p-xl">
      <div className="max-w-container-max mx-auto">
        <div className="flex justify-between items-center mb-xl">
          <div>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
              {isRTL ? "خدماتي" : "My Services"}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {isRTL ? "إدارة الخدمات التي تقدمها للعملاء" : "Manage the services you offer to clients"}
            </p>
          </div>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              {isRTL ? "إضافة خدمة جديدة" : "Add New Service"}
            </button>
          )}
        </div>

        {limitReached && (
          <div className="bg-[#E8F5E9] border border-[#4CAF50] rounded-xl p-lg mb-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-md">
            <div className="flex items-start gap-md">
              <span className="material-symbols-outlined text-[#4CAF50] text-[32px] mt-1">info</span>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-[#2E7D32] mb-xs">
                  {isRTL ? "وصلت إلى الحد الأقصى للباقة المجانية" : "Free Tier Limit Reached"}
                </h3>
                <p className="font-body-md text-body-md text-[#1B5E20]">
                  {isRTL 
                    ? "لقد وصلت إلى الحد الأقصى للخدمات المجانية. لنشر المزيد من الخدمات ومناقشة باقات الأسعار، يرجى التواصل مع فريق المبيعات عبر واتساب." 
                    : "You have reached the maximum number of free services. To post more services and discuss pricing, please contact our sales team via WhatsApp."}
                </p>
              </div>
            </div>
            <a 
              href="https://wa.me/201061016670" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-label-md text-label-md px-lg py-md rounded-lg flex items-center justify-center gap-xs hover:bg-[#128C7E] transition-colors whitespace-nowrap"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {isRTL ? "تواصل مع المبيعات 01061016670" : "Contact Sales: 01061016670"}
            </a>
          </div>
        )}

        {showForm && !limitReached && (
          <div className="bg-surface-container border border-outline-variant rounded-xl p-lg mb-xl animate-fade-in">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-xs">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                {isRTL ? "إضافة خدمة" : "Post Service"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {error && <div className="text-error mb-md font-body-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-background mb-xs">
                    {isRTL ? "عنوان الخدمة" : "Service Title"} *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-background mb-xs">
                    {isRTL ? "التصنيف" : "Category"} *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-background mb-xs">
                  {isRTL ? "الوصف" : "Description"} *
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors resize-y"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-background mb-xs">
                    {isRTL ? "السعر المبدئي (اختياري)" : "Starting Price (Optional)"}
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-background mb-xs">
                    {isRTL ? "كلمات دلالية (مفصولة بفاصلة)" : "Tags (comma separated)"}
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="React, Node.js, Design"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-sm mt-sm">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface px-md py-sm transition-colors"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="bg-secondary text-on-secondary font-label-md text-label-md px-lg py-sm rounded-lg hover:opacity-90 transition-opacity"
                >
                  {isRTL ? "حفظ الخدمة" : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        {loading ? (
          <div className="text-center py-2xl text-on-surface-variant">Loading...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-2xl bg-surface-container border border-outline-variant rounded-xl border-dashed">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/50 mb-sm">design_services</span>
            <p className="font-body-lg text-on-surface-variant">
              {isRTL ? "لم تقم بإضافة أي خدمات بعد" : "You haven't added any services yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {services.map(service => (
              <div key={service.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col hover:border-secondary hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-sm">
                  <h3 className="font-label-lg text-label-lg text-on-surface font-semibold line-clamp-2">
                    {service.title}
                  </h3>
                  <button 
                    onClick={() => deleteService(service.id)}
                    className="text-error/80 hover:text-error transition-colors p-1"
                    title={isRTL ? "حذف" : "Delete"}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
                
                <span className="inline-block bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-xs py-1 rounded w-fit mb-md">
                  {categories.find(c => c.value === service.category)?.label || service.category}
                </span>

                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mb-md flex-grow">
                  {service.description}
                </p>

                <div className="flex justify-between items-end border-t border-outline-variant pt-sm mt-auto">
                  <div className="font-label-md text-label-md text-primary font-bold">
                    {service.price ? `$${service.price}` : (isRTL ? "سعر متغير" : "Variable Price")}
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end w-1/2">
                    {service.tags && service.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="bg-surface-container text-on-surface-variant font-label-sm text-[10px] px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {service.tags && service.tags.length > 2 && (
                      <span className="bg-surface-container text-on-surface-variant font-label-sm text-[10px] px-2 py-0.5 rounded-full">
                        +{service.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default ProviderServices;
