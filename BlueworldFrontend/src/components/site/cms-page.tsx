import { PageHero } from "@/components/site/primitives";
import { RenderBlock } from "@/components/site/page-blocks";
import type { CmsPage as CmsPageType } from "@/lib/types";

export function CmsPageView({ page }: { page: CmsPageType }) {
  return (
    <>
      <PageHero
        eyebrow={page.eyebrow ?? undefined}
        title={page.title}
        description={page.description ?? undefined}
        image={page.heroImage ?? undefined}
      />
      {[...page.blocks].sort((a, b) => a.order - b.order).map((b) => (
        <RenderBlock key={b.id} block={b} />
      ))}
    </>
  );
}