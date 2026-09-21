import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ButtonLink } from "@/components/site/primitives";
import { resolveImage } from "@/data/images";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const ordered = [...slides].sort((a, b) => a.order - b.order);
  const pairCount = Math.max(1, Math.ceil(ordered.length / 2));
  const [pairIndex, setPairIndex] = useState(0);

  useEffect(() => {
    if (pairCount < 2) return;
    const t = setInterval(() => setPairIndex((i) => (i + 1) % pairCount), 7000);
    return () => clearInterval(t);
  }, [pairCount]);

  if (ordered.length === 0) return null;

  const left = ordered[(pairIndex * 2) % ordered.length]!;
  const right = ordered[(pairIndex * 2 + 1) % ordered.length] ?? left;
  const copy = left;

  return (
    <section className="relative h-[78vh] min-h-[480px] w-full overflow-hidden bg-primary-deep sm:h-[85vh] md:h-[92vh]">
      <div className="absolute inset-0 flex">
        {/* Left slot — this is what mobile shows full-width. Uses the
            slide's own mobileImage when set, falling back to the desktop
            photo so nothing breaks for slides that haven't been given one. */}
        <div className="relative h-full w-full md:w-1/2">
          <AnimatePresence mode="sync">
            <motion.img
              key={`${left.id}-mobile`}
              src={resolveImage(left.mobileImage || left.image)}
              alt=""
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full object-cover md:hidden"
            />
            <motion.img
              key={`${left.id}-desktop`}
              src={resolveImage(left.image)}
              alt=""
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 hidden h-full w-full object-cover md:block"
            />
          </AnimatePresence>
        </div>

        {/* Right slot — desktop only, unchanged from before */}
        <div className="relative hidden h-full w-1/2 md:block">
          <AnimatePresence mode="sync">
            <motion.img
              key={right.id}
              src={resolveImage(right.image)}
              alt=""
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/35" />

      <div className="relative flex h-full items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${copy.id}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            {copy.eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">{copy.eyebrow}</p>
            )}
            <h1 className="mt-4 text-2xl font-extrabold uppercase leading-tight tracking-wide text-white sm:text-3xl lg:text-5xl">
              {copy.title}
            </h1>
            <div className="mt-8">
              <ButtonLink href={copy.ctaHref} variant="outline">
                {copy.ctaLabel}
              </ButtonLink>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {pairCount > 1 && (
        <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {Array.from({ length: pairCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setPairIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === pairIndex ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}