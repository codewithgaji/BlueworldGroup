/**
 * Local placeholder/fallback dataset for every content region.
 *
 * Used automatically whenever the FastAPI backend is unreachable. Copy here is
 * realistic (never lorem ipsum) so the site is presentable offline.
 */
import type {
  BlogPost,
  BusinessUnit,
  HeroSlide,
  JobPosting,
  MediaAsset,
  Product,
  SiteSettings,
  TeamMember,
} from "@/lib/types";

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    image: "hero.beauty",
    eyebrow: "Since 1998 · Lagos, Nigeria",
    title: "Beauty formulated for African skin",
    subtitle:
      "Blue World Cosmetics manufactures skincare, haircare and fragrance for millions of homes across Africa, Asia and beyond.",
    ctaLabel: "Explore our brands",
    ctaHref: "/business/vivon",
    order: 1,
  },
  {
    id: "slide-2",
    image: "hero.factory",
    eyebrow: "Manufacturing",
    title: "Built in Nigeria. Held to global standard.",
    subtitle:
      "Two production lines, an in-house R&D laboratory and NAFDAC-certified quality control on every batch we ship.",
    ctaLabel: "Inside our operations",
    ctaHref: "/about/who-we-are",
    order: 2,
  },
  {
    id: "slide-3",
    image: "hero.products",
    eyebrow: "Five brands, one house",
    title: "Vivon. BlueCrystal. Blow Right. BlueFragrance.",
    subtitle:
      "A multi-brand portfolio covering face, body, children, hygiene, hair and fine fragrance — from one manufacturing floor.",
    ctaLabel: "See the portfolio",
    ctaHref: "/business/blueworld-cosmetics",
    order: 3,
  },
];

