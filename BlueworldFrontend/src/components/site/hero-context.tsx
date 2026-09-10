// src/components/site/hero-context.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type HeroContextValue = {
  hasHero: boolean;
  setHasHero: (value: boolean) => void;
};

const HeroContext = createContext<HeroContextValue | null>(null);

/**
 * Wrap the app shell (header + router outlet) with this once, at the root
 * layout, e.g.:
 *   <HeroProvider>
 *     <SiteHeader />
 *     <Outlet />
 *   </HeroProvider>
 */
export function HeroProvider({ children }: { children: ReactNode }) {
  const [hasHero, setHasHero] = useState(false);
  return (
    <HeroContext.Provider value={{ hasHero, setHasHero }}>
      {children}
    </HeroContext.Provider>
  );
}

export function useHasHero() {
  const ctx = useContext(HeroContext);
  return ctx?.hasHero ?? false;
}

/**
 * Drop this at the top of any page that opens with a full-bleed hero image.
 * Flips the header into transparent-over-hero mode while mounted, and
 * reverts automatically on unmount (i.e. when the user navigates away).
 *
 *   export function AboutPage() {
 *     return (
 *       <>
 *         <HeroFlag />
 *         <section className="hero">...</section>
 *         ...
 *       </>
 *     );
 *   }
 */
export function HeroFlag() {
  const ctx = useContext(HeroContext);
  useEffect(() => {
    if (!ctx) return;
    ctx.setHasHero(true);
    return () => ctx.setHasHero(false);
  }, [ctx]);
  return null;
}