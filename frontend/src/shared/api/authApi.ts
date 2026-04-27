import axios from "axios";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface AuthResponse {
  user: {
    id: string;
    phone: string,
    username: string;
    email: string;
    createdAt?: string;
  };
  token: string;
}

export const registerUser = async (
  data: RegisterData,
): Promise<RegisterResponse> => {  
  const response = await axios.post("/api/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post("/api/auth/login", data);
  return response.data;
};

export const verifyEmail = async (data: {
  userId: string;
  code: string;
}): Promise<AuthResponse> => {
  const response = await axios.post("/api/verification/email", data);
  return response.data;
};
