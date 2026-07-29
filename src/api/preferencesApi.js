import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const getPreferences = async () => {
  const response = await api.get('/api/preferences');
  return response.data;
};

export const updatePreferences = async (preferences) => {
  const response = await api.put('/api/preferences', preferences);
  return response.data;
};