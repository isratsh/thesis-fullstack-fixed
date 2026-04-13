import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — auto logout
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────
export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data),
  getMe: () => API.get("/auth/me"),
  updateProfile: (data) => API.put("/auth/update-profile", data),
  changePassword: (data) => API.put("/auth/change-password", data),
  getNotifications: () => API.get("/auth/notifications"),
  markAllRead: () => API.put("/auth/notifications/read-all"),
  deleteNotification: (id) => API.delete(`/auth/notifications/${id}`),
};

// ── Thesis ───────────────────────────────────────────
export const thesisAPI = {
  create: (data) => API.post("/thesis", data),
  getMy: () => API.get("/thesis/my"),
  getAll: () => API.get("/thesis/all"),
  getProgress: () => API.get("/thesis/progress"),
  getById: (id) => API.get(`/thesis/${id}`),
  update: (id, data) => API.put(`/thesis/${id}`, data),
  submitChapter: (id, formData) =>
    API.post(`/thesis/${id}/chapter`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  reviewChapter: (thesisId, chapterId, data) =>
    API.put(`/thesis/${thesisId}/chapter/${chapterId}/review`, data),
  downloadFile: (thesisId, chapterId) =>
    `${API.defaults.baseURL}/thesis/${thesisId}/chapter/${chapterId}/file`,
  getStats: () => API.get("/thesis/stats/overview"),
};

// ── Users ────────────────────────────────────────────
export const usersAPI = {
  getAll: (params) => API.get("/users", { params }),
  getSupervisors: () => API.get("/users/supervisors"),
  getMyStudents: () => API.get("/users/my-students"),
  assignSupervisor: (userId, supervisorId) =>
    API.put(`/users/${userId}/assign-supervisor`, { supervisorId }),
  toggleStatus: (userId) => API.put(`/users/${userId}/toggle-status`),
  createUser: (data) => API.post("/users/admin/create", data),
  deleteUser: (userId) => API.delete(`/users/${userId}`),
  getAdminStats: () => API.get("/users/admin/stats"),
};

// ── Meetings ─────────────────────────────────────────
export const meetingsAPI = {
  getAll: () => API.get("/meetings"),
  book: (data) => API.post("/meetings", data),
  cancel: (id, reason) => API.put(`/meetings/${id}/cancel`, { reason }),
  complete: (id, notes) => API.put(`/meetings/${id}/complete`, { notes }),
};

// ── Announcements ────────────────────────────────────
export const announcementsAPI = {
  getAll: () => API.get("/announcements"),
  create: (data) => API.post("/announcements", data),
  remove: (id) => API.delete(`/announcements/${id}`),
};

export default API;
