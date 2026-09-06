// import { useEffect, useState } from "react";
// import {
//   NavLink,
//   Outlet,
//   useNavigate,
//   useLocation,
// } from "react-router-dom";

// import { getCommunities } from "../api/api";

// function AdminLayout() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [pendingCount, setPendingCount] = useState(0);

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     navigate("/login");
//   };

//   const loadPendingCount = async () => {
//     try {
//       const response = await getCommunities();

//       const communities = response.data || [];

//       const pending = communities.filter(
//         (community) => community.status === "PENDING"
//       ).length;

//       setPendingCount(pending);
//     } catch (error) {
//       console.error(
//         "Failed to load pending community count:",
//         error.message
//       );
//     }
//   };

//   useEffect(() => {
//     loadPendingCount();

//     const handleFocus = () => {
//       loadPendingCount();
//     };

//     window.addEventListener("focus", handleFocus);

//     const interval = setInterval(() => {
//       loadPendingCount();
//     }, 30000);

//     return () => {
//       window.removeEventListener("focus", handleFocus);
//       clearInterval(interval);
//     };
//   }, [location.pathname]);

//   return (
//     <div className="admin-layout">
//       <aside className="sidebar">
//         <div className="sidebar-logo">
//           <h2>Senior Connect</h2>
//           <span>Admin Portal</span>
//         </div>

//         <nav>
//           <NavLink to="/dashboard">
//             Dashboard
//           </NavLink>

//           <NavLink to="/users">
//             Users
//           </NavLink>

//           <NavLink to="/communities">
//             <span>Communities</span>

//             {pendingCount > 0 && (
//               <span className="pending-badge">
//                 {pendingCount}
//               </span>
//             )}
//           </NavLink>

//           <NavLink to="/activity-logs">
//             Activity Logs
//           </NavLink>
//         </nav>

//         <button
//           className="logout-btn"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </aside>

//       <main className="admin-main">
//         <header className="admin-header">
//           <h2>Admin Portal</h2>

//           <button
//             className="admin-profile-btn"
//             onClick={() => navigate("/profile")}
//           >
//             Administrator
//           </button>
//         </header>

//         <section className="admin-content">
//           <Outlet />
//         </section>
//       </main>
//     </div>
//   );
// }

// export default AdminLayout;
import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { Bell } from "lucide-react";

import { getCommunities } from "../api/api";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [pendingCount, setPendingCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const loadPendingCount = async () => {
    try {
      const response = await getCommunities();

      const communities = response.data || [];

      const pending = communities.filter(
        (community) => community.status === "PENDING"
      ).length;

      setPendingCount(pending);
    } catch (error) {
      console.error(
        "Failed to load pending community count:",
        error.message
      );
    }
  };

  useEffect(() => {
    loadPendingCount();

    const handleFocus = () => {
      loadPendingCount();
    };

    window.addEventListener("focus", handleFocus);

    const interval = setInterval(() => {
      loadPendingCount();
    }, 30000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [location.pathname]);

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Senior Connect</h2>
          <span>Admin Portal</span>
        </div>

        <nav>
          <NavLink to="/dashboard">
            Dashboard
          </NavLink>

          <NavLink to="/users">
            Users
          </NavLink>

          <NavLink to="/communities">
            Communities
          </NavLink>

          <NavLink to="/activity-logs">
            Activity Logs
          </NavLink>
        </nav>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h2>Admin Portal</h2>

          <div className="admin-header-right">
            <button
              className="notification-btn"
              onClick={() => navigate("/communities")}
              title={
                pendingCount > 0
                  ? `${pendingCount} pending community ${
                      pendingCount === 1
                        ? "approval"
                        : "approvals"
                    }`
                  : "No pending community approvals"
              }
              aria-label={
                pendingCount > 0
                  ? `${pendingCount} pending community ${
                      pendingCount === 1
                        ? "approval"
                        : "approvals"
                    }`
                  : "No pending community approvals"
              }
            >
              <Bell size={22} />

              {pendingCount > 0 && (
                <span className="notification-badge">
                  {pendingCount > 99
                    ? "99+"
                    : pendingCount}
                </span>
              )}
            </button>

            <button
              className="admin-profile-btn"
              onClick={() => navigate("/profile")}
            >
              Administrator
            </button>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default AdminLayout;