"use client";

import { useState, useTransition } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { saveSiteContent } from "@/lib/admin/actions";
import type { SiteContentData } from "@/lib/site-content";

export function ContentEditor({ initial }: { initial: SiteContentData }) {
  const [form, setForm] = useState<SiteContentData>(initial);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof SiteContentData>(key: K, value: SiteContentData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setBlock = (i: number, patch: Partial<SiteContentData["whoBlocks"][number]>) =>
    set(
      "whoBlocks",
      form.whoBlocks.map((b, j) => (j === i ? { ...b, ...patch } : b)),
    );

  const save = () => {
    setMessage(null);
    startTransition(async () => {
      try {
        await saveSiteContent(form);
        setMessage({ ok: true, text: "Saved. The website is updated." });
      } catch {
        setMessage({ ok: false, text: "Could not save. Check that email and required fields are filled." });
      }
    });
  };

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Page Content"
        description="Edit the text shown on the website. Changes go live as soon as you save."
        action={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-black/15 px-4 py-2.5 text-sm font-medium"
          >
            View website
          </a>
        }
      />

      <Section title="Header & hero">
        <Text label="Business name" value={form.brandName} onChange={(v) => set("brandName", v)} />
        <Text label="Main heading" value={form.heroTitle} onChange={(v) => set("heroTitle", v)} />
        <Area label="Intro text" value={form.heroText} onChange={(v) => set("heroText", v)} />
        <Text label="Button text" value={form.ctaLabel} onChange={(v) => set("ctaLabel", v)} />
      </Section>

      <Section title="Who we serve">
        <Text label="Section heading" value={form.whoHeading} onChange={(v) => set("whoHeading", v)} />
        {form.whoBlocks.map((b, i) => (
          <div key={i} className="rounded-xl border border-black/[0.08] bg-[#f8fafc] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Card {i + 1}</p>
              <button
                type="button"
                className="text-sm text-red-700"
                onClick={() => set("whoBlocks", form.whoBlocks.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
            <div className="mt-3 grid gap-3">
              <Text label="Title" value={b.title} onChange={(v) => setBlock(i, { title: v })} />
              <Area
                label="Text (leave a blank line between paragraphs)"
                value={b.body}
                rows={7}
                onChange={(v) => setBlock(i, { body: v })}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="self-start rounded-xl border border-black/15 px-4 py-2 text-sm font-medium"
          onClick={() => set("whoBlocks", [...form.whoBlocks, { title: "", body: "" }])}
        >
          + Add card
        </button>
      </Section>

      <Section title="Request form">
        <Text label="Form heading" value={form.formHeading} onChange={(v) => set("formHeading", v)} />
        <p className="text-xs text-hero-muted">
          Submitted requests appear under Bookings in this admin panel.
        </p>
      </Section>

      <Section title="Contact details">
        <Text label="Section heading" value={form.contactHeading} onChange={(v) => set("contactHeading", v)} />
        <Text label="Email" value={form.email} onChange={(v) => set("email", v)} />
        <Text label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
        <Text label="Hours" value={form.hours} onChange={(v) => set("hours", v)} />
        <Text
          label="Address (comma separated: street, unit, city, province postal)"
          value={form.address}
          onChange={(v) => set("address", v)}
        />
        <Text label="Service area" value={form.serviceArea} onChange={(v) => set("serviceArea", v)} />
        <Text label="Response time" value={form.responseTime} onChange={(v) => set("responseTime", v)} />
      </Section>

      <div className="sticky bottom-0 -mx-3 mt-6 flex items-center gap-4 border-t border-black/[0.06] bg-[#eef2f7]/95 px-3 py-4 backdrop-blur min-[400px]:-mx-4 min-[400px]:px-4 md:-mx-8 md:px-8">
        <button
          type="button"
          disabled={pending}
          onClick={save}
          className="rounded-xl bg-hero-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {message && (
          <p className={`text-sm ${message.ok ? "text-emerald-700" : "text-red-700"}`} role="status">
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
      <h2 className="font-display text-xl text-hero-navy">{title}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Text({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input className="input mt-1" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm">
      {label}
      <textarea
        className="input mt-1 resize-y"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
