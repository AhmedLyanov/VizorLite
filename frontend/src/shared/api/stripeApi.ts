import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const stripeApi = {
  async createCheckout() {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/api/stripe/create-checkout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },
};
