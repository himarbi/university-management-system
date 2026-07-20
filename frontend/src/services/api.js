import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token in Request Headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle authentication errors (e.g. 401 unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/register', data),
};

export const courseApi = {
  getAll: (params) => api.get('/courses', { params }),
  getMyCourses: () => api.get('/courses/my-courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (id, studentId) => api.post(`/courses/${id}/enroll${studentId ? `?studentId=${studentId}` : ''}`),
  unenroll: (id, studentId) => api.post(`/courses/${id}/unenroll${studentId ? `?studentId=${studentId}` : ''}`),
};

export const userApi = {
  getAll: () => api.get('/users'),
};

export const analyticsApi = {
  getSummary: () => api.get('/analytics/summary'),
};

export default api;
