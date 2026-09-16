import { AppLink } from "@/components/site/app-link";
import { BrandGlobe } from "@/components/brand/brand-globe";
import { CmsImage, Section, SectionHeading, LoadingBlock, ErrorBlock, EmptyBlock } from "@/components/site/primitives";
import { REACH_MARKERS } from "@/data/placeholder-content";
import { useTeamMembers } from "@/hooks/use-cms";
import { cn } from "@/lib/utils";
import type { PageBlock } from "@/lib/types";

type P = Record<string, any>;

/** Drops any key whose value is null/undefined, so optional props under
 *  exactOptionalPropertyTypes can be spread instead of passed as `undefined`. */
function orNothing<T extends Record<string, unknown>>(
  obj: T,
): { [K in keyof T]?: NonNullable<T[K]> } {
  const out: Record<string, unknown> = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined) out[key] = value;
  }
  return out as { [K in keyof T]?: NonNullable<T[K]> };
}

const GRID_COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

function Prose({ p }: { p: P }) {
  const heading = orNothing({ eyebrow: p["eyebrow"], title: p["heading"] });
  return (
    <>
      {(p["eyebrow"] || p["heading"]) && <SectionHeading {...heading} title={p["heading"] ?? ""} />}
      <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
        {((p["paragraphs"] as string[]) ?? []).map((t, i) => <p key={i}>{t}</p>)}
      </div>
    </>
  );
}

function ProseImage({ p }: { p: P }) {
  const imageFirst = p["imageSide"] !== "right";
  const image = (
    <div className="overflow-hidden rounded-3xl shadow-lift">
      <CmsImage src={p["image"]} alt={p["imageAlt"] ?? ""} className="aspect-[4/3] w-full object-cover" />
    </div>
  );
  const text = (
    <div>
      <SectionHeading
        {...orNothing({ eyebrow: p["eyebrow"], description: p["description"] })}
        title={p["heading"] ?? ""}
      />
      <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
        {((p["paragraphs"] as string[]) ?? []).map((t, i) => <p key={i}>{t}</p>)}
      </div>
    </div>
  );
  return (
    <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
      {imageFirst ? <>{image}{text}</> : <>{text}{image}</>}
    </div>
  );
}

function CardGrid({ p }: { p: P }) {
  const cols = GRID_COLS[Number(p["columns"] ?? 2)] ?? GRID_COLS[2];
  return (
    <>
      {(p["eyebrow"] || p["heading"]) && (
        <SectionHeading {...orNothing({ eyebrow: p["eyebrow"] })} title={p["heading"] ?? ""} />
      )}
      <div className={cn("mt-12 grid gap-6", cols)}>
        {((p["cards"] as P[]) ?? []).map((c) => (
          <div key={c["title"]} className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <h3 className="font-display text-xl font-bold text-primary-deep">{c["title"]}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c["body"]}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function NumberedGrid({ p }: { p: P }) {
  return (
    <>
      {(p["eyebrow"] || p["heading"]) && (
        <SectionHeading {...orNothing({ eyebrow: p["eyebrow"] })} title={p["heading"] ?? ""} />
      )}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {((p["cards"] as P[]) ?? []).map((c, i) => (
          <div key={c["title"]} className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <span className="font-display text-3xl font-extrabold text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-primary-deep">{c["title"]}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c["body"]}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function FeaturePair({ p }: { p: P }) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {((p["items"] as P[]) ?? []).map((it) => (
        <div
          key={it["eyebrow"]}
          className={cn(
            "rounded-3xl p-10 shadow-card",
            it["tone"] === "accent" ? "bg-accent-soft" : "border-2 border-primary/20 bg-card",
          )}
        >
          <p className="eyebrow">{it["eyebrow"]}</p>
          <p className="mt-5 font-display text-2xl font-bold leading-snug text-primary-deep lg:text-3xl">
            {it["body"]}
          </p>
        </div>
      ))}
    </div>
  );
}

function LinkCards({ p }: { p: P }) {
  return (
    <>
      {(p["eyebrow"] || p["heading"]) && (
        <SectionHeading {...orNothing({ eyebrow: p["eyebrow"] })} title={p["heading"] ?? ""} align="center" />
      )}
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
        {((p["cards"] as P[]) ?? []).map((c) => (
          <AppLink
            key={c["label"]}
            href={c["href"]}
            className="rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <p className="font-display text-lg font-bold text-primary-deep">{c["label"]}</p>
            <p className="mt-2 text-sm text-muted-foreground">{c["copy"]}</p>
            <p className="mt-5 text-sm font-bold text-accent">Read more →</p>
          </AppLink>
        ))}
      </div>
    </>
  );
}

function TeamGrid({ p }: { p: P }) {
  const { data, isLoading, isError } = useTeamMembers();
  let members = [...(data ?? [])].sort((a, b) => a.order - b.order);
  if (p["limit"]) members = members.slice(0, p["limit"]);

  return (
    <>
      {(p["eyebrow"] || p["heading"]) && (
        <SectionHeading {...orNothing({ eyebrow: p["eyebrow"] })} title={p["heading"] ?? ""} />
      )}
      <div className="mt-12">
        {isLoading && <LoadingBlock label="Loading leadership team…" />}
        {isError && <ErrorBlock label="We couldn't load the team right now." />}
        {!isLoading && members.length === 0 && <EmptyBlock label="No team members published yet." />}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m) => (
            <article key={m.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="aspect-square overflow-hidden bg-secondary">
                <CmsImage src={m.photo} alt={m.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-primary-deep">{m.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">{m.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function GlobeReach({ p }: { p: P }) {
  return (
    <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <SectionHeading
          {...orNothing({ eyebrow: p["eyebrow"], description: p["description"] })}
          title={p["heading"] ?? ""}
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
  );
}

const REGISTRY = {
  prose: Prose,
  prose_image: ProseImage,
  card_grid: CardGrid,
  numbered_grid: NumberedGrid,
  feature_pair: FeaturePair,
  link_cards: LinkCards,
  team_grid: TeamGrid,
  globe_reach: GlobeReach,
} as const;

export function RenderBlock({ block }: { block: PageBlock }) {
  const Component = REGISTRY[block.type];
  if (!Component) {
    if (import.meta.env.DEV) console.warn(`[page-blocks] unknown block type: ${block.type}`);
    return null;
  }
  return (
    <Section {...orNothing({ tone: block.tone === "muted" ? "muted" : undefined })}>
      <Component p={block.payload as P} />
    </Section>
  );
}