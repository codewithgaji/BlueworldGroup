import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { ImageField } from "@/components/admin/resource-manager";
import { cn } from "@/lib/utils";
import type { PageBlockInput } from "@/lib/pages-admin";
import type { BlockType } from "@/lib/types";

type P = Record<string, any>;

function setPayload(block: PageBlockInput, patch: P): PageBlockInput {
  return { ...block, payload: { ...(block.payload as P), ...patch } };
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const labelClass = "text-xs font-semibold text-primary-deep";

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {help && <p className="mt-1 text-[0.7rem] text-muted-foreground">{help}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  );
}

function ParagraphsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <textarea
      rows={6}
      value={(value ?? []).join("\n\n")}
      onChange={(e) => onChange(e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean))}
      className={inputClass}
    />
  );
}

/* ---------- small repeaters shared by card_grid / numbered_grid / link_cards / feature_pair ---------- */

function CardsRepeater({
  cards,
  onChange,
}: {
  cards: { title: string; body: string }[];
  onChange: (next: { title: string; body: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      {cards.map((card, i) => (
        <div key={i} className="rounded-lg border border-border p-3">
          <div className="flex gap-2">
            <input
              value={card.title}
              onChange={(e) => onChange(cards.map((c, j) => (j === i ? { ...c, title: e.target.value } : c)))}
              placeholder="Title"
              className={cn(inputClass, "mt-0 flex-1")}
            />
            <button
              type="button"
              onClick={() => onChange(cards.filter((_, j) => j !== i))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <textarea
            rows={2}
            value={card.body}
            onChange={(e) => onChange(cards.map((c, j) => (j === i ? { ...c, body: e.target.value } : c)))}
            placeholder="Body text"
            className={cn(inputClass, "mt-2")}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...cards, { title: "", body: "" }])}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-bold text-primary-deep hover:bg-primary-soft"
      >
        <Plus className="h-3.5 w-3.5" />
        Add card
      </button>
    </div>
  );
}

function LinkCardsRepeater({
  cards,
  onChange,
}: {
  cards: { label: string; href: string; copy: string }[];
  onChange: (next: { label: string; href: string; copy: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      {cards.map((card, i) => (
        <div key={i} className="rounded-lg border border-border p-3">
          <div className="flex gap-2">
            <input
              value={card.label}
              onChange={(e) => onChange(cards.map((c, j) => (j === i ? { ...c, label: e.target.value } : c)))}
              placeholder="Link text"
              className={cn(inputClass, "mt-0 w-1/2")}
            />
            <input
              value={card.href}
              onChange={(e) => onChange(cards.map((c, j) => (j === i ? { ...c, href: e.target.value } : c)))}
              placeholder="Page path, e.g. /about/who-we-are"
              className={cn(inputClass, "mt-0 flex-1")}
            />
            <button
              type="button"
              onClick={() => onChange(cards.filter((_, j) => j !== i))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <input
            value={card.copy}
            onChange={(e) => onChange(cards.map((c, j) => (j === i ? { ...c, copy: e.target.value } : c)))}
            placeholder="Short description"
            className={cn(inputClass, "mt-2")}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...cards, { label: "", href: "", copy: "" }])}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-bold text-primary-deep hover:bg-primary-soft"
      >
        <Plus className="h-3.5 w-3.5" />
        Add link card
      </button>
    </div>
  );
}

function FeatureItemsRepeater({
  items,
  onChange,
}: {
  items: { eyebrow: string; body: string; tone: string }[];
  onChange: (next: { eyebrow: string; body: string; tone: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border p-3">
          <div className="flex gap-2">
            <input
              value={item.eyebrow}
              onChange={(e) => onChange(items.map((it, j) => (j === i ? { ...it, eyebrow: e.target.value } : it)))}
              placeholder="Small label (e.g. Our vision)"
              className={cn(inputClass, "mt-0 flex-1")}
            />
            <select
              value={item.tone}
              onChange={(e) => onChange(items.map((it, j) => (j === i ? { ...it, tone: e.target.value } : it)))}
              className={cn(inputClass, "mt-0 w-32")}
            >
              <option value="outline">Outline style</option>
              <option value="accent">Accent style</option>
            </select>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <textarea
            rows={2}
            value={item.body}
            onChange={(e) => onChange(items.map((it, j) => (j === i ? { ...it, body: e.target.value } : it)))}
            placeholder="Body text"
            className={cn(inputClass, "mt-2")}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { eyebrow: "", body: "", tone: "outline" }])}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-bold text-primary-deep hover:bg-primary-soft"
      >
        <Plus className="h-3.5 w-3.5" />
        Add feature
      </button>
    </div>
  );
}

/* ---------- per-block-type field sets ---------- */

function BlockFields({ block, onChange }: { block: PageBlockInput; onChange: (next: PageBlockInput) => void }) {
  const p = block.payload as P;
  const set = (patch: P) => onChange(setPayload(block, patch));

  switch (block.type) {
    case "prose":
      return (
        <div className="space-y-3">
          <Field label="Small label (optional)"><TextInput value={p.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
          <Field label="Heading (optional)"><TextInput value={p.heading} onChange={(v) => set({ heading: v })} /></Field>
          <Field label="Paragraphs" help="Leave a blank line between paragraphs.">
            <ParagraphsInput value={p.paragraphs ?? []} onChange={(v) => set({ paragraphs: v })} />
          </Field>
        </div>
      );

    case "prose_image":
      return (
        <div className="space-y-3">
          <Field label="Small label (optional)"><TextInput value={p.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
          <Field label="Heading"><TextInput value={p.heading} onChange={(v) => set({ heading: v })} /></Field>
          <Field label="Short description (optional)"><TextInput value={p.description} onChange={(v) => set({ description: v })} /></Field>
          <Field label="Paragraphs" help="Leave a blank line between paragraphs.">
            <ParagraphsInput value={p.paragraphs ?? []} onChange={(v) => set({ paragraphs: v })} />
          </Field>
          <Field label="Photo">
            <ImageField id={`img-${block.type}`} value={p.image ?? ""} onChange={(v) => set({ image: v })} />
          </Field>
          <Field label="Photo description (for accessibility)"><TextInput value={p.imageAlt} onChange={(v) => set({ imageAlt: v })} /></Field>
          <Field label="Photo position">
            <select value={p.imageSide ?? "left"} onChange={(e) => set({ imageSide: e.target.value })} className={inputClass}>
              <option value="left">Photo on the left</option>
              <option value="right">Photo on the right</option>
            </select>
          </Field>
        </div>
      );

    case "card_grid":
      return (
        <div className="space-y-3">
          <Field label="Small label (optional)"><TextInput value={p.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
          <Field label="Heading (optional)"><TextInput value={p.heading} onChange={(v) => set({ heading: v })} /></Field>
          <Field label="Columns">
            <select value={p.columns ?? 2} onChange={(e) => set({ columns: Number(e.target.value) })} className={inputClass}>
              <option value={2}>2 columns</option>
              <option value={3}>3 columns</option>
              <option value={4}>4 columns</option>
            </select>
          </Field>
          <Field label="Cards"><CardsRepeater cards={p.cards ?? []} onChange={(v) => set({ cards: v })} /></Field>
        </div>
      );

    case "numbered_grid":
      return (
        <div className="space-y-3">
          <Field label="Small label (optional)"><TextInput value={p.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
          <Field label="Heading (optional)"><TextInput value={p.heading} onChange={(v) => set({ heading: v })} /></Field>
          <Field label="Numbered items"><CardsRepeater cards={p.cards ?? []} onChange={(v) => set({ cards: v })} /></Field>
        </div>
      );

    case "feature_pair":
      return (
        <Field label="Features" help="Typically two side-by-side items, e.g. Vision and Mission.">
          <FeatureItemsRepeater items={p.items ?? []} onChange={(v) => set({ items: v })} />
        </Field>
      );

    case "link_cards":
      return (
        <div className="space-y-3">
          <Field label="Small label (optional)"><TextInput value={p.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
          <Field label="Heading (optional)"><TextInput value={p.heading} onChange={(v) => set({ heading: v })} /></Field>
          <Field label="Link cards"><LinkCardsRepeater cards={p.cards ?? []} onChange={(v) => set({ cards: v })} /></Field>
        </div>
      );

    case "team_grid":
      return (
        <div className="space-y-3">
          <Field label="Small label (optional)"><TextInput value={p.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
          <Field label="Heading (optional)"><TextInput value={p.heading} onChange={(v) => set({ heading: v })} /></Field>
          <Field label="Limit number of people shown (optional)" help="Leave blank to show everyone from the Team tab.">
            <input
              type="number"
              value={p.limit ?? ""}
              onChange={(e) => set({ limit: e.target.value === "" ? null : Number(e.target.value) })}
              className={inputClass}
            />
          </Field>
        </div>
      );

    case "globe_reach":
      return (
        <div className="space-y-3">
          <Field label="Small label (optional)"><TextInput value={p.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
          <Field label="Heading (optional)"><TextInput value={p.heading} onChange={(v) => set({ heading: v })} /></Field>
          <Field label="Description (optional)"><TextInput value={p.description} onChange={(v) => set({ description: v })} /></Field>
        </div>
      );

    default:
      return null;
  }
}

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  prose: "Text paragraph",
  prose_image: "Text with photo",
  card_grid: "Card grid",
  numbered_grid: "Numbered list",
  feature_pair: "Two-column feature",
  link_cards: "Link cards",
  team_grid: "Team grid",
  globe_reach: "World map",
};

export { BLOCK_TYPE_LABELS };

export function BlockEditorRow({
  block,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  block: PageBlockInput;
  index: number;
  total: number;
  onChange: (next: PageBlockInput) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary-deep">
            {BLOCK_TYPE_LABELS[block.type]}
          </span>
          <select
            value={block.tone}
            onChange={(e) => onChange({ ...block, tone: e.target.value as "default" | "muted" })}
            className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
          >
            <option value="default">White background</option>
            <option value="muted">Shaded background</option>
          </select>
        </div>
        <div className="flex gap-1">
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)} className="grid h-8 w-8 place-items-center rounded-lg border border-border disabled:opacity-30">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button type="button" disabled={index === total - 1} onClick={() => onMove(1)} className="grid h-8 w-8 place-items-center rounded-lg border border-border disabled:opacity-30">
            <ChevronDown className="h-4 w-4" />
          </button>
          <button type="button" onClick={onRemove} className="grid h-8 w-8 place-items-center rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="pt-4">
        <BlockFields block={block} onChange={onChange} />
      </div>
    </div>
  );
}