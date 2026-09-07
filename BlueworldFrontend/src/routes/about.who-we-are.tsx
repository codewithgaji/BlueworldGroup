import { createFileRoute } from "@tanstack/react-router";
import { CmsImage, PageHero, Section, SectionHeading } from "@/components/site/primitives";

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

const PILLARS = [
  {
    title: "Manufacturing",
    body: "Two filling lines in Ikeja handling liquids, creams and solids, with a dedicated export packing floor for containerised shipments.",
  },
  {
    title: "Research & Development",
    body: "An in-house laboratory that owns every formula we sell. No white-label brief leaves the building without a tropical-stability result.",
  },
  {
    title: "Quality control",
    body: "Eleven checks per batch, retained samples for the full shelf life, and NAFDAC registration on every regulated SKU.",
  },
  {
    title: "Distribution",
    body: "A distributor network across all six Nigerian geopolitical zones, plus institutional supply to hospitals, schools and hospitality groups.",
  },
];

function WhoWeArePage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Who we are"
        description="A vertically integrated Nigerian personal-care manufacturer: we formulate, produce, fill, pack and distribute under one roof."
        image="hero.factory"
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="The company"
              title="Everything happens in-house — on purpose"
            />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Blue World Cosmetics Limited is a private Nigerian company incorporated in 1998 and
                headquartered on Oba Akran Avenue, Ikeja Industrial Estate, Lagos. We employ over
                two hundred people across manufacturing, laboratory, commercial and field roles.
              </p>
              <p>
                We chose vertical integration because the alternative — outsourcing formulation to
                one party and filling to another — makes accountability impossible. When a customer
                writes to us about a batch, we can put our hands on the retained sample, the QC
                sheet and the chemist who signed it.
              </p>
              <p>
                Our raw materials are sourced locally wherever a specification allows: unrefined
                shea from the Middle Belt, palm derivatives from the South-South, and imported
                actives only where no compliant local supply exists.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-lift">
            <CmsImage
              src="hero.factory"
              alt="Production line at the Ikeja plant"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Capabilities" title="Four functions, one factory" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-8 shadow-card">
              <h3 className="font-display text-xl font-bold text-primary-deep">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
