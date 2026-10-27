import Image from "next/image";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { IMAGES } from "@/lib/images";

type Row = {
  id: string;
  referenceNumber: string;
  fullName: string;
  urgency: string;
  status: string;
  createdAt: string;
};

const statIcons = ["📄", "➕", "⏱", "✓", "💬"];

export function DashboardView({
  stats,
  recent,
  failedEmailCount,
}: {
  stats: { label: string; value: number }[];
  recent: Row[];
  failedEmailCount: number;
}) {
  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Manage your page content and service requests."
      />

      <div className="mb-8 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">
        <div className="relative h-36 md:h-44">
          <Image src={IMAGES.adminDashboardBanner} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-hero-navy/85 via-hero-navy/50 to-transparent" />
          <div className="relative flex h-full flex-col justify-center px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Welcome back</p>
            <p className="font-display mt-1 text-2xl text-white md:text-3xl">Your office at a glance</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm"
          >
            <span className="text-lg" aria-hidden>{statIcons[i] ?? "•"}</span>
            <p className="mt-3 text-xs font-medium text-hero-muted">{s.label}</p>
            <p className="font-display mt-1 text-3xl text-hero-navy">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-black/[0.06] bg-white shadow-sm">
          <div className="border-b border-black/[0.05] px-6 py-4">
            <h2 className="font-display text-xl text-hero-navy">Recent Service Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#f8fafc] text-xs uppercase tracking-wide text-hero-muted">
                <tr>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Urgency</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-hero-muted">
                      No requests yet.
                    </td>
                  </tr>
                ) : (
                  recent.map((r) => (
                    <tr key={r.id} className="border-t border-black/[0.04]">
                      <td className="px-6 py-3 font-medium">{r.referenceNumber}</td>
                      <td className="px-4 py-3">{r.fullName}</td>
                      <td className="px-4 py-3">
                        <StatusPill value={r.urgency} kind="urgency" />
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill value={r.status} kind="status" />
                      </td>
                      <td className="px-4 py-3 text-hero-muted">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <Link
                          href={`/admin/bookings?id=${r.id}`}
                          className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-[#f4f7fb]"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
            <h3 className="font-display text-lg text-hero-navy">Office Notifications</h3>
            {failedEmailCount > 0 ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
                <p className="font-medium text-red-900">Email notification failed</p>
                <p className="mt-1 text-red-800/80">{failedEmailCount} request(s) need retry.</p>
                <Link
                  href="/admin/bookings"
                  className="mt-3 inline-block rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium"
                >
                  Retry
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-sm text-hero-muted">All office emails delivered.</p>
            )}
            <Link href="/admin/bookings" className="mt-4 inline-flex text-sm text-accent">
              View all notifications →
            </Link>
          </div>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
            <h3 className="font-display text-lg text-hero-navy">Quick Actions</h3>
            <Link
              href="/admin/content"
              className="mt-4 flex items-center justify-between rounded-xl bg-hero-navy px-4 py-3 text-sm font-medium text-white"
            >
              Edit Page Content <span>→</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="mt-3 flex items-center justify-between rounded-xl border border-black/15 px-4 py-3 text-sm font-medium"
            >
              View Bookings <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function StatusPill({ value, kind }: { value: string; kind: "urgency" | "status" }) {
  const v = value.toLowerCase();
  let cls = "bg-slate-100 text-slate-700";
  if (kind === "urgency") {
    if (v.includes("rush") || v.includes("priority")) cls = "bg-red-100 text-red-800";
    else if (v === "standard") cls = "bg-amber-100 text-amber-900";
    else cls = "bg-emerald-100 text-emerald-800";
  } else {
    if (v === "new") cls = "bg-blue-100 text-blue-800";
    if (v === "in progress") cls = "bg-amber-100 text-amber-900";
    if (v === "completed") cls = "bg-emerald-100 text-emerald-800";
    if (v === "cancelled") cls = "bg-red-100 text-red-800";
  }
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {value}
    </span>
  );
}
