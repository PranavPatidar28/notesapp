export const API_BASE = ""; // same origin

export type ApiError = { status: number; error?: string; message?: string; limit?: number };

export function getAuthHeader() {
  if (typeof window === "undefined") return {} as Record<string, string>;
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  const authHeader = getAuthHeader();
  for (const [k, v] of Object.entries(authHeader)) headers.set(k, v as string);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    let err: ApiError = { status: res.status, message: res.statusText };
    try {
      const data = await res.json();
      err = { ...err, ...data };
    } catch {}
    throw err;
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text() as T;
}

export async function loginRequest(email: string, password: string) {
  return apiFetch<{ token: string; user: any }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function listNotes() {
  return apiFetch<{ notes: any[] }>("/api/notes");
}

export async function createNote(data: { title: string; content: string }) {
  return apiFetch<{ note: any }>("/api/notes", { method: "POST", body: JSON.stringify(data) });
}

export async function updateNote(id: string, data: { title?: string; content?: string }) {
  return apiFetch<{ note: any }>(`/api/notes/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteNote(id: string) {
  return apiFetch<void>(`/api/notes/${id}`, { method: "DELETE" });
}

export async function upgradeTenant(slug: string) {
  return apiFetch<{ tenant: any }>(`/api/tenants/${slug}/upgrade`, { method: "POST" });
}


