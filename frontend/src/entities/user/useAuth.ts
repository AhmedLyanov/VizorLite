import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registerUser, loginUser } from '../../shared/api/authApi'

export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      queryClient.setQueryData(['currentUser'], data.user)
    },
    onError: (error) => {
      console.error(error)
    }
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      queryClient.setQueryData(['currentUser'], data.user)
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })
}