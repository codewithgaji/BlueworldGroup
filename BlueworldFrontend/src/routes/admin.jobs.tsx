import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { ResourceManager, type ColumnConfig, type FieldConfig } from "@/components/admin/resource-manager";
import { deleteItem, newId, upsertItem, useCollection } from "@/lib/cms-store";
import type { JobPosting } from "@/lib/types";

export const Route = createFileRoute("/admin/jobs")({
  head: () => ({
    meta: [
      { title: "Job Postings — Blue World CMS" },
      { name: "description", content: "Publish and close roles listed on the careers page." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Job Postings — Blue World CMS" },
      { property: "og:description", content: "Manage open roles." },
    ],
  }),
  component: JobsAdmin,
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

const columns: ColumnConfig<JobPosting>[] = [
  { key: "title", label: "Title" },
  { key: "department", label: "Department" },
  { key: "location", label: "Location" },
  { key: "employmentType", label: "Type" },
  { key: "postedAt", label: "Posted" },
];

const fields: FieldConfig<JobPosting>[] = [
  { name: "title", label: "Role title" },
  { name: "department", label: "Department" },
  { name: "location", label: "Location" },
  {
    name: "employmentType",
    label: "Employment type",
    type: "select",
    options: ["Full-time", "Contract", "Internship"],
  },
  { name: "summary", label: "Role summary", type: "textarea", rows: 3, help: "A short overview of the role, shown on the careers listing." },
  { name: "responsibilities", label: "What they'll do", type: "list", rows: 6, help: "One responsibility per line." },
  { name: "requirements", label: "What we're looking for", type: "list", rows: 6, help: "One requirement per line." },
  { name: "postedAt", label: "Posted on", type: "date", help: "Pick the date this role should start showing on the careers page." },
  { name: "closesAt", label: "Applications close on", type: "date", help: "Optional — leave blank if there's no deadline." },
];

const DEFAULT_SLUG_PLACEHOLDER = "new-role";

function JobsAdmin() {
  const jobs = [...useCollection("jobPostings")].sort((a, b) => b.postedAt.localeCompare(a.postedAt));

  return (
    <AdminShell title="Job Postings" description="Roles listed on the Career page.">
      <ResourceManager<JobPosting>
        items={jobs}
        columns={columns}
        fields={fields}
        singular="Job"
        emptyItem={() => ({
          id: newId("j"),
          slug: DEFAULT_SLUG_PLACEHOLDER,
          title: "",
          department: "",
          location: "Ikeja, Lagos",
          employmentType: "Full-time",
          summary: "",
          responsibilities: [],
          requirements: [],
          postedAt: new Date().toISOString().slice(0, 10),
          closesAt: null,
        })}
        onSave={(item) => {
          const needsSlug = !item.slug || item.slug === DEFAULT_SLUG_PLACEHOLDER;
          const finalItem = needsSlug ? { ...item, slug: slugify(item.title) || newId("role") } : item;
          upsertItem("jobPostings", finalItem);
        }}
        onDelete={(id) => deleteItem("jobPostings", id)}
      />
    </AdminShell>
  );
}