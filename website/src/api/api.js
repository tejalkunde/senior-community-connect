const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
};

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Dashboard
export const getDashboardStats = async () => {
  return apiRequest("/admin/dashboard");
};

// Users
export const getUsers = async (params = "") => {
  return apiRequest(`/admin/users${params}`);
};

export const getUserById = async (id) => {
  return apiRequest(`/admin/users/${id}`);
};

export const updateUser = async (id, userData) => {
  return apiRequest(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

export const updateUserStatus = async (id, isActive) => {
  return apiRequest(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
};

export const deleteUser = async (id) => {
  return apiRequest(`/admin/users/${id}`, {
    method: "DELETE",
  });
};

// Communities
export const getCommunities = async (params = "") => {
  return apiRequest(`/admin/communities${params}`);
};

export const getCommunityById = async (id) => {
  return apiRequest(`/communities/${id}`);
};

export const approveCommunity = async (id) => {
  return apiRequest(`/admin/communities/${id}/approve`, {
    method: "PATCH",
  });
};

export const rejectCommunity = async (id, reason = "") => {
  return apiRequest(`/admin/communities/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ rejectionReason: reason }),
  });
};
export const apiLogin = async (email, password) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};
// Activity Logs
export const getActivityLogs = async (params = "") => {
  return apiRequest(`/admin/activity-logs${params}`);
};