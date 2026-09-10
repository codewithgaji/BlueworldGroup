import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { UploadCloud, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ResourceManager, type ColumnConfig, type FieldConfig } from "@/components/admin/resource-manager";
import { addUploadedMedia, deleteItem, newId, upsertItem, useCollection } from "@/lib/cms-store";
import { uploadMedia } from "@/lib/api";
import type { MediaAsset } from "@/lib/types";
import { cn } from "@/lib/utils";

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
const MEDIA_USAGE_AREAS = [
  "Hero Slides",
  "Business Units",
  "Products",
  "Team",
  "Blog Posts",
  "Site Logo / Settings",
  "Admin Login Background",
] as const;

const fields: FieldConfig<MediaAsset>[] = [
  { name: "filename", label: "Filename" },
  { name: "url", label: "Image", type: "image", help: "Set automatically by upload — edit only if replacing a broken link." },
  { name: "localPath", label: "Local path", help: "Legacy field — leave blank for uploaded assets." },
  { name: "width", label: "Width", type: "number" },
  { name: "height", label: "Height", type: "number" },
  {
    name: "usedOn",
    label: "Where is this used?",
    type: "multiselect",
    options: MEDIA_USAGE_AREAS,
    help: "Tap all the areas this image applies to — helps you find it later and lets other screens pick it up automatically.",
  },
];

function UploadPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0]!;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    setUploading(true);
    try {
      const asset = await uploadMedia(file);
      addUploadedMedia(asset);
      toast.success(`Uploaded ${asset.filename}`);
    } catch {
      toast.error("Upload failed — check your connection or permissions.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        void handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "mb-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
        dragOver ? "border-accent bg-primary-soft" : "border-border bg-card hover:border-accent/60",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      {uploading ? (
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      ) : (
        <UploadCloud className="h-8 w-8 text-accent" />
      )}
      <p className="mt-3 text-sm font-semibold text-primary-deep">
        {uploading ? "Uploading…" : "Drag an image here, or click to browse"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">Uploads go straight to Cloudinary.</p>
    </div>
  );
}

function MediaAdmin() {
  const assets = useCollection("mediaLibrary");

  return (
    <AdminShell
      title="Media Library"
      description="Upload images directly — they're stored on Cloudinary and available across every resource."
    >
      <UploadPanel />
      <ResourceManager<MediaAsset>
        items={assets}
        columns={columns}
        fields={fields}
        singular="Asset"
        emptyItem={() => ({
          id: newId("m"),
          filename: "",
          url: "",
          localPath: "",
          width: 0,
          height: 0,
          usedOn: "",
        })}
        onSave={(item) => upsertItem("mediaLibrary", item)}
        onDelete={(id) => deleteItem("mediaLibrary", id)}
      />
    </AdminShell>
  );
}