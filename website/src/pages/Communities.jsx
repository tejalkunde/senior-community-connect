import { useEffect, useState } from "react";
import { Search, Eye, Check, X } from "lucide-react";
import {
  getCommunities,
  approveCommunity,
  rejectCommunity,
} from "../api/api";

function Communities() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load real communities
  const loadCommunities = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCommunities();

      setCommunities(response.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  // Search + status filter
  const filteredCommunities = communities.filter((community) => {
    const ownerName = community.owner?.name || "";
    const communityName = community.name || "";

    const matchesSearch =
      communityName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      ownerName
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      community.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Approve community
  const handleApprove = async (community) => {
    const confirmed = window.confirm(
      `Approve "${community.name}" community?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await approveCommunity(community._id);

      const updatedCommunity = response.data;

      setCommunities((currentCommunities) =>
        currentCommunities.map((item) =>
          item._id === community._id
            ? updatedCommunity
            : item
        )
      );

      setSelectedCommunity((current) =>
        current && current._id === community._id
          ? updatedCommunity
          : current
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Reject community
  const handleReject = async (community) => {
    const reason = window.prompt(
      `Why do you want to reject "${community.name}"?`
    );

    if (reason === null) return;

    try {
      setError("");

      const response = await rejectCommunity(
        community._id,
        reason
      );

      const updatedCommunity = response.data;

      setCommunities((currentCommunities) =>
        currentCommunities.map((item) =>
          item._id === community._id
            ? updatedCommunity
            : item
        )
      );

      setSelectedCommunity((current) =>
        current && current._id === community._id
          ? updatedCommunity
          : current
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="page-title">
        <h1>Communities</h1>
        <p>Manage and approve communities</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="table-card">
        <div className="communities-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search communities or owners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="users-table-wrapper">
          {loading ? (
            <div className="dashboard-empty">
              <p>Loading communities...</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Community</th>
                  <th>Category</th>
                  <th>Owner</th>
                  <th>Members</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCommunities.length > 0 ? (
                  filteredCommunities.map((community) => (
                    <tr key={community._id}>
                      <td>
                        <strong>{community.name}</strong>
                      </td>

                      <td>{community.category}</td>

                      <td>
                        {community.owner?.name || "Unknown"}
                      </td>

                      <td>
                        {community.membersCount ??
                          community.members?.length ??
                          0}
                      </td>

                      <td>
                        <span
                          className={`community-status ${community.status.toLowerCase()}`}
                        >
                          {community.status}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          {/* View */}
                          <button
                            className="icon-btn"
                            title="View community"
                            onClick={() =>
                              setSelectedCommunity(
                                community
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>

                          {/* Approve / Reject */}
                          {community.status ===
                            "PENDING" && (
                            <>
                              <button
                                className="icon-btn approve-btn"
                                title="Approve community"
                                onClick={() =>
                                  handleApprove(
                                    community
                                  )
                                }
                              >
                                <Check size={17} />
                              </button>

                              <button
                                className="icon-btn reject-btn"
                                title="Reject community"
                                onClick={() =>
                                  handleReject(
                                    community
                                  )
                                }
                              >
                                <X size={17} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="no-users"
                    >
                      No communities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* COMMUNITY DETAILS MODAL */}
      {selectedCommunity && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedCommunity(null)
          }
        >
          <div
            className="community-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{selectedCommunity.name}</h2>
                <p>Community Details</p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedCommunity(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="community-details">
              <div className="detail-item">
                <span>Category</span>
                <strong>
                  {selectedCommunity.category}
                </strong>
              </div>

              <div className="detail-item">
                <span>Owner</span>
                <strong>
                  {selectedCommunity.owner?.name ||
                    "Unknown"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Owner Email</span>
                <strong>
                  {selectedCommunity.owner?.email ||
                    "N/A"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Members</span>
                <strong>
                  {selectedCommunity.membersCount ??
                    selectedCommunity.members?.length ??
                    0}
                </strong>
              </div>

              <div className="detail-item">
                <span>Status</span>

                <span
                  className={`community-status ${selectedCommunity.status.toLowerCase()}`}
                >
                  {selectedCommunity.status}
                </span>
              </div>

              <div className="detail-item full-width">
                <span>Description</span>
                <p>
                  {selectedCommunity.description ||
                    "No description provided."}
                </p>
              </div>

              <div className="detail-item">
                <span>Created</span>
                <strong>
                  {selectedCommunity.createdAt
                    ? new Date(
                        selectedCommunity.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </strong>
              </div>
            </div>

            {selectedCommunity.status ===
              "PENDING" && (
              <div className="modal-actions">
                <button
                  className="approve-community-btn"
                  onClick={() =>
                    handleApprove(
                      selectedCommunity
                    )
                  }
                >
                  <Check size={18} />
                  Approve
                </button>

                <button
                  className="reject-community-btn"
                  onClick={() =>
                    handleReject(
                      selectedCommunity
                    )
                  }
                >
                  <X size={18} />
                  Reject
                </button>
              </div>
            )}

            <button
              className="close-modal-btn"
              onClick={() =>
                setSelectedCommunity(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Communities;