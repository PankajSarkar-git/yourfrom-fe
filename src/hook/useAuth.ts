import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { showToast } from "../components/toast";
import { useEffect } from "react";

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authService.login,

    onSuccess: ({ data }) => {
      login({
        user: data.data.user,
        accessToken: data.data.accessToken,
      });

      showToast.success(data.message);

      navigate("/dashboard", {
        replace: true,
      });
    },

    onError: (error: any) => {
      showToast.error(
        error?.response?.data?.message || "Login failed"
      );
    },
  });
}

export function useSignup() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authService.signup,

    onSuccess: ({ data }) => {
      login({
        user: data.data.user,
        accessToken: data.data.accessToken,
      });

      showToast.success(data.message);

      navigate("/dashboard", {
        replace: true,
      });
    },

    onError: (error: any) => {
      showToast.error(
        error?.response?.data?.message || "Signup failed"
      );
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authService.logout,

    onSuccess: async ({ data }) => {
      await logout();

      queryClient.clear();

      showToast.success(data.message || "Logged out successfully");

      navigate("/login", {
        replace: true,
      });
    },

    onError: (error: any) => {
      showToast.error(
        error?.response?.data?.message || "Logout failed"
      );
    },
  });
}

export function useMe() {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await authService.me();
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data) {
      login({
        user: query.data.data,
        accessToken: localStorage.getItem("accessToken") || "",
      });
    }
  }, [query.data, login]);

  useEffect(() => {
    if (query.isError) {
      logout();
    }
  }, [query.isError, logout]);

  return query;
}