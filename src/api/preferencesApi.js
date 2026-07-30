import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const getPreferences = async () => {
  try {
    const response = await api.get('/api/preferences');
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data?.message || 'Failed to load preferences.');
    }
    throw new Error('Cannot reach the server. Is the backend running?');
  }
};

export const updatePreferences = async (preferences) => {
  try {
    const response = await api.put('/api/preferences', preferences);
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data?.message || 'Failed to save preferences.');
    }
    throw new Error('Cannot reach the server. Please check your connection.');
  }
};