// blog.tsx
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { ResourceManager, type ColumnConfig, type FieldConfig } from "@/components/admin/resource-manager";
import { deleteItem, newId, upsertItem, useCollection } from "@/lib/cms-store";
import { BLOG_CATEGORIES } from "@/data/placeholder-content";
import type { BlogPost } from "@/lib/types";

export const Route = createFileRoute("/admin/blog")({
  head: () => ({
    meta: [
      { title: "Blog Posts — Blue World CMS" },
      { name: "description", content: "Write and edit articles published on the Blue World blog." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Blog Posts — Blue World CMS" },
      { property: "og:description", content: "Write and edit blog articles." },
    ],
  }),
  component: BlogAdmin,
});

const POST_CATEGORIES = BLOG_CATEGORIES.filter((c) => c !== "All");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

const columns: ColumnConfig<BlogPost>[] = [
  { key: "coverImage", label: "Cover", image: true },
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "author", label: "Author" },
  { key: "publishedAt", label: "Published" },
];

const fields: FieldConfig<BlogPost>[] = [
  { name: "title", label: "Article title" },
  { name: "excerpt", label: "Short summary", type: "textarea", rows: 3, help: "A one- or two-sentence teaser shown on the blog listing page." },
  { name: "body", label: "Full article", type: "textarea", rows: 12, help: "Leave a blank line between paragraphs to start a new one." },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: POST_CATEGORIES,
  },
  { name: "author", label: "Written by" },
  { name: "publishedAt", label: "Publish date", type: "date", help: "Pick the date this article should go live." },
  { name: "coverImage", label: "Cover photo", type: "image" },
  { name: "readingMinutes", label: "Reading time (minutes)", type: "number" },
];

const DEFAULT_SLUG_PLACEHOLDER = "new-post";

function BlogAdmin() {
  const posts = [...useCollection("blogPosts")].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <AdminShell title="Blog Posts" description="Articles published under /blog.">
      <ResourceManager<BlogPost>
        items={posts}
        columns={columns}
        fields={fields}
        singular="Post"
        emptyItem={() => ({
          id: newId("b"),
          slug: DEFAULT_SLUG_PLACEHOLDER,
          title: "",
          excerpt: "",
          body: "",
          category: "Company News",
          author: "",
          publishedAt: new Date().toISOString().slice(0, 10),
          coverImage: "",
          readingMinutes: 4,
        })}
        onSave={(item) => {
          // The web-address slug is generated automatically from the title —
          // only regenerate it for a brand-new post, so editing an existing
          // post's title never breaks a link someone already shared.
          const needsSlug = !item.slug || item.slug === DEFAULT_SLUG_PLACEHOLDER;
          const finalItem = needsSlug ? { ...item, slug: slugify(item.title) || newId("post") } : item;
          upsertItem("blogPosts", finalItem);
        }}
        onDelete={(id) => deleteItem("blogPosts", id)}
      />
    </AdminShell>
  );
}