/**
 * WebGL brand globe (react-three-fiber). Client-only — loaded lazily by
 * <BrandGlobe /> so it never runs during SSR.
 */
import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

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

function Marker({ marker, radius }: { marker: GlobeMarker; radius: number }) {
  const [hovered, setHovered] = useState(false);
  const position = useMemo(
    () => latLngToVec3(marker.lat, marker.lng, radius * 1.02),
    [marker.lat, marker.lng, radius],
  );

  return (
    <group position={position}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setHovered((v) => !v);
        }}
      >
        <sphereGeometry args={[radius * 0.045, 16, 16]} />
        <meshBasicMaterial color={hovered ? "#ffffff" : "#f28022"} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.075, 16, 16]} />
        <meshBasicMaterial color="#f28022" transparent opacity={hovered ? 0.5 : 0.22} />
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
  const points = useMemo(() => {
    const start = latLngToVec3(from.lat, from.lng, radius * 1.01);
    const end = latLngToVec3(to.lat, to.lng, radius * 1.01);
    const mid = start
      .clone()
      .add(end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(radius * 1.45);
    return new THREE.QuadraticBezierCurve3(start, mid, end).getPoints(48);
  }, [from, to, radius]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <primitive
      object={
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({ color: "#f28022", transparent: true, opacity: 0.55 }),
        )
      }
    />
  );
}

function GlobeBody({
  markers,
  radius,
  autoRotate,
}: {
  markers: GlobeMarker[];
  radius: number;
  autoRotate: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && group.current) group.current.rotation.y += delta * 0.16;
  });

  const home = markers[0];

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial color="#1b4f9c" roughness={0.45} metalness={0.15} />
      </mesh>
      {/* Latitude / longitude lattice — the flat logo's globe grid, in 3D */}
      <lineSegments>
        <edgesGeometry args={[new THREE.SphereGeometry(radius * 1.003, 24, 16)]} />
        <lineBasicMaterial color="#8ec5ff" transparent opacity={0.45} />
      </lineSegments>
      <mesh>
        <sphereGeometry args={[radius * 1.07, 32, 32]} />
        <meshBasicMaterial color="#f28022" transparent opacity={0.07} side={THREE.BackSide} />
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
  markers = [],
  interactive = true,
  size = 220,
}: {
  markers?: GlobeMarker[];
  interactive?: boolean;
  size?: number;
}) {
  return (
    <Canvas
      style={{ width: size, height: size }}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 2, 4]} intensity={1.6} />
      <directionalLight position={[-4, -1, -2]} intensity={0.5} color="#f28022" />
      <Suspense fallback={null}>
        <GlobeBody markers={markers} radius={1.35} autoRotate />
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
