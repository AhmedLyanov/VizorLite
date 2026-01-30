import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { registerUser, loginUser } from '../../api/authApi'
import { getProfile, type ProfileData } from '../../api/profileApi'

export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      queryClient.setQueryData(['user'], data.user)
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    }
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      queryClient.setQueryData(['user'], data.user)
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })
}

export const useAuthCheck = () => {
  return !!localStorage.getItem('token')
}


export const useProfile = () => {
  return useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!localStorage.getItem('token'), 
    retry: false, 
    staleTime: 5 * 60 * 1000, 
  })
}



export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return () => {
    localStorage.removeItem('token')
    queryClient.removeQueries({ queryKey: ['user'] })
    queryClient.removeQueries({ queryKey: ['profile'] })
  }
}