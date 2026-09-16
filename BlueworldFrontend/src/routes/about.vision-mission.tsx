import { createFileRoute } from "@tanstack/react-router";
import { CmsPageView } from "@/components/site/cms-page";
import { usePage } from "@/hooks/use-cms";

export const Route = createFileRoute("/about/vision-mission")({
  head: () => ({
    meta: [
      { title: "Vision & Mission — Blue World Cosmetics" },
      {
        name: "description",
        content:
          "Our vision, mission and the five values that govern how Blue World Cosmetics formulates, manufactures and trades.",
      },
      { property: "og:title", content: "Vision & Mission — Blue World Cosmetics" },
      {
        property: "og:description",
        content:
          "What we are building, and the standards we hold ourselves to while building it.",
      },
    ],
  }),
  component: VisionMissionPage,
});

function VisionMissionPage() {
  const page = usePage("about/vision-mission");

  return <CmsPageView page={page} />;
}
