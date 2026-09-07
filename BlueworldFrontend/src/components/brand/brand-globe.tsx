import { lazy, Suspense, useEffect, useState } from "react";
import { Globe as GlobeIcon, Image as ImageIcon } from "lucide-react";
import type { GlobeMarker } from "@/components/brand/globe-scene";
import { geoJsonToDots, type LatLng } from "@/lib/geo-dots";

// react-three-fiber/three touch WebGL/window at import time, so the scene
// must only ever load client-side. React.lazy + <Suspense> keeps it inside
// the existing tree (no second root) and skips it entirely during SSR.
const GlobeScene = lazy(() => import("@/components/brand/globe-scene"));

interface BrandGlobeProps {
  size?: number;
  markers: GlobeMarker[];
  /** Which view shows first. Defaults to the animated globe. */
  mode?: "animated" | "static";
  /** Set to false for tight spaces like a navbar — hides the curved wordmark, keeps just the square. */
  showText?: boolean;
  /** Back-compat alias for showText, used by the nav-bar instance. */
  showMotto?: boolean;
  /** Lets a tight nav instance disable drag/orbit + the toggle button entirely. */
  interactive?: boolean;
  /** Hide the on/off toggle button even when interactive. */
  showToggle?: boolean;
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
        const computed = geoJsonToDots(geo, 3.2);
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

export function BrandGlobe({
  size = 340,
  markers,
  mode = "animated",
  showText = true,
  showMotto,
  interactive = true,
  showToggle = true,
}: BrandGlobeProps) {
  const wordmark = showMotto ?? showText;
  const [view, setView] = useState<"animated" | "static">(interactive ? mode : "static");
  const dots = useWorldDots(interactive && view === "animated");

  const canToggle = interactive && showToggle;

  const wrapperSize = size;
  const textBoxWidth = wrapperSize + 50;
  const textBoxHeight = 56;

  const square = (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-3xl"
      style={{
        width: wrapperSize,
        height: wrapperSize,
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
        <Suspense
          fallback={
            <div
              className="animate-pulse rounded-full bg-white/20"
              style={{ width: size * 0.6, height: size * 0.6 }}
            />
          }
        >
          <GlobeScene dots={dots} markers={markers} size={size * 0.82} interactive />
        </Suspense>
      )}

      {canToggle && (
        <button
          type="button"
          onClick={() => setView((v) => (v === "animated" ? "static" : "animated"))}
          aria-label={view === "animated" ? "Show logo" : "Show interactive globe"}
          title={view === "animated" ? "Show logo" : "Show interactive globe"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary-deep/70 text-primary-foreground backdrop-blur transition-colors hover:bg-primary-deep"
        >
          {view === "animated" ? <ImageIcon size={16} /> : <GlobeIcon size={16} />}
        </button>
      )}
    </div>
  );

  // Nav / tight-space usage: just the square, no wordmark, no extra vertical space reserved.
  if (!wordmark) {
    return square;
  }

  return (
    <div className="flex flex-col items-center" style={{ width: textBoxWidth }}>
      {square}

      {/* Curved wordmark — normal document flow below the square, single arc sized to fit its own viewBox */}
      <svg
        width={textBoxWidth}
        height={textBoxHeight}
        viewBox={`0 0 ${textBoxWidth} ${textBoxHeight}`}
        style={{ marginTop: -6 }}
      >
        <path
          id="globe-text-arc"
          d={`M 12 8 A ${(textBoxWidth - 24) / 2} ${(textBoxWidth - 24) / 2} 0 0 0 ${textBoxWidth - 12} 8`}
          fill="none"
        />
        <text fontSize="14" fontWeight="800" fill="#0f172a" letterSpacing="1.5">
          <textPath href="#globe-text-arc" startOffset="50%" textAnchor="middle">
            GOD IS OUR STRENGTH
          </textPath>
        </text>
      </svg>
    </div>
  );
}