import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageForm } from "@/components/admin/page-form";
import { createAdminPage, emptyPage } from "@/lib/pages-admin";

export const Route = createFileRoute("/admin/pages/new")({
  component: NewPage,
});

function NewPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  return (
    <AdminShell title="New page" description="Create a new About-section page.">
      <PageForm
        initial={emptyPage()}
        submitLabel="Create page"
        busy={busy}
        onSubmit={async (value) => {
          setBusy(true);
          try {
            await createAdminPage(value);
            toast.success("Page created");
            void navigate({ to: "/admin/pages" });
          } catch {
            toast.error("Could not create the page.");
          } finally {
            setBusy(false);
          }
        }}
      />
    </AdminShell>
  );
}