import axios from "axios"

export interface CreateRoomResponse {
  success: boolean
  data: {
    roomId: string
    name: string
    host: string
    createdAt: string
  }
}

export const createRoom = async (): Promise<CreateRoomResponse> => {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("No token found")
  }

  const response = await axios.post(
    "/api/room/create",
    {}, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}
