import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  CmsImage,
  EmptyBlock,
  LoadingBlock,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { ProductCard } from "@/components/site/product-card";
import { useBusinessUnits, useProducts } from "@/hooks/use-cms";
import { BUSINESS_UNITS } from "@/data/placeholder-content";

export const Route = createFileRoute("/business/$unit/")({
  loader: ({ params }) => {
    const unit = BUSINESS_UNITS.find((u) => u.slug === params.unit);
    if (!unit) throw notFound();
    return { name: unit.name, tagline: unit.tagline, summary: unit.summary };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Brand not found — Blue World Cosmetics" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — Blue World Cosmetics`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.summary.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.tagline },
      ],
    };
  },
  component: BusinessUnitPage,
});

function BusinessUnitPage() {
  const { unit: slug } = Route.useParams();
  const { data: units, isLoading } = useBusinessUnits();
  const { data: products } = useProducts();
  const unit = units?.find((u) => u.slug === slug);
  const unitProducts = (products ?? []).filter((p) => p.unit === slug);

  if (isLoading && !unit) {
    return (
      <Section>
        <LoadingBlock label="Loading brand…" />
      </Section>
    );
  }
  if (!unit) {
    return (
      <Section>
        <EmptyBlock label="This brand is not published yet." />
      </Section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Business"
        title={unit.name}
        description={unit.tagline}
        image={unit.heroImage}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Brand story" title={`Inside ${unit.name}`} />
            <div className="mt-6 space-y-5">
              {unit.story.split("\n\n").map((para) => (
                <p key={para.slice(0, 32)} className="text-base leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border shadow-card">
            <CmsImage
              src={unit.heroImage}
              alt={unit.name}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </Section>

      {unit.subLines && unit.subLines.length > 0 && (
        <Section tone="muted">
          <SectionHeading
            eyebrow="Product ranges"
            title={`${unit.name} is built from three ranges`}
            description="Each range has its own chemistry, testing protocol and audience."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {unit.subLines.map((line) => (
              <Link
                key={line.slug}
                to="/business/$unit/$line"
                params={{ unit: unit.slug, line: line.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  <CmsImage
                    src={line.heroImage}
                    alt={line.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-primary-deep">{line.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                    {line.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {line.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section>
        <SectionHeading eyebrow="Catalogue" title={`${unit.name} products`} />
        <div className="mt-12">
          {unitProducts.length === 0 ? (
            <EmptyBlock label="No products published for this brand yet." />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {unitProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
