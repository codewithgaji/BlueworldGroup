import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";
import { resolveImage } from "@/data/images";
import { AppLink } from "@/components/site/app-link";
import { HeroFlag } from "@/components/site/hero-context";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "deep" | "warm";
}) {
  return (
    <section
      className={cn(
        "px-5 py-20 lg:px-8 lg:py-28",
        tone === "muted" && "bg-secondary",
        tone === "warm" && "bg-accent-soft",
        tone === "deep" && "surface-deep",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  invert?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2
        className={cn(
          "mt-3 text-3xl font-extrabold leading-[1.1] lg:text-[2.6rem]",
          invert ? "text-primary-foreground" : "text-primary-deep",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed",
            invert ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

export function CmsImage({
  src,
  alt,
  className,
  width,
  height,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  eager?: boolean;
}) {
  const resolved = resolveImage(src);
  if (!src || !resolved) {
    return (
      <div className={cn("flex items-center justify-center bg-secondary text-muted-foreground/40", className)}>
        <ImageOff className="h-6 w-6" />
      </div>
    );
  }
  return (
    <img
      src={resolved}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = "none";
        const parent = e.currentTarget.parentElement;
        if (parent) parent.classList.add("bg-secondary");
      }}
    />
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
}) {
  return (
    <AppLink
      href={href}
      className={cn(
        "inline-flex items-center gap-2 border-2 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-all",
        "shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.9)]",
        "active:translate-y-0.5 active:shadow-[1px_1px_0_0_rgba(0,0,0,0.9)]",
        variant === "solid"
          ? "border-black bg-accent text-accent-foreground hover:bg-primary-deep hover:text-primary-foreground"
          : "border-white/80 bg-transparent text-white hover:bg-white hover:text-primary-deep",
      )}
    >
      {children}
    </AppLink>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-primary-deep">
      <HeroFlag />
      {image && (
        <div className="absolute inset-0">
          <CmsImage src={image} alt="" className="h-full w-full object-cover" eager />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>
      )}
      <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] text-primary-foreground lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">{description}</p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card py-16 text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function EmptyBlock({ label }: { label: string }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-secondary py-16 text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function ErrorBlock({ label = "Something went wrong." }: { label?: string }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-destructive/30 bg-destructive/5 py-16 text-sm text-destructive">
      {label}
    </div>
  );
}