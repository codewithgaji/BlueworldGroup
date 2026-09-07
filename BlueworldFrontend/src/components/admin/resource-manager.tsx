import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CmsImage } from "@/components/site/primitives";
import { LOCAL_IMAGES } from "@/data/images";
import { cn } from "@/lib/utils";

export type FieldType = "text" | "textarea" | "number" | "select" | "image" | "boolean" | "list";

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
}: {
  items: T[];
  columns: ColumnConfig<T>[];
  fields: FieldConfig<T>[];
  emptyItem: () => T;
  onSave: (item: T) => void;
  onDelete: (id: string) => void;
  singular: string;
}) {
  const [editing, setEditing] = useState<T | null>(null);

  return (
    <div className="space-y-6">
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

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
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
              <div className="mt-2 flex gap-3">
                <select
                  id={id}
                  value={String(value ?? "")}
                  onChange={(e) => set(field.name, e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                >
                  <option value="">—</option>
                  {Object.keys(LOCAL_IMAGES).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                {typeof value === "string" && value && (
                  <CmsImage src={value} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                )}
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
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-7 shadow-lift">
        <h2 className="font-display text-xl font-bold text-primary-deep">Edit {singular.toLowerCase()}</h2>
        <div className="mt-6">{body}</div>
      </div>
    </div>
  );
}
