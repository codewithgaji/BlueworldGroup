import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CmsImage,
  EmptyBlock,
  LoadingBlock,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { useBlogPosts } from "@/hooks/use-cms";
import { cn } from "@/lib/utils";

type BlogSearch = { category?: string | undefined };

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>): BlogSearch => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Blog & News — Blue World Cosmetics" },
      {
        name: "description",
        content:
          "Formulation science, manufacturing standards and company news from the Blue World Cosmetics team in Lagos.",
      },
      { property: "og:title", content: "Blog & News — Blue World Cosmetics" },
      {
        property: "og:description",
        content: "Notes from our lab, our factory floor and our export desk.",
      },
    ],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate();
  const { data, isLoading } = useBlogPosts();
  const posts = [...(data ?? [])].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const active = category ?? "All";
  const visible = active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Notes from the lab and the line"
        description="Formulation science, quality standards and company news — written by the people doing the work."
        image="blog.ingredients"
      />

      <Section>
        <SectionHeading eyebrow="Latest posts" title="What we've been writing" />

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                navigate({
                  to: "/blog",
                  search: cat === "All" ? {} : { category: cat },
                })
              }
              className={cn(
                "rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors",
                active === cat
                  ? "border-transparent bg-primary-deep text-primary-foreground"
                  : "text-foreground/70 hover:bg-primary-soft hover:text-primary-deep",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {isLoading && <LoadingBlock label="Loading posts…" />}
          {!isLoading && visible.length === 0 && <EmptyBlock label="No posts in this category yet." />}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="aspect-[16/10] overflow-hidden bg-secondary">
                  <CmsImage
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-accent">
                    {post.category} · {post.readingMinutes} min read
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug text-primary-deep">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <p className="mt-5 text-xs font-semibold text-muted-foreground">
                    {post.author} · {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
