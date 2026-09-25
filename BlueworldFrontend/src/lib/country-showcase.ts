/**
 * What appears when someone taps a market on the home page: the media
 * behind the globe plus the short write-up in the right-hand card.
 * Keys must match the `name` values in REACH_MARKERS.
 *
 * MEDIA: drop your own photos (or short looping clips) into /public/countries/
 * and point `image` / `video` at them. Use images you own or have licensed.
 * Until a file exists, the `tint` gradient shows instead, so nothing breaks.
 *
 *   image  ~1600px wide JPG/WebP, landscape or square, under ~400 KB
 *   video  optional muted MP4 loop, 5-10s, under ~3 MB (`image` is its poster)
 *
 * COPY: the text below is placeholder wording based on each market's role.
 * Edit it freely.
 */
export interface CountryShowcase {
  place: string;
  headline: string;
  blurb: string;
  /** A second paragraph — gives the card real depth instead of one short blurb. */
  detail: string;
  /** A short number/word pairing shown as a callout, e.g. "1998" / "Operating since". */
  stat: { value: string; label: string };
  points: string[];
  image: string;
  video?: string;
  /** Fallback backdrop while the image is missing or loading. */
  tint: string;
}

export const COUNTRY_SHOWCASE: Record<string, CountryShowcase> = {
  Nigeria: {
    place: "Lagos",
    headline: "Where every carton starts",
    blurb:
      "Formulation, filling, packing and quality control all happen at our plant on Oba Akran Avenue in the Ikeja Industrial Estate. Every product Blue World sells, anywhere in the world, passes through this one facility before it ever reaches a shelf.",
    detail:
      "Our in-house laboratory owns every formula we sell, and our quality team clears each batch against eleven separate checks before it's cleared to ship. Nothing leaves Lagos without retained samples and a full certificate of analysis on file. It's also home base commercially: our distributor network covers all six Nigerian geopolitical zones, alongside direct institutional supply to hospitals, schools and hospitality groups.",
    stat: { value: "200+", label: "People employed here" },
    points: [
      "Head office & manufacturing",
      "In-house R&D laboratory",
      "11 QC checks per batch",
      "Two production lines: liquids, creams & solids",
      "Distribution across all six geopolitical zones",
      "NAFDAC registration on every regulated SKU",
    ],
    image: "/countries/nigeria.jpg",
    tint: "linear-gradient(160deg, #0d3b2e 0%, #0b1a2a 100%)",
  },
  Kenya: {
    place: "Nairobi",
    headline: "Our gateway to East Africa",
    blurb:
      "Finished cartons leave Lagos by sea and land in Nairobi, where our distribution partners keep shelves stocked across the wider East African region — from major retail chains down to independent pharmacies and neighbourhood stores.",
    detail:
      "Kenya was our first export market outside West Africa, and it remains the busiest — the region's growing middle class and Nairobi's role as an East African logistics hub make it a natural second home for Blue World products. From here, our partners also handle onward distribution into neighbouring markets, so a single Nairobi shipment often reaches shelves well beyond Kenya's own borders.",
    stat: { value: "2016", label: "Exporting here since" },
    points: [
      "Regional distribution hub",
      "Retail & pharmacy partners",
      "East Africa's busiest export lane",
      "Onward reach into neighbouring markets",
      "Growing middle-class demand for skincare & hygiene",
    ],
    image: "/countries/kenya.jpg",
    tint: "linear-gradient(160deg, #5a2d0c 0%, #0b1a2a 100%)",
  },
  China: {
    place: "Guangzhou",
    headline: "Sourcing and contract fill",
    blurb:
      "We source key raw ingredients and packaging components from established suppliers in Guangzhou, one of the world's largest manufacturing hubs, and run selected contract-fill batches here to keep our production lines moving when local capacity is stretched.",
    detail:
      "Every supplier is audited against our own specification before a single shipment is approved — sourcing globally doesn't mean compromising on the standard we hold our own Lagos plant to. Guangzhou's depth of packaging and component suppliers also lets us prototype new pack formats faster than we could sourcing locally alone, which matters when a new brand line is racing toward launch.",
    stat: { value: "40+", label: "Approved raw materials" },
    points: [
      "Ingredient sourcing",
      "Packaging components",
      "Contract-fill capacity",
      "Supplier audits against our own specification",
      "Faster prototyping for new pack formats",
    ],
    image: "/countries/china.jpg",
    tint: "linear-gradient(160deg, #4a1016 0%, #0b1a2a 100%)",
  },
  India: {
    place: "Mumbai",
    headline: "Ingredients in, product out",
    blurb:
      "Our sourcing partners in Mumbai supply key active ingredients for our formulations — particularly for our skincare and haircare lines — and we export finished Blue World product back into the Indian market in return.",
    detail:
      "It's a genuine two-way relationship: ingredients flow into our Lagos plant, and finished cartons flow back out to Indian distributors, making this one of our few markets that runs both directions at once. That two-way flow also gives us an early read on ingredient trends coming out of one of the world's fastest-moving personal-care markets.",
    stat: { value: "2 way", label: "Import & export lane" },
    points: [
      "Active ingredient sourcing",
      "Finished product export",
      "Two-way trade relationship",
      "Focus on skincare & haircare actives",
      "Early visibility into emerging ingredient trends",
    ],
    image: "/countries/india.jpg",
    tint: "linear-gradient(160deg, #4d2a08 0%, #0b1a2a 100%)",
  },
};

export function getShowcase(name: string): CountryShowcase | null {
  const key = Object.keys(COUNTRY_SHOWCASE).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? COUNTRY_SHOWCASE[key] : null;
}