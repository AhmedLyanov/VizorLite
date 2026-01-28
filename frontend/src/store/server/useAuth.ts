import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registerUser, loginUser, type RegisterData, type LoginData } from '../../api/authApi'

export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      queryClient.setQueryData(['currentUser'], data.user)
      console.log('Registration successful!')
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
      queryClient.setQueryData(['currentUser'], data.user)
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })
}