import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { EmptyBlock, LoadingBlock, PageHero, Section, SectionHeading } from "@/components/site/primitives";
import { useJobPostings } from "@/hooks/use-cms";
import { ENDPOINTS, submitWithMock } from "@/lib/api";
import type { CareerApplication, JobPosting } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Careers — Blue World Cosmetics" },
      {
        name: "description",
        content:
          "Open roles in formulation, production, quality assurance and commercial at our Ikeja, Lagos manufacturing plant.",
      },
      { property: "og:title", content: "Careers — Blue World Cosmetics" },
      {
        property: "og:description",
        content: "Build cosmetics that reach millions of African households. See our open roles.",
      },
    ],
  }),
  component: CareerPage,
});

const PERKS = [
  { title: "Made here, owned here", body: "Every product you work on is formulated, filled and shipped from our own plant." },
  { title: "Real training budget", body: "Cosmetic science certifications, GMP training and conference travel are funded." },
  { title: "Health cover", body: "HMO cover for you and immediate family from day one of confirmation." },
  { title: "Growth on merit", body: "Line leads and QA supervisors are promoted from inside the plant, not hired around it." },
];

function CareerPage() {
  const { data, isLoading } = useJobPostings();
  const jobs = [...(data ?? [])].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
  const [openJob, setOpenJob] = useState<string | null>(null);
  const [applyTo, setApplyTo] = useState<JobPosting | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Career"
        title="Work where the product is actually made"
        description="We hire chemists, machine operators, QA analysts and commercial people who care about doing manufacturing properly."
        image="hero.factory"
      />

      <Section tone="muted">
        <SectionHeading eyebrow="Why join" title="What you get working here" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((perk) => (
            <div key={perk.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-base font-bold text-primary-deep">{perk.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{perk.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Open roles" title="Positions we're hiring for" />
        <div className="mt-12 space-y-4">
          {isLoading && <LoadingBlock label="Loading open roles…" />}
          {!isLoading && jobs.length === 0 && (
            <EmptyBlock label="No open roles right now — check back soon." />
          )}
          {jobs.map((job) => {
            const open = openJob === job.slug;
            return (
              <div key={job.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <button
                  type="button"
                  onClick={() => setOpenJob(open ? null : job.slug)}
                  className="flex w-full flex-wrap items-center justify-between gap-4 p-6 text-left"
                >
                  <div>
                    <h3 className="font-display text-lg font-bold text-primary-deep">{job.title}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                      {job.department} · {job.location} · {job.employmentType}
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {job.summary}
                    </p>
                  </div>
                  <span className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary-deep">
                    {open ? "Hide details" : "View details"}
                  </span>
                </button>
                {open && (
                  <div className="border-t border-border px-6 pb-6 pt-6">
                    <div className="grid gap-8 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-primary-deep">
                          Responsibilities
                        </h4>
                        <ul className="mt-4 space-y-2">
                          {job.responsibilities.map((r) => (
                            <li key={r} className="flex gap-3 text-sm text-muted-foreground">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-primary-deep">
                          Requirements
                        </h4>
                        <ul className="mt-4 space-y-2">
                          {job.requirements.map((r) => (
                            <li key={r} className="flex gap-3 text-sm text-muted-foreground">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApplyTo(job)}
                      className="mt-8 inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-card transition-transform hover:-translate-y-0.5"
                    >
                      Apply for this role
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {applyTo && <ApplyForm job={applyTo} onClose={() => setApplyTo(null)} />}
    </>
  );
}

function ApplyForm({ job, onClose }: { job: JobPosting; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: CareerApplication = {
      jobSlug: job.slug,
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      coverMessage: String(form.get("coverMessage") ?? ""),
    };
    setSubmitting(true);
    await submitWithMock(ENDPOINTS.careersApply, payload, { ok: true });
    setSubmitting(false);
    toast.success("Application received", {
      description: `Thanks ${payload.fullName.split(" ")[0]} — our people team will reach out by email.`,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-primary-deep/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-7 shadow-lift">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-accent">Apply</p>
            <h3 className="mt-1 font-display text-xl font-bold text-primary-deep">{job.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1 text-sm font-semibold text-muted-foreground"
          >
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Full name" name="fullName" required />
          <Field label="Email address" name="email" type="email" required />
          <Field label="Phone number" name="phone" required />
          <div>
            <label htmlFor="coverMessage" className="text-sm font-semibold text-primary-deep">
              Why this role?
            </label>
            <textarea
              id="coverMessage"
              name="coverMessage"
              rows={4}
              required
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "w-full rounded-full bg-primary-deep px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5",
              submitting && "opacity-60",
            )}
          >
            {submitting ? "Sending…" : "Submit application"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-primary-deep">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
