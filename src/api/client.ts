import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";

const TOKEN_KEY = "signal_token";
const USER_KEY = "signal_user";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown | undefined;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function apiUrl(path: string): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (configured) {
    return `${configured}${path.startsWith("/") ? path : `/${path}`}`;
  }
  return `/api${path.startsWith("/") ? path : `/${path}`}`;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): { userId: string; email: string } | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export function persistAuth(res: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, res.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({ userId: res.userId, email: res.email }),
  );
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function clearAuthAndGoLogin(): void {
  clearAuth();
  const p = window.location.pathname;
  if (!p.startsWith("/login") && !p.startsWith("/register")) {
    window.location.assign("/login");
  }
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function errorMessage(status: number, data: unknown): string {
  if (data && typeof data === "object" && "message" in data) {
    const m = (data as { message: unknown }).message;
    if (typeof m === "string") return m;
  }
  return `Request failed (${status})`;
}

async function request<T>(
  method: string,
  path: string,
  options?: { body?: unknown; skipAuth?: boolean },
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (options?.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  const token = options?.skipAuth ? null : getStoredToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(apiUrl(path), {
    method,
    headers,
    body:
      options?.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (res.status === 401 && !options?.skipAuth) {
    clearAuthAndGoLogin();
  }

  const data = await parseBody(res);

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    throw new ApiError(errorMessage(res.status, data), res.status, data);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),

  post: <T>(path: string, body?: unknown, opts?: { skipAuth?: boolean }) =>
    request<T>("POST", path, { body, skipAuth: opts?.skipAuth }),

  patch: <T>(path: string, body: unknown) =>
    request<T>("PATCH", path, { body }),

  delete: (path: string) => request<void>("DELETE", path),

  login: (body: LoginRequest) =>
    request<AuthResponse>("POST", "/auth/login", { body, skipAuth: true }),

  register: (body: RegisterRequest) =>
    request<AuthResponse>("POST", "/auth/register", { body, skipAuth: true }),
};
