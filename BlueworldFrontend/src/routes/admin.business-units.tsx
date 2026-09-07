import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { ResourceManager, type ColumnConfig, type FieldConfig } from "@/components/admin/resource-manager";
import { deleteItem, newId, upsertItem, useCollection } from "@/lib/cms-store";
import type { BusinessUnit } from "@/lib/types";

export const Route = createFileRoute("/admin/business-units")({
  head: () => ({
    meta: [
      { title: "Business Units — Blue World CMS" },
      { name: "description", content: "Manage the five Blue World brand divisions." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Business Units — Blue World CMS" },
      { property: "og:description", content: "Manage brand divisions and their stories." },
    ],
  }),
  component: BusinessUnitsAdmin,
});

const columns: ColumnConfig<BusinessUnit>[] = [
  { key: "heroImage", label: "Image", image: true },
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "accent", label: "Accent" },
  { key: "order", label: "Order" },
];

const fields: FieldConfig<BusinessUnit>[] = [
  { name: "name", label: "Name" },
  { name: "slug", label: "Slug", help: "Used in the URL: /business/<slug>" },
  { name: "tagline", label: "Tagline" },
  { name: "summary", label: "Summary", type: "textarea", rows: 3 },
  { name: "story", label: "Brand story", type: "textarea", rows: 8, help: "Separate paragraphs with a blank line." },
  { name: "heroImage", label: "Hero image", type: "image" },
  { name: "accent", label: "Accent colour", type: "select", options: ["blue", "orange"] },
  { name: "order", label: "Order", type: "number" },
];

function BusinessUnitsAdmin() {
  const units = [...useCollection("businessUnits")].sort((a, b) => a.order - b.order);

  return (
    <AdminShell title="Business Units" description="Each division shown under the Business menu.">
      <ResourceManager<BusinessUnit>
        items={units}
        columns={columns}
        fields={fields}
        singular="Business unit"
        emptyItem={() =>
          ({
            id: newId("bu"),
            slug: "vivon",
            name: "",
            tagline: "",
            summary: "",
            story: "",
            heroImage: "unit.blueworld-cosmetics",
            accent: "blue",
            order: units.length + 1,
          }) as BusinessUnit
        }
        onSave={(item) => upsertItem("businessUnits", item)}
        onDelete={(id) => deleteItem("businessUnits", id)}
      />
    </AdminShell>
  );
}
