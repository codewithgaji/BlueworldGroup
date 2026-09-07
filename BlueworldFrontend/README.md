# Blue World Brilliance

LOVABLE BUILD PROMPT — Blue World Cosmetics Corporate Website

Project: Rebuild the corporate website for Blue World Cosmetics, a leading Nigerian cosmetics manufacturing company, as a professional multi-brand corporate site (think: how PZ Cussons or a mid-size FMCG house presents itself, but with the visual polish of a premium D2C beauty brand like Nuban Beauty).

Stack & Non-Negotiables

Frontend framework: React + TypeScript, using TanStack Router in its SSR configuration (TanStack Start) — this is the same framework used on the developer's existing portfolio (gajilabs.com). Do not scaffold Next.js.

Styling: Tailwind CSS, with Framer Motion for animation.

Hosting target: Vercel only. Do not configure, reference, or scaffold any Cloudflare Workers/Pages integration — no Cloudflare deployment config of any kind.

Backend: There is no backend to build. The entire backend (FastAPI + PostgreSQL, JWT auth, CMS endpoints) will be hand-built separately by the developer. Your job is frontend + CMS UI only, built against a typed API client layer with clearly defined TypeScript interfaces/mock data, structured so real endpoints can be swapped in later with minimal refactor.

Content strategy — critical: Every content region (hero slides, product cards, team bios, business-unit descriptions, blog posts, job listings) must ship with real, well-written placeholder copy and stock-appropriate imagery (not lorem ipsum, not gray boxes) representing Blue World Cosmetics realistically. Each of these regions must be wired to a data-fetching hook (e.g. useHeroSlides(), useProducts()) that:

Attempts to fetch from a defined FastAPI endpoint (e.g. /api/cms/hero-slides).

Falls back automatically to the local placeholder/dummy dataset if the fetch fails or the backend is unreachable (timeout/network error), so the site never breaks with an empty state.

Is structured so an admin can later swap an individual placeholder image by replacing the file in a predictable local asset directory and updating a config key — this should work even with the backend fully offline, as a manual fallback layer.

Admin Panel (CMS)

Design it like a real WordPress/GoDaddy-style admin: sidebar nav (Dashboard, Pages, Products, Business Units, Blog, Careers, Media Library, Team, Settings), clean data tables, and a form-based editor for every editable region of the public site — hero slider (image/video, title, subtitle, CTA button + link), product entries, business-unit pages, job postings, blog posts, team members, contact info, footer links.

Auth: JWT-based login, matching the pattern already used on the developer's BioLogix system. Build one seeded admin account for now (single admin). Structure the auth/permissions layer so a request-to-access / approve-or-deny flow (multi-role: viewer/editor/admin) can be added later without restructuring — but do not build the multi-role UI yet, just leave the data model flexible.

Form design: generously spaced input fields and buttons, clear section grouping, helper text under every field explaining what it controls on the live site (e.g. "This image appears as the first hero slide on the homepage — recommended 1920×1080"). Every button labeled by action, not icon-only. This should feel noticeably more polished than a generic WordPress dashboard — rounded cards, soft shadows, a proper empty/loading/error state for every table.

Brand & Visual Identity

Colors: Orange and blue (from the existing Blue World logo), used the way Nuban Beauty uses its black/white/accent — confident, not garish. Blue as the dominant structural color (nav, headers, footers), orange reserved for CTAs, highlights, and accents.

Logo reinterpretation: Build an interactive 3D rotating globe as the primary brand mark, replacing the flat logo in the navbar and hero. Use Three.js (via react-three-fiber) or react-globe.gl — a real WebGL globe, not a CSS/SVG animation. It should:

Rotate slowly and continuously on its axis by default.

