import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { ResourceManager, type ColumnConfig, type FieldConfig } from "@/components/admin/resource-manager";
import { deleteItem, newId, upsertItem, useCollection } from "@/lib/cms-store";
import type { TeamMember } from "@/lib/types";

export const Route = createFileRoute("/admin/team")({
  head: () => ({
    meta: [
      { title: "Team — Blue World CMS" },
      { name: "description", content: "Manage the leadership team shown on the About pages." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Team — Blue World CMS" },
      { property: "og:description", content: "Manage leadership profiles." },
    ],
  }),
  component: TeamAdmin,
});

const columns: ColumnConfig<TeamMember>[] = [
  { key: "photo", label: "Photo", image: true },
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "order", label: "Order" },
];

const fields: FieldConfig<TeamMember>[] = [
  { name: "name", label: "Full name" },
  { name: "role", label: "Role" },
  { name: "bio", label: "Bio", type: "textarea", rows: 4 },
  { name: "photo", label: "Photo", type: "image" },
  { name: "order", label: "Order", type: "number" },
];

function TeamAdmin() {
  const members = [...useCollection("teamMembers")].sort((a, b) => a.order - b.order);

  return (
    <AdminShell title="Team" description="Executives listed on About Us → Leadership.">
      <ResourceManager<TeamMember>
        items={members}
        columns={columns}
        fields={fields}
        singular="Team member"
        emptyItem={() => ({
          id: newId("t"),
          name: "",
          role: "",
          bio: "",
          photo: "team.1",
          order: members.length + 1,
        })}
        onSave={(item) => upsertItem("teamMembers", item)}
        onDelete={(id) => deleteItem("teamMembers", id)}
      />
    </AdminShell>
  );
}
