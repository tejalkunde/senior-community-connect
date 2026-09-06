import { useEffect, useState } from "react";
import { Search, RefreshCw, Activity } from "lucide-react";

import { getActivityLogs } from "../api/api";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivityLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getActivityLogs();

      setLogs(response.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivityLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const action = log.action || "";
    const description = log.description || "";
    const performedBy =
      log.performedBy?.name ||
      log.performedBy?.email ||
      "";

    const searchText = search.toLowerCase();

    const matchesSearch =
      action.toLowerCase().includes(searchText) ||
      description.toLowerCase().includes(searchText) ||
      performedBy.toLowerCase().includes(searchText);

    const matchesAction =
      actionFilter === "ALL" || action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const actionTypes = [
    ...new Set(
      logs
        .map((log) => log.action)
        .filter(Boolean)
    ),
  ];

  const formatAction = (action) => {
    if (!action) return "Unknown";

    return action
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString();
  };

  return (
    <div>
      <div className="page-title">
        <h1>Activity Logs</h1>
        <p>View administrative activities and system actions</p>
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
              placeholder="Search activity logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) =>
              setActionFilter(e.target.value)
            }
          >
            <option value="ALL">All Actions</option>

            {actionTypes.map((action) => (
              <option key={action} value={action}>
                {formatAction(action)}
              </option>
            ))}
          </select>

          <button
            className="refresh-btn"
            onClick={loadActivityLogs}
            title="Refresh activity logs"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        <div className="users-table-wrapper">
          {loading ? (
            <div className="dashboard-empty">
              <Activity size={32} />

              <p>
                Loading activity logs...
              </p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="dashboard-empty">
              <Activity size={32} />

              <p>
                {logs.length === 0
                  ? "No activity logs found."
                  : "No activity logs match your search."}
              </p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Description</th>
                  <th>Performed By</th>
                  <th>Target</th>
                  <th>Date & Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      <span
                        className={`activity-action ${String(
                          log.action || ""
                        ).toLowerCase()}`}
                      >
                        {formatAction(log.action)}
                      </span>
                    </td>

                    <td>
                      {log.description || "N/A"}
                    </td>

                    <td>
                      <strong>
                        {log.performedBy?.name ||
                          log.performedBy?.email ||
                          "Unknown"}
                      </strong>
                    </td>

                    <td>
                      {log.targetType
                        ? `${log.targetType}${
                            log.targetId
                              ? ` (${String(
                                  log.targetId
                                ).slice(0, 8)}...)`
                              : ""
                          }`
                        : "N/A"}
                    </td>

                    <td>
                      {formatDate(
                        log.createdAt
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;