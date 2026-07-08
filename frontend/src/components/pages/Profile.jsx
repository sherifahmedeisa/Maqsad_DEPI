import { useState, useEffect } from "react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users/me", {
        credentials: "include",
      });
      const data = await response.json();
      setUser(data);
      setFormData({
        fullName: data.fullName,
        email: data.email,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
        alert("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (!user) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p className="subtitle">Manage your account information</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {user.fullName.charAt(0).toUpperCase()}
        </div>

        {isEditing ? (
          <form className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={user.role}
                disabled
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-save"
                onClick={handleSaveProfile}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-field">
              <label>Full Name</label>
              <p>{user.fullName}</p>
            </div>

            <div className="info-field">
              <label>Email</label>
              <p>{user.email}</p>
            </div>

            <div className="info-field">
              <label>Role</label>
              <p className="badge">{user.role}</p>
            </div>

            <div className="info-field">
              <label>Account Status</label>
              <p className="badge active">{user.accountStatus}</p>
            </div>

            <button
              className="btn-edit"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
