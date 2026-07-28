import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const getIngredients = async () => {
  const response = await api.get('/api/pantry');
  return response.data;
};

export const addIngredient = async (ingredient) => {
  const response = await api.post('/api/pantry', ingredient);
  return response.data;
};

export const deleteIngredient = async (id) => {
  await api.delete(`/api/pantry/${id}`);
};