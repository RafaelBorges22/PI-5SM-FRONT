import { apiRequest } from "./api2";

export interface LoginPayload {
  userName: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
    auth: false, // login não precisa de token
  });
}