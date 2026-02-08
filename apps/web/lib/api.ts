const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

type ApiResponse<T> = {
  data?: T;
  message?: string;
};

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  try {
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
  } catch (error) {
    if (error instanceof Error && error.message.includes("fetch")) {
      throw new Error("API is unreachable. Please try again later.");
    }
    throw error;
  }
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

export async function uploadLeads(params: {
  file: File;
  mapping?: Record<string, string | null>;
  token?: string;
}) {
  const formData = new FormData();
  formData.append("file", params.file);
  if (params.mapping) {
    formData.append("mapping", JSON.stringify(params.mapping));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/leads/import`, {
      method: "POST",
      headers: {
        ...(params.token ? { Authorization: `Bearer ${params.token}` } : {})
      },
      body: formData
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.message || "Lead upload failed.");
    }
    return payload;
  } catch (error) {
    if (error instanceof Error && error.message.includes("fetch")) {
      throw new Error("API is unreachable. Please try again later.");
    }
    throw error;
  }
}
