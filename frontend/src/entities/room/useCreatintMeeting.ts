import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { createRoom } from "../../shared/api/roomApi"

export const useCreateMeeting = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: createRoom,
    onSuccess: (data) => {
      const roomId = data.data.roomId
      navigate(`/room/${roomId}`)
    },
  })
}
