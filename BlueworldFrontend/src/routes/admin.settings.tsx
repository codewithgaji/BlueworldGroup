import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { RecordEditor, type FieldConfig } from "@/components/admin/resource-manager";
import { updateSettings, useCmsState } from "@/lib/cms-store";
import type { SiteSettings } from "@/lib/types";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Site Settings — Blue World CMS" },
      { name: "description", content: "Company contact details, office hours and footer navigation." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Site Settings — Blue World CMS" },
      { property: "og:description", content: "Global company and contact settings." },
    ],
  }),
  component: SettingsAdmin,
});

type SettingsDraft = {
  companyName: string;
  tagline: string;
  addressLines: string[];
  phones: string[];
  emails: string[];
  officeHours: string[];
  mapEmbedUrl: string;
  [key: string]: unknown;
};

const fields: FieldConfig<SettingsDraft>[] = [
  { name: "companyName", label: "Company name" },
  { name: "tagline", label: "Company slogan" },
  { name: "addressLines", label: "Office address", type: "list", rows: 4, help: "One line per row — e.g. street, city, state." },
  { name: "phones", label: "Phone numbers", type: "list", rows: 3, help: "One number per row." },
  { name: "emails", label: "Email addresses", type: "list", rows: 3, help: "One email per row." },
  { name: "officeHours", label: "Office hours", type: "list", rows: 4, help: "e.g. 'Mon–Fri: 8am–5pm', one line per row." },
  { name: "mapEmbedUrl", label: "Google Maps link", help: "Paste the 'Embed a map' link from Google Maps here." },
];

function SocialLinksEditor({
  socials,
  onSave,
}: {
  socials: { label: string; href: string }[];
  onSave: (next: { label: string; href: string }[]) => void;
}) {
  const [rows, setRows] = useState(socials);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-base font-bold text-primary-deep">Social links</h2>
      <p className="mt-1 text-xs text-muted-foreground">e.g. Instagram, Facebook, LinkedIn — shown in the site footer.</p>
      <div className="mt-4 space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={row.label}
              onChange={(e) => setRows((r) => r.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
              placeholder="Platform (e.g. Instagram)"
              className="w-1/3 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              value={row.href}
              onChange={(e) => setRows((r) => r.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))}
              placeholder="Link (https://...)"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setRows((r) => r.filter((_, j) => j !== i))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setRows((r) => [...r, { label: "", href: "" }])}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-primary-deep hover:bg-primary-soft"
        >
          <Plus className="h-3.5 w-3.5" />
          Add social link
        </button>
        <button
          type="button"
          onClick={() => {
            onSave(rows.filter((r) => r.label.trim() && r.href.trim()));
            toast.success("Social links saved");
          }}
          className="rounded-full bg-primary-deep px-5 py-2 text-xs font-bold text-primary-foreground"
        >
          Save social links
        </button>
      </div>
    </div>
  );
}

function FooterColumnsEditor({
  columns,
  onSave,
}: {
  columns: { title: string; links: { label: string; href: string }[] }[];
  onSave: (next: { title: string; links: { label: string; href: string }[] }[]) => void;
}) {
  const [cols, setCols] = useState(columns);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-base font-bold text-primary-deep">Footer columns</h2>
      <p className="mt-1 text-xs text-muted-foreground">The grouped link lists shown across the bottom of every page.</p>
      <div className="mt-4 space-y-6">
        {cols.map((col, ci) => (
          <div key={ci} className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-2">
              <input
                value={col.title}
                onChange={(e) => setCols((c) => c.map((x, j) => (j === ci ? { ...x, title: e.target.value } : x)))}
                placeholder="Column heading (e.g. Company)"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setCols((c) => c.filter((_, j) => j !== ci))}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {col.links.map((link, li) => (
                <div key={li} className="flex gap-2 pl-2">
                  <input
                    value={link.label}
                    onChange={(e) =>
                      setCols((c) =>
                        c.map((x, j) =>
                          j === ci
                            ? { ...x, links: x.links.map((l, k) => (k === li ? { ...l, label: e.target.value } : l)) }
                            : x,
                        ),
                      )
                    }
                    placeholder="Link text"
                    className="w-1/3 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  />
                  <input
                    value={link.href}
                    onChange={(e) =>
                      setCols((c) =>
                        c.map((x, j) =>
                          j === ci
                            ? { ...x, links: x.links.map((l, k) => (k === li ? { ...l, href: e.target.value } : l)) }
                            : x,
                        ),
                      )
                    }
                    placeholder="Page path (e.g. /contact)"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCols((c) => c.map((x, j) => (j === ci ? { ...x, links: x.links.filter((_, k) => k !== li) } : x)))
                    }
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCols((c) => c.map((x, j) => (j === ci ? { ...x, links: [...x.links, { label: "", href: "" }] } : x)))
                }
                className="ml-2 inline-flex items-center gap-1.5 text-xs font-bold text-accent"
              >
                <Plus className="h-3 w-3" />
                Add link
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setCols((c) => [...c, { title: "", links: [] }])}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-primary-deep hover:bg-primary-soft"
        >
          <Plus className="h-3.5 w-3.5" />
          Add column
        </button>
        <button
          type="button"
          onClick={() => {
            onSave(cols.filter((c) => c.title.trim()));
            toast.success("Footer columns saved");
          }}
          className="rounded-full bg-primary-deep px-5 py-2 text-xs font-bold text-primary-foreground"
        >
          Save footer columns
        </button>
      </div>
    </div>
  );
}

function SettingsAdmin() {
  const { settings } = useCmsState();

  const draft: SettingsDraft = {
    companyName: settings.companyName,
    tagline: settings.tagline,
    addressLines: settings.addressLines,
    phones: settings.phones,
    emails: settings.emails,
    officeHours: settings.officeHours,
    mapEmbedUrl: settings.mapEmbedUrl,
  };

  return (
    <AdminShell title="Site Settings" description="Used by the header, footer and contact page.">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
          <RecordEditor<SettingsDraft>
            record={draft}
            fields={fields}
            singular="Settings"
            inline
            onSave={(next) => {
              const merged: SiteSettings = {
                ...settings,
                companyName: next.companyName,
                tagline: next.tagline,
                addressLines: next.addressLines,
                phones: next.phones,
                emails: next.emails,
                officeHours: next.officeHours,
                mapEmbedUrl: next.mapEmbedUrl,
              };
              updateSettings(merged);
              toast.success("Site settings saved");
            }}
          />
        </div>

        <div className="space-y-6">
          <SocialLinksEditor
            socials={settings.socials}
            onSave={(socials) => updateSettings({ ...settings, socials })}
          />
          <FooterColumnsEditor
            columns={settings.footerColumns}
            onSave={(footerColumns) => updateSettings({ ...settings, footerColumns })}
          />
        </div>
      </div>
    </AdminShell>
  );
}