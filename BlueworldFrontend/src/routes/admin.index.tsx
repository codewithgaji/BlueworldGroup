import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { resetCms, useCmsState } from "@/lib/cms-store";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "CMS Dashboard — Blue World Cosmetics" },
      { name: "description", content: "Content overview for the Blue World Cosmetics website." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "CMS Dashboard — Blue World Cosmetics" },
      { property: "og:description", content: "Manage site content, brands, products and jobs." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const cms = useCmsState();

  const stats = [
    { label: "Hero slides", value: cms.heroSlides.length, to: "/admin/hero-slides" },
    { label: "Business units", value: cms.businessUnits.length, to: "/admin/business-units" },
    { label: "Products", value: cms.products.length, to: "/admin/products" },
    { label: "Team members", value: cms.teamMembers.length, to: "/admin/team" },
    { label: "Blog posts", value: cms.blogPosts.length, to: "/admin/blog" },
    { label: "Open roles", value: cms.jobPostings.length, to: "/admin/jobs" },
    { label: "Media assets", value: cms.mediaLibrary.length, to: "/admin/media" },
  ] as const;

  return (
    <AdminShell
      title="Dashboard"
      description="Everything published on blueworldcosmetics.org at a glance."
      actions={
        <button
          type="button"
          onClick={() => {
            resetCms();
            toast.success("Content reset to the seeded dataset");
          }}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground/75 hover:bg-primary-soft"
        >
          Reset content
        </button>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">{stat.label}</p>
            <p className="mt-3 font-display text-4xl font-extrabold text-primary-deep">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-primary-deep">Recent blog posts</h2>
          <ul className="mt-4 space-y-3">
            {[...cms.blogPosts]
              .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
              .slice(0, 4)
              .map((post) => (
                <li key={post.id} className="flex items-center justify-between gap-4 text-sm">
                  <span className="line-clamp-1 font-medium text-foreground/85">{post.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{post.publishedAt}</span>
                </li>
              ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-primary-deep">Backend status</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The CMS reads and writes against a local draft while the FastAPI service is unavailable.
            Every screen maps 1:1 to a REST resource documented in{" "}
            <span className="font-semibold text-primary-deep">BACKEND_MANIFEST.md</span>.
          </p>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">API base URL</dt>
              <dd className="font-mono text-xs text-primary-deep">{API_BASE_URL}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Auth</dt>
              <dd className="font-semibold text-primary-deep">JWT bearer (access + refresh)</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Write mode</dt>
              <dd className="font-semibold text-accent">Local draft</dd>
            </div>
          </dl>
        </div>
      </div>
    </AdminShell>
  );
}
