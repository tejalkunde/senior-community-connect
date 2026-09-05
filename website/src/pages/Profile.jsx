import { useState } from "react";
import { User, Mail, Shield, Save } from "lucide-react";

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

  return (
    <div className="profile-page">
      <div className="page-title">
        <h1>Admin Profile</h1>
        <p>Manage your administrator profile</p>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={32} />
          </div>

          <div>
            <h2>{name}</h2>
            <p>Platform Administrator</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Name</label>

            <div className="profile-input">
              <User size={18} />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>

            <div className="profile-input">
              <Mail size={18} />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Role</label>

            <div className="profile-input">
              <Shield size={18} />

              <input
                type="text"
                value="Administrator"
                disabled
              />
            </div>
          </div>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          <button type="submit" className="save-profile-btn">
            <Save size={18} />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;