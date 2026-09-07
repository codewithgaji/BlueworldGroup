/**
 * Typed API client layer.
 *
 * Every read goes through `fetchWithFallback`: it tries the real FastAPI
 * endpoint and, if the backend is unreachable / slow / errors, silently falls
 * back to the local placeholder dataset so the site never renders empty.
 *
 * Swap-in later = point VITE_API_BASE_URL at the FastAPI host. No component
 * changes required.
 */

export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "/api";

const DEFAULT_TIMEOUT_MS = 4000;

export const ENDPOINTS = {
  heroSlides: "/cms/hero-slides",
  products: "/cms/products",
  businessUnits: "/cms/business-units",
  teamMembers: "/cms/team",
  blogPosts: "/cms/blog-posts",
  jobPostings: "/cms/jobs",
  settings: "/cms/settings",
  media: "/cms/media",
  careersApply: "/careers/apply",
  contact: "/contact",
  newsletter: "/newsletter/subscribe",
  authLogin: "/auth/login",
  authRefresh: "/auth/refresh",
  authMe: "/auth/me",
} as const;

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        ...(init.headers ?? {}),
        ...authHeader(),
      },
    });
    if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Read helper. Never throws — resolves to `fallback` when the backend is not
 * yet available. Accepts either a bare array or `{ items: [...] }`.
 */
export async function fetchWithFallback<T>(path: string, fallback: T): Promise<T> {
  try {
    const data = await apiFetch<unknown>(path, { method: "GET" });
    if (data && typeof data === "object" && "items" in (data as Record<string, unknown>)) {
      const items = (data as { items: unknown }).items;
      if (Array.isArray(items) && items.length > 0) return items as unknown as T;
      return fallback;
    }
    if (Array.isArray(data) && data.length === 0) return fallback;
    if (data == null) return fallback;
    return data as T;
  } catch {
    // Backend offline / timeout / 5xx -> local placeholder dataset.
    return fallback;
  }
}

/** Writes optimistically resolve to a mock success when the backend is absent. */
export async function submitWithMock<TBody, TResult>(
  path: string,
  body: TBody,
  mockResult: TResult,
): Promise<TResult> {
  try {
    return await apiFetch<TResult>(path, { method: "POST", body: JSON.stringify(body) });
  } catch {
    await new Promise((r) => setTimeout(r, 600));
    return mockResult;
  }
}

/* --------------------------------- tokens --------------------------------- */

const TOKEN_KEY = "bwc.admin.tokens";

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

export function readTokens(): StoredTokens | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as StoredTokens) : null;
  } catch {
    return null;
  }
}

export function writeTokens(tokens: StoredTokens | null) {
  if (typeof window === "undefined") return;
  if (!tokens) window.localStorage.removeItem(TOKEN_KEY);
  else window.localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

function authHeader(): Record<string, string> {
  const tokens = readTokens();
  return tokens ? { authorization: `Bearer ${tokens.accessToken}` } : {};
}
