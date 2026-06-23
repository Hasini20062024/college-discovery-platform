import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const collegeAPI = {
  list: (page = 1, limit = 10, filters = {}) =>
    api.get('/colleges', { params: { page, limit, ...filters } }),

  search: (query, page = 1, limit = 10) =>
    api.get('/colleges/search', { params: { q: query, page, limit } }),

  getById: (id) => api.get(`/colleges/${id}`),

  getByCity: (city, page = 1, limit = 10) =>
    api.get(`/colleges/city/${city}`, { params: { page, limit } }),
};

export const authAPI = {
  signup: (email, password, firstName, lastName) =>
    api.post('/auth/signup', { email, password, firstName, lastName }),

  login: (email, password) => api.post('/auth/login', { email, password }),

  googleAuth: (googleId, email, firstName, lastName) =>
    api.post('/auth/google', { googleId, email, firstName, lastName }),

  getMe: () => api.get('/auth/me'),
};

export const compareAPI = {
  compare: (collegeIds) => api.post('/compare', { collegeIds }),

  save: (collegeIds, name) => api.post('/compare/save', { collegeIds, name }),

  getSaved: () => api.get('/compare/saved'),

  delete: (id) => api.delete(`/compare/${id}`),
};

export const userAPI = {
  getSavedColleges: (page = 1, limit = 10) =>
    api.get('/users/saved-colleges', { params: { page, limit } }),

  saveCollege: (collegeId) => api.post('/users/save-college', { collegeId }),

  removeCollege: (collegeId) => api.delete(`/users/save-college/${collegeId}`),

  checkIfSaved: (collegeId) => api.get(`/users/check-saved/${collegeId}`),
};

export default api;
