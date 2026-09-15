export interface BackendResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  raw?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = {
  async get<T>(
    endpoint: string,
    params: Record<string, string | number> = {},
  ): Promise<BackendResponse<T>> {
    const baseUrl = API_BASE_URL.startsWith("http")
      ? API_BASE_URL
      : `${window.location.origin}${API_BASE_URL}`;

    const url = new URL(`${baseUrl}/${endpoint}`);
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, String(params[key])),
    );
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return response.json();
  },

  async post<T>(endpoint: string, body: any): Promise<BackendResponse<T>> {
    const baseUrl = API_BASE_URL.startsWith("http")
      ? API_BASE_URL
      : `${window.location.origin}${API_BASE_URL}`;

    const response = await fetch(`${baseUrl}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return response.json();
  },
};
