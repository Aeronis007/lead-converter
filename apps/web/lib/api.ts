const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type ApiResponse<T> = {
  data?: T;
  message?: string;
};

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    },
    ...options
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload.data ?? (payload as T);
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  return apiRequest<{ token: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function loginUser(input: { email: string; password: string }) {
  return apiRequest<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function fetchProfile(token: string) {
  return apiRequest<{ user: { id: string; email: string } }>("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
