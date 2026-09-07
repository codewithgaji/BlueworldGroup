export interface GlobeMarker {
  id: string;
  label: string;       // e.g. "Lagos, Nigeria"
  lat: number;
  lng: number;
}

export interface GlobeSettings {
  mode: "animated" | "static";
  markers: GlobeMarker[];
}

export const GLOBE_SETTINGS_DEFAULT: GlobeSettings = {
  mode: "animated",
  markers: [
    { id: "lagos", label: "Lagos, Nigeria — HQ & factory", lat: 6.5244, lng: 3.3792 },
    { id: "anambra", label: "Anambra, Nigeria", lat: 6.2209, lng: 6.9370 },
    { id: "nairobi", label: "Nairobi, Kenya", lat: -1.2921, lng: 36.8219 },
    { id: "beijing", label: "Beijing, China", lat: 39.9042, lng: 116.4074 },
    { id: "mumbai", label: "Mumbai, India", lat: 19.0760, lng: 72.8777 },
    { id: "newyork", label: "New York, USA", lat: 40.7128, lng: -74.0060 },
  ],
};