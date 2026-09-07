import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
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

/** Flat editing shape — the arrays are edited as one-per-line text areas. */
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
  { name: "tagline", label: "Tagline" },
  { name: "addressLines", label: "Address", type: "list", rows: 4, help: "One line per row." },
  { name: "phones", label: "Phone numbers", type: "list", rows: 3 },
  { name: "emails", label: "Email addresses", type: "list", rows: 3 },
  { name: "officeHours", label: "Office hours", type: "list", rows: 4 },
  { name: "mapEmbedUrl", label: "Map embed URL" },
];

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
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold text-primary-deep">Social links</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {settings.socials.map((s) => (
                <li key={s.label} className="flex justify-between gap-4">
                  <span className="font-medium text-foreground/85">{s.label}</span>
                  <span className="truncate text-xs text-muted-foreground">{s.href}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold text-primary-deep">Footer columns</h2>
            <div className="mt-4 space-y-4">
              {settings.footerColumns.map((col) => (
                <div key={col.title}>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">{col.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {col.links.map((l) => l.label).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
