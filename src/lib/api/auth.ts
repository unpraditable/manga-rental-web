import { AuthResponse, LoginPayload } from "@/types/auth";
import { apiClient } from "./client";

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
};

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
  phone: string;
}): Promise<AuthResponse> => {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
};

export const getProfile = async () => {
  const { data } = await apiClient.get("/auth/profile");
  return data;
};
