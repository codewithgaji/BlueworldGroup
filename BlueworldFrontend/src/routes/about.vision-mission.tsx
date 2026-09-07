import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading } from "@/components/site/primitives";

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
        content: "What we are building, and the standards we hold ourselves to while building it.",
      },
    ],
  }),
  component: VisionMissionPage,
});

const VALUES = [
  {
    title: "Formulate honestly",
    body: "No banned actives, no undisclosed strengths, no marketing claim the laboratory cannot defend.",
  },
  {
    title: "Price with respect",
    body: "A Nigerian family should be able to buy the same quality every month, not only when the naira allows.",
  },
  {
    title: "Buy Nigerian first",
    body: "Local sourcing wherever specification allows, because a supply chain that stays close stays accountable.",
  },
  {
    title: "Document everything",
    body: "Retained samples, batch sheets and certificates of analysis. If it is not written down, it did not happen.",
  },
  {
    title: "Grow our people",
    body: "Chemists, operators and field staff trained internally and promoted from within wherever possible.",
  },
];

function VisionMissionPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Vision & mission"
        description="God Is Our Strength is not decoration on a logo — it is the standard we set before we had the equipment to meet it."
        image="hero.beauty"
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border-2 border-primary/20 bg-card p-10 shadow-card">
            <p className="eyebrow">Our vision</p>
            <p className="mt-5 font-display text-2xl font-bold leading-snug text-primary-deep lg:text-3xl">
              To be the personal-care manufacturer that proves world-class cosmetics can be
              formulated, produced and exported from Nigeria.
            </p>
          </div>
          <div className="rounded-3xl bg-accent-soft p-10 shadow-card">
            <p className="eyebrow">Our mission</p>
            <p className="mt-5 font-display text-2xl font-bold leading-snug text-primary-deep lg:text-3xl">
              To make safe, effective and affordable skincare, hygiene, hair and fragrance products
              for African families — manufactured locally, documented fully, and priced fairly.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Our values" title="Five rules we do not trade away" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-8 shadow-card">
              <span className="font-display text-3xl font-extrabold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-primary-deep">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
