import { useState } from "react";
import { Plus } from "lucide-react";
import { ImageField } from "@/components/admin/resource-manager";
import { BlockEditorRow, BLOCK_TYPE_LABELS } from "@/components/admin/page-block-editor";
import { emptyPageBlock, type PageInput } from "@/lib/pages-admin";
import type { BlockType } from "@/lib/types";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";
const labelClass = "text-sm font-semibold text-primary-deep";

export function PageForm({
  initial,
  onSubmit,
  submitLabel,
  busy,
}: {
  initial: PageInput;
  onSubmit: (value: PageInput) => void;
  submitLabel: string;
  busy: boolean;
}) {
  const [form, setForm] = useState<PageInput>(initial);
  const [newBlockType, setNewBlockType] = useState<BlockType>("prose");

  function set<K extends keyof PageInput>(key: K, value: PageInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateBlock(i: number, next: PageInput["blocks"][number]) {
    setForm((f) => ({ ...f, blocks: f.blocks.map((b, j) => (j === i ? next : b)) }));
  }

  function removeBlock(i: number) {
    setForm((f) => ({ ...f, blocks: f.blocks.filter((_, j) => j !== i) }));
  }

  function moveBlock(i: number, dir: -1 | 1) {
    setForm((f) => {
      const blocks = [...f.blocks];
      const target = i + dir;
      if (target < 0 || target >= blocks.length) return f;
      [blocks[i], blocks[target]] = [blocks[target]!, blocks[i]!];
      return { ...f, blocks };
    });
  }

  function addBlock() {
    setForm((f) => ({ ...f, blocks: [...f.blocks, emptyPageBlock(newBlockType)] }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-8"
    >
      <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
        <h2 className="font-display text-lg font-bold text-primary-deep">Page details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Page title</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Page path (URL)</label>
            <input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="about/vision-mission"
              className={inputClass}
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">The web address this page appears at, e.g. "about/leadership".</p>
          </div>
          <div>
            <label className={labelClass}>Small label above the title (optional)</label>
            <input value={form.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value as "draft" | "published")}
              className={inputClass}
            >
              <option value="draft">Draft — not visible on the website yet</option>
              <option value="published">Published — live on the website</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Short description (shown under the title)</label>
            <textarea
              rows={2}
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Cover photo (optional)</label>
            <ImageField id="page-hero-image" value={form.heroImage ?? ""} onChange={(v) => set("heroImage", v)} />
          </div>
        </div>

        <details className="mt-6 rounded-xl border border-border p-4">
          <summary className="cursor-pointer text-sm font-semibold text-primary-deep">Search engine settings (optional)</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Browser tab / search result title</label>
              <input value={form.metaTitle ?? ""} onChange={(e) => set("metaTitle", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Search result description</label>
              <input value={form.metaDescription ?? ""} onChange={(e) => set("metaDescription", e.target.value)} className={inputClass} />
            </div>
          </div>
        </details>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-primary-deep">Page content</h2>
          <div className="flex items-center gap-2">
            <select
              value={newBlockType}
              onChange={(e) => setNewBlockType(e.target.value as BlockType)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {(Object.keys(BLOCK_TYPE_LABELS) as BlockType[]).map((t) => (
                <option key={t} value={t}>{BLOCK_TYPE_LABELS[t]}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={addBlock}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-bold text-accent-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              Add section
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          {form.blocks.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border bg-secondary py-10 text-center text-sm text-muted-foreground">
              No sections yet — pick a type above and click "Add section."
            </p>
          )}
          {form.blocks.map((block, i) => (
            <BlockEditorRow
              key={i}
              block={block}
              index={i}
              total={form.blocks.length}
              onChange={(next) => updateBlock(i, next)}
              onRemove={() => removeBlock(i)}
              onMove={(dir) => moveBlock(i, dir)}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-primary-deep px-8 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {busy ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}