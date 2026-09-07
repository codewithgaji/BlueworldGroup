import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AppLink } from "@/components/site/app-link";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandGlobe } from "@/components/brand/brand-globe";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  to: string;
  children?: { label: string; to: string }[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About Us",
    to: "/about",
    children: [
      { label: "Who We Are", to: "/about/who-we-are" },
      { label: "Vision & Mission", to: "/about/vision-mission" },
      { label: "Leadership", to: "/about/leadership" },
    ],
  },
  {
    label: "Business",
    to: "/business/vivon",
    children: [
      { label: "Vivon", to: "/business/vivon" },
      { label: "BlueCrystal", to: "/business/bluecrystal" },
      { label: "Blow Right", to: "/business/blow-right" },
      { label: "BlueFragrance", to: "/business/bluefragrance" },
      { label: "BlueWorld Cosmetics", to: "/business/blueworld-cosmetics" },
    ],
  },
  { label: "Career", to: "/career" },
  {
    label: "Blog",
    to: "/blog",
    children: [
      { label: "Latest Posts", to: "/blog" },
      { label: "Company News", to: "/blog?category=Company+News" },
      { label: "Research & Development", to: "/blog?category=Research+%26+Development" },
    ],
  },
  { label: "Contact", to: "/contact" },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openMobile, setOpenMobile] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setOpenMobile(false)}>
          <BrandGlobe size={56} interactive={false} showMotto={false} />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.05rem] font-extrabold tracking-tight text-primary-deep">
              BLUE WORLD
            </span>
            <span className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-accent">
              Cosmetics
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to.split("?")[0]!);
            if (!item.children) {
              return (
                <AppLink
                  key={item.label}
                  href={item.to}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-primary-soft hover:text-primary-deep",
                    active && "text-primary-deep",
                  )}
                >
                  {item.label}
                </AppLink>
              );
            }
            return (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-primary-soft hover:text-primary-deep",
                    active && "text-primary-deep",
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-0 top-full w-64 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-lift">
                    {item.children.map((child) => (
                      <AppLink
                        key={child.label}
                        href={child.to}
                        className="block rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary-soft hover:text-primary-deep"
                      >
                        {child.label}
                      </AppLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-card transition-transform hover:-translate-y-0.5"
          >
            Talk to sales
          </Link>
        </div>

        <button
          type="button"
          aria-label={openMobile ? "Close menu" : "Open menu"}
          onClick={() => setOpenMobile((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-border text-primary-deep lg:hidden"
        >
          {openMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {openMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-card lg:hidden"
          >
            <div className="space-y-1 px-5 py-4">
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <div key={item.label} className="rounded-xl">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAccordion((c) => (c === item.label ? null : item.label))
                      }
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-primary-deep"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openAccordion === item.label && "rotate-180",
                        )}
                      />
                    </button>
                    {openAccordion === item.label && (
                      <div className="space-y-1 pb-2 pl-3">
                        {item.children.map((child) => (
                          <AppLink
                            key={child.label}
                            href={child.to}
                            onClick={() => setOpenMobile(false)}
                            className="block rounded-lg px-3 py-2.5 text-sm text-foreground/75"
                          >
                            {child.label}
                          </AppLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <AppLink
                    key={item.label}
                    href={item.to}
                    onClick={() => setOpenMobile(false)}
                    className="block rounded-xl px-3 py-3 text-sm font-semibold text-primary-deep"
                  >
                    {item.label}
                  </AppLink>
                ),
              )}
              <Link
                to="/contact"
                onClick={() => setOpenMobile(false)}
                className="mt-3 block rounded-full bg-accent px-5 py-3 text-center text-sm font-bold text-accent-foreground"
              >
                Talk to sales
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
