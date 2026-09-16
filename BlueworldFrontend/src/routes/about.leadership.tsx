import { createFileRoute } from "@tanstack/react-router";
import { CmsPageView } from "@/components/site/cms-page";
import { usePage } from "@/hooks/use-cms";
import { LoadingBlock, ErrorBlock, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/about/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — Blue World Cosmetics" },
      {
        name: "description",
        content:
          "Meet the executive team running manufacturing, brands, R&D and commercial operations at Blue World Cosmetics.",
      },
      { property: "og:title", content: "Leadership — Blue World Cosmetics" },
      {
        property: "og:description",
        content: "The people accountable for every batch that leaves the Ikeja plant.",
      },
    ],
  }),
  component: LeadershipPage,
});

function LeadershipPage() {
  const { data: page, isLoading, isError } = usePage("about/leadership");

  if (isLoading) {
    return (
      <Section>
        <LoadingBlock label="Loading page…" />
      </Section>
    );
  }
  if (isError || !page) {
    return (
      <Section>
        <ErrorBlock label="This page isn't published yet — check /admin/pages, or run the seed script on the backend." />
      </Section>
    );
  }

  return <CmsPageView page={page} />;
}