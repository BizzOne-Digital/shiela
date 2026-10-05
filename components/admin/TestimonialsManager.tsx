"use client";

import { useState } from "react";
import { deleteTestimonial, saveTestimonial } from "@/lib/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export type TestimonialRow = {
  _id: string;
  clientName: string;
  clientRole?: string;
  text: string;
  displayOrder: number;
  published: boolean;
};

export function TestimonialsManager({ initial }: { initial: TestimonialRow[] }) {
  const [rows] = useState(initial);
  const [form, setForm] = useState<TestimonialRow | null>(null);
  const [message, setMessage] = useState("");

  const blank = (): TestimonialRow => ({
    _id: "",
    clientName: "",
    clientRole: "",
    text: "",
    displayOrder: rows.length + 1,
    published: false,
  });

  const save = async () => {
    if (!form) return;
    setMessage("");
    try {
      await saveTestimonial(form._id || null, {
        clientName: form.clientName,
        clientRole: form.clientRole,
        text: form.text,
        displayOrder: form.displayOrder,
        published: form.published,
      });
      setMessage("Saved.");
      window.location.reload();
    } catch {
      setMessage("Could not save.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await deleteTestimonial(id);
    window.location.reload();
  };

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Publish genuine, approved client feedback."
        action={
          <button
            type="button"
            onClick={() => setForm(blank())}
            className="rounded-xl bg-hero-navy px-5 py-2.5 text-sm font-semibold text-white"
          >
            + Add Testimonial
          </button>
        }
      />

      {message && <p className="mb-4 text-sm text-accent">{message}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
          {rows.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f1fa] text-3xl text-hero-navy/40">
                “
              </div>
              <p className="font-display mt-6 text-lg text-hero-navy">No testimonials yet</p>
              <p className="mt-2 text-sm text-hero-muted">Add an approved testimonial to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rows.map((t) => (
                <div key={t._id} className="rounded-xl border border-black/[0.06] p-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-semibold">{t.clientName}</p>
                      {t.clientRole && <p className="text-xs text-hero-muted">{t.clientRole}</p>}
                    </div>
                    <div className="flex gap-2 text-sm">
                      <button type="button" className="text-accent" onClick={() => setForm(t)}>Edit</button>
                      <button type="button" className="text-red-700" onClick={() => remove(t._id)}>Delete</button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-hero-navy/80">&ldquo;{t.text}&rdquo;</p>
                  <p className="mt-2 text-xs text-hero-muted">{t.published ? "Published" : "Draft"}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
          {form ? (
            <>
              <h2 className="font-display text-xl text-hero-navy">
                {form._id ? "Edit testimonial" : "New Testimonial"}
              </h2>
              <div className="mt-4 grid gap-4">
                <label className="text-sm">
                  Client Display Name
                  <input
                    className="input mt-1"
                    placeholder="e.g. Jane D."
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  />
                </label>
                <label className="text-sm">
                  Role / Company (optional)
                  <input
                    className="input mt-1"
                    placeholder="e.g. Business Owner, Durham"
                    value={form.clientRole ?? ""}
                    onChange={(e) => setForm({ ...form, clientRole: e.target.value })}
                  />
                </label>
                <label className="text-sm">
                  Testimonial
                  <textarea
                    className="input mt-1 min-h-[120px]"
                    placeholder="Enter the client's feedback..."
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                  />
                </label>
                <label className="text-sm">
                  Display Order
                  <input
                    type="number"
                    className="input mt-1"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                  />
                  <span className="mt-1 block text-xs text-hero-muted">Lower numbers appear first.</span>
                </label>
                <label className="flex items-center justify-between text-sm">
                  <span>{form.published ? "Publish" : "Draft"}</span>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  />
                </label>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={save}
                  className="rounded-xl bg-hero-navy px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {form.published ? "Save & Publish" : "Save Draft"}
                </button>
                <button type="button" onClick={() => setForm(null)} className="text-sm text-hero-muted">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-hero-muted">Select Add Testimonial or edit an existing entry.</p>
          )}
        </div>
      </div>
    </div>
  );
}
