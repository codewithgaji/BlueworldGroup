import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { deleteAdminPage, listAdminPages } from "@/lib/pages-admin";

export const Route = createFileRoute("/admin/pages/")({
  component: AdminPagesList,
});

function AdminPagesList() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "pages"],
    queryFn: listAdminPages,
  });
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (isError) toast.error("Could not load pages — check your connection or permissions.");
  }, [isError]);

  async function handleDelete(id: string, slug: string) {
    if (!window.confirm(`Delete the "${slug}" page? This removes all of its blocks too.`)) return;
    setBusyId(id);
    try {
      await deleteAdminPage(id);
      toast.success("Page deleted");
      await refetch();
    } catch {
      toast.error("Could not delete — check your connection or permissions.");
    } finally {
      setBusyId(null);
    }
  }

  const StatusBadge = ({ status }: { status: string }) => (
    <span
      className={
        status === "published"
          ? "rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-deep"
          : "rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground"
      }
    >
      {status}
    </span>
  );

  const RowActions = ({ id, title, slug, size = "h-9 w-9" }: { id: string; title: string; slug: string; size?: string }) => (
    <>
      <Link
        to="/admin/pages/$pageId"
        params={{ pageId: id }}
        className={`grid ${size} place-items-center rounded-lg border border-border text-primary-deep transition-colors hover:bg-primary-soft`}
        aria-label={`Edit ${title}`}
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        type="button"
        disabled={busyId === id}
        onClick={() => void handleDelete(id, slug)}
        className={`grid ${size} place-items-center rounded-lg border border-border text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50`}
        aria-label={`Delete ${title}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  );

  return (
    <AdminShell
      title="About Pages"
      description="Content and images for the About section — Index, Who We Are, Vision & Mission, Leadership."
      actions={
        <button
          type="button"
          onClick={() => void navigate({ to: "/admin/pages/new" })}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-card transition-transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          New page
        </button>
      }
    >
      {isLoading && (
        <div className="rounded-2xl border border-border bg-card py-10 text-center text-sm text-muted-foreground">
          Loading pages…
        </div>
      )}
      {!isLoading && (data?.length ?? 0) === 0 && (
        <div className="rounded-2xl border border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
          No pages yet — create your first one, or run{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5">python -m scripts.seed_pages</code> on the backend to
          load the four About pages.
        </div>
      )}

      {/* Mobile: stacked cards, matching the pattern used everywhere else in the admin panel */}
      {!isLoading && (data?.length ?? 0) > 0 && (
        <div className="space-y-3 sm:hidden">
          {(data ?? []).map((page) => (
            <div key={page.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-primary-deep">{page.title}</p>
                  <p className="truncate text-xs text-muted-foreground">/{page.slug}</p>
                </div>
                <StatusBadge status={page.status} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{page.blocks.length} section(s)</p>
                <div className="flex gap-2">
                  <RowActions id={page.id} title={page.title} slug={page.slug} size="h-10 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tablet/desktop: table */}
      {!isLoading && (data?.length ?? 0) > 0 && (
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-card sm:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-secondary/60">
                <tr>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Title</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Slug</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Blocks</th>
                  <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((page) => (
                  <tr key={page.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-4 font-semibold text-primary-deep">{page.title}</td>
                    <td className="px-5 py-4 text-muted-foreground">/{page.slug}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={page.status} />
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{page.blocks.length}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <RowActions id={page.id} title={page.title} slug={page.slug} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}