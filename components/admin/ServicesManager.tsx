"use client";

import { useState } from "react";
import { ICON_KEYS } from "@/lib/constants";
import { createService, deleteService, updateService } from "@/lib/admin/actions";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export type ServiceRow = {
  _id: string;
  title: string;
  description: string;
  iconKey: string;
  displayOrder: number;
  active: boolean;
};

export function ServicesManager({ initial }: { initial: ServiceRow[] }) {
  const [services] = useState(initial);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    iconKey: "document",
    displayOrder: 0,
    active: true,
  });
  const [message, setMessage] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", description: "", iconKey: "document", displayOrder: services.length + 1, active: true });
    setShowEditor(true);
  };

  const openEdit = (s: ServiceRow) => {
    setEditing(s);
    setForm({
      title: s.title,
      description: s.description,
      iconKey: s.iconKey,
      displayOrder: s.displayOrder,
      active: s.active,
    });
    setShowEditor(true);
  };

  const save = async () => {
    setMessage("");
    try {
      if (editing) {
        await updateService(editing._id, form);
      } else {
        await createService(form);
      }
      setMessage("Saved.");
      window.location.reload();
    } catch {
      setMessage("Could not save.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete or deactivate this service?")) return;
    await deleteService(id);
    window.location.reload();
  };

  return (
    <div>
      <AdminPageHeader
        title="Manage Services"
        description="Add, edit, and organize the services shown on your website."
        action={
          <button type="button" onClick={openNew} className="rounded-xl bg-hero-navy px-5 py-2.5 text-sm font-semibold text-white">
            + Add Service
          </button>
        }
      />

      {message && <p className="mt-4 text-sm text-accent">{message}</p>}

      {showEditor && (
        <div className="mt-8 rounded-2xl border border-pale-gray bg-soft-white p-6">
          <h2 className="font-semibold">{editing ? "Edit service" : "New service"}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              Title
              <input className="input mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label className="text-sm">
              Display order
              <input
                type="number"
                className="input mt-1"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
              />
            </label>
            <label className="text-sm md:col-span-2">
              Description
              <textarea
                className="input mt-1 min-h-[80px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Icon
              <select
                className="input mt-1"
                value={form.iconKey}
                onChange={(e) => setForm({ ...form, iconKey: e.target.value })}
              >
                {ICON_KEYS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Active
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={save} className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-soft-white">
              Save
            </button>
            <button type="button" onClick={() => setShowEditor(false)} className="text-sm text-ink/60">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl border border-pale-gray/70 bg-soft-white">
        <table className="min-w-full text-sm">
          <thead className="bg-pale-blue/30 text-xs uppercase text-ink/55">
            <tr>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center">
                  <p className="text-hero-muted">No services in the database yet.</p>
                  <p className="mt-2 text-sm text-hero-muted">
                    Run{" "}
                    <code className="rounded bg-pale-blue/50 px-1.5 py-0.5 text-xs">npm run seed:services</code>{" "}
                    in the project folder, or refresh after seeding.
                  </p>
                  {process.env.NODE_ENV === "development" ? (
                    <button
                      type="button"
                      className="mt-4 rounded-xl bg-hero-navy px-5 py-2.5 text-sm font-semibold text-white"
                      onClick={async () => {
                        await fetch("/api/auth/seed-services", { method: "POST" });
                        window.location.reload();
                      }}
                    >
                      Load default services
                    </button>
                  ) : null}
                </td>
              </tr>
            ) : null}
            {services.map((s) => (
              <tr key={s._id} className="border-t border-pale-gray/40">
                <td className="px-4 py-3">{s.displayOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ServiceIcon iconKey={s.iconKey} className="h-6 w-6" />
                    <span className="font-medium">{s.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{s.active ? "Active" : "Inactive"}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" className="text-accent hover:text-ink" onClick={() => openEdit(s)}>
                    Edit
                  </button>
                  <button type="button" className="ml-3 text-red-700" onClick={() => remove(s._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
