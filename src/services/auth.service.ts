import { api } from "../api/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login: (data: LoginPayload) => api.post("/api/v1/users/login", data),

  signup: (data: SignupPayload) => api.post("/api/v1/users/register", data),

  logout: () => api.post("/api/v1/users/logout"),

  me: () => api.get("/api/v1/users/me"),
};
