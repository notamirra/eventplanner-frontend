import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add user ID to requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.id) {
    config.headers['X-User-ID'] = user.id;
  }
  return config;
});

// Auth API functions
export const authAPI = {
  signup: async (name, email, password) => {
    try {
      const response = await api.post('/signup', { name, email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Signup failed',
      };
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  },
};

// Event API functions
export const eventAPI = {
  create: async (title, description, location, startTime) => {
    try {
      const response = await api.post('/events', {
        title,
        description,
        location,
        startTime,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create event',
      };
    }
  },

  getOrganized: async () => {
    try {
      const response = await api.get('/events/organized');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch organized events',
      };
    }
  },

  getInvited: async () => {
    try {
      const response = await api.get('/events/invited');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch invited events',
      };
    }
  },

  invite: async (eventId, userId, role) => {
    try {
      const response = await api.post(`/events/${eventId}/invite`, {
        userId,
        role,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to invite user',
      };
    }
  },

  delete: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete event',
      };
    }
  },

  getAttendees: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}/attendees`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch attendees',
      };
    }
  },

  setAttendance: async (eventId, status) => {
    try {
      const response = await api.put(`/events/${eventId}/attendance`, {
        userId: JSON.parse(localStorage.getItem('user') || '{}').id,
        status,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update attendance',
      };
    }
  },

  createTask: async (eventId, title, description, dueDate, assigneeId) => {
    try {
      const response = await api.post(`/events/${eventId}/tasks`, {
        title,
        description,
        dueDate,
        assigneeId,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create task',
      };
    }
  },
};

// Search API functions
export const searchAPI = {
  search: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams({ q: query });
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);
      if (filters.role) params.append('role', filters.role);

      const response = await api.get(`/search?${params.toString()}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Search failed',
      };
    }
  },
};

export default api;
