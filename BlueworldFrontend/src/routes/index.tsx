import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { HeroSlider } from "@/components/site/hero-slider";
import { AppLink } from "@/components/site/app-link";
import { BrandGlobe } from "@/components/brand/brand-globe";
import {
  CmsImage,
  EmptyBlock,
  LoadingBlock,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { ProductCard } from "@/components/site/product-card";
import { useBlogPosts, useBusinessUnits, useHeroSlides, useProducts } from "@/hooks/use-cms";
import { ENDPOINTS, submitWithMock } from "@/lib/api";
import { REACH_MARKERS } from "@/data/placeholder-content";
import { HeroFlag } from "@/components/site/hero-context";
import { ScrollRevealText } from "@/components/site/scroll-reveal-text";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blue World Cosmetics — Nigerian Cosmetics Manufacturer" },
      {
        name: "description",
        content:
          "Skincare, hygiene, haircare and fragrance manufactured in Lagos. Home of Vivon, BlueCrystal, Blow Right, BlueFragrance and BlueWorld Cosmetics.",
      },
      { property: "og:title", content: "Blue World Cosmetics" },
      {
        property: "og:description",
        content: "Five brands. One Nigerian manufacturing house. God Is Our Strength.",
      },
    ],
  }),
  component: HomePage,
});

const BUSINESS_UNIT_DISPLAY_ORDER = [
  "vivon",
  "bluefragrance",
  "blueworld-cosmetics",
  "bluecrystal",
  "blow-right",
];

function orderBusinessUnits<T extends { slug: string }>(units: T[]): T[] {
  return [...units].sort((a, b) => {
    const ai = BUSINESS_UNIT_DISPLAY_ORDER.indexOf(a.slug);
    const bi = BUSINESS_UNIT_DISPLAY_ORDER.indexOf(b.slug);
    const aRank = ai === -1 ? BUSINESS_UNIT_DISPLAY_ORDER.length : ai;
    const bRank = bi === -1 ? BUSINESS_UNIT_DISPLAY_ORDER.length : bi;
    return aRank - bRank;
  });
}

const TRUST_MARKERS = [
  { k: "1998", v: "Founded in Lagos" },
  { k: "500+", v: "People employed" },
  { k: "5", v: "Brands in the house" },
  { k: "120+", v: "SKUs in production" },
  { k: "4", v: "Countries reached" },
  { k: "11", v: "QC checks per batch" },
];

function HomePage() {
  const slides = useHeroSlides();
  const units = useBusinessUnits();
  const products = useProducts();
  const posts = useBlogPosts();

  const orderedUnits = orderBusinessUnits(units.data ?? []);
  const featured = (products.data ?? []).filter((p) => p.featured).slice(0, 4);
  const latest = (posts.data ?? []).slice(0, 3);

  return (
    <>
      <HeroFlag />
      {slides.isLoading ? (
        <div className="h-[70vh] animate-pulse bg-primary-deep" />
      ) : (
        <HeroSlider slides={slides.data ?? []} />
      )}

      {/* Trust bar — sits right under the hero, gives the page immediate
          substance instead of dropping straight into a big empty gap. */}
      <div className="border-b border-border bg-primary-deep py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 px-5 sm:grid-cols-6 lg:px-8">
          {TRUST_MARKERS.map((s) => (
            <div key={s.k} className="text-center">
              <p className="font-display text-2xl font-extrabold text-accent sm:text-3xl">{s.k}</p>
              <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wide text-primary-foreground/70 sm:text-xs">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Globe section — a quieter statement keeps the content in focus. */}
      <Section tone="muted" className="py-16 lg:py-24">
        <div className="mb-12 flex items-center justify-center gap-4 sm:mb-16">
          <span className="h-px w-10 bg-accent sm:w-16" />
          <ScrollRevealText
            text="God Is Our Strength"
            className="text-2xl font-semibold uppercase leading-none tracking-[0.08em] text-primary-deep sm:text-3xl md:text-4xl"
          />
          <span className="h-px w-10 bg-accent sm:w-16" />
        </div>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <BrandGlobe markers={REACH_MARKERS} maxWidthClass="max-w-md" />
          <div>
            <SectionHeading
              title="Made in Nigeria, carried around the world"
              description="From our plant on Oba Akran Avenue, Blue World products reach households in Nigeria, Kenya, China and India. Spin the globe — every marker is a market our cartons land in."
            />
          </div>
        </div>
      </Section>

      {/* Business units — plain white, image-forward (Nuban-style), no chrome */}
      <Section>
        <SectionHeading
          eyebrow="Our business"
          title="Five brands, built for different shelves"
          description="Each unit runs its own formulation brief, packaging language and route to market — sharing one factory floor and one quality standard."
        />
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6">
          {units.isLoading && <LoadingBlock label="Loading business units…" />}
          {!units.isLoading && orderedUnits.length === 0 && (
            <EmptyBlock label="No business units published yet." />
          )}
          {orderedUnits.map((unit, i) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <AppLink href={`/business/${unit.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-secondary">
                  <CmsImage
                    src={unit.heroImage}
                    alt={unit.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent">
                    {unit.tagline}
                  </p>
                  <h3 className="mt-1.5 font-display text-base font-bold text-primary-deep">
                    {unit.name}
                  </h3>
                </div>
              </AppLink>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Featured products — orange-tinted, warms up the page between two
          otherwise-white sections and breaks the "all white" flatness */}
      <Section tone="warm">
        <SectionHeading eyebrow="Featured products" title="What our lines are shipping right now" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.isLoading && <LoadingBlock label="Loading products…" />}
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Quote strip — cheap to build, gives the page a confident, considered
          moment instead of jumping straight from products to blog. */}
      <Section className="py-16 lg:py-20">
        <blockquote className="mx-auto max-w-3xl text-center">
          <p className="font-display text-2xl font-bold leading-snug text-primary-deep sm:text-3xl">
            "Make it properly, or do not ship it."
          </p>
          <footer className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
            The rule since 1998
          </footer>
        </blockquote>
      </Section>

      {/* Latest posts */}
      <Section tone="muted">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="From the blog" title="News, research and factory notes" />
          <AppLink
            href="/blog"
            className="rounded-full border-2 border-primary px-6 py-3 text-sm font-bold text-primary-deep transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            All posts
          </AppLink>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {latest.map((post) => (
            <AppLink
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <CmsImage
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="eyebrow">{post.category}</p>
                <h3 className="mt-3 text-lg font-bold leading-snug text-primary-deep">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
              </div>
            </AppLink>
          ))}
        </div>
      </Section>

      <NewsletterBlock />
    </>
  );
}

function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <Section tone="deep">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <SectionHeading
          invert
          eyebrow="Newsletter"
          title="Trade updates, new lines and factory news"
          description="One email a month for distributors, retail partners and anyone who cares how the products are made."
        />
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            await submitWithMock(ENDPOINTS.newsletter, { email }, { ok: true });
            setBusy(false);
            setEmail("");
            toast.success("You're subscribed. Watch your inbox.");
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="h-14 flex-1 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-6 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={busy}
            className="h-14 rounded-full bg-accent px-8 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {busy ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      </div>
    </Section>
  );
}
