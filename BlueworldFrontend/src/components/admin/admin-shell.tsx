import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Images,
  LayoutDashboard,
  Layers,
  LogOut,
  Menu,
  Newspaper,
  Package,
  Settings,
  Sparkles,
  Users,
  Briefcase,
  UserCheck,
  X,
  FileText,
} from "lucide-react";
import { getAdminUser, logout, useAdminUser } from "@/hooks/use-admin-auth";
import { BrandGlobe } from "@/components/brand/brand-globe";
import { cn } from "@/lib/utils";
import { useCmsSourceAlerts } from "@/hooks/use-cms-source-alerts";

export const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Hero Slides", to: "/admin/hero-slides", icon: Sparkles },
  { label: "Business Units", to: "/admin/business-units", icon: Layers },
  { label: "About Pages", to: "/admin/pages", icon: FileText },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Team", to: "/admin/team", icon: Users },
  { label: "Blog Posts", to: "/admin/blog", icon: Newspaper },
  { label: "Jobs", to: "/admin/jobs", icon: Briefcase },
  { label: "Media", to: "/admin/media", icon: Images },
  { label: "Access Requests", to: "/admin/access-requests", icon: UserCheck },
  { label: "Site Settings", to: "/admin/settings", icon: Settings },
] as const;



export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const user = useAdminUser();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useCmsSourceAlerts();


  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && !user && !getAdminUser()) void navigate({ to: "/admin/login" });
  }, [hydrated, user, navigate]);

  // Close the mobile nav automatically whenever the route changes.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const session = user ?? (hydrated ? getAdminUser() : null);

  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center bg-secondary text-sm text-muted-foreground">
        Checking your session…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-secondary">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
         <a       
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-20 items-center gap-3 border-b border-border px-6 transition-opacity hover:opacity-80"
          title="Open the public site in a new tab"
        >
          <BrandGlobe size={36} interactive={false} showMotto={false} />
          <div className="leading-tight">
            <p className="font-display text-sm font-extrabold text-primary-deep">BLUEWORLD</p>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-accent">CMS</p>
          </div>
        </a>
        <nav className="flex-1 space-y-1 p-4">
          {ADMIN_NAV.map((item) => {
            const active = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-primary-deep text-primary-foreground"
                    : "text-foreground/70 hover:bg-primary-soft hover:text-primary-deep",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <Link to="/" className="block rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground">
            ← View public site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileNavOpen((v) => !v)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border text-primary-deep lg:hidden"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-primary-deep">{title}</h1>
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-primary-deep">{session.fullName}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-accent">{session.role}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                void navigate({ to: "/admin/login" });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-primary-soft"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        <AnimatePresence>
          {mobileNavOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-b border-border bg-card lg:hidden"
            >
              <div className="space-y-1 p-4">
                {ADMIN_NAV.map((item) => {
                  const active = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                        active
                          ? "bg-primary-deep text-primary-foreground"
                          : "text-foreground/70 hover:bg-primary-soft hover:text-primary-deep",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  to="/"
                  className="mt-2 block rounded-xl border-t border-border px-3 py-3 pt-4 text-xs font-semibold text-muted-foreground"
                >
                  ← View public site
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}