import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || API_BASE_URL.replace(/\/api\/?$/, '');

export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const getDownloadUrl = (noteId) => `${API_BASE_URL}/notes/${noteId}/download`;
export const getShareUrl = (token) => `${BACKEND_URL}/s/${token}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('notestack_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected route, clean token
      if (localStorage.getItem('notestack_token')) {
        console.warn('Session expired or unauthorized token.');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (userData) => api.post('/auth/signup', userData),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword })
};

export const noteService = {
  getNotes: (params) => api.get('/notes', { params }),
  getNoteById: (id) => api.get(`/notes/${id}`),
  uploadNote: (formData, onProgress) => api.post('/notes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
  }),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  rateNote: (id, rating) => api.post(`/notes/${id}/rate`, { rating }),
  getComments: (id) => api.get(`/notes/${id}/comments`),
  addComment: (id, content) => api.post(`/notes/${id}/comments`, { content }),
  toggleBookmark: (id) => api.post(`/notes/${id}/bookmark`),
  getMyNotes: () => api.get('/notes/my-notes'),
  getMyBookmarks: () => api.get('/notes/bookmarks'),
  getTrendingNotes: () => api.get('/notes/trending'),
  getRecentNotes: () => api.get('/notes/recent'),
  reportNote: (id, reason, details) => api.post(`/notes/${id}/report`, { reason, details })
};

export const metadataService = {
  getCategories: () => api.get('/categories'),
  getSubjects: (params) => api.get('/subjects', { params })
};

export const adminService = {
  getPendingNotes: () => api.get('/admin/pending-notes'),
  updateNoteStatus: (id, status) => api.put(`/admin/notes/${id}/status?status=${status}`),
  getReports: () => api.get('/admin/reports'),
  resolveReport: (id, status) => api.put(`/admin/reports/${id}/resolve?status=${status}`),
  getUsers: () => api.get('/admin/users'),
  getStats: () => api.get('/admin/stats')
};

export default api;
