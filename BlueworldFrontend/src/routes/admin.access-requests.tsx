import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { apiFetch, ENDPOINTS } from "@/lib/api";

export const Route = createFileRoute("/admin/access-requests")({
  head: () => ({
    meta: [
      { title: "Access Requests — Blue World CMS" },
      { name: "description", content: "Approve or reject pending editor and viewer access requests." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccessRequestsPage,
});

interface PendingUser {
  id: string;
  email: string;
  fullName: string | null;
  role: "admin" | "editor" | "viewer";
  status: "pending" | "active" | "suspended";
  createdAt: string;
}

function AccessRequestsPage() {
  const [requests, setRequests] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch<PendingUser[]>(ENDPOINTS.accessRequests, { method: "GET" });
      setRequests(data);
    } catch {
      toast.error("Could not load access requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function decide(id: string, approve: boolean) {
    setBusyId(id);
    try {
      await apiFetch(`${ENDPOINTS.accessRequests}/${id}/decision`, {
        method: "POST",
        body: JSON.stringify({ approve }),
      });
      toast.success(approve ? "Request approved" : "Request rejected");
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Could not update this request.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell title="Access requests" description="Pending editor and viewer sign-up requests.">
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pending requests.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
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
    </AdminShell>
  );
}