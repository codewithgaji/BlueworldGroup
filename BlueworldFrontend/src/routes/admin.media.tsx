import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { ResourceManager, type ColumnConfig, type FieldConfig } from "@/components/admin/resource-manager";
import { deleteItem, newId, upsertItem, useCollection } from "@/lib/cms-store";
import type { MediaAsset } from "@/lib/types";

export const Route = createFileRoute("/admin/media")({
  head: () => ({
    meta: [
      { title: "Media Library — Blue World CMS" },
      { name: "description", content: "Track every image used across the Blue World Cosmetics site." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Media Library — Blue World CMS" },
      { property: "og:description", content: "Image assets and where they are used." },
    ],
  }),
  component: MediaAdmin,
});

const columns: ColumnConfig<MediaAsset>[] = [
  { key: "url", label: "Preview", image: true },
  { key: "filename", label: "Filename" },
  { key: "localPath", label: "Local path" },
  { key: "usedOn", label: "Used on" },
];

const fields: FieldConfig<MediaAsset>[] = [
  { name: "filename", label: "Filename" },
  { name: "url", label: "Image", type: "image", help: "Bundled asset key, or paste a remote URL below." },
  { name: "localPath", label: "Local path", help: "Drop a replacement file here to swap the image." },
  { name: "width", label: "Width", type: "number" },
  { name: "height", label: "Height", type: "number" },
  { name: "usedOn", label: "Used on" },
];

function MediaAdmin() {
  const assets = useCollection("mediaLibrary");

  return (
    <AdminShell
      title="Media Library"
      description="Images resolve through src/data/images.ts — replace a file in src/assets to swap it everywhere."
    >
      <ResourceManager<MediaAsset>
        items={assets}
        columns={columns}
        fields={fields}
        singular="Asset"
        emptyItem={() => ({
          id: newId("m"),
          filename: "",
          url: "hero.products",
          localPath: "src/assets/",
          width: 1600,
          height: 1100,
          usedOn: "",
        })}
        onSave={(item) => upsertItem("mediaLibrary", item)}
        onDelete={(id) => deleteItem("mediaLibrary", id)}
      />
    </AdminShell>
  );
}
