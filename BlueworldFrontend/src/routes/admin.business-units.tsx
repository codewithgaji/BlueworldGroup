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
  { key: "heroImage", label: "Cover Photo", image: true },
  { key: "name", label: "Brand Name" },
  { key: "accent", label: "Colour Theme" },
  { key: "order", label: "Display Order" },
];

const fields: FieldConfig<BusinessUnit>[] = [
  {
    name: "slug",
    label: "Which brand is this?",
    type: "select",
    options: ["vivon", "bluecrystal", "blow-right", "bluefragrance", "blueworld-cosmetics"],
    help: "This is fixed to one of the five brands — it controls which page on the website this content appears on.",
  },
  { name: "name", label: "Brand Name (as shown on the page)" },
  { name: "tagline", label: "Short slogan", help: "A one-line phrase shown under the brand name, e.g. 'Skincare that listens to your skin'." },
  { name: "summary", label: "Short description", type: "textarea", rows: 3, help: "A brief overview shown on the homepage card for this brand." },
  { name: "story", label: "Full brand story", type: "textarea", rows: 8, help: "The longer story shown on the brand's own page. Leave a blank line to start a new paragraph." },
  {
    name: "heroImage",
    label: "Cover Photo",
    type: "image",
    help: "This is the ONE main photo for this brand — shown on the homepage and at the top of the brand's page. To show several product photos, add them as separate Products (see the Products tab) and tag them to this brand.",
  },
  { name: "accent", label: "Colour Theme", type: "select", options: ["blue", "orange"], help: "Which brand colour is used for highlights on this brand's page." },
  { name: "order", label: "Display Order", type: "number", help: "Lower numbers appear first on the homepage. 1 shows before 2, and so on." },
];

function BusinessUnitsAdmin() {
  const units = [...useCollection("businessUnits")].sort((a, b) => a.order - b.order);

  return (
    <AdminShell
      title="Business Units"
      description="Each division shown under the Business menu. Note: each brand has one cover photo here — individual product photos are managed separately under Products."
    >
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
            heroImage: "",
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