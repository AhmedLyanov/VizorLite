import axios from "axios";

export interface VerifyEmailData {
  userId: string;
  code: string;
}

export interface VerifyEmailResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    createdAt?: string;
  };
}

export const verifyEmail = async (
  data: VerifyEmailData,
): Promise<VerifyEmailResponse> => {
  const response = await axios.post("/api/verification/email", data);
  return response.data;
};
