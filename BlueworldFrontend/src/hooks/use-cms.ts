/**
 * Data-fetching hooks. Each one hits the FastAPI endpoint and falls back to the
 * local placeholder dataset in `src/data/placeholder-content.ts`.
 */
import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS, fetchWithFallback, apiFetch } from "@/lib/api";
import { useCmsRevision, useCmsState } from "@/lib/cms-store";
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
import type { CmsPage } from "@/lib/types";





const COMMON = { staleTime: 5 * 60_000, retry: 0 } as const;

export function useHeroSlides() {
  const cms = useCmsState();
  const rev = useCmsRevision();
  return useQuery({
    queryKey: ["cms", "hero-slides", rev],
    queryFn: () => fetchWithFallback<HeroSlide[]>(ENDPOINTS.heroSlides, cms.heroSlides),
    ...COMMON,
  });
}

export function useBusinessUnits() {
  const cms = useCmsState();
  const rev = useCmsRevision();
  return useQuery({
    queryKey: ["cms", "business-units", rev],
    queryFn: () => fetchWithFallback<BusinessUnit[]>(ENDPOINTS.businessUnits, cms.businessUnits),
    ...COMMON,
  });
}

export function useBusinessUnit(slug: string) {
  const query = useBusinessUnits();
  return { ...query, unit: query.data?.find((u) => u.slug === slug) };
}

export function useProducts() {
  const cms = useCmsState();
  const rev = useCmsRevision();
  return useQuery({
    queryKey: ["cms", "products", rev],
    queryFn: () => fetchWithFallback<Product[]>(ENDPOINTS.products, cms.products),
    ...COMMON,
  });
}

export function useTeamMembers() {
  const cms = useCmsState();
  const rev = useCmsRevision();
  return useQuery({
    queryKey: ["cms", "team", rev],
    queryFn: () => fetchWithFallback<TeamMember[]>(ENDPOINTS.teamMembers, cms.teamMembers),
    ...COMMON,
  });
}

export function useBlogPosts() {
  const cms = useCmsState();
  const rev = useCmsRevision();
  return useQuery({
    queryKey: ["cms", "blog-posts", rev],
    queryFn: () => fetchWithFallback<BlogPost[]>(ENDPOINTS.blogPosts, cms.blogPosts),
    ...COMMON,
  });
}

export function useJobPostings() {
  const cms = useCmsState();
  const rev = useCmsRevision();
  return useQuery({
    queryKey: ["cms", "jobs", rev],
    queryFn: () => fetchWithFallback<JobPosting[]>(ENDPOINTS.jobPostings, cms.jobPostings),
    ...COMMON,
  });
}

export function useSiteSettings() {
  const cms = useCmsState();
  const rev = useCmsRevision();
  return useQuery({
    queryKey: ["cms", "settings", rev],
    queryFn: () => fetchWithFallback<SiteSettings>(ENDPOINTS.settings, cms.settings),
    ...COMMON,
  });
}

export function useMediaLibrary() {
  const cms = useCmsState();
  const rev = useCmsRevision();
  return useQuery({
    queryKey: ["cms", "media", rev],
    queryFn: () => fetchWithFallback<MediaAsset[]>(ENDPOINTS.media, cms.mediaLibrary),
    ...COMMON,
  });
}


import { GLOBE_SETTINGS_DEFAULT, type GlobeSettings } from "@/data/globe-content";

export function useGlobeSettings() {
  return useQuery({
    queryKey: ["globe-settings"],
    queryFn: () => fetchWithFallback<GlobeSettings>("/cms/globe-settings", GLOBE_SETTINGS_DEFAULT),
  });
}



export function usePage(slug: string) {
  return useQuery({
    queryKey: ["cms", "page", slug],
    queryFn: () => apiFetch<CmsPage>(`${ENDPOINTS.pages}/${slug}`),
    ...COMMON,
  });
}