/**
 * Admin CRUD client for Pages — separate from cms-store.ts because Page
 * doesn't fit the flat-collection model everything else there uses (nested
 * blocks, identified by slug on the public side, no placeholder fallback).
 * Every call requires an authenticated admin/editor session (JWT attached
 * automatically via apiFetch's authHeader()).
 */
import { apiFetch, ENDPOINTS } from "@/lib/api";
import type { CmsPage, PageBlock } from "@/lib/types";

export type PageBlockInput = Omit<PageBlock, "id">;

export interface PageInput {
  slug: string;
  title: string;
  eyebrow?: string | null;
  description?: string | null;
  heroImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  status: "draft" | "published";
  blocks: PageBlockInput[];
}

export function listAdminPages(): Promise<CmsPage[]> {
  return apiFetch<CmsPage[]>(ENDPOINTS.adminPages, { method: "GET" });
}

export function getAdminPage(id: string): Promise<CmsPage> {
  return apiFetch<CmsPage>(`${ENDPOINTS.adminPages}/${id}`, { method: "GET" });
}

export function createAdminPage(payload: PageInput): Promise<CmsPage> {
  return apiFetch<CmsPage>(ENDPOINTS.adminPages, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminPage(id: string, payload: PageInput): Promise<CmsPage> {
  return apiFetch<CmsPage>(`${ENDPOINTS.adminPages}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminPage(id: string): Promise<void> {
  return apiFetch<void>(`${ENDPOINTS.adminPages}/${id}`, { method: "DELETE" });
}

export function emptyPageBlock(type: PageBlock["type"]): PageBlockInput {
  const payloadByType: Record<PageBlock["type"], Record<string, unknown>> = {
    prose: { paragraphs: [] },
    prose_image: { heading: "", paragraphs: [], image: "", imageAlt: "", imageSide: "left" },
    card_grid: { columns: 2, cards: [] },
    numbered_grid: { cards: [] },
    feature_pair: { items: [] },
    link_cards: { cards: [] },
    team_grid: {},
    globe_reach: {},
  };
  return { type, tone: "default", order: 0, payload: payloadByType[type] };
}

export function emptyPage(): PageInput {
  return {
    slug: "",
    title: "",
    eyebrow: "",
    description: "",
    heroImage: "",
    metaTitle: "",
    metaDescription: "",
    status: "draft",
    blocks: [],
  };
}