import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { ResourceManager, type ColumnConfig, type FieldConfig } from "@/components/admin/resource-manager";
import { deleteItem, newId, upsertItem, useCollection } from "@/lib/cms-store";
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

const columns: ColumnConfig<BlogPost>[] = [
  { key: "coverImage", label: "Cover", image: true },
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "author", label: "Author" },
  { key: "publishedAt", label: "Published" },
];

const fields: FieldConfig<BlogPost>[] = [
  { name: "title", label: "Title" },
  { name: "slug", label: "Slug", help: "URL: /blog/<slug>" },
  { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3 },
  { name: "body", label: "Body", type: "textarea", rows: 12, help: "Separate paragraphs with a blank line." },
  { name: "category", label: "Category" },
  { name: "author", label: "Author" },
  { name: "publishedAt", label: "Publish date", help: "YYYY-MM-DD" },
  { name: "coverImage", label: "Cover image", type: "image" },
  { name: "readingMinutes", label: "Reading minutes", type: "number" },
];

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
          slug: "new-post",
          title: "",
          excerpt: "",
          body: "",
          category: "Company News",
          author: "",
          publishedAt: new Date().toISOString().slice(0, 10),
          coverImage: "blog.ingredients",
          readingMinutes: 4,
        })}
        onSave={(item) => upsertItem("blogPosts", item)}
        onDelete={(id) => deleteItem("blogPosts", id)}
      />
    </AdminShell>
  );
}
