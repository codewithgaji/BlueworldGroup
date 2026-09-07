import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CmsImage, EmptyBlock, Section } from "@/components/site/primitives";
import { useBlogPosts } from "@/hooks/use-cms";
import { BLOG_POSTS } from "@/data/placeholder-content";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { title: post.title, excerpt: post.excerpt };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Post not found — Blue World Cosmetics" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.title} — Blue World Cosmetics`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.excerpt.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.excerpt.slice(0, 155) },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data } = useBlogPosts();
  const posts = data ?? [];
  const post = posts.find((p) => p.slug === slug);
  const related = posts.filter((p) => p.slug !== slug).slice(0, 2);

  if (!post) {
    return (
      <Section>
        <EmptyBlock label="This post is not published yet." />
      </Section>
    );
  }

  return (
    <article>
      <div className="relative overflow-hidden surface-deep">
        <div className="absolute inset-0">
          <CmsImage src={post.coverImage} alt="" className="h-full w-full object-cover opacity-25" eager />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-deep via-primary-deep/85 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-4xl px-5 py-24 lg:px-8 lg:py-28">
          <p className="eyebrow">{post.category}</p>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] text-primary-foreground lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 text-sm font-semibold text-primary-foreground/70">
            {post.author} ·{" "}
            {new Date(post.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · {post.readingMinutes} min read
          </p>
        </div>
      </div>

      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-border shadow-card">
            <CmsImage src={post.coverImage} alt={post.title} className="aspect-[16/9] w-full object-cover" />
          </div>
          <div className="mt-10 space-y-6">
            {post.body.split("\n\n").map((para) => (
              <p key={para.slice(0, 32)} className="text-base leading-relaxed text-foreground/85">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-14 border-t border-border pt-10">
            <h2 className="font-display text-lg font-bold text-primary-deep">Keep reading</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-accent">
                    {r.category}
                  </p>
                  <p className="mt-2 font-semibold text-primary-deep">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </article>
  );
}
