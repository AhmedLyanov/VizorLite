import { useState, useEffect, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { AuthContext, type User } from "@/entities/user/AuthContext";
import { profileApi } from "@/shared/api/profileApi";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const profileData = await profileApi.getProfile();
      return {
        id: profileData.user._id,
        username: profileData.user.username,
        email: profileData.user.email,
        createdAt: profileData.user.createdAt,
        avatar: profileData.user.avatar || null,
        plan: profileData.user.plan, 
      };
    },
    enabled: !!token,
    staleTime: 0,
    gcTime: 0,
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    queryClient.removeQueries({ queryKey: ["currentUser"] });
    window.dispatchEvent(new Event("auth-change"));
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    window.dispatchEvent(new Event("auth-change"));
  };

  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarUrl };
      updateUser(updatedUser);
    }
  };

  const value = {
    user: user || null,
    profile: null,
    isLoading,
    isAuthenticated: !!token && !!user,
    logout,
    updateUser,
    updateUserAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};