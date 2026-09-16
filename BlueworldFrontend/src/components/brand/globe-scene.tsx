/**
 * WebGL brand globe (react-three-fiber). Client-only — loaded lazily by
 * <BrandGlobe /> so it never runs during SSR. Renders the world as a
 * dot-matrix (Cloudflare-style) built from a countries GeoJSON, with
 * spoke-and-label "reach" tags for the places the brand actually ships to.
 *
 * Fully responsive: the <Canvas> has no hardcoded pixel size — it fills
 * whatever box its parent gives it, and react-three-fiber's built-in
 * ResizeObserver keeps the camera/aspect in sync as that box resizes.
 */
import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Html, Line, OrbitControls, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { LatLng } from "@/lib/geo-dots";

export interface GlobeMarker {
  name: string;
  lat: number;
  lng: number;
  note?: string;
}

const GLOBE_RADIUS = 1.35;
// Light, high-contrast dots read as "land" against the deep blue "ocean" sphere below.
const DOT_COLOR = "#eaf3ff";
const ACCENT = "#f5a623";

function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** The dot-matrix land mask — one static BufferGeometry of points. */
function DotMatrix({ dots, radius }: { dots: LatLng[]; radius: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(dots.length * 3);
    dots.forEach((d, i) => {
      const v = latLngToVec3(d.lat, d.lng, radius);
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    });
    return arr;
  }, [dots, radius]);

  if (dots.length === 0) return null;

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial
        color={DOT_COLOR}
        size={radius * 0.032}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
      />
    </Points>
  );
}

function Marker({ marker, radius }: { marker: GlobeMarker; radius: number }) {
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Surface dot + a short radial "spoke" out to a floating tip, where the label lives —
  // Cloudflare-style thin connector instead of a label sitting right on top of the dot.
  const { dotPos, tipPos } = useMemo(() => {
    const surface = latLngToVec3(marker.lat, marker.lng, radius * 1.01);
    const dir = surface.clone().normalize();
    const tip = surface.clone().add(dir.multiplyScalar(radius * 0.3));
    return { dotPos: surface, tipPos: tip };
  }, [marker.lat, marker.lng, radius]);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    const t = (clock.getElapsedTime() * 0.9) % 1;
    pulseRef.current.scale.setScalar(1 + t * 1.8);
    (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.35;
  });

  return (
    <group>
      <Line points={[dotPos, tipPos]} color={ACCENT} transparent opacity={0.6} lineWidth={1} />

      {/* Camera-facing flat disc — always reads as a perfect circle, never foreshortens into an
          oval near the globe's limb the way a 3D sphere marker would. */}
      <Billboard position={dotPos}>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <circleGeometry args={[radius * 0.035, 24]} />
          <meshBasicMaterial color={hovered ? "#ffffff" : ACCENT} />
        </mesh>
        <mesh ref={pulseRef}>
          <circleGeometry args={[radius * 0.035, 24]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.35} />
        </mesh>
      </Billboard>

      {/* Label floats at the spoke's tip, not on the dot — `occlude` hides it once the marker
          rotates to the far side of the globe. */}
      <Html position={tipPos} center occlude zIndexRange={[10, 0]} style={{ transition: "opacity 0.2s" }}>
        <div
          title={marker.note}
          className="pointer-events-none whitespace-nowrap rounded-md bg-primary-deep/90 px-2 py-0.5 shadow-lift"
        >
          <span className="text-[9px] font-bold uppercase tracking-wide text-primary-foreground">
            {marker.name}
          </span>
        </div>
      </Html>
    </group>
  );
}

function GlobeBody({
  dots,
  markers,
  autoRotate,
}: {
  dots: LatLng[];
  markers: GlobeMarker[];
  autoRotate: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const radius = GLOBE_RADIUS;

  useFrame((_, delta) => {
    if (autoRotate && group.current) group.current.rotation.y += delta * 0.14;
  });

  return (
    <group ref={group}>
      {/* Deep blue "ocean" — opaque enough to read clearly as blue against the orange square,
          with a little transparency left (12%) to keep the sleek/glassy feel from the logo. */}
      <mesh>
        <sphereGeometry args={[radius * 0.985, 48, 48]} />
        <meshBasicMaterial color="#164a9e" transparent opacity={0.88} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.SphereGeometry(radius * 1.001, 20, 14)]} />
        <lineBasicMaterial color="#8fb8ff" transparent opacity={0.25} />
      </lineSegments>
      <DotMatrix dots={dots} radius={radius} />
      <mesh>
        <sphereGeometry args={[radius * 1.06, 32, 32]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      {markers.map((m) => (
        <Marker key={m.name} marker={m} radius={radius} />
      ))}
    </group>
  );
}

export default function GlobeScene({
  dots = [],
  markers = [],
  interactive = true,
}: {
  dots?: LatLng[];
  markers?: GlobeMarker[];
  interactive?: boolean;
}) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 4.6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 2, 4]} intensity={1.1} />
      <directionalLight position={[-4, -1, -2]} intensity={0.35} color={ACCENT} />
      <Suspense fallback={null}>
        <GlobeBody dots={dots} markers={markers} autoRotate />
      </Suspense>
      {interactive && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.6}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.6}
        />
      )}
    </Canvas>
  );
}