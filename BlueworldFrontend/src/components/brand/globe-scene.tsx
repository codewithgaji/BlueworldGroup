/**
 * WebGL brand globe (react-three-fiber). Client-only — loaded lazily by
 * <BrandGlobe /> so it never runs during SSR. Renders the world as a
 * dot-matrix (Cloudflare-style) built from a countries GeoJSON, with a few
 * glowing markers + arcs for the places the brand actually ships to.
 */
import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { LatLng } from "@/lib/geo-dots";

export interface GlobeMarker {
  name: string;
  lat: number;
  lng: number;
  note?: string;
}

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
        color="#bcd9ff"
        size={radius * 0.028}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </Points>
  );
}

function Marker({ marker, radius }: { marker: GlobeMarker; radius: number }) {
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef<THREE.Mesh>(null);
  const position = useMemo(
    () => latLngToVec3(marker.lat, marker.lng, radius * 1.015),
    [marker.lat, marker.lng, radius],
  );

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    const t = (clock.getElapsedTime() * 0.9) % 1;
    const scale = 1 + t * 1.8;
    pulseRef.current.scale.setScalar(scale);
    (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.5;
  });

  return (
    <group position={position}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[radius * 0.05, 16, 16]} />
        <meshBasicMaterial color={hovered ? "#ffffff" : "#f5a623"} />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[radius * 0.05, 16, 16]} />
        <meshBasicMaterial color="#f5a623" transparent opacity={0.4} />
      </mesh>
      {hovered && (
        <Html center distanceFactor={6} zIndexRange={[10, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-md bg-primary-deep px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lift">
            {marker.name}
            {marker.note ? (
              <span className="ml-2 font-normal opacity-70">{marker.note}</span>
            ) : null}
          </div>
        </Html>
      )}
    </group>
  );
}

function Arc({ from, to, radius }: { from: GlobeMarker; to: GlobeMarker; radius: number }) {
  const geometry = useMemo(() => {
    const start = latLngToVec3(from.lat, from.lng, radius * 1.01);
    const end = latLngToVec3(to.lat, to.lng, radius * 1.01);
    const mid = start
      .clone()
      .add(end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(radius * 1.4);
    const points = new THREE.QuadraticBezierCurve3(start, mid, end).getPoints(48);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [from, to, radius]);

  return (
    <primitive
      object={
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({ color: "#f5a623", transparent: true, opacity: 0.5 }),
        )
      }
    />
  );
}

function GlobeBody({
  dots,
  markers,
  radius,
  autoRotate,
}: {
  dots: LatLng[];
  markers: GlobeMarker[];
  radius: number;
  autoRotate: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && group.current) group.current.rotation.y += delta * 0.14;
  });

  const home = markers[0];

  return (
    <group ref={group}>
      {/* Faint inner sphere for depth — kept mostly transparent so the dots read as "sleek", not solid */}
      <mesh>
        <sphereGeometry args={[radius * 0.985, 48, 48]} />
        <meshBasicMaterial color="#0f2c5c" transparent opacity={0.18} />
      </mesh>
      {/* Longitude/latitude wire shell */}
      <lineSegments>
        <edgesGeometry args={[new THREE.SphereGeometry(radius * 1.001, 20, 14)]} />
        <lineBasicMaterial color="#6fa8f5" transparent opacity={0.12} />
      </lineSegments>
      <DotMatrix dots={dots} radius={radius} />
      {/* Soft outer glow rim */}
      <mesh>
        <sphereGeometry args={[radius * 1.08, 32, 32]} />
        <meshBasicMaterial color="#f5a623" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
      {markers.map((m) => (
        <Marker key={m.name} marker={m} radius={radius} />
      ))}
      {home &&
        markers.slice(1).map((m) => <Arc key={`arc-${m.name}`} from={home} to={m} radius={radius} />)}
    </group>
  );
}

export default function GlobeScene({
  dots = [],
  markers = [],
  interactive = true,
  size = 220,
}: {
  dots?: LatLng[];
  markers?: GlobeMarker[];
  interactive?: boolean;
  size?: number;
}) {
  return (
    <Canvas
      style={{ width: size, height: size }}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 2, 4]} intensity={1.2} />
      <directionalLight position={[-4, -1, -2]} intensity={0.4} color="#f5a623" />
      <Suspense fallback={null}>
        <GlobeBody dots={dots} markers={markers} radius={1.35} autoRotate />
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