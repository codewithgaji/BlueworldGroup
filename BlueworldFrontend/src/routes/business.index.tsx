import { createFileRoute, Link } from "@tanstack/react-router";
import { CmsImage, LoadingBlock, PageHero, Section, SectionHeading } from "@/components/site/primitives";
import { useBusinessUnits } from "@/hooks/use-cms";

export const Route = createFileRoute("/business/")({
  head: () => ({
    meta: [
      { title: "Our Brands — Blue World Cosmetics" },
      {
        name: "description",
        content:
          "Five brands under one Lagos manufacturing house: Vivon skincare, BlueCrystal hygiene, Blow Right haircare, BlueFragrance and BlueWorld Cosmetics essentials.",
      },
      { property: "og:title", content: "Our Brands — Blue World Cosmetics" },
      {
        property: "og:description",
        content: "Skincare, hygiene, haircare, fragrance and household essentials made in Nigeria.",
      },
    ],
  }),
  component: BusinessIndexPage,
});

function BusinessIndexPage() {
  const { data, isLoading } = useBusinessUnits();
  const units = [...(data ?? [])].sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHero
        eyebrow="Business"
        title="Five brands, one factory floor"
        description="Each division owns its own chemistry, packaging and audience — all produced, tested and filled at our Ikeja plant."
        image="hero.factory"
      />
      <Section>
        <SectionHeading eyebrow="Our house of brands" title="Choose a division" />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && <LoadingBlock label="Loading brands…" />}
          {units.map((unit) => (
            <Link
              key={unit.id}
              to="/business/$unit"
              params={{ unit: unit.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <CmsImage
                  src={unit.heroImage}
                  alt={unit.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-primary-deep">{unit.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                  {unit.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{unit.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
