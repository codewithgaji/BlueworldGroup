import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppLink } from "@/components/site/app-link";
import { resolveImage } from "@/data/images";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const ordered = [...slides].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (ordered.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % ordered.length), 7000);
    return () => clearInterval(t);
  }, [ordered.length]);

  const slide = ordered[index];
  if (!slide) return null;

  return (
    <section className="relative h-[86vh] min-h-[560px] w-full overflow-hidden bg-primary-deep">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
          className="absolute inset-0"
        >
          {slide.videoUrl ? (
            <video
              src={slide.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={resolveImage(slide.image)}
              alt=""
              className="ken-burns h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/95 via-primary-deep/70 to-primary-deep/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${slide.id}`}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.03] text-primary-foreground sm:text-5xl lg:text-[4.1rem]">
              {slide.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85">
              {slide.subtitle}
            </p>
            <AppLink
              href={slide.ctaHref}
              className="mt-9 inline-flex items-center rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-accent-foreground shadow-lift transition-transform hover:-translate-y-0.5"
            >
              {slide.ctaLabel}
            </AppLink>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-0 right-0">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 lg:px-8">
          {ordered.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Show slide ${i + 1}: ${s.title}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-14 bg-accent" : "w-7 bg-primary-foreground/35 hover:bg-primary-foreground/60",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
