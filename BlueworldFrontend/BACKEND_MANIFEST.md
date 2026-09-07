# Backend Integration Manifest — Blue World Cosmetics

The frontend is complete and runs standalone: every read goes through
`fetchWithFallback()` in `src/lib/api.ts`, which calls the REST endpoint below and
silently falls back to the local dataset in `src/data/placeholder-content.ts` when
the API is unreachable. Point `VITE_API_BASE_URL` at the FastAPI host to go live —
no component changes required.

```
VITE_API_BASE_URL=https://api.blueworldcosmetics.org
```

## Conventions

- JSON only. Dates are ISO `YYYY-MM-DD`.
- List endpoints may return either a bare array or `{ "items": [...], "total": n }`.
- Auth: `Authorization: Bearer <accessToken>` on every write and every `/admin` read.
- Empty list responses are treated as "not yet populated" and the placeholder data is shown.

## Public read endpoints (no auth)

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/cms/hero-slides` | `HeroSlide[]` |
| GET | `/cms/business-units` | `BusinessUnit[]` (embeds `subLines`) |
| GET | `/cms/products` | `Product[]` |
| GET | `/cms/team` | `TeamMember[]` |
| GET | `/cms/blog-posts` | `BlogPost[]` |
| GET | `/cms/jobs` | `JobPosting[]` |
| GET | `/cms/settings` | `SiteSettings` |
| GET | `/cms/media` | `MediaAsset[]` |

## Public write endpoints (no auth, rate-limit + captcha recommended)

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | `/careers/apply` | `CareerApplication` | `{ ok: true }` |
| POST | `/contact` | `ContactSubmission` | `{ ok: true }` |
| POST | `/newsletter/subscribe` | `NewsletterSignup` | `{ ok: true }` |

## Auth endpoints

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | `/auth/login` | `{ email, password }` | `LoginResponse` |
| POST | `/auth/refresh` | `{ refreshToken }` | `AuthTokens` |
| GET | `/auth/me` | — | `AdminUser` |

Tokens are stored in `localStorage` under `bwc.admin.tokens` and attached
automatically by `apiFetch()`.

## Admin CRUD endpoints (JWT required)

Each CMS screen maps 1:1 to a resource. `:resource` is one of
`hero-slides`, `business-units`, `products`, `team`, `blog-posts`, `jobs`, `media`.

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/admin/:resource` | — | `T[]` |
| POST | `/admin/:resource` | `T` (no `id`) | `T` |
| PUT | `/admin/:resource/{id}` | `T` | `T` |
| DELETE | `/admin/:resource/{id}` | — | `204` |
| PUT | `/admin/settings` | `SiteSettings` | `SiteSettings` |
| POST | `/admin/media/upload` | `multipart/form-data` file | `MediaAsset` |
| GET | `/admin/submissions/contact` | — | `ContactSubmission[]` |
| GET | `/admin/submissions/applications` | — | `CareerApplication[]` |

Until those writes exist, the CMS persists edits to a local draft
(`bwc.cms.draft` in `localStorage`, see `src/lib/cms-store.ts`). Swapping to the
API means replacing `upsertItem`/`deleteItem`/`updateSettings` with the calls above.

## TypeScript contract

The canonical interfaces live in `src/lib/types.ts` and Pydantic schemas should
line up field-for-field:

`HeroSlide`, `BusinessUnit`, `BusinessSubLine`, `Product`, `TeamMember`,
`BlogPost`, `JobPosting`, `CareerApplication`, `ContactSubmission`,
`NewsletterSignup`, `SiteSettings`, `AdminUser`, `AuthTokens`, `LoginResponse`,
`MediaAsset`, `ApiListResponse<T>`.

Key enums:

```ts
type BusinessUnitSlug = "vivon" | "bluecrystal" | "blow-right" | "bluefragrance" | "blueworld-cosmetics";
type BusinessSubLineSlug = "face" | "body" | "children";
type EmploymentType = "Full-time" | "Contract" | "Internship";
type AdminRole = "admin" | "editor" | "viewer";
```

## Images

Image fields accept either an absolute URL from the backend or a bundled asset
key resolved by `src/data/images.ts` (e.g. `hero.factory`, `unit.vivon`,
`vivon.face`, `blog.export`, `team.1`). To replace an image without a backend,
drop a new file into `src/assets/` and point the matching key at it.

## Deployment

Static/SSR build targets Vercel. Only `VITE_API_BASE_URL` is required at build time.
