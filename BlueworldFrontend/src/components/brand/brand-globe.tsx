import { lazy, Suspense, useEffect, useState } from "react";
import { Globe as GlobeIcon, Image as ImageIcon } from "lucide-react";
import type { GlobeMarker } from "@/components/brand/globe-scene";
import { geoJsonToDots, type LatLng } from "@/lib/geo-dots";

// react-three-fiber/three touch WebGL/window at import time, so the scene
// must only ever load client-side. React.lazy + <Suspense> keeps it inside
// the existing tree (no second root) and skips it entirely during SSR.
const GlobeScene = lazy(() => import("@/components/brand/globe-scene"));

interface BrandGlobeProps {
  /** Fixed pixel square — for tight, non-growing spots like the navbar. Overrides maxWidthClass entirely. */
  size?: number;
  /**
   * Tailwind max-width class for the responsive (non-`size`) square, e.g. "max-w-sm",
   * "max-w-md", "max-w-xl". This is the knob for "make the whole orange box smaller" —
   * separate from `className` so you don't have to also remember to keep `mx-auto`.
   */
  maxWidthClass?: string;
  /** Extra classes for the outer square — merged alongside maxWidthClass, not replacing it. */
  className?: string;
  markers?: GlobeMarker[];
  /** Which view shows first. Defaults to the animated globe. */
  mode?: "animated" | "static";
  /** Set to false for tight spaces like a navbar — hides the curved wordmark. */
  showText?: boolean;
  /** Back-compat alias for showText, used by the nav-bar instance. */
  showMotto?: boolean;
  /** Lets a tight nav instance disable drag/orbit + the toggle button entirely. */
  interactive?: boolean;
  /** Hide the on/off toggle button even when interactive. */
  showToggle?: boolean;
  /** Short mission line shown in a card top-left of the square. Pass null to hide it. */
  standText?: string | null;

  // ---- Globe sizing knobs (all % of the square) ----
  /** Inset from left/right edges before the globe starts. Bigger = smaller globe. */
  globeMarginX?: number;
  /** Inset from the top before the globe starts. Bigger = smaller globe, pushed down. */
  globeMarginTop?: number;
  /** Inset from the bottom where the globe ends. Bigger = smaller globe, pushed up. */
  globeMarginBottom?: number;

  // ---- Wordmark curve knobs ----
  /** "inward" = bulges up toward the globe (what we want here). "outward" = bulges away from it. */
  wordmarkCurve?: "inward" | "outward";
  /**
   * 0–1+ ratio of the chord's half-width used as the curve's sagitta (see buildWordmarkArcPath
   * for what "sagitta" means here). 1 = a true semicircle matching the globe's own radius —
   * a tight hug. >1 = wraps MORE than a semicircle, curling further up the globe's sides.
   * Ignored whenever `wordmarkDepth` is set (depth always wins).
   */
  wordmarkHug?: number;
  /**
   * Absolute sagitta override, in viewBox units (0–100 scale), instead of the `wordmarkHug`
   * ratio. This is the ACTUAL curve depth, not a "how far up/down" position — see the big
   * comment on buildWordmarkArcPath below for the full explanation and safe ranges.
   * Leave unset to just use `wordmarkHug` instead — that's usually the easier knob.
   */
  wordmarkDepth?: number;
  /**
   * Vertical gap, in viewBox units, between the globe's bottom edge and the arc's CHORD line
   * (not the visible curve itself — see comment below). 0 = chord sits exactly at the globe's
   * edge. Negative = chord moves UP, closer to (or into) the globe. Positive = moves DOWN,
   * away from the globe, toward the bottom of the square.
   */
  wordmarkGap?: number;
}

let cachedDots: LatLng[] | null = null;

