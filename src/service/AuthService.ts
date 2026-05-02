import { httpClient } from "./HttpClient";

export interface LoginPayload {
  userName: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  return httpClient.post<LoginResponse>("/auth/login", payload, undefined, false);
}