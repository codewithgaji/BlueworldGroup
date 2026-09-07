import { createFileRoute } from "@tanstack/react-router";
import {
  CmsImage,
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { useTeamMembers } from "@/hooks/use-cms";

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
  const { data, isLoading, isError } = useTeamMembers();
  const members = [...(data ?? [])].sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Leadership"
        description="A small executive team, each one accountable for a specific part of how the company runs."
      />

      <Section>
        <SectionHeading eyebrow="Executive team" title="Who signs off on the work" />
        <div className="mt-12">
          {isLoading && <LoadingBlock label="Loading leadership team…" />}
          {isError && <ErrorBlock label="We couldn't load the team right now." />}
          {!isLoading && members.length === 0 && <EmptyBlock label="No team members published yet." />}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((m) => (
              <article
                key={m.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                <div className="aspect-square overflow-hidden bg-secondary">
                  <CmsImage src={m.photo} alt={m.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-primary-deep">{m.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                    {m.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
