import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserRound,
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

import { getDashboardStats } from "../api/api";
import "./Dashboard.css";
function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    seniorCitizens: 0,
    communityOwners: 0,
    totalCommunities: 0,
    pendingCommunities: 0,
    approvedCommunities: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getDashboardStats();

        setStats(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
    },
    {
      title: "Senior Citizens",
      value: stats.seniorCitizens,
      icon: UserRound,
    },
    {
      title: "Community Owners",
      value: stats.communityOwners,
      icon: ShieldCheck,
    },
    {
      title: "Total Communities",
      value: stats.totalCommunities,
      icon: Building2,
    },
    {
      title: "Pending Approvals",
      value: stats.pendingCommunities,
      icon: Clock,
    },
    {
      title: "Approved Communities",
      value: stats.approvedCommunities,
      icon: CheckCircle,
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="page-title">
          <h1>Dashboard</h1>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-title">
        <h1>Dashboard</h1>
        <p>Overview of Senior Community Connect</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="stat-card" key={card.title}>
              <div className="stat-icon">
                <Icon size={24} />
              </div>

              <div className="stat-info">
                <p>{card.title}</p>
                <h2>{card.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Pending Community Approvals</h2>
              <p>Communities waiting for admin review</p>
            </div>

            <button onClick={() => navigate("/communities")}>
              View All
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="dashboard-empty">
            <Clock size={32} />
            <p>
              {stats.pendingCommunities === 0
                ? "No pending communities"
                : `${stats.pendingCommunities} communities waiting for approval`}
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage the platform</p>
            </div>
          </div>

          <div className="quick-actions">
            <button onClick={() => navigate("/users")}>
              <Users size={18} />
              Manage Users
            </button>

            <button onClick={() => navigate("/communities")}>
              <Building2 size={18} />
              Manage Communities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;