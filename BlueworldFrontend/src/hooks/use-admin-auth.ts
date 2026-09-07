/**
 * JWT-style admin auth.
 *
 * `login()` posts to POST /auth/login and, when the backend is unreachable,
 * falls back to a mock session for the seeded admin account so the CMS is
 * demonstrable offline.
 */
import { useSyncExternalStore } from "react";
import { ENDPOINTS, readTokens, submitWithMock, writeTokens } from "@/lib/api";
import type { AdminUser, LoginResponse } from "@/lib/types";

const USER_KEY = "bwc.admin.user";

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

export async function login(email: string, password: string): Promise<AdminUser> {
  const mock: LoginResponse = {
    accessToken: `mock.${btoa(email)}.access`,
    refreshToken: `mock.${btoa(email)}.refresh`,
    tokenType: "bearer",
    expiresIn: 3600,
    user: { ...DEMO_USER, email },
  };

  const isDemo =
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;

  let result: LoginResponse;
  try {
    result = await submitWithMock<{ email: string; password: string }, LoginResponse>(
      ENDPOINTS.authLogin,
      { email, password },
      isDemo ? mock : (null as unknown as LoginResponse),
    );
  } catch {
    result = null as unknown as LoginResponse;
  }

  if (!result) throw new Error("Invalid email or password.");

  writeTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
  cached = result.user;
  window.localStorage.setItem(USER_KEY, JSON.stringify(result.user));
  emit();
  return result.user;
}

export function logout() {
  writeTokens(null);
  cached = null;
  if (typeof window !== "undefined") window.localStorage.removeItem(USER_KEY);
  emit();
}
