import { useState } from "react";
import { Search, Eye, Check, X } from "lucide-react";

function Communities() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: "Yoga for Seniors",
      category: "Health & Wellness",
      owner: "Amit Verma",
      members: 45,
      status: "PENDING",
      description:
        "A friendly community for seniors interested in yoga, flexibility, fitness and healthy living.",
      createdAt: "September 1, 2026",
    },
    {
      id: 2,
      name: "Morning Walk Club",
      category: "Fitness",
      owner: "Vikram Singh",
      members: 72,
      status: "APPROVED",
      description:
        "A community where senior citizens can join morning walks and stay active together.",
      createdAt: "August 25, 2026",
    },
    {
      id: 3,
      name: "Golden Age Friends",
      category: "Social",
      owner: "Neha Kapoor",
      members: 38,
      status: "PENDING",
      description:
        "A social community for seniors to connect, share experiences and make new friends.",
      createdAt: "August 29, 2026",
    },
    {
      id: 4,
      name: "Senior Book Club",
      category: "Education",
      owner: "Rakesh Mehta",
      members: 25,
      status: "APPROVED",
      description:
        "A book reading and discussion community for senior citizens.",
      createdAt: "August 20, 2026",
    },
    {
      id: 5,
      name: "Healthy Living",
      category: "Health & Wellness",
      owner: "Sunita Patel",
      members: 31,
      status: "REJECTED",
      description:
        "A community focused on healthy lifestyle discussions and activities.",
      createdAt: "August 18, 2026",
    },
  ]);

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(search.toLowerCase()) ||
      community.owner.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || community.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, newStatus) => {
    setCommunities((currentCommunities) =>
      currentCommunities.map((community) =>
        community.id === id
          ? { ...community, status: newStatus }
          : community
      )
    );

    setSelectedCommunity((current) =>
      current && current.id === id
        ? { ...current, status: newStatus }
        : current
    );
  };

  const handleApprove = (id, name) => {
    const confirmed = window.confirm(`Approve "${name}" community?`);

    if (confirmed) {
      updateStatus(id, "APPROVED");
    }
  };

  const handleReject = (id, name) => {
    const confirmed = window.confirm(`Reject "${name}" community?`);

    if (confirmed) {
      updateStatus(id, "REJECTED");
    }
  };

  return (
    <div>
      <div className="page-title">
        <h1>Communities</h1>
        <p>Manage and approve communities</p>
      </div>

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
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="users-table-wrapper">
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
                  <tr key={community.id}>
                    <td>
                      <strong>{community.name}</strong>
                    </td>

                    <td>{community.category}</td>

                    <td>{community.owner}</td>

                    <td>{community.members}</td>

                    <td>
                      <span
                        className={`community-status ${community.status.toLowerCase()}`}
                      >
                        {community.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-btn"
                          title="View community"
                          onClick={() =>
                            setSelectedCommunity(community)
                          }
                        >
                          <Eye size={17} />
                        </button>

                        {community.status === "PENDING" && (
                          <>
                            <button
                              className="icon-btn approve-btn"
                              title="Approve community"
                              onClick={() =>
                                handleApprove(
                                  community.id,
                                  community.name
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
                                  community.id,
                                  community.name
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
                  <td colSpan="6" className="no-users">
                    No communities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCommunity && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedCommunity(null)}
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
                onClick={() => setSelectedCommunity(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="community-details">
              <div className="detail-item">
                <span>Category</span>
                <strong>{selectedCommunity.category}</strong>
              </div>

              <div className="detail-item">
                <span>Owner</span>
                <strong>{selectedCommunity.owner}</strong>
              </div>

              <div className="detail-item">
                <span>Members</span>
                <strong>{selectedCommunity.members}</strong>
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
                <p>{selectedCommunity.description}</p>
              </div>

              <div className="detail-item">
                <span>Created</span>
                <strong>{selectedCommunity.createdAt}</strong>
              </div>
            </div>

            {selectedCommunity.status === "PENDING" && (
              <div className="modal-actions">
                <button
                  className="approve-community-btn"
                  onClick={() =>
                    handleApprove(
                      selectedCommunity.id,
                      selectedCommunity.name
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
                      selectedCommunity.id,
                      selectedCommunity.name
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
              onClick={() => setSelectedCommunity(null)}
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