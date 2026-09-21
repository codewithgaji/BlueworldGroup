import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageForm } from "@/components/admin/page-form";
import { createAdminPage, emptyPage } from "@/lib/pages-admin";

export const Route = createFileRoute("/admin/pages/new")({
  component: NewPage,
});

function NewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  return (
    <AdminShell title="New page" description="Build a new About-section page from reusable content blocks.">
      <PageForm
        initial={emptyPage()}
        submitLabel="Create page"
        busy={busy}
        onSubmit={async (value) => {
          setBusy(true);
          try {
            await createAdminPage(value);
            await queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });
            await queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === "cms" && q.queryKey[1] === "page" });
            toast.success("Page created");
            void navigate({ to: "/admin/pages" });
          } catch {
            toast.error("Could not create page — check the page path isn't already in use.");
          } finally {
            setBusy(false);
          }
        }}
      />
    </AdminShell>
  );
}