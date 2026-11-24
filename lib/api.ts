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

// Same as apiRequest, but for files (PDF downloads)
export async function apiBlob(path: string): Promise<Blob> {
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("superleo_token")
      : null;
  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!response.ok) {
    let message = "Download failed";
    try {
      message = (await response.json()).error || message;
    } catch {
      /* not JSON */
    }
    throw new Error(message);
  }
  return response.blob();
}

export type SupplierPayments = {
  startDate: string | null;
  balance: {
    earned: number;
    deducted: number;
    paid: number;
    processing: number;
    balance: number;
  };
  payments: Array<{
    id: string;
    amount: number;
    status: "completed" | "processing";
    mpesa_receipt: string | null;
    phone: string;
    paid_at: string;
  }>;
  deductions: Array<{
    id: string;
    kind: "feed" | "advance" | "other";
    description: string | null;
    amount: number;
    deduction_date: string;
  }>;
};

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
    }>("/suppliers/profile"),
  updateProfile: (payload: { fullName: string; phone: string; address: string }) =>
    apiRequest<{
      full_name: string;
      phone: string | null;
      address: string | null;
    }>("/suppliers/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  payments: () => apiRequest<SupplierPayments>("/suppliers/payments"),
  // YYYY-MM  ->  PDF statement of that month's deliveries
  monthlyStatement: (month: string) =>
    apiBlob(`/suppliers/reports/monthly?month=${encodeURIComponent(month)}`),
  deliveries: () =>
    apiRequest<
      Array<{
        quantity_litres: number;
        session_date: string;
        session_type: string;
      }>
    >("/suppliers/deliveries"),
};
