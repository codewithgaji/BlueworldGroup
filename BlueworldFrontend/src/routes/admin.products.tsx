import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { ResourceManager, type ColumnConfig, type FieldConfig } from "@/components/admin/resource-manager";
import { deleteItem, newId, upsertItem, useCollection } from "@/lib/cms-store";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products — Blue World CMS" },
      { name: "description", content: "Manage the product catalogue across all brands." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Products — Blue World CMS" },
      { property: "og:description", content: "Manage the Blue World product catalogue." },
    ],
  }),
  component: ProductsAdmin,
});

const columns: ColumnConfig<Product>[] = [
  { key: "image", label: "Image", image: true },
  { key: "name", label: "Name" },
  { key: "unit", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "size", label: "Size" },
];

const fields: FieldConfig<Product>[] = [
  { name: "name", label: "Product name" },
  {
    name: "unit",
    label: "Business unit",
    type: "select",
    options: ["vivon", "bluecrystal", "blow-right", "bluefragrance", "blueworld-cosmetics"],
  },
  { name: "subLine", label: "Vivon range", type: "select", options: ["face", "body", "children"] },
  { name: "category", label: "Category" },
  { name: "description", label: "Description", type: "textarea", rows: 3 },
  { name: "size", label: "Pack size" },
  { name: "image", label: "Image", type: "image" },
  { name: "featured", label: "Featured on homepage", type: "boolean" },
];

function ProductsAdmin() {
  const products = useCollection("products");

  return (
    <AdminShell title="Products" description="Catalogue entries shown on each brand page.">
      <ResourceManager<Product>
        items={products}
        columns={columns}
        fields={fields}
        singular="Product"
        emptyItem={() =>
          ({
            id: newId("p"),
            name: "",
            unit: "vivon",
            category: "",
            description: "",
            size: "",
            image: "hero.products",
            featured: false,
          }) as Product
        }
        onSave={(item) => upsertItem("products", item)}
        onDelete={(id) => deleteItem("products", id)}
      />
    </AdminShell>
  );
}
