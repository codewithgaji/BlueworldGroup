/**
 * JWT-style admin auth.
 *
 * `login()` posts to POST /auth/login. If the backend is unreachable, it
 * falls back to a mock session for the seeded demo account ONLY — and that
 * fallback is loud: it logs a console warning and throws a distinguishable
 * error the caller can use to show the user this is not a real session.
 */
import { useSyncExternalStore } from "react";
import { ApiError, ENDPOINTS, readTokens, submitWithMock, writeTokens } from "@/lib/api";
import type { AdminUser, LoginResponse } from "@/lib/types";

const USER_KEY = "bwc.admin.user";
const DEMO_FLAG_KEY = "bwc.admin.demoSession";

/** Seeded credentials used only when the FastAPI backend is not reachable. */
export const DEMO_CREDENTIALS = {
  email: "admin@blueworldcosmetics.org",
  password: "blueworld2026",
};

const DEMO_USER: AdminUser = {
  id: "u-1",
  email: DEMO_CREDENTIALS.email,
  fullName: "Amaka Eze",
  role: "admin",
  status: "active",
  createdAt: "2024-01-08",
};

const listeners = new Set<() => void>();
let cached: AdminUser | null | undefined;

function read(): AdminUser | null {
  if (typeof window === "undefined") return null;
  if (cached !== undefined) return cached;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    cached = raw && readTokens() ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    cached = null;
  }
  return cached;
}

function emit() {
  listeners.forEach((l) => l());
}

/** Direct (non-reactive) session read — safe to call inside effects after mount. */
export function getAdminUser(): AdminUser | null {
  return read();
}

export function useAdminUser(): AdminUser | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => null,
  );
}

/** True when the current session is the offline demo fallback, not a real backend login. */
export function isDemoSession(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DEMO_FLAG_KEY) === "1";
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const mock: LoginResponse = {
    accessToken: `mock.${btoa(email)}.access`,
    refreshToken: `mock.${btoa(email)}.refresh`,
    tokenType: "bearer",
    expiresIn: 3600,
    user: { ...DEMO_USER, email },
  };

  const isDemoCreds =
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;

  let result: LoginResponse;
  let usedFallback = false;

  try {
    result = await submitWithMock<{ email: string; password: string }, LoginResponse>(
      ENDPOINTS.authLogin,
      { email, password },
      isDemoCreds ? mock : (null as unknown as LoginResponse),
    );
    // submitWithMock only returns the mock object on a genuine network
    // failure (backend unreachable) — detect that by identity/shape rather
    // than trusting a flag, since a real backend could theoretically also
    // return isDemoCreds' user by coincidence of email.
    usedFallback = isDemoCreds && result?.accessToken?.startsWith("mock.");
  } catch (error) {
    if (error instanceof ApiError) {
      // Backend is up and rejected the credentials for real — don't fall
      // back, don't pretend, just surface the real failure.
      throw new Error("Invalid email or password.");
    }
    result = null as unknown as LoginResponse;
  }

  if (!result) throw new Error("Invalid email or password.");

  if (usedFallback) {
    // eslint-disable-next-line no-console
    console.warn(
      "[auth] Backend unreachable — signed in with the OFFLINE DEMO session. " +
        "This is not a real account and will not reflect real data.",
    );
  }

  writeTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
  cached = result.user;
  window.localStorage.setItem(USER_KEY, JSON.stringify(result.user));
  if (typeof window !== "undefined") {
    if (usedFallback) window.localStorage.setItem(DEMO_FLAG_KEY, "1");
    else window.localStorage.removeItem(DEMO_FLAG_KEY);
  }
  emit();
  return result.user;
}

export function logout() {
  writeTokens(null);
  cached = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(DEMO_FLAG_KEY);
  }
  emit();
}