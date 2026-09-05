import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  UserCheck,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Users",
      value: "1,250",
      icon: Users,
    },
    {
      title: "Senior Citizens",
      value: "980",
      icon: UserCheck,
    },
    {
      title: "Community Owners",
      value: "120",
      icon: Users,
    },
    {
      title: "Total Communities",
      value: "150",
      icon: Building2,
    },
    {
      title: "Pending Approvals",
      value: "12",
      icon: Clock,
    },
    {
      title: "Approved Communities",
      value: "138",
      icon: CheckCircle,
    },
  ];

  const pendingCommunities = [
    {
      name: "Yoga for Seniors",
      owner: "Amit Verma",
      category: "Health & Wellness",
    },
    {
      name: "Golden Age Friends",
      owner: "Neha Kapoor",
      category: "Social",
    },
    {
      name: "Happy Senior Club",
      owner: "Rohit Sharma",
      category: "Social",
    },
  ];

  const recentUsers = [
    {
      name: "Rajesh Kumar",
      role: "Senior Citizen",
      time: "10 minutes ago",
    },
    {
      name: "Amit Verma",
      role: "Community Owner",
      time: "30 minutes ago",
    },
    {
      name: "Priya Sharma",
      role: "Senior Citizen",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="dashboard">
      <div className="page-title">
        <h1>Dashboard</h1>
        <p>Overview of Senior Community Connect</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-icon">
                <Icon size={22} />
              </div>

              <div>
                <p>{stat.title}</p>
                <h2>{stat.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        {/* Pending Communities */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Pending Approvals</h2>
              <p>Communities waiting for admin approval</p>
            </div>

            <button
              className="view-all-btn"
              onClick={() => navigate("/communities")}
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="dashboard-list">
            {pendingCommunities.map((community) => (
              <div className="dashboard-list-item" key={community.name}>
                <div>
                  <strong>{community.name}</strong>
                  <span>
                    {community.category} · {community.owner}
                  </span>
                </div>

                <span className="community-status pending">
                  PENDING
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Recent Users</h2>
              <p>Recently registered users</p>
            </div>

            <button
              className="view-all-btn"
              onClick={() => navigate("/users")}
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="dashboard-list">
            {recentUsers.map((user) => (
              <div className="dashboard-list-item" key={user.email}>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.role}</span>
                </div>

                <small>{user.time}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>

        <div className="quick-actions-grid">
          <button onClick={() => navigate("/users")}>
            <Users size={20} />
            <span>
              <strong>Manage Users</strong>
              <small>View and manage platform users</small>
            </span>
            <ArrowRight size={18} />
          </button>

          <button onClick={() => navigate("/communities")}>
            <Building2 size={20} />
            <span>
              <strong>Review Communities</strong>
              <small>Approve or reject communities</small>
            </span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;