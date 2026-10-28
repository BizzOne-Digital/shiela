"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REQUEST_STATUSES, URGENCY_OPTIONS } from "@/lib/constants";
import { deleteBooking, retryOfficeEmail, updateBooking } from "@/lib/admin/actions";

export type BookingDetailData = {
  _id: string;
  referenceNumber: string;
  requesterType: string;
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  serviceAddress: string;
  serviceCity: string;
  urgency: string;
  courtDeadline?: string;
  addOns: string[];
  matterDetails: string;
  status: string;
  internalNotes: string;
  officeEmailStatus: string;
  officeEmailError?: string;
  acknowledgementEmailStatus: string;
  documents: { originalName: string; storageKey: string; sizeBytes: number }[];
  createdAt: string;
};

export function BookingDetail({ booking }: { booking: BookingDetailData }) {
  const router = useRouter();
  const [status, setStatus] = useState(booking.status);
  const [notes, setNotes] = useState(booking.internalNotes);
  const [msg, setMsg] = useState("");

  const urgencyLabel =
    URGENCY_OPTIONS.find((u) => u.value === booking.urgency)?.label ?? booking.urgency;

  const save = async () => {
    await updateBooking(booking._id, { status, internalNotes: notes });
    setMsg("Saved.");
  };

  const retry = async () => {
    const res = await retryOfficeEmail(booking._id);
    setMsg(res.ok ? "Office email sent." : res.error ?? "Retry failed.");
  };

  const remove = async () => {
    if (!confirm("Permanently delete this request and its documents?")) return;
    await deleteBooking(booking._id);
    router.push("/admin/bookings");
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl text-ink">{booking.referenceNumber}</h1>
      <p className="mt-1 text-sm text-ink/60">Submitted {new Date(booking.createdAt).toLocaleString()}</p>

      {msg && <p className="mt-4 text-sm text-accent">{msg}</p>}

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <InfoCard title="Contact">
          <p>{booking.fullName}</p>
          <p className="text-sm text-ink/70">{booking.requesterType}</p>
          {booking.company && <p className="text-sm">{booking.company}</p>}
          <p className="mt-2 text-sm"><a href={`mailto:${booking.email}`}>{booking.email}</a></p>
          <p className="text-sm">{booking.phone}</p>
        </InfoCard>
        <InfoCard title="Service">
          <p className="text-sm">{booking.serviceAddress}, {booking.serviceCity}</p>
          <p className="mt-2 text-sm">Urgency: {urgencyLabel}</p>
          {booking.courtDeadline && <p className="text-sm">Court deadline: {booking.courtDeadline}</p>}
          {booking.addOns.length > 0 && (
            <p className="mt-2 text-sm">Add-ons: {booking.addOns.join(", ")}</p>
          )}
        </InfoCard>
      </section>

      <section className="mt-6 rounded-xl border border-pale-gray bg-soft-white p-6">
        <h2 className="font-semibold">Matter details</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-ink/80">{booking.matterDetails}</p>
      </section>

      <section className="mt-6 rounded-xl border border-pale-gray bg-soft-white p-6">
        <h2 className="font-semibold">Documents</h2>
        {booking.documents.length === 0 ? (
          <p className="mt-2 text-sm text-ink/50">No documents.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {booking.documents.map((d) => (
              <li key={d.storageKey}>
                <span>{d.originalName}</span>
                <span className="text-ink/50"> ({Math.round(d.sizeBytes / 1024)} KB)</span>
                <span className="ml-3 space-x-3">
                  <a
                    className="font-medium text-accent hover:text-ink"
                    href={`/api/admin/documents?requestId=${booking._id}&key=${encodeURIComponent(d.storageKey)}&inline=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                  <a
                    className="text-accent hover:text-ink"
                    href={`/api/admin/documents?requestId=${booking._id}&key=${encodeURIComponent(d.storageKey)}`}
                  >
                    Download
                  </a>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-pale-gray bg-soft-white p-6">
        <h2 className="font-semibold">Office notification</h2>
        <p className="mt-2 text-sm">
          Status: {booking.officeEmailStatus}
          {booking.officeEmailError && ` — ${booking.officeEmailError}`}
        </p>
        <p className="text-sm">Acknowledgement: {booking.acknowledgementEmailStatus}</p>
        {booking.officeEmailStatus === "failed" && (
          <button type="button" onClick={retry} className="mt-3 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-soft-white">
            Retry office email
          </button>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-pale-gray bg-soft-white p-6">
        <h2 className="font-semibold">Internal</h2>
        <label className="mt-3 block text-sm">
          Status
          <select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value)}>
            {REQUEST_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="mt-4 block text-sm">
          Internal notes (not visible to clients)
          <textarea className="input mt-1 min-h-[100px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={save} className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-soft-white">
            Save changes
          </button>
          <button type="button" onClick={remove} className="text-sm text-red-700">
            Delete request
          </button>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-pale-gray bg-soft-white p-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-ink/50">{title}</h2>
      <div className="mt-3 text-sm text-ink">{children}</div>
    </div>
  );
}
