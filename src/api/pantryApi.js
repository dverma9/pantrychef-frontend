import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 seconds for pantry operations
});

export const getIngredients = async () => {
  try {
    const response = await api.get('/api/pantry');
    return response.data;
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please check your connection.');
    }
    if (err.response) {
      throw new Error(err.response.data?.message || 'Failed to load pantry.');
    }
    throw new Error('Cannot reach the server. Is the backend running?');
  }
};

export const addIngredient = async (ingredient) => {
  try {
    const response = await api.post('/api/pantry', ingredient);
    return response.data;
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    if (err.response) {
      throw new Error(err.response.data?.message || 'Failed to add ingredient.');
    }
    throw new Error('Cannot reach the server. Please check your connection.');
  }
};

export const deleteIngredient = async (id) => {
  try {
    await api.delete(`/api/pantry/${id}`);
  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error('Ingredient not found — it may have already been removed.');
    }
    if (err.response) {
      throw new Error(err.response.data?.message || 'Failed to remove ingredient.');
    }
    throw new Error('Cannot reach the server. Please check your connection.');
  }
};