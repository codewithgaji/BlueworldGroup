import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Transparent on EVERY page, on every fresh load and every client-side
  // navigation, until the user scrolls, hovers the bar, or opens the mobile
  // menu. No route is special-cased.
  const transparent = !scrolled && !openMobile && !hovered;

  useEffect(() => {
    // A client-side route change keeps this component mounted with its old
    // state — always reset to "not scrolled" the instant the route changes,
    // then hand off to the real scroll position on the next paint (by which
    // point the router's own scroll-restoration has settled).
    setScrolled(false);
    const onScroll = () => setScrolled(window.scrollY > 40);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return (
    <header
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-out",
        transparent
          ? "border-transparent bg-transparent shadow-none"
          : "border-b border-border/70 bg-background/95 backdrop-blur-xl shadow-sm",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setOpenMobile(false)}>
          <BrandGlobe size={56} interactive={false} showMotto={false} />
          <span className="flex flex-col leading-none">
            <span
              className={cn(
                "font-display text-[1.05rem] font-extrabold tracking-tight transition-colors",
                transparent ? "text-white" : "text-primary-deep",
              )}
            >
              BLUE WORLD
            </span>
            <span
              className={cn(
                "mt-1 text-[0.62rem] font-bold uppercase tracking-[0.28em] transition-colors",
                transparent ? "text-white/80" : "text-accent",
              )}
            >
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
                    "rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200",
                    transparent
                      ? "text-white/90 hover:bg-white/10 hover:text-white"
                      : "text-foreground/75 hover:bg-primary-soft hover:text-primary-deep",
                    active && (transparent ? "text-white" : "text-primary-deep"),
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
                    "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200",
                    transparent
                      ? "text-white/90 hover:bg-white/10 hover:text-white"
                      : "text-foreground/75 hover:bg-primary-soft hover:text-primary-deep",
                    active && (transparent ? "text-white" : "text-primary-deep"),
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
            className={cn(
              "inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5",
              transparent
                ? "border border-white/70 text-white hover:bg-white hover:text-primary-deep"
                : "bg-accent text-accent-foreground",
            )}
          >
            Talk to sales
          </Link>
        </div>

        <button
          type="button"
          aria-label={openMobile ? "Close menu" : "Open menu"}
          onClick={() => setOpenMobile((v) => !v)}
          className={cn(
            "grid h-11 w-11 place-items-center rounded-xl border lg:hidden transition-colors",
            transparent ? "border-white/50 text-white" : "border-border text-primary-deep",
          )}
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
                      onClick={() => setOpenAccordion((c) => (c === item.label ? null : item.label))}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-primary-deep hover:bg-primary-soft"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", openAccordion === item.label && "rotate-180")}
                      />
                    </button>
                    {openAccordion === item.label && (
                      <div className="space-y-1 pb-2 pl-3">
                        {item.children.map((child) => (
                          <AppLink
                            key={child.label}
                            href={child.to}
                            onClick={() => setOpenMobile(false)}
                            className="block rounded-lg px-3 py-2.5 text-sm text-foreground/75 hover:bg-primary-soft"
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
                    className="block rounded-xl px-3 py-3 text-sm font-semibold text-primary-deep hover:bg-primary-soft"
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