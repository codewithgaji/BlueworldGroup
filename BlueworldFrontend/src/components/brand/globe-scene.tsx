/**
 * WebGL brand globe (react-three-fiber). Client-only — loaded lazily by
 * <BrandGlobe /> so it never runs during SSR. Renders a photoreal Earth
 * (real day-map texture, not a dot-matrix) with a soft atmosphere rim,
 * a camera dolly-in on mount, a fast-spin-then-settle axial rotation, and
 * "reach" markers whose spoke + label fade in with a staggered reveal
 * instead of appearing all at once.
 *
 * Fully responsive: the <Canvas> has no hardcoded pixel size — it fills
 * whatever box its parent gives it, and react-three-fiber's built-in
 * ResizeObserver keeps the camera/aspect in sync as that box resizes.
 */
import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Billboard, Html, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export interface GlobeMarker {
  name: string;
  lat: number;
  lng: number;
  note?: string;
}

const GLOBE_RADIUS = 1.35;
const ACCENT = "#f5a623";

// Official three.js example asset — publicly hosted with CORS headers set,
// so it loads fine as a WebGL texture from any origin. Swap this for your
// own hosted Earth map later if you want a different look/resolution.
const EARTH_TEXTURE_URL = "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";

/** Resting spin speed once the entrance settles — rad/s. Deliberately well
 *  above the old 0.14 (which read as "boringly slow"); this completes a
 *  full turn roughly every 12-13s, a pace that stays legible for reading
 *  marker labels but is clearly, purposefully in motion. */
const REST_SPIN_SPEED = 0.5;
/** Angular velocity the globe starts at on mount, decaying down to
 *  REST_SPIN_SPEED — this is the "spins fast then settles" entrance. */
const INTRO_SPIN_SPEED = 5.5;
/** Higher = faster decay from intro speed to resting speed. */
const SPIN_DECAY = 1.8;

function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** The real Earth sphere, texture-mapped — replaces the old dot-matrix land mask. */
function EarthMesh({ radius }: { radius: number }) {
  const texture = useLoader(THREE.TextureLoader, EARTH_TEXTURE_URL);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.9} metalness={0} />
    </mesh>
  );
}

/** Soft blue-white rim glow — a slightly larger backside-only sphere, additive-ish via opacity. */
function AtmosphereGlow({ radius }: { radius: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.045, 48, 48]} />
      <meshBasicMaterial color="#7ec8ff" transparent opacity={0.14} side={THREE.BackSide} />
    </mesh>
  );
}

function Marker({ marker, radius, index }: { marker: GlobeMarker; radius: number; index: number }) {
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<{ material: THREE.Material & { opacity: number } } | null>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const revealStart = useRef<number | null>(null);

  // Surface dot + a short radial "spoke" out to a floating tip, where the label lives —
  // a thin connector instead of a label sitting right on top of the dot.
  const { dotPos, tipPos } = useMemo(() => {
    const surface = latLngToVec3(marker.lat, marker.lng, radius * 1.01);
    const dir = surface.clone().normalize();
    const tip = surface.clone().add(dir.multiplyScalar(radius * 0.3));
    return { dotPos: surface, tipPos: tip };
  }, [marker.lat, marker.lng, radius]);

  useFrame(({ clock }) => {
    // Idle pulse ring on the surface dot.
    if (pulseRef.current) {
      const t = (clock.getElapsedTime() * 0.9) % 1;
      pulseRef.current.scale.setScalar(1 + t * 1.8);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.35;
    }

    // Staggered "line, then label" reveal — each marker starts fading in
    // index * 0.25s after the last, so they read as a sequence rather than
    // popping in all at once.
    if (revealStart.current === null) {
      revealStart.current = clock.getElapsedTime() + index * 0.25;
    }
    const elapsed = clock.getElapsedTime() - revealStart.current;
    const t = THREE.MathUtils.clamp(elapsed / 0.7, 0, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic

    if (lineRef.current) lineRef.current.material.opacity = eased * 0.65;
    if (labelRef.current) labelRef.current.style.opacity = String(eased);
  });

  return (
    <group>
      <Line
        ref={lineRef as never}
        points={[dotPos, tipPos]}
        color={ACCENT}
        transparent
        opacity={0}
        lineWidth={1}
      />

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
          rotates to the far side of the globe. Starts invisible; useFrame above fades it in. */}
      <Html position={tipPos} center occlude zIndexRange={[10, 0]}>
        <div
          ref={labelRef}
          title={marker.note}
          style={{ opacity: 0 }}
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

/**
 * Axial spin with a "fast on entry, settles into a nice steady rate" feel —
 * mirrors CameraIntro's damp-based decay below, so both entrance motions
 * (zoom + spin) read as one coordinated intro rather than two unrelated
 * animations. `spinVelocity` starts at INTRO_SPIN_SPEED and exponentially
 * decays toward REST_SPIN_SPEED every frame; orbit-drag still works the
 * whole time since this only ever touches the group's own rotation, not
 * the camera OrbitControls already owns.
 */
function GlobeBody({ markers }: { markers: GlobeMarker[] }) {
  const group = useRef<THREE.Group>(null);
  const spinVelocity = useRef(INTRO_SPIN_SPEED);
  const radius = GLOBE_RADIUS;

  useFrame((_, delta) => {
    spinVelocity.current = THREE.MathUtils.damp(spinVelocity.current, REST_SPIN_SPEED, SPIN_DECAY, delta);
    if (group.current) group.current.rotation.y += spinVelocity.current * delta;
  });

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        <EarthMesh radius={radius} />
      </Suspense>
      <AtmosphereGlow radius={radius} />
      {/* Faint lat/lng grid, sitting just above the texture. */}
      <lineSegments>
        <edgesGeometry args={[new THREE.SphereGeometry(radius * 1.001, 20, 14)]} />
        <lineBasicMaterial color="#8fb8ff" transparent opacity={0.12} />
      </lineSegments>
      {markers.map((m, i) => (
        <Marker key={m.name} marker={m} radius={radius} index={i} />
      ))}
    </group>
  );
}

/** Dollies the camera in from far away to its resting position on mount — the "zooms forward" entrance. */
const SETTLE_EPSILON = 0.01;

function CameraIntro({ restZ = 4.6 }: { restZ?: number }) {
  const { camera } = useThree();
  const started = useRef(false);
  const settled = useRef(false);

  useFrame((_, delta) => {
    if (settled.current) return; // OrbitControls owns the camera exclusively from here on

    if (!started.current) {
      camera.position.z = 11;
      started.current = true;
    }

    camera.position.z = THREE.MathUtils.damp(camera.position.z, restZ, 3.2, delta);

    if (Math.abs(camera.position.z - restZ) < SETTLE_EPSILON) {
      camera.position.z = restZ;
      settled.current = true;
    }
  });

  return null;
}

export default function GlobeScene({
  markers = [],
  interactive = true,
}: {
  markers?: GlobeMarker[];
  interactive?: boolean;
}) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 11], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 2, 4]} intensity={1.3} />
      <directionalLight position={[-4, -1, -2]} intensity={0.3} color={ACCENT} />
      <CameraIntro />
      <Suspense fallback={null}>
        <GlobeBody markers={markers} />
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