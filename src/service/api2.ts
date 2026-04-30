import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./Api"; // seu arquivo existente em services/Api.ts

const TOKEN_KEY = "@app:token";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Se false, não injeta o Authorization header (útil para /auth/login) */
  auth?: boolean;
}

export async function apiRequest<T = unknown>(
  path: string,
  { method = "GET", body, auth = true }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? "Erro na requisição.");
  }

  return data as T;
}