import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { Globe2, MapPin } from "lucide-react";
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
import { getShowcase } from "@/lib/country-showcase";

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
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const activeShowcase = activeCountry ? getShowcase(activeCountry) : null;

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
      <div className="border-b border-border bg-primary-deep py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 px-5 sm:gap-6 sm:grid-cols-6 lg:px-8">
          {TRUST_MARKERS.map((s) => (
            <div key={s.k} className="min-w-0 text-center">
              <p className="font-display text-xl font-extrabold text-accent sm:text-2xl">{s.k}</p>
              <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-wide text-primary-foreground/70 sm:text-[0.65rem]">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Globe section — click a marker on the globe, or a chip below it,
          to see that market's photo backdrop and write-up in the right
          card. Click the X on the globe (or "Overview" on the right) to
          reset back to the deep-blue default. */}
      <Section tone="muted" className="py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-12"
        >
          {/* Lines flank the text only from sm up — on phones they were
              squeezing the words into an awkward wrap. Below sm it's just
              centered text, full width, properly sized down. */}
          <div className="hidden items-center justify-center gap-4 sm:flex">
            <span className="h-px w-8 bg-accent md:w-12" />
            <ScrollRevealText
              text="God Is Our Strength"
              className="whitespace-nowrap text-2xl font-semibold uppercase leading-none tracking-[0.06em] text-primary-deep md:text-3xl"
            />
            <span className="h-px w-8 bg-accent md:w-12" />
          </div>
          <div className="sm:hidden">
            <ScrollRevealText
              text="God Is Our Strength"
              className="text-center text-lg font-semibold uppercase leading-snug tracking-[0.04em] text-primary-deep"
            />
          </div>
        </motion.div>

        {/* items-stretch: if either card's content runs slightly longer than
            the other's, the shorter one stretches to match, instead of the
            two drifting apart the way they did with items-start. */}
        <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
          {/* Card A — globe, height-capped (max-h-72/80) so it no longer
              dictates the row's height on its own. A row of country chips
              underneath fills the leftover space with real, useful content
              (and doubles as a second, easier way to trigger the same
              select-a-country interaction as clicking a pin on the globe). */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col rounded-3xl border border-border bg-card p-4 shadow-card sm:p-5 lg:p-6"
          >
            <p className="eyebrow">Where we ship</p>
            <h3 className="mt-2 font-display text-lg font-bold text-primary-deep sm:text-xl">
              Made in Nigeria, carried around the world
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              From our plant on Oba Akran Avenue, Blue World products reach households across four
              countries. Tap a marker — or a market below — to see it up close.
            </p>

            <div className="mt-4">
                <BrandGlobe
                markers={REACH_MARKERS}
                boxHeightClass="h-64 sm:h-72 lg:h-80"
                background="midnight"
                standText={null}
                activeCountry={activeCountry}
                onSelectCountry={(name) => setActiveCountry(name || null)}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {REACH_MARKERS.map((m) => {
                const active = activeCountry?.toLowerCase() === m.name.toLowerCase();
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setActiveCountry(active ? null : m.name)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                      active
                        ? "border-transparent bg-accent text-accent-foreground"
                        : "border-border text-primary-deep hover:bg-primary-soft"
                    }`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Card B — default market-list panel, or the selected country's
              write-up from country-showcase.ts, cross-fading between the two. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col rounded-3xl border border-border bg-card p-4 shadow-card sm:p-5 lg:p-6"
          >
            <AnimatePresence mode="wait">
              {activeShowcase ? (
                                <motion.div
                  key={activeCountry}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-1 flex-col"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow">{activeShowcase.place}</p>
                      <h3 className="mt-2 font-display text-lg font-bold text-primary-deep sm:text-xl">
                        {activeShowcase.headline}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveCountry(null)}
                      className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-primary-deep hover:bg-primary-soft"
                    >
                      ← Overview
                    </button>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{activeShowcase.blurb}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{activeShowcase.detail}</p>

                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-accent-soft p-4">
                    <span className="font-display text-2xl font-extrabold text-accent">
                      {activeShowcase.stat.value}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary-deep/70">
                      {activeShowcase.stat.label}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-border p-4">
                    {activeShowcase.points.map((point) => (
                      <div key={point} className="flex items-center gap-2 text-sm font-semibold text-primary-deep">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {point}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-1 flex-col"
                >
                  <p className="eyebrow">Every marker, explained</p>
                  <h3 className="mt-2 font-display text-lg font-bold text-primary-deep sm:text-xl">
                    Four markets, one factory floor
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Five Nigerian-made brands, trusted in homes across four countries and counting.
                  </p>
                  <div className="mt-4 flex flex-1 flex-col rounded-2xl bg-accent-soft p-4 sm:p-5">
                    <div className="flex items-center gap-2 border-b border-primary-deep/10 pb-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-deep/10">
                        <Globe2 size={16} className="text-primary-deep" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary-deep/70">
                        Export map
                      </span>
                    </div>
                    <div className="mt-4 flex flex-1 flex-col justify-center gap-3">
                      {REACH_MARKERS.map((m) => (
                        <motion.button
                          key={m.name}
                          type="button"
                          onClick={() => setActiveCountry(m.name)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="flex items-center gap-3 rounded-xl bg-card/70 px-3.5 py-2.5 text-left shadow-sm"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15">
                            <MapPin size={14} className="text-accent" />
                          </span>
                          <span className="flex-1 font-display text-sm font-bold text-primary-deep">{m.name}</span>
                          <span className="text-right text-xs text-muted-foreground">{m.note}</span>
                        </motion.button>
                      ))}
                    </div>
                    <p className="mt-3 border-t border-primary-deep/10 pt-3 text-center text-xs font-semibold text-primary-deep/60">
                      {REACH_MARKERS.length} export markets and counting
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </Section>

      {/* Business units — plain white, image-forward (Nuban-style), no chrome */}
      <Section className="py-12 lg:py-16">
        <SectionHeading
          eyebrow="Our business"
          title="Five brands, built for different shelves"
          description="Each unit runs its own formulation brief, packaging language and route to market — sharing one factory floor and one quality standard."
        />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-6">
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
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                  <CmsImage
                    src={unit.heroImage}
                    alt={unit.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Bellussi-style diagonal shine — sweeps across on hover */}
                  <div
                    className="pointer-events-none absolute inset-0 -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-[150%]"
                  />
                  {/* Bottom scrim so the reveal text below is always legible */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="mt-3 text-center">
                  <p className="font-serif text-xs italic tracking-wide text-muted-foreground">Collection</p>
                  <h3 className="mt-1 font-display text-base font-bold text-primary-deep">{unit.name}</h3>
                  <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-accent">
                    {unit.tagline}
                  </p>
                  {/* Hover reveal — hidden until hover, like Bellussi's "you discover" */}
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
                        {unit.summary}
                      </p>
                      <span className="mt-3 inline-block border-b border-accent pb-0.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-accent">
                        Discover
                      </span>
                    </div>
                  </div>
                </div>
              </AppLink>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Featured products — orange-tinted, warms up the page between two
          otherwise-white sections and breaks the "all white" flatness */}
      <Section tone="warm" className="py-12 lg:py-16">
        <SectionHeading eyebrow="Featured products" title="What our lines are shipping right now" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.isLoading && <LoadingBlock label="Loading products…" />}
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Quote strip — cheap to build, gives the page a confident, considered
          moment instead of jumping straight from products to blog. */}
      <Section className="py-12 lg:py-14">
        <blockquote className="mx-auto max-w-3xl text-center">
          <p className="font-display text-xl font-bold leading-snug text-primary-deep sm:text-2xl">
            "Make it properly, or do not ship it."
          </p>
          <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            The rule since 1998
          </footer>
        </blockquote>
      </Section>

      {/* Latest posts */}
      <Section tone="muted" className="py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="From the blog" title="News, research and factory notes" />
          <AppLink
            href="/blog"
            className="rounded-full border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary-deep transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            All posts
          </AppLink>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
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
              <div className="p-5">
                <p className="eyebrow">{post.category}</p>
                <h3 className="mt-2 text-base font-bold leading-snug text-primary-deep">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
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
    <Section tone="deep" className="py-12 lg:py-16">
      <div className="grid items-center gap-8 lg:grid-cols-2">
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
            className="h-12 flex-1 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-6 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={busy}
            className="h-12 rounded-full bg-accent px-7 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {busy ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      </div>
    </Section>
  );
}