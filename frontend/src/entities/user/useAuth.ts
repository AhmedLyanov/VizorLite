import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, verifyEmail } from "@/shared/api/authApi";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();



  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      queryClient.setQueryData(["currentUser"], data.user);

      window.dispatchEvent(new Event("auth-change"));

      navigate("/profile", { replace: true });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

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
  });
};
