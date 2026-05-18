import type { ApiFieldError, ApiResponse } from "../types/api";

const rawApiUrl = import.meta.env.VITE_API_URL;
export const API_URL = (rawApiUrl ? rawApiUrl : "/api").replace(/\/$/, "");

export class ApiError extends Error {
  public readonly status: number;
  public readonly errors?: ApiFieldError[];

  constructor(status: number, message: string, errors?: ApiFieldError[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

const getToken = (): string | null => {
  return localStorage.getItem("gigflow_token");
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem("gigflow_token", token);
};

export const clearStoredToken = (): void => {
  localStorage.removeItem("gigflow_token");
};

export const hasStoredToken = (): boolean => Boolean(getToken());

export const apiRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers);
  const token = getToken();

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as Partial<ApiResponse<T>>)
    : undefined;

  if (!response.ok) {
    throw new ApiError(response.status, payload?.message ?? "Request failed", payload?.errors);
  }

  if (!payload?.data) {
    return undefined as T;
  }

  return payload.data;
};

export const apiFileRequest = async (path: string): Promise<Blob> => {
  const headers = new Headers();
  const token = getToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { headers });

  if (!response.ok) {
    const payload = (await response.json().catch(() => undefined)) as { message?: string } | undefined;
    throw new ApiError(response.status, payload?.message ?? "File request failed");
  }

  return response.blob();
};
