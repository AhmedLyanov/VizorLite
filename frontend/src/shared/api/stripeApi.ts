import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CheckoutResponse {
  url: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'expired';
  description: string;
  invoiceUrl?: string;
}

export const stripeApi = {
  createCheckout: async (): Promise<CheckoutResponse> => {
    const response = await api.post("/stripe/create-checkout");
    return response.data;
  },
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get("/stripe/transactions");
    return response.data;
  },
};

export default api;