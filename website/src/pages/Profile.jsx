import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Save,
  Lock,
  CheckCircle,
} from "lucide-react";

import "./Profile.css";

function Profile() {
  const [name, setName] = useState("Administrator");
  const [email, setEmail] = useState("admin@seniorconnect.com");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("Profile updated successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const getInitials = () => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="profile-page">
      {/* Page Header */}
      <div className="page-title">
        <h1>Admin Profile</h1>
        <p>Manage your administrator account and profile information</p>
      </div>

      <div className="profile-layout">
        {/* Profile Summary */}
        <div className="profile-summary-card">
          <div className="profile-avatar-large">
            {getInitials()}
          </div>

          <h2>{name}</h2>
          <p className="profile-role">Platform Administrator</p>

          <div className="profile-status">
            <CheckCircle size={16} />
            <span>Administrator Account</span>
          </div>

          <div className="profile-summary-divider" />

          <div className="profile-summary-item">
            <Shield size={18} />
            <div>
              <span>Role</span>
              <strong>Administrator</strong>
            </div>
          </div>

          <div className="profile-summary-item">
            <Mail size={18} />
            <div>
              <span>Email</span>
              <strong>{email}</strong>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2>Profile Information</h2>
              <p>Update your personal information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="profile-name">Full Name</label>

              <div className="profile-input">
                <User size={18} />

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="profile-email">Email Address</label>

              <div className="profile-input">
                <Mail size={18} />

                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div className="form-group">
              <label htmlFor="profile-role">Role</label>

              <div className="profile-input disabled-input">
                <Shield size={18} />

                <input
                  id="profile-role"
                  type="text"
                  value="Administrator"
                  disabled
                  readOnly
                />
              </div>

              <small>
                Your administrator role cannot be changed from this page.
              </small>
            </div>

            {/* Security */}
            <div className="profile-security">
              <div className="security-icon">
                <Lock size={19} />
              </div>

              <div>
                <h3>Account Security</h3>
                <p>
                  Your account is protected with administrator access
                  controls.
                </p>
              </div>
            </div>

            {/* Success Message */}
            {message && (
              <div className="success-message">
                <CheckCircle size={18} />
                <span>{message}</span>
              </div>
            )}

            {/* Save */}
            <div className="profile-form-footer">
              <button type="submit" className="save-profile-btn">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;