import { PageHero } from "@/components/site/primitives";
import { RenderBlock } from "@/components/site/page-blocks";
import type { CmsPage as CmsPageType } from "@/lib/types";

function orNothing<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined) out[key] = value;
  }
  return out;
}

export function CmsPageView({ page }: { page: CmsPageType }) {
  return (
    <>
      <PageHero
        {...orNothing({
          eyebrow: page.eyebrow,
          description: page.description,
          image: page.heroImage,
        })}
        title={page.title}
      />
      {[...page.blocks].sort((a, b) => a.order - b.order).map((b) => (
        <RenderBlock key={b.id} block={b} />
      ))}
    </>
  );
}