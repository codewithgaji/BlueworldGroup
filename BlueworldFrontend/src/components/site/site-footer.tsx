import { AppLink } from "@/components/site/app-link";
import { useSiteSettings } from "@/hooks/use-cms";
import { SITE_SETTINGS } from "@/data/placeholder-content";

export function SiteFooter() {
  const { data } = useSiteSettings();
  const settings = data ?? SITE_SETTINGS;

  return (
    <footer className="surface-deep mt-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.4fr_2fr] lg:px-8">
        <div>
          {/* Flat wordmark stays in footer / favicon / email contexts. */}
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-accent font-display text-sm font-black text-accent">
              BW
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              BLUE WORLD COSMETICS
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
            A Nigerian cosmetics manufacturing house producing skincare, hygiene, haircare and
            fragrance for households across Africa and Asia.
          </p>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-accent">
            {settings.tagline}
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {settings.footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/60">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <AppLink
                      href={link.href}
                      className="text-sm text-primary-foreground/85 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs text-primary-foreground/65 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} {settings.companyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            {settings.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
