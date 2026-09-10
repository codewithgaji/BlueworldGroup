/**
 * Client-side CMS store — backed by the real FastAPI backend.
 *
 * Reads hit the public /cms/* endpoints (falling back to placeholder content
 * if the backend is unreachable, via fetchWithFallback). Writes hit the
 * authenticated /admin/* endpoints and require a signed-in admin/editor
 * session with the JWT already attached via api.ts's authHeader().
 */
import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { apiFetch, fetchWithFallback } from "@/lib/api";
import {
  BLOG_POSTS,
  BUSINESS_UNITS,
  HERO_SLIDES,
  JOB_POSTINGS,
  MEDIA_LIBRARY,
  PRODUCTS,
  SITE_SETTINGS,
  TEAM_MEMBERS,
} from "@/data/placeholder-content";
import type {
  BlogPost,
  BusinessUnit,
  HeroSlide,
  JobPosting,
  MediaAsset,
  Product,
  SiteSettings,
  TeamMember,
} from "@/lib/types";

export interface CmsState {
  heroSlides: HeroSlide[];
  businessUnits: BusinessUnit[];
  products: Product[];
  teamMembers: TeamMember[];
  blogPosts: BlogPost[];
  jobPostings: JobPosting[];
  mediaLibrary: MediaAsset[];
  settings: SiteSettings;
}

export type CollectionKey = Exclude<keyof CmsState, "settings">;

const INITIAL: CmsState = {
  heroSlides: HERO_SLIDES,
  businessUnits: BUSINESS_UNITS,
  products: PRODUCTS,
  teamMembers: TEAM_MEMBERS,
  blogPosts: BLOG_POSTS,
  jobPostings: JOB_POSTINGS,
  mediaLibrary: MEDIA_LIBRARY,
  settings: SITE_SETTINGS,
};

/** Public read path + authenticated admin write path for each collection. */
const RESOURCE_PATHS: Record<CollectionKey, { public: string; admin: string }> = {
  heroSlides: { public: "/cms/hero-slides", admin: "/admin/hero-slides" },
  businessUnits: { public: "/cms/business-units", admin: "/admin/business-units" },
  products: { public: "/cms/products", admin: "/admin/products" },
  teamMembers: { public: "/cms/team", admin: "/admin/team" },
  blogPosts: { public: "/cms/blog-posts", admin: "/admin/blog-posts" },
  jobPostings: { public: "/cms/jobs", admin: "/admin/jobs" },
  mediaLibrary: { public: "/cms/media", admin: "/admin/media" },
};

const SETTINGS_PATHS = { public: "/cms/settings", admin: "/admin/settings" };

let state: CmsState = INITIAL;
let hydrating = false;
let hydrated = false;
let revision = 0;
const listeners = new Set<() => void>();

function emit() {
  revision += 1;
  listeners.forEach((l) => l());
}

async function hydrate() {
  if (hydrated || hydrating || typeof window === "undefined") return;
  hydrating = true;
  try {
    const [heroSlides, businessUnits, products, teamMembers, blogPosts, jobPostings, mediaLibrary, settings] =
      await Promise.all([
        fetchWithFallback(RESOURCE_PATHS.heroSlides.public, INITIAL.heroSlides),
        fetchWithFallback(RESOURCE_PATHS.businessUnits.public, INITIAL.businessUnits),
        fetchWithFallback(RESOURCE_PATHS.products.public, INITIAL.products),
        fetchWithFallback(RESOURCE_PATHS.teamMembers.public, INITIAL.teamMembers),
        fetchWithFallback(RESOURCE_PATHS.blogPosts.public, INITIAL.blogPosts),
        fetchWithFallback(RESOURCE_PATHS.jobPostings.public, INITIAL.jobPostings),
        fetchWithFallback(RESOURCE_PATHS.mediaLibrary.public, INITIAL.mediaLibrary),
        fetchWithFallback(SETTINGS_PATHS.public, INITIAL.settings),
      ]);
    state = { heroSlides, businessUnits, products, teamMembers, blogPosts, jobPostings, mediaLibrary, settings };
  } finally {
    hydrated = true;
    hydrating = false;
    emit();
  }
}

function subscribe(listener: () => void) {
  void hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCmsState(): CmsState {
  return useSyncExternalStore(subscribe, () => state, () => INITIAL);
}

/** Increments on every fetch/create/update/delete — use to bust dependent caches. */
export function useCmsRevision(): number {
  return useSyncExternalStore(subscribe, () => revision, () => 0);
}

export function useCollection<K extends CollectionKey>(key: K): CmsState[K] {
  return useCmsState()[key];
}

type Row = { id: string };

/** Refetch a single collection from the public endpoint (used after a write). */
async function refetch<K extends CollectionKey>(key: K) {
  const fresh = await fetchWithFallback(RESOURCE_PATHS[key].public, state[key]);
  state = { ...state, [key]: fresh } as CmsState;
  emit();
}

/**
 * A new item's id (from newId() below, e.g. "t-a1b2c3") never matches a real
 * backend UUID, so its absence from the current fetched list is what
 * distinguishes a create from an edit of an existing row.
 */
export async function upsertItem<K extends CollectionKey>(key: K, item: CmsState[K][number]) {
  const list = state[key] as unknown as Row[];
  const row = item as unknown as Row & Record<string, unknown>;
  const { admin } = RESOURCE_PATHS[key];
  const exists = list.some((r) => r.id === row.id);

  try {
    if (exists) {
      const { id, ...body } = row;
      await apiFetch(`${admin}/${id}`, { method: "PUT", body: JSON.stringify(body) });
    } else {
      const { id: _tempId, ...body } = row;
      await apiFetch(admin, { method: "POST", body: JSON.stringify(body) });
    }
    await refetch(key);
  } catch (error) {
    toast.error("Could not save — check your connection or permissions.");
    throw error;
  }
}

export async function deleteItem(key: CollectionKey, id: string) {
  const { admin } = RESOURCE_PATHS[key];
  try {
    await apiFetch(`${admin}/${id}`, { method: "DELETE" });
    await refetch(key);
  } catch (error) {
    toast.error("Could not delete — check your connection or permissions.");
    throw error;
  }
}


/** Merges a media asset already created via the /upload endpoint into local state. */
export function addUploadedMedia(asset: MediaAsset) {
  state = { ...state, mediaLibrary: [asset, ...state.mediaLibrary] };
  emit();
}

export async function updateSettings(settings: SiteSettings) {
  try {
    const updated = await apiFetch<SiteSettings>(SETTINGS_PATHS.admin, {
      method: "PUT",
      body: JSON.stringify(settings),
    });
    state = { ...state, settings: updated };
    emit();
  } catch (error) {
    toast.error("Could not save settings — check your connection or permissions.");
    throw error;
  }
}

/** Re-fetches every collection from the backend, discarding any local cache. */
export function resetCms() {
  hydrated = false;
  void hydrate();
}

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}