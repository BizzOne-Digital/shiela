"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { deleteBooking, retryOfficeEmail, updateBooking } from "@/lib/admin/actions";
import { REQUEST_STATUSES } from "@/lib/constants";

export type BookingListItem = {
  _id: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  requesterType: string;
  urgency: string;
  status: string;
  createdAt: string;
  officeEmailStatus: string;
};

export type BookingDetail = BookingListItem & {
  phone: string;
  company?: string;
  serviceAddress: string;
  serviceCity: string;
  addOns: string[];
  matterDetails: string;
  internalNotes: string;
  documents: { originalName: string; storageKey: string; sizeBytes: number }[];
};

export function BookingsWorkspace({
  bookings,
  selected,
}: {
  bookings: BookingListItem[];
  selected: BookingDetail | null;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [status, setStatus] = useState(params.get("status") ?? "");
  const [notes, setNotes] = useState(selected?.internalNotes ?? "");
  const [statusVal, setStatusVal] = useState(selected?.status ?? "New");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return bookings.filter((b) => {
      if (status && b.status !== status) return false;
      if (!term) return true;
      return (
        b.referenceNumber.toLowerCase().includes(term) ||
        b.fullName.toLowerCase().includes(term) ||
        b.email.toLowerCase().includes(term)
      );
    });
  }, [bookings, q, status]);

  const select = (id: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("id", id);
    router.push(`/admin/bookings?${next.toString()}`);
  };

  const save = () => {
    if (!selected) return;
    startTransition(async () => {
      await updateBooking(selected._id, { status: statusVal, internalNotes: notes });
      router.refresh();
    });
  };

  const retry = () => {
    if (!selected) return;
    startTransition(async () => {
      await retryOfficeEmail(selected._id);
      router.refresh();
    });
  };

  return (
    <>
      <AdminPageHeader
        title="Service Requests"
        description="View and manage incoming service requests."
        action={
          <span className="text-xs text-hero-muted">{filtered.length} requests</span>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-black/[0.06] bg-white shadow-sm">
          <div className="border-b border-black/[0.05] p-4 space-y-3">
            <input
              type="search"
              placeholder="Search by request ID, client name, or email..."
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <select className="input max-w-[160px]" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Statuses</option>
                {REQUEST_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="max-h-[70vh] overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-[#f8fafc] text-xs uppercase text-hero-muted">
                <tr>
                  <th className="px-4 py-2 text-left">Request ID</th>
                  <th className="px-3 py-2 text-left">Client</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr
                    key={b._id}
                    onClick={() => select(b._id)}
                    className={`cursor-pointer border-t border-black/[0.04] ${
                      selected?._id === b._id ? "bg-[#e8f1fa]" : "hover:bg-[#f4f7fb]"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">{b.referenceNumber}</td>
                    <td className="px-3 py-3">{b.fullName}</td>
                    <td className="px-3 py-3">{b.status}</td>
                    <td className="px-3 py-3 text-hero-muted">
                      {new Date(b.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
          {!selected ? (
            <p className="text-sm text-hero-muted">Select a request to view details.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="font-display text-xl text-hero-navy">{selected.referenceNumber}</h2>
                <select
                  className="input max-w-[180px]"
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                >
                  {REQUEST_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4 rounded-xl bg-[#f4f7fb] p-4 text-sm">
                <p className="font-semibold">{selected.fullName}</p>
                <p className="text-hero-muted">{selected.requesterType}</p>
                {selected.company && <p className="text-hero-muted">{selected.company}</p>}
                <a href={`mailto:${selected.email}`} className="text-accent">{selected.email}</a>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-hero-muted">Location</dt><dd>{selected.serviceCity}</dd></div>
                <div><dt className="text-hero-muted">Urgency</dt><dd className="capitalize">{selected.urgency}</dd></div>
                <div><dt className="text-hero-muted">Phone</dt><dd>{selected.phone}</dd></div>
              </dl>
              {selected.addOns.length > 0 && (
                <p className="mt-3 text-sm"><span className="text-hero-muted">Add-ons: </span>{selected.addOns.join(", ")}</p>
              )}
              <p className="mt-4 text-sm whitespace-pre-wrap text-hero-navy/85">{selected.matterDetails}</p>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-hero-muted">Documents</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {selected.documents.length === 0 ? (
                    <li className="text-hero-muted">None</li>
                  ) : (
                    selected.documents.map((d) => (
                      <li key={d.storageKey} className="flex flex-wrap items-center gap-x-3">
                        <span className="break-all">{d.originalName}</span>
                        <a
                          className="font-medium text-accent"
                          href={`/api/admin/documents?requestId=${selected._id}&key=${encodeURIComponent(d.storageKey)}&inline=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open
                        </a>
                        <a
                          className="text-accent"
                          href={`/api/admin/documents?requestId=${selected._id}&key=${encodeURIComponent(d.storageKey)}`}
                        >
                          Download
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <label className="mt-4 block text-sm">
                Internal notes
                <textarea className="input mt-1 min-h-[90px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </label>
              {selected.officeEmailStatus === "failed" && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
                  <p className="font-medium text-red-900">Office email: Failed</p>
                  <button type="button" onClick={retry} className="mt-2 rounded-lg border bg-white px-3 py-1.5 text-xs">
                    Retry Email
                  </button>
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={pending}
                  onClick={save}
                  className="rounded-xl bg-hero-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="text-sm text-red-700"
                  onClick={() => {
                    if (confirm("Delete this request and documents?")) {
                      startTransition(async () => {
                        await deleteBooking(selected._id);
                        router.push("/admin/bookings");
                        router.refresh();
                      });
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
