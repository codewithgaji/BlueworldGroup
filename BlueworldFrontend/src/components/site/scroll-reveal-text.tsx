import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(progress, range, ["hsl(var(--muted-foreground))", "hsl(var(--accent))"]);
  return (
    <motion.span style={{ color }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

export function ScrollRevealText({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.25"] });
  const words = text.split(" ");

  return (
    <div ref={ref} className="mx-auto max-w-4xl overflow-hidden px-6 py-32 text-center">
      <p className="font-display text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl">
        {words.map((word, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {word}
          </Word>
        ))}
      </p>
    </div>
  );
}