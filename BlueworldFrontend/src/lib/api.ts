import type { MediaAsset } from "@/lib/types";

export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "http://localhost:8000";

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
  requestAccess: "/auth/request-access",
  accessRequests: "/auth/access-requests",
  users: "/auth/users",
  pages: "/cms/pages",
  adminPages: "/admin/pages",
} as const;

/** Thrown when the backend actually responded but rejected the request. */
export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, detail: unknown, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

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
        if (!res.ok) {
      let detail: unknown = null;
      try {
        detail = await res.json();
      } catch {
        // response wasn't JSON — leave detail null
      }
      throw new ApiError(res.status, detail, `API ${res.status} on ${path}`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}




export async function uploadMedia(file: File): Promise<MediaAsset> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/admin/media/upload`, {
    method: "POST",
    headers: { ...authHeader() }, // deliberately no content-type here
    body: formData,
  });

  if (!res.ok) {
    let detail: unknown = null;
    try {
      detail = await res.json();
    } catch {
      // not JSON
    }
    throw new ApiError(res.status, detail, `API ${res.status} on /admin/media/upload`);
  }
  return (await res.json()) as MediaAsset;
}

/** Result of a fallback-aware read — tells the caller whether `data` is real or placeholder. */
export interface SourcedResult<T> {
  data: T;
  /** true = came from the backend; false = local placeholder was used instead. */
  isLive: boolean;
}

/**
 * Same fallback behaviour as `fetchWithFallback`, but also reports whether
 * the result actually came from the backend or is local placeholder content.
 * Use this wherever the caller needs to know the difference (e.g. the admin
 * panel warning banner) — use the plain `fetchWithFallback` wherever the
 * caller just wants data and doesn't care where it came from.
 */
export async function fetchWithSource<T>(path: string, fallback: T): Promise<SourcedResult<T>> {
  try {
    const data = await apiFetch<unknown>(path, { method: "GET" });
    if (data && typeof data === "object" && "items" in (data as Record<string, unknown>)) {
      const items = (data as { items: unknown }).items;
      if (Array.isArray(items) && items.length > 0) return { data: items as unknown as T, isLive: true };
      return { data: fallback, isLive: false };
    }
    if (Array.isArray(data) && data.length === 0) return { data: fallback, isLive: false };
    if (data == null) return { data: fallback, isLive: false };
    return { data: data as T, isLive: true };
  } catch (err) {
    console.warn(`[api] GET ${path} failed, using placeholder data:`, err);
    return { data: fallback, isLive: false };
  }
}

/**
 * Read helper. Never throws — resolves to `fallback` when the backend is not
 * reachable. Accepts either a bare array or `{ items: [...] }`. Real errors
 * are logged to the console so they're visible during development instead of
 * silently disappearing.
 */
export async function fetchWithFallback<T>(path: string, fallback: T): Promise<T> {
  const { data } = await fetchWithSource(path, fallback);
  return data;
}

/**
 * Write helper for public-facing forms (contact, newsletter, careers) where a
 * missing backend shouldn't block the UI demo. Falls back to a mock success
 * ONLY on network failure (backend unreachable/timeout) — a real validation
 * or server error from a reachable backend is re-thrown so the form can show
 * the actual problem instead of lying about success.
 */
export async function submitWithMock<TBody, TResult>(
  path: string,
  body: TBody,
  mockResult: TResult,
): Promise<TResult> {
  try {
    return await apiFetch<TResult>(path, { method: "POST", body: JSON.stringify(body) });
  } catch (err) {
    if (err instanceof ApiError) {
      // Backend is up and responded — this is a real error, don't mask it.
      throw err;
    }
    console.warn(`[api] POST ${path} unreachable, using mock result:`, err);
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