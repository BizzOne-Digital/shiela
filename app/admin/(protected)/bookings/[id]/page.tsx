import { notFound } from "next/navigation";
import { connectMongo } from "@/lib/mongodb";
import { ServiceRequest } from "@/models/ServiceRequest";
import { BookingDetail } from "@/components/admin/BookingDetail";
import { guardAdmin } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await guardAdmin();
  const { id } = await params;
  await connectMongo();
  const doc = await ServiceRequest.findById(id).lean();
  if (!doc) notFound();
  const r = doc as NonNullable<typeof doc>;

  const booking = {
    _id: r._id.toString(),
    referenceNumber: r.referenceNumber,
    requesterType: r.requesterType,
    fullName: r.fullName,
    company: r.company ?? undefined,
    email: r.email,
    phone: r.phone,
    serviceAddress: r.serviceAddress,
    serviceCity: r.serviceCity,
    urgency: r.urgency,
    courtDeadline: r.courtDeadline?.toISOString().slice(0, 10),
    addOns: r.addOns ?? [],
    matterDetails: r.matterDetails,
    status: r.status,
    internalNotes: r.internalNotes ?? "",
    officeEmailStatus: r.officeEmailStatus,
    officeEmailError: r.officeEmailError ?? undefined,
    acknowledgementEmailStatus: r.acknowledgementEmailStatus,
    documents: r.documents.map((d) => ({
      originalName: d.originalName,
      storageKey: d.storageKey,
      sizeBytes: d.sizeBytes,
    })),
    createdAt: r.createdAt?.toISOString() ?? "",
  };

  return <BookingDetail booking={booking} />;
}
