import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { UserCheck, UserX, Trash2, ShieldAlert } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminUser } from "@/hooks/use-admin-auth";
import { apiFetch, ENDPOINTS } from "@/lib/api";

export const Route = createFileRoute("/admin/access-requests")({
  head: () => ({
    meta: [
      { title: "Access & Team — Blue World CMS" },
      { name: "description", content: "Approve access requests and manage existing CMS accounts." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccessRequestsPage,
});

interface AdminUserRow {
  id: string;
  email: string;
  fullName: string | null;
  role: "admin" | "editor" | "viewer";
  status: "pending" | "active" | "suspended";
  createdAt: string;
}

function AccessRequestsPage() {
  const session = getAdminUser();
  const isAdmin = session?.role === "admin";

  const [pending, setPending] = useState<AdminUserRow[]>([]);
  const [team, setTeam] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [pendingList, teamList] = await Promise.all([
        apiFetch<AdminUserRow[]>(ENDPOINTS.accessRequests, { method: "GET" }),
        apiFetch<AdminUserRow[]>(ENDPOINTS.users, { method: "GET" }),
      ]);
      setPending(pendingList);
      setTeam(teamList);
    } catch {
      toast.error("Could not load access requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) void load();
    else setLoading(false);
  }, [isAdmin]);

  function guardSelf(targetId: string, action: string): boolean {
    if (session && targetId === session.id) {
      toast.error(`You can't ${action} your own account while signed in.`);
      return true;
    }
    return false;
  }

  async function decide(id: string, approve: boolean) {
    setBusyId(id);
    try {
      await apiFetch(`${ENDPOINTS.accessRequests}/${id}/decision`, {
        method: "POST",
        body: JSON.stringify({ approve }),
      });
      toast.success(approve ? "Request approved" : "Request rejected");
      await load();
    } catch {
      toast.error("Could not update this request.");
    } finally {
      setBusyId(null);
    }
  }

  async function suspend(id: string) {
    if (guardSelf(id, "suspend")) return;
    setBusyId(id);
    try {
      await apiFetch(`${ENDPOINTS.users}/${id}/suspend`, { method: "POST" });
      toast.success("Account suspended");
      await load();
    } catch {
      toast.error("Could not suspend this account.");
    } finally {
      setBusyId(null);
    }
  }

  async function reactivate(id: string) {
    setBusyId(id);
    try {
      await apiFetch(`${ENDPOINTS.users}/${id}/reactivate`, { method: "POST" });
      toast.success("Account reactivated");
      await load();
    } catch {
      toast.error("Could not reactivate this account.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (guardSelf(id, "delete")) return;
    if (!window.confirm("Permanently delete this account? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await apiFetch(`${ENDPOINTS.users}/${id}`, { method: "DELETE" });
      toast.success("Account deleted");
      await load();
    } catch {
      toast.error("Could not delete this account.");
    } finally {
      setBusyId(null);
    }
  }

  if (!isAdmin) {
    return (
      <AdminShell title="Access & team" description="Approve requests, and manage existing CMS accounts.">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-12 text-center">
          <ShieldAlert className="h-8 w-8 text-muted-foreground" />
          <p className="font-semibold text-primary-deep">Admins only</p>
          <p className="text-sm text-muted-foreground">
            Your account doesn't have permission to manage team access. Contact an administrator if you need this.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Access & team" description="Approve requests, and manage existing CMS accounts.">
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-lg font-bold text-primary-deep">Pending requests</h2>
            {pending.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No pending requests.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {pending.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                    <div>
                      <p className="font-semibold text-primary-deep">{r.fullName || r.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.email} — requested <span className="font-semibold">{r.role}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        disabled={busyId === r.id}
                        onClick={() => void decide(r.id, true)}
                        className="rounded-full bg-primary-deep px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        disabled={busyId === r.id}
                        onClick={() => void decide(r.id, false)}
                        className="rounded-full border border-border px-4 py-2 text-xs font-bold text-primary-deep disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-primary-deep">Team</h2>
            {team.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No approved accounts yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {team.map((u) => {
                  const isSelf = session && u.id === session.id;
                  return (
                    <div
                      key={u.id}
                      className={`flex items-center justify-between rounded-xl border border-border bg-card p-4 ${isSelf ? "opacity-60" : ""}`}
                    >
                      <div>
                        <p className="font-semibold text-primary-deep">
                          {u.fullName || u.email}
                          {isSelf && <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {u.email} — <span className="font-semibold">{u.role}</span> —{" "}
                          <span className={u.status === "suspended" ? "text-destructive" : "text-accent"}>
                            {u.status}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {u.status === "active" ? (
                          <button
                            disabled={busyId === u.id}
                            onClick={() => void suspend(u.id)}
                            className={`inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-primary-deep disabled:opacity-60 ${isSelf ? "cursor-not-allowed" : ""}`}
                          >
                            <UserX className="h-3.5 w-3.5" />
                            Suspend
                          </button>
                        ) : (
                          <button
                            disabled={busyId === u.id}
                            onClick={() => void reactivate(u.id)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary-deep px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-60"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            Reactivate
                          </button>
                        )}
                        <button
                          disabled={busyId === u.id}
                          onClick={() => void remove(u.id)}
                          className={`inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-4 py-2 text-xs font-bold text-destructive disabled:opacity-60 ${isSelf ? "cursor-not-allowed" : ""}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </AdminShell>
  );
}