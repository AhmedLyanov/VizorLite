import axios from "axios"

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    username: string
    email: string
  }
  token: string
}

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post('/api/auth/register', data)

  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));

  return response.data
}

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post('/api/auth/login', data)

  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));

  return response.data
}