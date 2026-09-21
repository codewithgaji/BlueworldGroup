import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageForm } from "@/components/admin/page-form";
import { LoadingBlock, ErrorBlock } from "@/components/site/primitives";
import { deleteAdminPage, getAdminPage, updateAdminPage } from "@/lib/pages-admin";
import type { PageInput } from "@/lib/pages-admin";

export const Route = createFileRoute("/admin/pages/$pageId")({
  component: EditPage,
});

function EditPage() {
  const { pageId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  const { data: page, isLoading, isError } = useQuery({
    queryKey: ["admin", "page", pageId],
    queryFn: () => getAdminPage(pageId),
  });

  useEffect(() => {
    if (isError) toast.error("Could not load this page.");
  }, [isError]);

  async function invalidatePageCaches() {
    await queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });
    await queryClient.invalidateQueries({ queryKey: ["admin", "page", pageId] });
    await queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === "cms" && q.queryKey[1] === "page" });
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${page?.title}"? This removes all of its content.`)) return;
    setBusy(true);
    try {
      await deleteAdminPage(pageId);
      await invalidatePageCaches();
      toast.success("Page deleted");
      void navigate({ to: "/admin/pages" });
    } catch {
      toast.error("Could not delete this page.");
    } finally {
      setBusy(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell title="Edit page">
        <LoadingBlock label="Loading page…" />
      </AdminShell>
    );
  }
  if (isError || !page) {
    return (
      <AdminShell title="Edit page">
        <ErrorBlock label="Could not load this page." />
      </AdminShell>
    );
  }

  const initial: PageInput = {
    slug: page.slug,
    title: page.title,
    eyebrow: page.eyebrow ?? "",
    description: page.description ?? "",
    heroImage: page.heroImage ?? "",
    metaTitle: page.metaTitle ?? "",
    metaDescription: page.metaDescription ?? "",
    status: page.status,
    blocks: [...page.blocks]
      .sort((a, b) => a.order - b.order)
      .map((b) => ({ type: b.type, tone: b.tone, order: b.order, payload: b.payload })),
  };

  return (
    <AdminShell
      title={`Edit: ${page.title}`}
      description="Editing an About-section page."
      actions={
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-4 py-2 text-sm font-bold text-destructive hover:bg-destructive/10 disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" />
          Delete page
        </button>
      }
    >
      <PageForm
        initial={initial}
        submitLabel="Save changes"
        busy={busy}
        onSubmit={async (value) => {
          setBusy(true);
          try {
            await updateAdminPage(pageId, value);
            await invalidatePageCaches();
            toast.success("Page saved");
            void navigate({ to: "/admin/pages" });
          } catch {
            toast.error("Could not save changes.");
          } finally {
            setBusy(false);
          }
        }}
      />
    </AdminShell>
  );
}