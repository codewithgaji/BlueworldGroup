import { createFileRoute } from "@tanstack/react-router";
import { CmsPageView } from "@/components/site/cms-page";
import { usePage } from "@/hooks/use-cms";
import { LoadingBlock, ErrorBlock, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/about/who-we-are")({
  head: () => ({
    meta: [
      { title: "Who We Are — Blue World Cosmetics" },
      {
        name: "description",
        content:
          "Inside Blue World Cosmetics: two production lines, an in-house R&D lab and NAFDAC-certified quality control in Ikeja, Lagos.",
      },
      { property: "og:title", content: "Who We Are — Blue World Cosmetics" },
      {
        property: "og:description",
        content: "The plant, the people and the standards behind five Nigerian personal-care brands.",
      },
    ],
  }),
  component: WhoWeArePage,
});

function WhoWeArePage() {
  const { data: page, isLoading, isError } = usePage("about/who-we-are");

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