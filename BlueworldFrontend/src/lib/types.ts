/**
 * Shared data models for the Blue World Cosmetics site.
 *
 * These interfaces are the contract between this frontend and the FastAPI
 * backend that will be built separately. Pydantic schemas should line up
 * field-for-field with everything below.
 */

export interface HeroSlide {
  id: string;
  /** Absolute URL, or a key in `LOCAL_IMAGES` for a bundled/manual asset. */
  image: string;
  /** Optional mp4/webm URL; when present the slide plays video over the image. */
  videoUrl?: string | null;
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  order: number;
}

export type BusinessUnitSlug =
  | "vivon"
  | "bluecrystal"
  | "blow-right"
  | "bluefragrance"
  | "blueworld-cosmetics";

export interface BusinessUnit {
  id: string;
  slug: BusinessUnitSlug;
  name: string;
  tagline: string;
  /** One-paragraph teaser used on the homepage. */
  summary: string;
  /** Longer brand story, rendered as paragraphs (split on \n\n). */
  story: string;
  heroImage: string;
  accent: "blue" | "orange";
  /** Only Vivon uses sub-lines today; the model stays open for other units. */
  subLines?: BusinessSubLine[];
  order: number;
}

export interface BusinessSubLine {
  slug: "face" | "body" | "children";
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
}

export interface Product {
  id: string;
  name: string;
  /** Business unit slug this product belongs to. */
  unit: BusinessUnitSlug;
  /** Sub-line slug for Vivon products (face | body | children). */
  subLine?: BusinessSubLine["slug"];
  category: string;
  description: string;
  size: string;
  image: string;
  featured: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  order: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown-ish rich text; paragraphs separated by blank lines. */
  body: string;
  category: string;
  author: string;
  publishedAt: string; // ISO date
  coverImage: string;
  readingMinutes: number;
}

export interface JobPosting {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: "Full-time" | "Contract" | "Internship";
  summary: string;
  responsibilities: string[];
  requirements: string[];
  postedAt: string; // ISO date
  closesAt?: string | null;
}

export interface CareerApplication {
  jobSlug: string;
  fullName: string;
  email: string;
  phone: string;
  coverMessage: string;
}

export interface ContactSubmission {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterSignup {
  email: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  addressLines: string[];
  phones: string[];
  emails: string[];
  officeHours: string[];
  mapEmbedUrl: string;
  socials: { label: string; href: string }[];
  footerColumns: { title: string; links: { label: string; href: string }[] }[];
}

/* ---------------------------------- admin --------------------------------- */

export type AdminRole = "admin" | "editor" | "viewer";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  /** Single seeded admin for v1; the multi-role UI comes later. */
  role: AdminRole;
  /** Reserved for the future request-to-access flow. */
  status: "active" | "pending" | "suspended";
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: "bearer";
  expiresIn: number;
}

export interface LoginResponse extends AuthTokens {
  user: AdminUser;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  /** Where a manual replacement file should be dropped. */
  localPath: string;
  width: number;
  height: number;
  usedOn: string;
}

export interface ApiListResponse<T> {
  items: T[];
  total: number;
}