export const BUSINESS_UNITS: BusinessUnit[] = [
  {
    id: "bu-vivon",
    slug: "vivon",
    name: "Vivon",
    tagline: "Everyday skincare, dermatologically considered",
    summary:
      "Vivon is our flagship skincare brand: gentle, high-performing formulations for face, body and children, built around shea butter, glycerin and Nigerian botanical extracts.",
    story:
      "Vivon began in 2004 as a single lightweight body lotion sold in Onitsha market. Today it is the widest line in the Blue World house, spanning three dedicated ranges.\n\nEvery Vivon formula is developed in our Ikeja laboratory and tested for tropical stability — a product that behaves in a 34°C Lagos afternoon is a product that behaves anywhere. We formulate without hydroquinone or mercury, and we publish a full ingredient deck on every carton.\n\nThe brand is built on three ranges: Vivon Face, Vivon Body and Vivon Children. Each has its own chemistry, its own testing protocol and its own audience.",
    heroImage: "unit.vivon",
    accent: "orange",
    order: 1,
    subLines: [
      {
        slug: "face",
        name: "Vivon Face",
        tagline: "Clarity, tone and barrier repair",
        description:
          "Serums, cleansers and moisturisers formulated for melanin-rich skin — niacinamide for tone, licorice root for dark spots, and a non-comedogenic base that holds up in humidity.",
        heroImage: "vivon.face",
      },
      {
        slug: "body",
        name: "Vivon Body",
        tagline: "Deep moisture that lasts the whole day",
        description:
          "Shea-rich lotions, cocoa butter creams and glycerin body washes. Fast-absorbing, never greasy, and packaged in family sizes for the Nigerian household.",
        heroImage: "vivon.body",
      },
      {
        slug: "children",
        name: "Vivon Children",
        tagline: "Gentle enough for the newest skin",
        description:
          "Fragrance-light, tear-free care for babies and children: nappy balm, hair-and-body wash, and a petroleum-jelly alternative with pediatric-dermatologist review.",
        heroImage: "vivon.children",
      },
    ],
  },
  {
    id: "bu-bluecrystal",
    slug: "bluecrystal",
    name: "BlueCrystal",
    tagline: "Hygiene and antiseptic care for the whole family",
    summary:
      "BlueCrystal covers antiseptic liquids, medicated soaps and hand hygiene — the trusted blue bottle found in Nigerian bathrooms, clinics and schools.",
    story:
      "BlueCrystal was launched in 2011 in response to a simple gap: affordable, honestly-dosed antiseptic care manufactured locally instead of imported.\n\nThe range is anchored by our antiseptic liquid concentrate, produced under strict NAFDAC oversight, and extends into medicated bath soap, hand wash and surface care. Institutional volumes ship to hospitals, boarding schools and hospitality groups across the South-West.",
    heroImage: "unit.bluecrystal",
    accent: "blue",
    order: 2,
  },
  {
    id: "bu-blow-right",
    slug: "blow-right",
    name: "Blow Right",
    tagline: "Hair that behaves, from wash day to weekend",
    summary:
      "Relaxers, styling creams, hair food and edge control built for African hair textures — salon-grade performance at market price.",
    story:
      "Blow Right is our haircare house, developed with salon professionals in Lagos and Aba. The range covers the full wash-day ritual: shampoo, conditioning treatment, no-lye relaxer, styling cream and finishing hair food.\n\nWe test every relaxer at three strength grades and publish processing times clearly on pack, because scalp safety is a formulation problem before it is a marketing one.",
    heroImage: "unit.blowright",
    accent: "orange",
    order: 3,
  },
  {
    id: "bu-bluefragrance",
    slug: "bluefragrance",
    name: "BlueFragrance",
    tagline: "Fine fragrance, made on the continent",
    summary:
      "Eau de parfum, body sprays and roll-ons composed in-house — warm, resinous, unmistakably West African accords.",
    story:
      "BlueFragrance is our newest division, founded in 2019 to prove that a competitive fine fragrance can be composed and filled in Nigeria.\n\nOur perfumers work with oud, frankincense, shea flower and citrus, blending in small batches before scaling. The line spans 50ml eau de parfum for the premium tier down to deodorant body sprays for everyday wear.",
    heroImage: "unit.bluefragrance",
    accent: "blue",
    order: 4,
  },
  {
    id: "bu-blueworld",
    slug: "blueworld-cosmetics",
    name: "BlueWorld Cosmetics",
    tagline: "The parent line — essentials for every home",
    summary:
      "Our flagship house line: petroleum jelly, body lotions, glycerin, bath soaps and the value essentials that built the company.",
    story:
      "BlueWorld Cosmetics is where the company started, and it remains the volume backbone of the business. Petroleum jelly, glycerin, camphorated oil, bath soap and family body lotion — unglamorous products, made properly, at a price a Nigerian family can carry every month.\n\nThe line is also our contract-manufacturing showcase: many of the private-label products on West African shelves are filled on the same lines.",
    heroImage: "unit.blueworld-cosmetics",
    accent: "blue",
    order: 5,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "p-1",
    name: "Vivon Radiance Face Serum",
    unit: "vivon",
    subLine: "face",
    category: "Face serum",
    description:
      "10% niacinamide with licorice root extract for even tone and visibly reduced dark spots. Lightweight, non-comedogenic.",
    size: "30ml",
    image: "vivon.face",
    featured: true,
  },
  {
    id: "p-2",
    name: "Vivon Gentle Foaming Cleanser",
    unit: "vivon",
    subLine: "face",
    category: "Cleanser",
    description:
      "A sulphate-free daily cleanser that lifts sunscreen and city dust without stripping the skin barrier.",
    size: "150ml",
    image: "vivon.face",
    featured: false,
  },
  {
    id: "p-3",
    name: "Vivon Shea Deep Moisture Lotion",
    unit: "vivon",
    subLine: "body",
    category: "Body lotion",
    description:
      "Unrefined Nigerian shea butter and glycerin in a fast-absorbing base. 24-hour moisture, family size.",
    size: "500ml",
    image: "vivon.body",
    featured: true,
  },
  {
    id: "p-4",
    name: "Vivon Cocoa Butter Body Cream",
    unit: "vivon",
    subLine: "body",
    category: "Body cream",
    description: "A rich cocoa butter cream for very dry skin, knees, elbows and heels.",
    size: "400g",
    image: "vivon.body",
    featured: false,
  },
  {
    id: "p-5",
    name: "Vivon Children Hair & Body Wash",
    unit: "vivon",
    subLine: "children",
    category: "Children wash",
    description: "Tear-free, fragrance-light 2-in-1 wash for babies and toddlers.",
    size: "300ml",
    image: "vivon.children",
    featured: true,
  },
  {
    id: "p-6",
    name: "Vivon Children Nappy Balm",
    unit: "vivon",
    subLine: "children",
    category: "Baby balm",
    description: "Zinc oxide barrier balm reviewed by pediatric dermatologists.",
    size: "100g",
    image: "vivon.children",
    featured: false,
  },
  {
    id: "p-7",
    name: "BlueCrystal Antiseptic Liquid",
    unit: "bluecrystal",
    category: "Antiseptic",
    description:
      "Concentrated antiseptic disinfectant for wounds, bathing and household surfaces. NAFDAC registered.",
    size: "500ml",
    image: "unit.bluecrystal",
    featured: true,
  },
  {
    id: "p-8",
    name: "BlueCrystal Medicated Bath Soap",
    unit: "bluecrystal",
    category: "Medicated soap",
    description: "Daily medicated soap for body odour control and blemish-prone skin.",
    size: "80g",
    image: "unit.bluecrystal",
    featured: false,
  },
  {
    id: "p-9",
    name: "Blow Right No-Lye Relaxer Kit",
    unit: "blow-right",
    category: "Relaxer",
    description:
      "Conditioning no-lye relaxer in regular and super strength, with pre-treatment scalp protector.",
    size: "Kit",
    image: "unit.blowright",
    featured: true,
  },
  {
    id: "p-10",
    name: "Blow Right Styling Cream",
    unit: "blow-right",
    category: "Styling",
    description: "Medium-hold styling cream with castor oil for definition without flaking.",
    size: "250g",
    image: "unit.blowright",
    featured: false,
  },
  {
    id: "p-11",
    name: "BlueFragrance Oud Noir EDP",
    unit: "bluefragrance",
    category: "Eau de parfum",
    description: "Oud, frankincense and dried plum over a warm amber base. Composed in Lagos.",
    size: "50ml",
    image: "unit.bluefragrance",
    featured: true,
  },
  {
    id: "p-12",
    name: "BlueWorld Petroleum Jelly",
    unit: "blueworld-cosmetics",
    category: "Essentials",
    description: "Triple-filtered petroleum jelly, the household staple, in four sizes.",
    size: "250g",
    image: "unit.blueworld-cosmetics",
    featured: true,
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "t-1",
    name: "Chukwuemeka Obi",
    role: "Group Managing Director",
    bio: "Founded Blue World in 1998 with two mixing vessels in Ikeja. Twenty-eight years later he still signs off every new formulation brief.",
    photo: "team.1",
    order: 1,
  },
  {
    id: "t-2",
    name: "Amaka Eze",
    role: "Executive Director, Brands",
    bio: "Leads the Vivon, Blow Right and BlueFragrance brand teams. Previously ten years in FMCG marketing across West Africa.",
    photo: "team.2",
    order: 2,
  },
  {
    id: "t-3",
    name: "Tunde Alabi",
    role: "Director of Manufacturing",
    bio: "Runs both production lines and the export packing floor. Certified lead auditor for ISO 22716 cosmetic GMP.",
    photo: "team.3",
    order: 3,
  },
  {
    id: "t-4",
    name: "Dr. Ngozi Adeyemi",
    role: "Head of Research & Development",
    bio: "Cosmetic chemist. Holds the company's tropical-stability testing protocol and leads the in-house formulation laboratory.",
    photo: "team.4",
    order: 4,
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b-1",
    slug: "formulating-for-melanin-rich-skin",
    title: "Formulating for melanin-rich skin: what actually changes",
    excerpt:
      "Hyperpigmentation behaves differently on deeper skin tones. Our R&D lead explains how that reshapes an ingredient deck.",
    body:
      "Most global skincare formulations are validated on lighter skin phototypes. When the same formula meets melanin-rich skin, the failure mode is rarely irritation — it is pigment.\n\nPost-inflammatory hyperpigmentation means any aggressive actives risk leaving a mark that outlives the blemish it treated. So our Vivon Face range is built on tone-evening actives with a wide safety margin: niacinamide, licorice root, azelaic derivatives. We do not use hydroquinone or mercury in any product, at any concentration.\n\nThe second change is the base. A tropical climate plus sebum-rich skin means an occlusive-heavy emulsion will feel like a mask by midday. We test every face formula at 34°C and 80% relative humidity before it leaves the lab.\n\nThe third is disclosure. Every Vivon carton carries the full INCI list and the active percentage on the front of pack. Customers deserve to know what strength they bought.",
    category: "Research & Development",
    author: "Dr. Ngozi Adeyemi",
    publishedAt: "2026-07-14",
    coverImage: "blog.ingredients",
    readingMinutes: 6,
  },
  {
    id: "b-2",
    slug: "blue-world-expands-export-to-east-africa",
    title: "Blue World expands export volumes into East Africa",
    excerpt:
      "Our first dedicated Nairobi distribution partnership takes the Vivon and BlueCrystal ranges into Kenyan retail at scale.",
    body:
      "This quarter we signed our first dedicated East African distribution partnership, taking Vivon Body and BlueCrystal antiseptic into Kenyan modern trade.\n\nExport is a logistics problem before it is a sales problem. Containerised cosmetics must survive weeks of heat cycling, so the Nairobi shipments run on our export-grade packing specification: heavier HDPE walls, induction sealing on every unit, and pallet-level batch traceability.\n\nKenya joins Nigeria, China and India on the list of markets our products reach. India and China remain primarily ingredient-sourcing and contract-fill relationships, but consumer volume there is growing.",
    category: "Company News",
    author: "Amaka Eze",
    publishedAt: "2026-06-02",
    coverImage: "blog.export",
    readingMinutes: 4,
  },
  {
    id: "b-3",
    slug: "inside-our-quality-control-lab",
    title: "Inside our quality control lab: every batch, every time",
    excerpt:
      "Viscosity, pH, microbial load and tropical stability. A walk through the eleven checks a batch clears before it ships.",
    body:
      "No batch leaves the Ikeja plant without a signed certificate of analysis. That certificate is the output of eleven separate checks.\n\nWe start at raw material intake: every drum of shea, glycerin and surfactant is sampled and identity-tested before it enters the store. In-process checks cover pH, viscosity, appearance and odour at three points in the mixing cycle.\n\nFinished goods go to accelerated stability — 40°C for twelve weeks, plus a freeze-thaw cycle — and to microbial challenge testing. Retained samples from every batch are kept for the full shelf life, so a complaint from a customer two years out can be traced to a physical sample on our shelf.\n\nIt is unglamorous work. It is also the entire reason a family trusts the same blue bottle for a decade.",
    category: "Manufacturing",
    author: "Tunde Alabi",
    publishedAt: "2026-04-21",
    coverImage: "blog.quality",
    readingMinutes: 5,
  },
];

