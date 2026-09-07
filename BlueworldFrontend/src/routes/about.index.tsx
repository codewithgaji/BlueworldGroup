import { createFileRoute } from "@tanstack/react-router";
import { AppLink } from "@/components/site/app-link";
import { BrandGlobe } from "@/components/brand/brand-globe";
import { CmsImage, PageHero, Section, SectionHeading } from "@/components/site/primitives";
import { REACH_MARKERS } from "@/data/placeholder-content";

export const Route = createFileRoute("/about/")({
  head: () => ({
    meta: [
      { title: "About Blue World Cosmetics — Our Story" },
      {
        name: "description",
        content:
          "Founded in Lagos in 1998, Blue World Cosmetics manufactures five personal-care brands reaching Nigeria, Kenya, China and India.",
      },
      { property: "og:title", content: "About Blue World Cosmetics" },
      {
        property: "og:description",
        content: "A Nigerian manufacturing house built on formulation discipline and local sourcing.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A cosmetics house built in Lagos, for the world"
        description="Twenty-eight years of formulating, filling and shipping personal care from Nigeria — with the same rule on day one and today: make it properly or do not ship it."
        image="about.story"
      />

      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="overflow-hidden rounded-3xl shadow-lift">
            <CmsImage
              src="about.story"
              alt="Blue World R&D laboratory in Ikeja"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Our story"
              title="From two mixing vessels to five brands"
              description="Blue World Cosmetics started in 1998 in a rented unit in Ikeja with two mixing vessels, a hand-filling bench and one product: a glycerin body lotion."
            />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                What grew from there was not a single hero product but a house of brands, each
                answering a different need on a Nigerian shelf: Vivon for skincare, BlueCrystal for
                hygiene, Blow Right for hair, BlueFragrance for scent, and the BlueWorld line for
                everyday essentials.
              </p>
              <p>
                Today we operate two production lines, an in-house R&amp;D laboratory and a quality
                control unit that clears every batch against eleven separate checks. We source shea
                and palm derivatives locally wherever the specification allows, and we publish full
                ingredient decks on pack.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Where we reach"
              title="Four countries on the manifest"
              description="Hover or tap a marker to see the role each market plays. Nigeria is home and manufacturing; Kenya is our East African distribution beachhead; China and India cover ingredient sourcing, contract fill and growing consumer volume."
            />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {REACH_MARKERS.map((m) => (
                <li key={m.name} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <p className="font-display text-lg font-bold text-primary-deep">{m.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{m.note}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <BrandGlobe size={400} markers={REACH_MARKERS} />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Go deeper" title="Explore the company" align="center" />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            { label: "Who We Are", href: "/about/who-we-are", copy: "The plant, the people, the standards." },
            { label: "Vision & Mission", href: "/about/vision-mission", copy: "What we are building and why." },
            { label: "Leadership", href: "/about/leadership", copy: "The team accountable for it." },
          ].map((c) => (
            <AppLink
              key={c.label}
              href={c.href}
              className="rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <p className="font-display text-lg font-bold text-primary-deep">{c.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{c.copy}</p>
              <p className="mt-5 text-sm font-bold text-accent">Read more →</p>
            </AppLink>
          ))}
        </div>
      </Section>
    </>
  );
}
