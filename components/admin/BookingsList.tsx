"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { REQUEST_STATUSES, URGENCY_OPTIONS } from "@/lib/constants";

export type BookingRow = {
  _id: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  status: string;
  urgency: string;
  createdAt: string;
  services: string;
};

export function BookingsList({
  bookings,
  total,
  page,
  pageSize,
  services,
}: {
  bookings: BookingRow[];
  total: number;
  page: number;
  pageSize: number;
  services: { _id: string; title: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    router.push(`/admin/bookings?${next.toString()}`);
  };

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Bookings</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name, email, reference…"
          className="input max-w-xs"
          defaultValue={params.get("q") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") setParam("q", (e.target as HTMLInputElement).value);
          }}
        />
        <select
          className="input max-w-[180px]"
          value={params.get("status") ?? ""}
          onChange={(e) => setParam("status", e.target.value)}
        >
          <option value="">All statuses</option>
          {REQUEST_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="input max-w-[180px]"
          value={params.get("urgency") ?? ""}
          onChange={(e) => setParam("urgency", e.target.value)}
        >
          <option value="">All urgency</option>
          {URGENCY_OPTIONS.map((u) => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
        <select
          className="input max-w-[200px]"
          value={params.get("service") ?? ""}
          onChange={(e) => setParam("service", e.target.value)}
        >
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s._id} value={s._id}>{s.title}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-pale-gray/70 bg-soft-white">
        <table className="min-w-full text-sm">
          <thead className="bg-pale-blue/30 text-xs uppercase text-ink/55">
            <tr>
              <th className="px-4 py-3 text-left">Reference</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Services</th>
              <th className="px-4 py-3 text-left">Urgency</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink/50">No bookings found.</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} className="border-t border-pale-gray/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${b._id}`} className="font-medium text-accent">
                      {b.referenceNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div>{b.fullName}</div>
                    <div className="text-xs text-ink/55">{b.email}</div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate">{b.services}</td>
                  <td className="px-4 py-3">{b.urgency}</td>
                  <td className="px-4 py-3">{b.status}</td>
                  <td className="px-4 py-3 text-ink/60">{new Date(b.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-ink/60">Page {page} of {pages} ({total} total)</span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            className="rounded-lg border border-pale-gray px-3 py-1 disabled:opacity-40"
            onClick={() => setParam("page", String(page - 1))}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= pages}
            className="rounded-lg border border-pale-gray px-3 py-1 disabled:opacity-40"
            onClick={() => setParam("page", String(page + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