export const BLOG_CATEGORIES = [
  "All",
  ...Array.from(new Set(BLOG_POSTS.map((p) => p.category))),
];

export const JOB_POSTINGS: JobPosting[] = [
  {
    id: "j-1",
    slug: "cosmetic-formulation-chemist",
    title: "Cosmetic Formulation Chemist",
    department: "Research & Development",
    location: "Ikeja, Lagos",
    employmentType: "Full-time",
    summary:
      "Join our R&D laboratory developing emulsions and surfactant systems for the Vivon and Blow Right ranges.",
    responsibilities: [
      "Develop and optimise emulsions, cleansers and hair systems from brief to pilot batch",
      "Run tropical stability and compatibility testing, and document outcomes",
      "Support scale-up trials with the production team on both lines",
      "Maintain formulation records and INCI documentation for regulatory filing",
    ],
    requirements: [
      "B.Sc. or M.Sc. in Chemistry, Industrial Chemistry or Pharmacy",
      "3+ years hands-on cosmetic or personal-care formulation experience",
      "Working knowledge of NAFDAC cosmetic registration requirements",
      "Meticulous laboratory documentation habits",
    ],
    postedAt: "2026-08-04",
    closesAt: "2026-09-15",
  },
  {
    id: "j-2",
    slug: "regional-sales-manager-south-east",
    title: "Regional Sales Manager — South East",
    department: "Sales & Distribution",
    location: "Onitsha, Anambra",
    employmentType: "Full-time",
    summary:
      "Own distributor relationships and sell-out performance for the South East region across all five brands.",
    responsibilities: [
      "Manage and grow a portfolio of key distributors across five states",
      "Deliver monthly volume and coverage targets by brand",
      "Lead a field team of sales representatives and merchandisers",
      "Report market intelligence on pricing and competitor activity",
    ],
    requirements: [
      "5+ years FMCG field sales, at least 2 in a supervisory role",
      "Proven distributor management track record in the South East",
      "Comfortable with route-to-market analytics and reporting",
      "Valid driver's licence and willingness to travel weekly",
    ],
    postedAt: "2026-07-28",
    closesAt: "2026-09-01",
  },
  {
    id: "j-3",
    slug: "production-line-supervisor",
    title: "Production Line Supervisor",
    department: "Manufacturing",
    location: "Ikeja, Lagos",
    employmentType: "Full-time",
    summary:
      "Supervise a filling and packing shift, holding output, hygiene and safety standards on Line 2.",
    responsibilities: [
      "Run daily shift planning, manning and changeovers on Line 2",
      "Enforce GMP, hygiene and safety protocols on the floor",
      "Log downtime, yield and wastage, and drive corrective actions",
      "Coordinate with QC on in-process checks and batch release",
    ],
    requirements: [
      "HND/B.Sc. in Engineering, Sciences or a related field",
      "3+ years supervising a filling or packing line in FMCG",
      "Familiarity with ISO 22716 cosmetic GMP",
      "Strong people-management instincts under shift pressure",
    ],
    postedAt: "2026-07-11",
    closesAt: null,
  },
  {
    id: "j-4",
    slug: "digital-brand-executive",
    title: "Digital Brand Executive",
    department: "Marketing",
    location: "Victoria Island, Lagos (Hybrid)",
    employmentType: "Full-time",
    summary:
      "Run always-on social and content for Vivon and BlueFragrance, working with creators across Nigeria.",
    responsibilities: [
      "Plan and publish the monthly content calendar for two brands",
      "Brief and manage creator partnerships and shoots",
      "Report on reach, engagement and conversion by channel",
      "Own community response quality and turnaround time",
    ],
    requirements: [
      "2+ years managing brand social accounts, beauty preferred",
      "Comfortable writing short-form copy in Nigerian English register",
      "Hands-on with Meta and TikTok ad managers",
      "Portfolio of campaigns you personally shipped",
    ],
    postedAt: "2026-08-12",
    closesAt: "2026-09-20",
  },
];

