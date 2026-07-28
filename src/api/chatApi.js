import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const sendMessage = async (message, conversationHistory) => {
  const response = await api.post('/api/chat', {
    message,
    conversationHistory,
  });
  return response.data.reply;
};