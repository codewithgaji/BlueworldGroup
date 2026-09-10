import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useCmsDataSources, type CollectionKey, type DataSource } from "@/lib/cms-store";

const COLLECTION_LABELS: Record<CollectionKey, string> = {
  heroSlides: "Hero Slides",
  businessUnits: "Business Units",
  products: "Products",
  teamMembers: "Team",
  blogPosts: "Blog Posts",
  jobPostings: "Job Postings",
  mediaLibrary: "Media Library",
};

/**
 * Warns admins when a section is showing local placeholder content instead
 * of real backend data — and confirms once it switches to live. Mount this
 * once near the top of the admin shell so it covers every /admin page
 * without each route needing its own copy.
 */
export function useCmsSourceAlerts() {
  const sources = useCmsDataSources();
  const previous = useRef<Record<CollectionKey, DataSource> | null>(null);

  useEffect(() => {
    const prev = previous.current;
    const keys = Object.keys(sources) as CollectionKey[];

    if (prev === null) {
      // First read after hydration — flag whatever's still placeholder.
      const placeholders = keys.filter((k) => sources[k] === "placeholder");
      if (placeholders.length > 0) {
        toast.warning(
          `Showing placeholders for: ${placeholders.map((k) => COLLECTION_LABELS[k]).join(", ")}`,
          {
            description: "No live data from the backend yet — what's shown isn't saved content.",
            duration: 7000,
          },
        );
      }
    } else {
      // On later updates, only speak up about what actually changed.
      for (const key of keys) {
        if (prev[key] === "placeholder" && sources[key] === "live") {
          toast.success(`${COLLECTION_LABELS[key]} is now live from the backend.`);
        }
        if (prev[key] === "live" && sources[key] === "placeholder") {
          toast.warning(`${COLLECTION_LABELS[key]} dropped back to placeholder — is the backend down?`);
        }
      }
    }

    previous.current = sources;
  }, [sources]);
}