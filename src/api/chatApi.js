import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30 seconds — AI responses can be slow
});

export const sendMessage = async (message, conversationHistory) => {
  try {
    const response = await api.post('/api/chat', {
      message,
      conversationHistory,
    });
    return response.data.reply;
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      throw new Error('The request timed out. The AI is taking too long — please try again.');
    }
    if (err.response) {
      // Backend returned an error response
      const msg = err.response.data?.message;
      throw new Error(msg || 'Something went wrong. Please try again.');
    }
    // Network error — no response at all
    throw new Error('Cannot reach the server. Please check your connection.');
  }
};