export const SITE_SETTINGS: SiteSettings = {
  companyName: "Blue World Cosmetics Limited",
  tagline: "God Is Our Strength",
  addressLines: ["24 Oba Akran Avenue", "Ikeja Industrial Estate", "Lagos, Nigeria"],
  phones: ["+234 803 000 0000", "+234 701 000 0000"],
  emails: ["hello@blueworldcosmetics.org", "careers@blueworldcosmetics.org"],
  officeHours: ["Monday – Friday: 8:00 – 17:00", "Saturday: 9:00 – 14:00", "Sunday: Closed"],
  mapEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=3.32%2C6.58%2C3.39%2C6.63&layer=mapnik",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X", href: "https://x.com" },
  ],
  footerColumns: [
    {
      title: "Company",
      links: [
        { label: "Who We Are", href: "/about/who-we-are" },
        { label: "Vision & Mission", href: "/about/vision-mission" },
        { label: "Leadership", href: "/about/leadership" },
        { label: "Career", href: "/career" },
      ],
    },
    {
      title: "Our Brands",
      links: [
        { label: "Vivon", href: "/business/vivon" },
        { label: "BlueCrystal", href: "/business/bluecrystal" },
        { label: "Blow Right", href: "/business/blow-right" },
        { label: "BlueFragrance", href: "/business/bluefragrance" },
        { label: "BlueWorld Cosmetics", href: "/business/blueworld-cosmetics" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
        { label: "Admin", href: "/admin/login" },
      ],
    },
  ],
};

