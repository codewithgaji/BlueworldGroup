import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CmsImage } from "@/components/site/primitives";
import { LOCAL_IMAGES } from "@/data/images";
import { useCollection } from "@/lib/cms-store";
import { cn } from "@/lib/utils";

export type FieldType = "text" | "textarea" | "number" | "select" | "multiselect" | "date" | "image" | "boolean" | "list";

export interface FieldConfig<T> {
  name: keyof T & string;
  label: string;
  type?: FieldType;
  options?: readonly string[];
  help?: string;
  rows?: number;
}

export interface ColumnConfig<T> {
  key: keyof T & string;
  label: string;
  /** Renders the cell as a thumbnail. */
  image?: boolean;
}

type Row = { id: string };

export function ResourceManager<T extends Row>({
  items,
  columns,
  fields,
  emptyItem,
  onSave,
  onDelete,
  singular,
  allowCreate = true,
}: {
  items: T[];
  columns: ColumnConfig<T>[];
  fields: FieldConfig<T>[];
  emptyItem: () => T;
  onSave: (item: T) => void;
  onDelete: (id: string) => void;
  singular: string;
  /** Set false for resources created only through a dedicated flow (e.g. media uploads). */
  allowCreate?: boolean;
}) {
  const [editing, setEditing] = useState<T | null>(null);

  // CHANGED: split out the image column and the rest so the mobile card
  // view below can lay out a thumbnail + label:value list without the
  // caller having to configure anything extra.
  const imageColumn = columns.find((col) => col.image);
  const textColumns = columns.filter((col) => !col.image);

  return (
    <div className="space-y-6">
      {allowCreate && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setEditing(emptyItem())}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-card transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            New {singular}
          </button>
        </div>
      )}

      {/* CHANGED: table now hidden below `sm` — a data table with 4+
          columns forces horizontal scroll on a phone just to reach the
          Actions buttons. Kept as-is for tablet/desktop where a mouse and
          wider viewport make that a non-issue. */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-card sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-secondary/60">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-10 text-center text-muted-foreground">
                    Nothing here yet — create your first {singular.toLowerCase()}.
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border/70 last:border-0">
                  {columns.map((col) => {
                    const value = item[col.key];
                    return (
                      <td key={col.key} className="px-5 py-3 align-middle">
                        {col.image ? (
                          <CmsImage
                            src={String(value ?? "")}
                            alt=""
                            className="h-12 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="line-clamp-2 text-foreground/85">
                            {Array.isArray(value) ? `${value.length} item(s)` : String(value ?? "—")}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(item)}
                        aria-label={`Edit ${item.id}`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-border text-primary-deep hover:bg-primary-soft"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${item.id}`}
                        onClick={() => {
                          onDelete(item.id);
                          toast.success(`${singular} deleted`);
                        }}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW: mobile-only stacked card list — replaces the table below `sm`.
          Uses the same ColumnConfig data the table already has, so no
          per-page changes needed anywhere ResourceManager is used. */}
      <div className="space-y-3 sm:hidden">
        {items.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-card">
            Nothing here yet — create your first {singular.toLowerCase()}.
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            {imageColumn && (
              <CmsImage
                src={String(item[imageColumn.key] ?? "")}
                alt=""
                className="h-16 w-16 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              {textColumns.map((col) => {
                const value = item[col.key];
                return (
                  <p key={col.key} className="truncate text-sm">
                    <span className="font-semibold text-primary-deep">{col.label}: </span>
                    <span className="text-foreground/80">
                      {Array.isArray(value) ? `${value.length} item(s)` : String(value ?? "—")}
                    </span>
                  </p>
                );
              })}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(item)}
                  aria-label={`Edit ${item.id}`}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-border text-primary-deep hover:bg-primary-soft"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${item.id}`}
                  onClick={() => {
                    onDelete(item.id);
                    toast.success(`${singular} deleted`);
                  }}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <RecordEditor
          record={editing}
          fields={fields}
          singular={singular}
          onCancel={() => setEditing(null)}
          onSave={(next) => {
            onSave(next);
            setEditing(null);
            toast.success(`${singular} saved`);
          }}
        />
      )}
    </div>
  );
}

/** Picks an image either from the uploaded Media Library, a bundled local asset, or a pasted URL. */
export function ImageField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const media = useCollection("mediaLibrary");

  return (
    <div className="mt-2 space-y-2">
      {/* CHANGED: stacks on mobile (`flex-col`) instead of squeezing the
          select next to a fixed-width thumbnail; goes side-by-side again
          at `sm` where there's room. `min-w-0` on the select stops long
          option text (filenames, bundled-asset keys) from forcing overflow
          inside the flex row. */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        >
          <option value="">— choose an image —</option>
          {media.length > 0 && (
            <optgroup label="Uploaded (Media Library)">
              {media.map((asset) => (
                <option key={asset.id} value={asset.url}>
                  {asset.filename || asset.url}
                </option>
              ))}
            </optgroup>
          )}
          {Object.keys(LOCAL_IMAGES).length > 0 && (
            <optgroup label="Bundled assets">
              {Object.keys(LOCAL_IMAGES).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        {value && (
          <CmsImage
            src={value}
            alt=""
            className="h-12 w-16 shrink-0 self-start rounded-lg object-cover sm:self-auto"
          />
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL directly"
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
      />
      <p className="text-xs text-muted-foreground">
        Don't see the image you need?{" "}
        <Link to="/admin/media" className="font-semibold text-primary-deep underline">
          Upload it to the Media Library
        </Link>{" "}
        first, then pick it here.
      </p>
    </div>
  );
}

export function RecordEditor<T extends Record<string, unknown>>({
  record,
  fields,
  singular,
  onCancel,
  onSave,
  inline = false,
}: {
  record: T;
  fields: FieldConfig<T>[];
  singular: string;
  onCancel?: () => void;
  onSave: (next: T) => void;
  inline?: boolean;
}) {
  const [draft, setDraft] = useState<T>(record);

  function set(name: string, value: unknown) {
    setDraft((d) => ({ ...d, [name]: value }));
  }

  const body = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(draft);
      }}
      className="space-y-4"
    >
      {fields.map((field) => {
        const value = draft[field.name];
        const id = `field-${String(field.name)}`;
        return (
          <div key={String(field.name)}>
            <label htmlFor={id} className="text-sm font-semibold text-primary-deep">
              {field.label}
            </label>
            {field.type === "textarea" || field.type === "list" ? (
              <textarea
                id={id}
                rows={field.rows ?? 4}
                value={
                  field.type === "list"
                    ? ((value as string[] | undefined) ?? []).join("\n")
                    : String(value ?? "")
                }
                onChange={(e) =>
                  set(
                    field.name,
                    field.type === "list"
                      ? e.target.value.split("\n").filter((l) => l.trim().length > 0)
                      : e.target.value,
                  )
                }
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            ) : field.type === "select" ? (
              <select
                id={id}
                value={String(value ?? "")}
                onChange={(e) => set(field.name, e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              >
                <option value="">—</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "image" ? (
              <ImageField id={id} value={String(value ?? "")} onChange={(v) => set(field.name, v)} />

                        ) : field.type === "multiselect" ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {(field.options ?? []).map((opt) => {
                  const selected = String(value ?? "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const isOn = selected.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        const next = isOn ? selected.filter((s) => s !== opt) : [...selected, opt];
                        set(field.name, next.join(", "));
                      }}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                        isOn
                          ? "border-transparent bg-primary-deep text-primary-foreground"
                          : "border-border text-foreground/70 hover:bg-primary-soft",
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            
            ) : field.type === "boolean" ? (
              <div className="mt-2">
                <button
                  type="button"
                  id={id}
                  onClick={() => set(field.name, !value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold",
                    value
                      ? "border-transparent bg-primary-deep text-primary-foreground"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {value ? "Yes" : "No"}
                </button>
              </div>
              ) : field.type === "date" ? (
              <input
                id={id}
                type="date"
                value={String(value ?? "")}
                onChange={(e) => set(field.name, e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            ) : (
              <input
                id={id}
                type={field.type === "number" ? "number" : "text"}
                value={String(value ?? "")}
                onChange={(e) =>
                  set(field.name, field.type === "number" ? Number(e.target.value) : e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            )}
            {field.help && <p className="mt-1.5 text-xs text-muted-foreground">{field.help}</p>}
          </div>
        );
      })}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-full bg-primary-deep px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Save {singular.toLowerCase()}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-muted-foreground"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );

  if (inline) return body;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-primary-deep/60 p-4 backdrop-blur-sm">
      {/* CHANGED: tighter padding on mobile (`p-5`), original `p-7` kept
          from `sm` up. */}
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-lift sm:p-7">
        <h2 className="font-display text-xl font-bold text-primary-deep">Edit {singular.toLowerCase()}</h2>
        <div className="mt-6">{body}</div>
      </div>
    </div>
  );
}