function useWorldDots(enabled: boolean) {
  const [dots, setDots] = useState<LatLng[]>(cachedDots ?? []);

  useEffect(() => {
    if (!enabled || cachedDots) return;
    let cancelled = false;

    fetch("/data/world-countries.geojson")
      .then((r) => r.json())
      .then((geo) => {
        const computed = geoJsonToDots(geo);
        cachedDots = computed;
        if (!cancelled) setDots(computed);
      })
      .catch((err) => {
        console.error("[BrandGlobe] failed to load world-countries.geojson", err);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return dots;
}

/**
 * Derives the wordmark arc's `d` path directly from the globe's own footprint
 * (globeMarginX/Bottom), so the text always hugs wherever the globe currently
 * is — resize the globe and the text follows automatically instead of
 * drifting out of sync.
 *
 * ---- How this actually works, step by step ----
 *
 * 1. `startX`/`endX` — the two endpoints of the curve, in the 0–100 viewBox.
 *    These are pinned to the globe's left/right edges (globeMarginX), so the
 *    curve is always exactly as wide as the globe itself.
 *
 * 2. `y` — the height of the CHORD: an imaginary straight line connecting
 *    startX and endX, before any curving happens. This is NOT where the
 *    visible curve sits — it's the reference line the curve bulges up from.
 *    `gap` shifts this chord up (negative) or down (positive) relative to
 *    the globe's bottom edge.
 *
 * 3. `halfChord` — half the width of that chord. With globeMarginX = 5,
 *    the chord runs from x=5 to x=95, so halfChord = 45.
 *
 * 4. `sagitta` — THIS is what "depth" really means: the height of the bulge,
 *    measured from the middle of the chord straight up to the peak of the
 *    curve. A bigger sagitta = the curve peaks further above the chord line
 *    = a MORE pronounced, tighter-wrapping curve. A sagitta of ~halfChord
 *    (45 here) draws a perfect semicircle. A sagitta near 0 draws an almost
 *    flat line. Sagitta can never be negative or zero — geometrically that's
 *    not a curve — so `depth` gets floored at 1. This is why a very negative
 *    `wordmarkDepth` (like -1000) doesn't "curve the other way" — it just
 *    clamps to the flattest possible curve (sagitta = 1).
 *
 * 5. `radius` — the actual circle radius that produces a curve with this
 *    exact chord width and sagitta. Bigger sagitta (relative to halfChord)
 *    means a SMALLER radius (a tighter, more curled circle) — this can feel
 *    backwards at first, so don't try to reason about "radius", reason
 *    about "sagitta" (= wordmarkDepth) instead.
 *
 * 6. `largeArcFlag` — SVG arcs are ambiguous: for any given radius and chord,
 *    there are two possible arcs (a short one and a long way around). Once
 *    sagitta exceeds radius, we need the "long way around" arc to wrap MORE
 *    than a semicircle (curling further up the globe's sides) — without this
 *    flag, SVG would silently draw the short, flatter arc instead and your
 *    high `wordmarkDepth` would appear to do nothing.
 *
 * 7. `sweepFlag` — just picks which of the two directions (bulge up vs. bulge
 *    down) the curve goes. That's what `wordmarkCurve: "inward" | "outward"`
 *    controls.
 */
function buildWordmarkArcPath({
  globeMarginX,
  globeMarginBottom,
  hug,
  depth,
  gap,
  curve,
}: {
  globeMarginX: number;
  globeMarginBottom: number;
  hug: number;
  depth?: number;
  gap: number;
  curve: "inward" | "outward";
}) {
  const startX = globeMarginX;
  const endX = 100 - globeMarginX;
  const y = 100 - globeMarginBottom + gap;

  const halfChord = (endX - startX) / 2;

  // `depth` (an absolute sagitta) wins over `hug` (a ratio of halfChord) whenever it's set.
  // Floored at 1 because a sagitta of 0 or less isn't a valid curve at all.
  const sagitta = depth != null ? Math.max(depth, 1) : Math.max(halfChord * Math.max(hug, 0.05), 1);

  const radius = (halfChord * halfChord + sagitta * sagitta) / (2 * sagitta);

  // sagitta > radius means we've wrapped past a semicircle — needs the large-arc flag,
  // or SVG draws the short way around and the curve looks like it "did nothing."
  const largeArcFlag = sagitta > radius ? 1 : 0;
  const sweepFlag = curve === "inward" ? 0 : 1;

  return `M ${startX} ${y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${y}`;
}

export function BrandGlobe({
  size,
  maxWidthClass = "max-w-xl",
  className,
  markers = [],
  mode = "animated",
  showText = true,
  showMotto,
  interactive = true,
  showToggle = true,
  standText = "Five Nigerian-made brands, trusted in homes across four countries and counting.",
  globeMarginX = 20,
  globeMarginTop = 8,
  globeMarginBottom = 12,
  wordmarkCurve = "inward",
  wordmarkHug = 1,
  wordmarkDepth= 70,
  wordmarkGap = -70,
}: BrandGlobeProps) {
  const wordmark = showMotto ?? showText;
  const [view, setView] = useState<"animated" | "static">(interactive ? mode : "static");
  const dots = useWorldDots(interactive && view === "animated");
  const canToggle = interactive && showToggle;

  const outerStyle = size ? { width: size, height: size } : undefined;
  const outerClassName = size
    ? "relative overflow-hidden rounded-3xl"
    : `relative w-full overflow-hidden rounded-3xl aspect-square mx-auto ${maxWidthClass} ${className ?? ""}`;

  const wordmarkPath = buildWordmarkArcPath({
    globeMarginX,
    globeMarginBottom,
    hug: wordmarkHug,
    depth: wordmarkDepth,
    gap: wordmarkGap,
    curve: wordmarkCurve,
  });

  return (
    <div
      className={outerClassName}
      style={{
        ...outerStyle,
        background: "linear-gradient(160deg, #F5A623 0%, #EE8A1E 55%, #DD7412 100%)",
      }}
    >
      {view === "static" || !interactive ? (
        <img
          src="/blueworld.png"
          alt="Blue World Cosmetics"
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <>
          {/* Globe footprint — driven by globeMarginX/Top/Bottom so resizing it
              and re-hugging the text stay in sync automatically. */}
          <div
            className="absolute"
            style={{
              left: `${globeMarginX}%`,
              right: `${globeMarginX}%`,
              top: `${globeMarginTop}%`,
              bottom: `${globeMarginBottom}%`,
            }}
          >
            <Suspense
              fallback={<div className="h-full w-full animate-pulse rounded-full bg-white/15" />}
            >
              <GlobeScene dots={dots} markers={markers} interactive />
            </Suspense>
          </div>

          {standText && (
            <div className="pointer-events-none absolute left-3 top-3 max-w-[46%] rounded-lg border border-white/15 bg-primary-deep/85 p-2.5 text-[10px] font-medium leading-snug text-primary-foreground shadow-lift">
              {standText}
            </div>
          )}

          {/* Curved "GOD IS OUR STRENGTH" — percentage viewBox, so it scales with the square at any size.
              `side="right"` on textPath is what makes the glyphs lean inward toward the globe (matching
              the logo) instead of outward/upside-down, which is the default without it. */}
          {wordmark && (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path id="brand-globe-arc" d={wordmarkPath} fill="none" />
              <text fontSize="5.6" fontWeight="800" fill="#0f172a" letterSpacing="0.1">
                <textPath href="#brand-globe-arc" startOffset="50%" textAnchor="middle" side="right">
                  GOD IS OUR STRENGTH
                </textPath>
              </text>
            </svg>
          )}
        </>
      )}

      {canToggle && (
        <button
          type="button"
          onClick={() => setView((v) => (v === "animated" ? "static" : "animated"))}
          aria-label={view === "animated" ? "Show logo" : "Show interactive globe"}
          title={view === "animated" ? "Show logo" : "Show interactive globe"}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-primary-deep/70 text-primary-foreground backdrop-blur transition-colors hover:bg-primary-deep"
        >
          {view === "animated" ? <ImageIcon size={16} /> : <GlobeIcon size={16} />}
        </button>
      )}
    </div>
  );
}