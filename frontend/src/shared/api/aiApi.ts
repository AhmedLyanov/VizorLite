import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const aiApi = {
  async chat(message: string, messages: { role: 'user' | 'assistant'; content: string }[]): Promise<{ reply: string }> {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(
      `${API_URL}/ai/chat`,
      { 
        message, 
        messages
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

    return response.data;
  },

  async getStatus(): Promise<{ status: string; connected: boolean }> {
    const response = await axios.get(`${API_URL}/ai/status`);
    return response.data;
  },
};