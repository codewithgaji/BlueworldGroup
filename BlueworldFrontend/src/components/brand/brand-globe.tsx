import { useEffect, useRef, useState } from "react";
import type { GlobeMarker } from "@/data/globe-content";

interface BrandGlobeProps {
  size?: number;
  markers: GlobeMarker[];
  mode?: "animated" | "static";
  /** Set to false for tight spaces like a navbar — hides the curved wordmark, keeps just the orb. */
  showText?: boolean;
}

// react-globe.gl touches WebGL/window at import time, so it must only ever be
// loaded client-side. A plain dynamic import() swapped into state — not a
// second ReactDOM root — keeps it inside the existing React tree.
function InteractiveGlobe({ size = 340, markers }: { size?: number; markers: GlobeMarker[] }) {
  const globeRef = useRef<any>(null);
  const [GlobeComponent, setGlobeComponent] = useState<any>(null);
  const [hexData, setHexData] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;

    import("react-globe.gl")
      .then((mod: any) => {
        // Interop guard: some bundler configs resolve this package's default
        // export as undefined even though the import itself succeeds silently.
        const Comp = mod?.default ?? mod;
        if (!cancelled) {
          if (!Comp) {
            console.error("[BrandGlobe] react-globe.gl loaded but no component found on the module", mod);
          }
          setGlobeComponent(() => Comp);
        }
      })
      .catch((err) => {
        console.error("[BrandGlobe] failed to load react-globe.gl", err);
      });

    if ((window as any).__world_hex_data) {
      setHexData((window as any).__world_hex_data);
    } else {
      fetch("/data/world-countries.geojson")
        .then((r) => r.json())
        .then((geo) => {
          (window as any).__world_hex_data = geo.features;
          if (!cancelled) setHexData(geo.features);
        })
        .catch(() => {
          if (!cancelled) setHexData([]);
        });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls?.();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = false;
    }
    globeRef.current.pointOfView?.({ altitude: 2.2 });
  }, [GlobeComponent]);

  if (!GlobeComponent) {
    return (
      <div
        className="animate-pulse rounded-full"
        style={{ width: size, height: size, background: "rgba(255,255,255,0.2)" }}
      />
    );
  }

  const Globe = GlobeComponent;

  return (
    <Globe
      ref={globeRef}
      width={size}
      height={size}
      backgroundColor="rgba(0,0,0,0)"
      showGlobe={false}
      showAtmosphere={false}
      hexPolygonsData={hexData}
      hexPolygonResolution={3}
      hexPolygonMargin={0.3}
      hexPolygonColor={() => "#FFFFFF"}
      pointsData={markers}
      pointLat={(d: any) => d.lat}
      pointLng={(d: any) => d.lng}
      pointColor={() => "#0f172a"}
      pointAltitude={0.02}
      pointRadius={0.45}
      pointLabel={(d: any) =>
        `<div style="background:#0f172a;color:#fff;padding:6px 10px;border-radius:8px;font-size:12px;white-space:nowrap;">${d.label}</div>`
      }
    />
  );
}

export function BrandGlobe({ size = 340, markers, mode = "animated", showText = true }: BrandGlobeProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const wrapperSize = size + 40;
  const textBoxWidth = wrapperSize + 50;
  const textBoxHeight = 56;

  const orb = (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-full"
      style={{
        width: wrapperSize,
        height: wrapperSize,
        background: "radial-gradient(circle at 35% 30%, #F5A623 0%, #E8871E 60%, #D9760F 100%)",
      }}
    >
      {mode === "static" || !mounted ? (
        <img
          src="/blueworld.png"
          alt="Blue World Cosmetics"
          style={{ width: size * 0.72, height: size * 0.72, objectFit: "contain" }}
          draggable={false}
        />
      ) : (
        <InteractiveGlobe size={size} markers={markers} />
      )}
    </div>
  );

  // Nav / tight-space usage: just the orb, no wordmark, no extra vertical space reserved.
  if (!showText) {
    return orb;
  }

  return (
    <div className="flex flex-col items-center" style={{ width: textBoxWidth }}>
      {orb}

      {/* Curved wordmark — normal document flow below the circle, single arc sized to fit its own viewBox */}
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