import axios from "axios"

export interface ProfileData {
  user: {
    _id: string
    email: string
    username: string
    createdAt: string
    updatedAt: string
    __v: number
    avatar?: string | null
  }
}

export interface AvatarUploadResponse {
  success: boolean
  message: string
  data: {
    avatarUrl: string
    avatarPath: string
  }
}

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const profileApi = {
  getProfile: async (): Promise<ProfileData> => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  uploadAvatar: async (formData: FormData): Promise<AvatarUploadResponse> => {
    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  deleteAvatar: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete('/profile/avatar')
    return response.data
  },
}

export const getProfile = profileApi.getProfile
export default api
