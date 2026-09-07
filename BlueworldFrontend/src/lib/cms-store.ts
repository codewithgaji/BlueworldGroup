/**
 * Client-side CMS store.
 *
 * The admin panel edits content locally (persisted to localStorage) so the
 * whole CMS is usable before the FastAPI backend exists. Each collection maps
 * 1:1 to a REST resource in BACKEND_MANIFEST.md — swapping to real writes means
 * replacing `persist()` with an apiFetch PUT/POST/DELETE.
 */
import { useSyncExternalStore } from "react";
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

const STORAGE_KEY = "bwc.cms.draft";

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

let state: CmsState = INITIAL;
let hydrated = false;
let revision = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = { ...INITIAL, ...(JSON.parse(raw) as Partial<CmsState>) };
      revision += 1;
    }
  } catch {
    /* corrupt draft -> keep seeded content */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode -> in-memory only */
  }
}

function setState(next: CmsState) {
  state = next;
  revision += 1;
  persist();
  emit();
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCmsState(): CmsState {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return state;
    },
    () => INITIAL,
  );
}

/** Increments on every local edit — used to bust the query cache. */
export function useCmsRevision(): number {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return revision;
    },
    () => 0,
  );
}

export function useCollection<K extends CollectionKey>(key: K): CmsState[K] {
  return useCmsState()[key];
}

type Row = { id: string };

export function upsertItem<K extends CollectionKey>(key: K, item: CmsState[K][number]) {
  const list = state[key] as unknown as Row[];
  const row = item as unknown as Row;
  const exists = list.some((r) => r.id === row.id);
  const next = exists ? list.map((r) => (r.id === row.id ? row : r)) : [...list, row];
  setState({ ...state, [key]: next } as CmsState);
}

export function deleteItem(key: CollectionKey, id: string) {
  const list = state[key] as unknown as Row[];
  setState({ ...state, [key]: list.filter((r) => r.id !== id) } as CmsState);
}

export function updateSettings(settings: SiteSettings) {
  setState({ ...state, settings });
}

export function resetCms() {
  setState(INITIAL);
}

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
