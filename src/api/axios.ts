import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth.store";

const API_URL = import.meta.env.VITE_API_URL;

interface RefreshResponse {
  data: {
    accessToken?: string;
  };
}

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let failedQueue: {
  resolve: () => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes("/users/refresh-token") ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axios.post<RefreshResponse>(
        `${API_URL}/api/v1/users/refresh-token`,
        {},
        {
          withCredentials: true,
        },
      );

      processQueue();

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      localStorage.removeItem("accessToken");

      useAuthStore.setState({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
      });

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
