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

const columns: ColumnConfig<JobPosting>[] = [
  { key: "title", label: "Title" },
  { key: "department", label: "Department" },
  { key: "location", label: "Location" },
  { key: "employmentType", label: "Type" },
  { key: "postedAt", label: "Posted" },
];

const fields: FieldConfig<JobPosting>[] = [
  { name: "title", label: "Role title" },
  { name: "slug", label: "Slug" },
  { name: "department", label: "Department" },
  { name: "location", label: "Location" },
  {
    name: "employmentType",
    label: "Employment type",
    type: "select",
    options: ["Full-time", "Contract", "Internship"],
  },
  { name: "summary", label: "Summary", type: "textarea", rows: 3 },
  { name: "responsibilities", label: "Responsibilities", type: "list", rows: 6, help: "One per line." },
  { name: "requirements", label: "Requirements", type: "list", rows: 6, help: "One per line." },
  { name: "postedAt", label: "Posted on", help: "YYYY-MM-DD" },
  { name: "closesAt", label: "Closes on", help: "YYYY-MM-DD (optional)" },
];

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
          slug: "new-role",
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
        onSave={(item) => upsertItem("jobPostings", item)}
        onDelete={(id) => deleteItem("jobPostings", id)}
      />
    </AdminShell>
  );
}
