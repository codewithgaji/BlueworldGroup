import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

function Word({
  children,
  progress,
  range,
  className,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const color = useTransform(progress, range, ["hsl(var(--muted-foreground))", "hsl(var(--accent))"]);
  return (
    <motion.span style={{ color }} className={cn("inline", className)}>
      {children}{" "}
    </motion.span>
  );
}

import { cn } from "@/lib/utils";

export function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.35"] });
  const words = text.split(" ");

  return (
    <div ref={ref} className="overflow-hidden">
      <p className={cn("font-display font-extrabold leading-none", className)}>
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>
    </div>
  );
}