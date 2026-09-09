import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { apiFetch, ENDPOINTS, ApiError } from "@/lib/api";
import { BrandGlobe } from "@/components/brand/brand-globe";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/request-access")({
  head: () => ({
    meta: [
      { title: "Request CMS Access — Blue World Cosmetics" },
      { name: "description", content: "Request editor or viewer access to the Blue World Cosmetics CMS." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RequestAccessPage,
});

type RequestedRole = "editor" | "viewer";

function RequestAccessPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [requestedRole, setRequestedRole] = useState<RequestedRole>("viewer");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await apiFetch(ENDPOINTS.requestAccess, {
        method: "POST",
        body: JSON.stringify({ email, password, fullName, requestedRole }),
      });
      setSubmitted(true);
      toast.success("Request submitted — an admin will review it.");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toast.error("An account with this email already exists.");
      } else if (error instanceof ApiError && error.status === 429) {
        toast.error("Too many requests — please try again later.");
      } else {
        toast.error("Could not submit request. Try again shortly.");
      }
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="grid min-h-screen place-items-center bg-secondary px-5 py-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lift">
          <h1 className="font-display text-2xl font-bold text-primary-deep">Request sent</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your access request is pending review. You'll be able to sign in once an admin approves it.
          </p>
          <Link
            to="/admin/login"
            className="mt-6 inline-block rounded-full bg-primary-deep px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-secondary px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lift">
        <div className="flex items-center gap-3">
          <BrandGlobe size={56} interactive={false} showMotto={false} />
          <div className="leading-tight">
            <p className="font-display text-base font-extrabold text-primary-deep">BLUE WORLD</p>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-accent">
              Content Management
            </p>
          </div>
        </div>

        <h1 className="mt-8 font-display text-2xl font-bold text-primary-deep">Request CMS access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ask for editor or viewer access. An admin must approve your request before you can sign in.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="fullName" className="text-sm font-semibold text-primary-deep">
              Full name
            </label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-primary-deep">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-primary-deep">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="requestedRole" className="text-sm font-semibold text-primary-deep">
              Requested role
            </label>
            <select
              id="requestedRole"
              value={requestedRole}
              onChange={(e) => setRequestedRole(e.target.value as RequestedRole)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <option value="viewer">Viewer — read-only access</option>
              <option value="editor">Editor — can create and edit content</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={busy}
            className={cn(
              "w-full rounded-full bg-primary-deep px-6 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5",
              busy && "opacity-60",
            )}
          >
            {busy ? "Submitting…" : "Submit request"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/admin/login" className="font-semibold text-primary-deep">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}