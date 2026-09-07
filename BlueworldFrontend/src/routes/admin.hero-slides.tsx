import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { ResourceManager, type ColumnConfig, type FieldConfig } from "@/components/admin/resource-manager";
import { deleteItem, newId, upsertItem, useCollection } from "@/lib/cms-store";
import type { HeroSlide } from "@/lib/types";

export const Route = createFileRoute("/admin/hero-slides")({
  head: () => ({
    meta: [
      { title: "Hero Slides — Blue World CMS" },
      { name: "description", content: "Manage the homepage hero slider content." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Hero Slides — Blue World CMS" },
      { property: "og:description", content: "Manage homepage hero slides." },
    ],
  }),
  component: HeroSlidesAdmin,
});

const columns: ColumnConfig<HeroSlide>[] = [
  { key: "image", label: "Image", image: true },
  { key: "title", label: "Title" },
  { key: "ctaLabel", label: "CTA" },
  { key: "order", label: "Order" },
];

const fields: FieldConfig<HeroSlide>[] = [
  { name: "image", label: "Background image", type: "image" },
  { name: "eyebrow", label: "Eyebrow" },
  { name: "title", label: "Title" },
  { name: "subtitle", label: "Subtitle", type: "textarea", rows: 3 },
  { name: "ctaLabel", label: "CTA label" },
  { name: "ctaHref", label: "CTA link", help: "Internal path, e.g. /business/vivon" },
  { name: "order", label: "Order", type: "number" },
];

function HeroSlidesAdmin() {
  const slides = [...useCollection("heroSlides")].sort((a, b) => a.order - b.order);

  return (
    <AdminShell title="Hero Slides" description="The rotating banner at the top of the homepage.">
      <ResourceManager<HeroSlide>
        items={slides}
        columns={columns}
        fields={fields}
        singular="Slide"
        emptyItem={() => ({
          id: newId("hs"),
          image: "hero.beauty",
          eyebrow: "",
          title: "",
          subtitle: "",
          ctaLabel: "Learn more",
          ctaHref: "/business",
          order: slides.length + 1,
        })}
        onSave={(item) => upsertItem("heroSlides", item)}
        onDelete={(id) => deleteItem("heroSlides", id)}
      />
    </AdminShell>
  );
}
