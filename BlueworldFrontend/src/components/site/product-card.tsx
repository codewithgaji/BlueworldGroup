import { motion } from "framer-motion";
import { CmsImage } from "@/components/site/primitives";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="aspect-[4/3] overflow-hidden bg-secondary">
        <CmsImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-accent">
          {product.category} · {product.size}
        </p>
        <h3 className="mt-2 text-lg font-bold text-primary-deep">{product.name}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>
    </motion.article>
  );
}
