import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { EmptyBlock, PageHero, Section, SectionHeading } from "@/components/site/primitives";
import { ProductCard } from "@/components/site/product-card";
import { useBusinessUnits, useProducts } from "@/hooks/use-cms";
import { BUSINESS_UNITS } from "@/data/placeholder-content";

export const Route = createFileRoute("/business/$unit/$line")({
  loader: ({ params }) => {
    const unit = BUSINESS_UNITS.find((u) => u.slug === params.unit);
    const line = unit?.subLines?.find((l) => l.slug === params.line);
    if (!unit || !line) throw notFound();
    return { unitName: unit.name, name: line.name, tagline: line.tagline, description: line.description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Range not found — Blue World Cosmetics" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — Blue World Cosmetics`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.tagline },
      ],
    };
  },
  component: SubLinePage,
});

function SubLinePage() {
  const { unit: unitSlug, line: lineSlug } = Route.useParams();
  const { data: units } = useBusinessUnits();
  const { data: products } = useProducts();
  const unit = units?.find((u) => u.slug === unitSlug);
  const line = unit?.subLines?.find((l) => l.slug === lineSlug);
  const lineProducts = (products ?? []).filter(
    (p) => p.unit === unitSlug && p.subLine === lineSlug,
  );

  if (!unit || !line) {
    return (
      <Section>
        <EmptyBlock label="This range is not published yet." />
      </Section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={unit.name}
        title={line.name}
        description={line.description}
        image={line.heroImage}
      >
        <Link
          to="/business/$unit"
          params={{ unit: unit.slug }}
          className="inline-flex items-center rounded-full border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
        >
          ← Back to {unit.name}
        </Link>
      </PageHero>

      <Section>
        <SectionHeading eyebrow="Catalogue" title={`${line.name} products`} description={line.tagline} />
        <div className="mt-12">
          {lineProducts.length === 0 ? (
            <EmptyBlock label="No products published in this range yet." />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {lineProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
