import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../../shared/api/verificationApi";

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyEmail,

    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      queryClient.setQueryData(["currentUser"], data.user);

      window.dispatchEvent(new Event("auth-change"));

      navigate("/profile", { replace: true });
    },

    onError: (error) => {
      console.error("Verification failed:", error);
    },
  });
};
