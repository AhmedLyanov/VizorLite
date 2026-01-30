import axios from "axios"

export interface ProfileData {
  user: {
    _id: string
    email: string
    username: string
    createdAt: string
    updatedAt: string
    __v: number
  }
}

export const getProfile = async (): Promise<ProfileData> => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    throw new Error('No token found')
  }

  const response = await axios.get('/api/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  return response.data
}