import { useState } from "react";
import {
  Search,
  Eye,
  UserCheck,
  UserX,
  Trash2,
  Edit,
  X,
} from "lucide-react";

function Users() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh@gmail.com",
      role: "SENIOR",
      status: "Active",
      phone: "+91 9876543210",
      createdAt: "September 1, 2026",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@gmail.com",
      role: "SENIOR",
      status: "Active",
      phone: "+91 9876543211",
      createdAt: "August 29, 2026",
    },
    {
      id: 3,
      name: "Amit Verma",
      email: "amit@gmail.com",
      role: "OWNER",
      status: "Active",
      phone: "+91 9876543212",
      createdAt: "August 27, 2026",
    },
    {
      id: 4,
      name: "Sunita Patel",
      email: "sunita@gmail.com",
      role: "SENIOR",
      status: "Inactive",
      phone: "+91 9876543213",
      createdAt: "August 24, 2026",
    },
    {
      id: 5,
      name: "Vikram Singh",
      email: "vikram@gmail.com",
      role: "OWNER",
      status: "Active",
      phone: "+91 9876543214",
      createdAt: "August 20, 2026",
    },
  ]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const toggleStatus = (id) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );

    setSelectedUser((current) =>
      current && current.id === id
        ? {
            ...current,
            status:
              current.status === "Active" ? "Inactive" : "Active",
          }
        : current
    );
  };

  const deleteUser = (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) return;

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== id)
    );

    setSelectedUser(null);
    setEditingUser(null);
  };

  const saveUser = () => {
    if (!editingUser) return;

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === editingUser.id ? editingUser : user
      )
    );

    setSelectedUser(editingUser);
    setEditingUser(null);
  };

  return (
    <div>
      <div className="page-title">
        <h1>Users</h1>
        <p>Manage platform users</p>
      </div>

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
                  <tr key={user.id}>
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
                        className={`status-badge ${user.status.toLowerCase()}`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-btn"
                          title="View user"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          className="icon-btn"
                          title={
                            user.status === "Active"
                              ? "Deactivate user"
                              : "Activate user"
                          }
                          onClick={() => toggleStatus(user.id)}
                        >
                          {user.status === "Active" ? (
                            <UserX size={17} />
                          ) : (
                            <UserCheck size={17} />
                          )}
                        </button>

                        <button
                          className="icon-btn reject-btn"
                          title="Delete user"
                          onClick={() =>
                            deleteUser(user.id, user.name)
                          }
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
                <strong>{selectedUser.phone}</strong>
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
                  className={`status-badge ${selectedUser.status.toLowerCase()}`}
                >
                  {selectedUser.status}
                </span>
              </div>

              <div className="detail-item">
                <span>Account Created</span>
                <strong>{selectedUser.createdAt}</strong>
              </div>
            </div>

            <div className="user-modal-actions">
              <button
                className="activate-user-btn"
                onClick={() => setEditingUser({ ...selectedUser })}
              >
                <Edit size={18} />
                Edit User
              </button>

              <button
                className={
                  selectedUser.status === "Active"
                    ? "deactivate-user-btn"
                    : "activate-user-btn"
                }
                onClick={() => toggleStatus(selectedUser.id)}
              >
                {selectedUser.status === "Active" ? (
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

              <button
                className="reject-community-btn"
                onClick={() =>
                  deleteUser(
                    selectedUser.id,
                    selectedUser.name
                  )
                }
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

            <div className="edit-user-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={editingUser.phone}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Role</label>

                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="SENIOR">Senior Citizen</option>
                  <option value="OWNER">Community Owner</option>
                </select>
              </div>
            </div>

            <div className="user-modal-actions">
              <button
                className="activate-user-btn"
                onClick={saveUser}
              >
                <UserCheck size={18} />
                Save Changes
              </button>

              <button
                className="close-modal-btn"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;