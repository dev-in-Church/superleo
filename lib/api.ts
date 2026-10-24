const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function apiRequest<T>(path: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("superleo_token")
      : null;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Request failed");
  return body.data as T;
}

export const authApi = {
  register: (payload: Record<string, string>) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: Record<string, string>) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () =>
    apiRequest<{
      id: string;
      full_name: string | null;
      email: string;
      role: string;
    }>("/auth/me"),
};

export const supplierApi = {
  profile: () =>
    apiRequest<{
      full_name: string;
      phone: string | null;
      address: string | null;
    }>("/supplier/profile"),
  deliveries: () =>
    apiRequest<
      Array<{
        quantity_litres: number;
        session_date: string;
        session_type: string;
      }>
    >("/supplier/deliveries"),
};
