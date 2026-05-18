import { apiRequest } from "./http";
import type { AuthResponse, AuthUser, LoginInput, RegisterInput } from "../types/auth";

export const loginUser = (input: LoginInput): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
};

export const registerUser = (input: RegisterInput): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await apiRequest<{ user: AuthUser }>("/auth/me");
  return response.user;
};