export const MEDIA_LIBRARY: MediaAsset[] = [
  {
    id: "m-1",
    filename: "hero-beauty.jpg",
    url: "hero.beauty",
    localPath: "src/assets/hero-beauty.jpg",
    width: 1920,
    height: 1080,
    usedOn: "Homepage hero — slide 1",
  },
  {
    id: "m-2",
    filename: "hero-factory.jpg",
    url: "hero.factory",
    localPath: "src/assets/hero-factory.jpg",
    width: 1920,
    height: 1080,
    usedOn: "Homepage hero — slide 2",
  },
  {
    id: "m-3",
    filename: "hero-products.jpg",
    url: "hero.products",
    localPath: "src/assets/hero-products.jpg",
    width: 1920,
    height: 1080,
    usedOn: "Homepage hero — slide 3",
  },
  {
    id: "m-4",
    filename: "unit-vivon.jpg",
    url: "unit.vivon",
    localPath: "src/assets/unit-vivon.jpg",
    width: 1600,
    height: 1100,
    usedOn: "Vivon business unit hero",
  },
  {
    id: "m-5",
    filename: "about-story.jpg",
    url: "about.story",
    localPath: "src/assets/about-story.jpg",
    width: 1600,
    height: 1100,
    usedOn: "About Us — company story",
  },
];

/** Countries the products reach — plotted on the About page globe. */
export const REACH_MARKERS = [
  { name: "Nigeria", lat: 9.082, lng: 8.6753, note: "Head office & manufacturing" },
  { name: "Kenya", lat: -1.2921, lng: 36.8219, note: "East Africa distribution" },
  { name: "China", lat: 31.2304, lng: 121.4737, note: "Ingredient sourcing & contract fill" },
  { name: "India", lat: 19.076, lng: 72.8777, note: "Ingredient sourcing & export" },
];
