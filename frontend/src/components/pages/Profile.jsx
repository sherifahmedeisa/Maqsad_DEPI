import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../ProviderSidebar";
import "./Profile.css";

function Profile() {
  const { user: authUser } = useAuth();
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({});

  const isRTL = i18n.language.startsWith("ar");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/me");
      if (!response.ok) {
        throw new Error(t("profile.failedUpdate"));
      }
      const data = await response.json();
      setUser(data);

      // Initialize form data based on role
      const initialForm = {
        fullName: data.fullName || "",
        phone: data.phone || "",
        country: data.country || "",
        city: data.city || "",
      };

      if (data.role === "beneficiary") {
        const bp = data.beneficiaryProfile || {};
        initialForm.organizationName = bp.organizationName || "";
        initialForm.industry = bp.industry || "";
        initialForm.websiteUrl = bp.websiteUrl || "";
        initialForm.bio = bp.bio || "";
      } else if (data.role === "provider") {
        const pp = data.providerProfile || {};
        initialForm.companyName = pp.companyName || "";
        initialForm.description = pp.description || "";
        initialForm.websiteUrl = pp.websiteUrl || "";
        initialForm.serviceTags = Array.isArray(pp.serviceTags)
          ? pp.serviceTags.join(", ")
          : typeof pp.serviceTags === "string"
          ? pp.serviceTags
          : "";
      }

      setFormData(initialForm);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setError("");
      
      // Prepare payload
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
      };

      if (user.role === "beneficiary") {
        payload.organizationName = formData.organizationName;
        payload.industry = formData.industry;
        payload.websiteUrl = formData.websiteUrl;
        payload.bio = formData.bio;
      } else if (user.role === "provider") {
        payload.companyName = formData.companyName;
        payload.description = formData.description;
        payload.websiteUrl = formData.websiteUrl;
        
        // Parse comma-separated serviceTags into array
        payload.serviceTags = formData.serviceTags
          ? formData.serviceTags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [];
      }

      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(t("profile.failedUpdate"));
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      alert(t("profile.successUpdate"));
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message || t("profile.failedUpdate"));
    }
  };

  if (loading) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="font-body-md text-body-md text-on-surface-variant">Loading Profile...</p>
      </div>
    );
  }

  const isProvider = user?.role === "provider";

  const mainContent = (
    <div className={`profile-wrapper ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="profile-header">
        <h1 className={`font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface font-bold ${isRTL ? "text-right" : "text-left"}`}>
          {t("profile.title")}
        </h1>
        <p className={`font-body-md text-body-md text-on-surface-variant ${isRTL ? "text-right" : "text-left"}`}>
          {t("profile.subtitle")}
        </p>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-md rounded-lg border border-error/10 font-body-sm mb-lg">
          {error}
        </div>
      )}

      <div className="profile-card bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
        <div className="profile-avatar bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center font-bold text-2xl mb-lg mx-auto">
          {user?.fullName?.charAt(0).toUpperCase() || "U"}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="profile-form flex flex-col gap-md">
            
            {/* Standard User Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div className="form-group">
                <label className="font-semibold text-sm text-on-surface">{t("profile.labels.fullName")}</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t("profile.placeholders.fullName")}
                  className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md"
                />
              </div>

              <div className="form-group">
                <label className="font-semibold text-sm text-on-surface">{t("profile.labels.email")}</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border border-outline-variant bg-surface-container-low rounded-xl text-on-surface-variant cursor-not-allowed font-body-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
              <div className="form-group">
                <label className="font-semibold text-sm text-on-surface">{t("profile.labels.phone")}</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t("profile.placeholders.phone")}
                  className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md"
                />
              </div>

              <div className="form-group">
                <label className="font-semibold text-sm text-on-surface">{t("profile.labels.country")}</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder={t("profile.placeholders.country")}
                  className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md"
                />
              </div>

              <div className="form-group">
                <label className="font-semibold text-sm text-on-surface">{t("profile.labels.city")}</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder={t("profile.placeholders.city")}
                  className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md"
                />
              </div>
            </div>

            {/* Client (Beneficiary) Specific Fields */}
            {user.role === "beneficiary" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div className="form-group">
                    <label className="font-semibold text-sm text-on-surface">{t("profile.labels.organizationName")}</label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      placeholder={t("profile.placeholders.organizationName")}
                      className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md"
                    />
                  </div>

                  <div className="form-group">
                    <label className="font-semibold text-sm text-on-surface">{t("profile.labels.industry")}</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder={t("profile.placeholders.industry")}
                      className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="font-semibold text-sm text-on-surface">{t("profile.labels.websiteUrl")}</label>
                  <input
                    type="text"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    placeholder={t("profile.placeholders.websiteUrl")}
                    className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md"
                  />
                </div>

                <div className="form-group">
                  <label className="font-semibold text-sm text-on-surface">{t("profile.labels.bio")}</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder={t("profile.placeholders.bio")}
                    rows={4}
                    className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md resize-y"
                  />
                </div>
              </>
            )}

            {/* Provider Specific Fields */}
            {user.role === "provider" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div className="form-group">
                    <label className="font-semibold text-sm text-on-surface">{t("profile.labels.companyName")}</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder={t("profile.placeholders.companyName")}
                      className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md"
                    />
                  </div>

                  <div className="form-group">
                    <label className="font-semibold text-sm text-on-surface">{t("profile.labels.websiteUrl")}</label>
                    <input
                      type="text"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      placeholder={t("profile.placeholders.websiteUrl")}
                      className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="font-semibold text-sm text-on-surface">{t("profile.labels.serviceTags")}</label>
                  <input
                    type="text"
                    name="serviceTags"
                    value={formData.serviceTags}
                    onChange={handleInputChange}
                    placeholder={t("profile.placeholders.serviceTags")}
                    className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md"
                  />
                </div>

                <div className="form-group">
                  <label className="font-semibold text-sm text-on-surface">{t("profile.labels.description")}</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={t("profile.placeholders.description")}
                    rows={4}
                    className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md resize-y"
                  />
                </div>
              </>
            )}

            <div className="form-actions flex gap-md mt-md">
              <button type="submit" className="btn-save flex-1 py-2 px-4 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-0">
                {t("profile.saveBtn")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  fetchUserProfile();
                }}
                className="btn-cancel flex-1 py-2 px-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors cursor-pointer border-0"
              >
                {t("profile.cancelBtn")}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info flex flex-col gap-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div className="info-field border-b border-outline-variant pb-sm">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.fullName")}</label>
                <p className="font-body-md text-on-surface m-0 font-medium">{user.fullName || "-"}</p>
              </div>

              <div className="info-field border-b border-outline-variant pb-sm">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.email")}</label>
                <p className="font-body-md text-on-surface m-0 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
              <div className="info-field border-b border-outline-variant pb-sm">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.phone")}</label>
                <p className="font-body-md text-on-surface m-0 font-medium">{user.phone || "-"}</p>
              </div>

              <div className="info-field border-b border-outline-variant pb-sm">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.country")}</label>
                <p className="font-body-md text-on-surface m-0 font-medium">{user.country || "-"}</p>
              </div>

              <div className="info-field border-b border-outline-variant pb-sm">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.city")}</label>
                <p className="font-body-md text-on-surface m-0 font-medium">{user.city || "-"}</p>
              </div>
            </div>

            {/* Client (Beneficiary) Specific Fields */}
            {user.role === "beneficiary" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div className="info-field border-b border-outline-variant pb-sm">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.organizationName")}</label>
                    <p className="font-body-md text-on-surface m-0 font-medium">
                      {user.beneficiaryProfile?.organizationName || "-"}
                    </p>
                  </div>

                  <div className="info-field border-b border-outline-variant pb-sm">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.industry")}</label>
                    <p className="font-body-md text-on-surface m-0 font-medium">{user.beneficiaryProfile?.industry || "-"}</p>
                  </div>
                </div>

                <div className="info-field border-b border-outline-variant pb-sm">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.websiteUrl")}</label>
                  {user.beneficiaryProfile?.websiteUrl ? (
                    <a
                      href={user.beneficiaryProfile.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body-md text-secondary hover:underline"
                    >
                      {user.beneficiaryProfile.websiteUrl}
                    </a>
                  ) : (
                    <p className="font-body-md text-on-surface m-0 font-medium">-</p>
                  )}
                </div>

                <div className="info-field">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.bio")}</label>
                  <p className="font-body-md text-on-surface m-0 font-medium whitespace-pre-line">
                    {user.beneficiaryProfile?.bio || "-"}
                  </p>
                </div>
              </>
            )}

            {/* Provider Specific Fields */}
            {user.role === "provider" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div className="info-field border-b border-outline-variant pb-sm">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.companyName")}</label>
                    <p className="font-body-md text-on-surface m-0 font-medium">
                      {user.providerProfile?.companyName || "-"}
                    </p>
                  </div>

                  <div className="info-field border-b border-outline-variant pb-sm">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.websiteUrl")}</label>
                    {user.providerProfile?.websiteUrl ? (
                      <a
                        href={user.providerProfile.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body-md text-secondary hover:underline"
                      >
                        {user.providerProfile.websiteUrl}
                      </a>
                    ) : (
                      <p className="font-body-md text-on-surface m-0 font-medium">-</p>
                    )}
                  </div>
                </div>

                <div className="info-field border-b border-outline-variant pb-sm">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.serviceTags")}</label>
                  <div className="flex flex-wrap gap-xs mt-xs">
                    {Array.isArray(user.providerProfile?.serviceTags) &&
                    user.providerProfile.serviceTags.length > 0 ? (
                      user.providerProfile.serviceTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container border border-secondary-fixed"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="font-body-md text-on-surface m-0 font-medium">-</p>
                    )}
                  </div>
                </div>

                <div className="info-field">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-xs">{t("profile.labels.description")}</label>
                  <p className="font-body-md text-on-surface m-0 font-medium whitespace-pre-line">
                    {user.providerProfile?.description || "-"}
                  </p>
                </div>
              </>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2.5 px-4 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-opacity mt-md cursor-pointer border-0"
            >
              {t("profile.editBtn")}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (isProvider) {
    return (
      <div className="flex bg-[#f8fafc] min-h-screen">
        <ProviderSidebar />
        <div className="flex-grow flex flex-col min-h-screen overflow-hidden pl-0 lg:pl-0">
          <main className="flex-grow p-lg md:p-xl max-w-container-max w-full mx-auto flex flex-col gap-lg mb-20">
            {mainContent}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
      {mainContent}
    </div>
  );
}

export default Profile;
