import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { createRoom } from "../../shared/api/roomApi"
import { useAuth } from "../user/AuthContext"

export const useCreateMeeting = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        navigate('/auth', { 
          state: { from: location.pathname, action: 'createMeeting' },
          replace: true 
        })
        throw new Error('Access denied!')
      }
      
      return createRoom()
    },
    onSuccess: (data) => {
      const roomId = data.data.roomId
      navigate(`/room/${roomId}`)
    },
    onError: (error) => {
      console.error('Failed to create meeting:', error)
    }
  })
}