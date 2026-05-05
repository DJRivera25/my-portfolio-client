import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: typeof window !== "undefined" ? "" : undefined,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  if (config.data instanceof FormData && config.headers) {
    const h = config.headers as Record<string, unknown>;
    delete h["Content-Type"];
    delete h["content-type"];
  }
  return config;
});

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isAxiosError(err: unknown): err is AxiosError {
  return axios.isAxiosError(err);
}

export default api;
