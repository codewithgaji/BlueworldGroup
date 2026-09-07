export interface LatLng {
  lat: number;
  lng: number;
}

type Ring = [number, number][]; // [lng, lat][]
type Geometry =
  | { type: "Polygon"; coordinates: Ring[] }
  | { type: "MultiPolygon"; coordinates: Ring[][] };

interface GeoFeature {
  type: "Feature";
  properties?: Record<string, unknown>;
  geometry: Geometry;
}

interface GeoJson {
  type: "FeatureCollection";
  features: GeoFeature[];
}

// Ray-casting point-in-polygon on a ring's exterior boundary. Good enough at
// dot-matrix resolution; ignores interior holes (rings[1..]) by design.
function pointInRing(lng: number, lat: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInPolygonCoords(lng: number, lat: number, rings: Ring[]): boolean {
  if (rings.length === 0) return false;
  return pointInRing(lng, lat, rings[0]);
}

function pointInFeature(lng: number, lat: number, geometry: Geometry): boolean {
  if (geometry.type === "Polygon") {
    return pointInPolygonCoords(lng, lat, geometry.coordinates);
  }
  return geometry.coordinates.some((rings) => pointInPolygonCoords(lng, lat, rings));
}

/**
 * Samples a regular lat/lng grid and keeps only points that fall inside a
 * land polygon — a cheap way to build a Cloudflare-style dot-matrix map from
 * a countries GeoJSON without a full point-in-polygon library.
 *
 * @param step grid spacing in degrees. 3-4 gives a dense, legible globe;
 *   smaller values grow the point count quickly (roughly quadratic).
 */
export function geoJsonToDots(geo: GeoJson, step = 3.2): LatLng[] {
  const dots: LatLng[] = [];
  if (!geo?.features?.length) return dots;

  for (let lat = -88; lat <= 88; lat += step) {
    // Shrink the longitude step near the poles so dots stay roughly
    // uniform in surface area instead of bunching up.
    const lngStep = Math.min(step / Math.max(Math.cos((lat * Math.PI) / 180), 0.15), 12);
    for (let lng = -180; lng < 180; lng += lngStep) {
      for (const feature of geo.features) {
        if (pointInFeature(lng, lat, feature.geometry)) {
          dots.push({ lat, lng });
          break;
        }
      }
    }
  }
  return dots;
}