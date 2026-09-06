import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  UserCheck,
  UserX,
  Trash2,
  Edit,
  X,
} from "lucide-react";
import {
  getUsers,
  getUserById,
  updateUserStatus,
} from "../api/api";

function Users() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch real users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUsers();

      setUsers(response.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Search + role filter
  const filteredUsers = users.filter((user) => {
    const name = user.name?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";

    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Activate / Deactivate user
  const toggleStatus = async (user) => {
    try {
      const newStatus = !user.isActive;

      await updateUserStatus(user._id, newStatus);

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser._id === user._id
            ? {
                ...currentUser,
                isActive: newStatus,
              }
            : currentUser
        )
      );

      setSelectedUser((current) =>
        current && current._id === user._id
          ? {
              ...current,
              isActive: newStatus,
            }
          : current
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // View user details
  const viewUser = async (user) => {
    try {
      const response = await getUserById(user._id);
      setSelectedUser(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Edit is not supported by current backend
  const handleEdit = () => {
    setError("Edit user API is not available yet.");
  };

  // Delete is not supported by current backend
  const handleDelete = () => {
    setError("Delete user API is not available yet.");
  };

  return (
    <div>
      <div className="page-title">
        <h1>Users</h1>
        <p>Manage platform users</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="table-card">
        <div className="users-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="SENIOR">Senior Citizen</option>
            <option value="OWNER">Community Owner</option>
          </select>
        </div>

        <div className="users-table-wrapper">
          {loading ? (
            <div className="dashboard-empty">
              <p>Loading users...</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <strong>{user.name}</strong>
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span
                          className={`role-badge ${user.role.toLowerCase()}`}
                        >
                          {user.role === "SENIOR"
                            ? "Senior Citizen"
                            : "Community Owner"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            user.isActive ? "active" : "inactive"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          {/* View */}
                          <button
                            className="icon-btn"
                            title="View user"
                            onClick={() => viewUser(user)}
                          >
                            <Eye size={17} />
                          </button>

                          {/* Activate / Deactivate */}
                          <button
                            className="icon-btn"
                            title={
                              user.isActive
                                ? "Deactivate user"
                                : "Activate user"
                            }
                            onClick={() => toggleStatus(user)}
                          >
                            {user.isActive ? (
                              <UserX size={17} />
                            ) : (
                              <UserCheck size={17} />
                            )}
                          </button>

                          {/* Delete - backend not available */}
                          <button
                            className="icon-btn reject-btn"
                            title="Delete user"
                            onClick={handleDelete}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-users">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* USER DETAILS MODAL */}
      {selectedUser && !editingUser && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="user-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{selectedUser.name}</h2>
                <p>User Details</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedUser(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="user-details">
              <div className="detail-item">
                <span>Name</span>
                <strong>{selectedUser.name}</strong>
              </div>

              <div className="detail-item">
                <span>Email</span>
                <strong>{selectedUser.email}</strong>
              </div>

              <div className="detail-item">
                <span>Phone</span>
                <strong>
                  {selectedUser.phone || "Not provided"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Role</span>
                <strong>
                  {selectedUser.role === "SENIOR"
                    ? "Senior Citizen"
                    : "Community Owner"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Status</span>

                <span
                  className={`status-badge ${
                    selectedUser.isActive
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {selectedUser.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              <div className="detail-item">
                <span>Account Created</span>
                <strong>
                  {selectedUser.createdAt
                    ? new Date(
                        selectedUser.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </strong>
              </div>
            </div>

            <div className="user-modal-actions">
              {/* Edit */}
              <button
                className="activate-user-btn"
                onClick={handleEdit}
              >
                <Edit size={18} />
                Edit User
              </button>

              {/* Status */}
              <button
                className={
                  selectedUser.isActive
                    ? "deactivate-user-btn"
                    : "activate-user-btn"
                }
                onClick={() => toggleStatus(selectedUser)}
              >
                {selectedUser.isActive ? (
                  <>
                    <UserX size={18} />
                    Deactivate User
                  </>
                ) : (
                  <>
                    <UserCheck size={18} />
                    Activate User
                  </>
                )}
              </button>

              {/* Delete */}
              <button
                className="reject-community-btn"
                onClick={handleDelete}
              >
                <Trash2 size={18} />
                Delete User
              </button>

              <button
                className="close-modal-btn"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div
          className="modal-overlay"
          onClick={() => setEditingUser(null)}
        >
          <div
            className="user-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Edit User</h2>
                <p>Update user information</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setEditingUser(null)}
              >
                <X size={20} />
              </button>
            </div>

            <p>
              Edit functionality will be connected once the
              backend update-user API is added.
            </p>

            <div className="user-modal-actions">
              <button
                className="close-modal-btn"
                onClick={() => setEditingUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;