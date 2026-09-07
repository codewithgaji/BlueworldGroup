import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DEMO_CREDENTIALS, login, useAdminUser } from "@/hooks/use-admin-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "CMS Sign In — Blue World Cosmetics" },
      { name: "description", content: "Secure sign-in for the Blue World Cosmetics content management system." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "CMS Sign In — Blue World Cosmetics" },
      { property: "og:description", content: "Staff access to the Blue World Cosmetics CMS." },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const user = useAdminUser();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [busy, setBusy] = useState(false);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && user) void navigate({ to: "/admin" });
  }, [hydrated, user, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Signed in");
      void navigate({ to: "/admin" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-secondary px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lift">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-accent font-display text-sm font-black text-accent">
            BW
          </span>
          <div className="leading-tight">
            <p className="font-display text-base font-extrabold text-primary-deep">BLUE WORLD</p>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-accent">
              Content Management
            </p>
          </div>
        </div>

        <h1 className="mt-8 font-display text-2xl font-bold text-primary-deep">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Staff access only. Sessions use JWT access + refresh tokens.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className={cn(
              "w-full rounded-full bg-primary-deep px-6 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5",
              busy && "opacity-60",
            )}
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 rounded-xl bg-secondary p-4 text-xs leading-relaxed text-muted-foreground">
          Demo account (used while the API is offline):
          <br />
          <span className="font-semibold text-primary-deep">{DEMO_CREDENTIALS.email}</span> /{" "}
          <span className="font-semibold text-primary-deep">{DEMO_CREDENTIALS.password}</span>
        </p>
      </div>
    </div>
  );
}