Be draggable/mouse-controllable to spin manually (same interaction pattern as Nuban Beauty's navbar mark).

Render at small size in the navbar (subtle, ambient rotation) and larger on the homepage hero and About Us page.

Have "GOD IS OUR STRENGTH" set in bold caps, curved along the bottom arc of the globe, matching the reference logo's curvature.

On the About Us page, plot glowing markers/arcs on the globe for Nigeria, Kenya, China, and India — the countries Blue World's products reach — with a hover/tap tooltip naming the country.

Keep the original flat Blue World logo mark available for favicon, footer, email signature contexts — the globe is the hero/nav reinterpretation, not a full replacement everywhere.

Navigation Structure (build every linked page — no dead links)

Home

About Us (dropdown)

Who We Are

Vision & Mission

Leadership

Business (dropdown, arrow indicator) — each item below is its own full page:

Vivon — routes to its own dedicated page at /business/vivon, which links out to three separate routed sub-pages: /business/vivon/face, /business/vivon/body, /business/vivon/children — each a full page with its own hero, product grid, and descriptions for that line. Do not build this as tabs on a single page.

BlueCrystal

Blow Right

BlueFragrance

BlueWorld Cosmetics (flagship/parent brand line)

Career — job listings (title, department, location, description, apply form/CTA), list + detail page per posting

Blog (dropdown: e.g. Latest Posts, Categories) — list + individual post page

Contact — standard professional layout: contact form, map/location, phone/email, social links, office hours

Page-Level Direction

Homepage: Full-bleed hero image/video slider (3 slides, Ken Burns/fade transition like blueworldcosmetics.org's current slider but far more polished), globe-integrated section below the fold, featured business units in a Mafa-style image-left/text-right alternating layout (generous whitespace, never cramped), featured products carousel, latest blog posts strip, newsletter signup (Nuban-style modal or inline block).

About Us: Company story, then the interactive globe with country markers described above, then Who We Are / Vision & Mission / Leadership as either sections or true sub-pages per the nav.

Business unit pages: Each gets a hero banner, brand story, product grid/list with descriptions and imagery, and (for Vivon) its three routed sub-pages for Face, Body, and Children.

Career: Job list with filters (department/location), individual job detail pages, and an application form that submits to a placeholder API endpoint (e.g. POST /api/careers/apply) returning a mock success response. Do not build a résumé/file upload field for v1 — this comes later once the real backend is wired. Keep the form to name, email, phone, and a short cover message.

Blog: Standard blog list with category filter, individual post pages with rich content rendering.

Contact: Form (name, email, subject, message) posting to a placeholder endpoint, plus static company info block.

Design Bar

Match Nuban Beauty's level of detail: consistent spacing scale, a proper type hierarchy (one display font for headings, clean sans for body), logo/nav alignment pixel-tight, hover states on every interactive element, mobile-first responsive nav (hamburger with the same dropdown structure collapsed into an accordion). No generic templated look — this should read as a bespoke corporate site, not a theme.

Build Instruction

Start building immediately with the structure, placeholder content, and fallback data-fetching pattern described above. Use your best judgment on exact copy, image choices, and component structure — do not pause to ask clarifying questions; make reasonable assumptions and note them in comments where relevant.

Deliverable: Backend Integration Manifest

Immediately after generating the build, output a complete manifest of everything the FastAPI backend will need to implement, so it can be wired in later with no guesswork. This should include:

A full list of required REST endpoints — method, path, purpose, and expected request/response shape for every data-driven region of the site: hero slides, products, business units (including Vivon's three sub-lines), team members, blog posts, job postings, the careers application submission, the contact form submission, and any auth endpoints the admin panel calls (login, token refresh, current-user check).

TypeScript interfaces/types for every data model used across the frontend (e.g. HeroSlide, Product, BusinessUnit, TeamMember, BlogPost, JobPosting, CareerApplication, ContactSubmission, AdminUser), matching exactly what the hooks/components expect, so the backend's Pydantic schemas can be written to line up field-for-field.

Where each placeholder/fallback dataset lives in the codebase (file paths), so it's easy to find and eventually replace or point at live data.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b5a4c25a-cbb5-4197-9422-63eeb38cb18c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
