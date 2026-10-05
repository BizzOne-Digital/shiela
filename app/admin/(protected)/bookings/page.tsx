import { connectMongo } from "@/lib/mongodb";
import { ServiceRequest } from "@/models/ServiceRequest";
import { BookingsWorkspace } from "@/components/admin/BookingsWorkspace";
import { guardAdmin } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; q?: string; status?: string }>;
}) {
  await guardAdmin();
  await connectMongo();
  const sp = await searchParams;

  const docs = await ServiceRequest.find().sort({ createdAt: -1 }).limit(100).lean();

  const bookings = docs.map((d) => ({
    _id: d._id.toString(),
    referenceNumber: d.referenceNumber,
    fullName: d.fullName,
    email: d.email,
    requesterType: d.requesterType,
    services: d.services.map((s) => s.title).join(", "),
    urgency: d.urgency,
    status: d.status,
    createdAt: d.createdAt?.toISOString() ?? "",
    officeEmailStatus: d.officeEmailStatus,
  }));

  const selectedDoc = sp.id ? docs.find((d) => d._id.toString() === sp.id) : docs[0];
  const selected = selectedDoc
    ? {
        _id: selectedDoc._id.toString(),
        referenceNumber: selectedDoc.referenceNumber,
        fullName: selectedDoc.fullName,
        email: selectedDoc.email,
        requesterType: selectedDoc.requesterType,
        services: selectedDoc.services.map((s) => s.title).join(", "),
        urgency: selectedDoc.urgency,
        status: selectedDoc.status,
        createdAt: selectedDoc.createdAt?.toISOString() ?? "",
        officeEmailStatus: selectedDoc.officeEmailStatus,
        phone: selectedDoc.phone,
        company: selectedDoc.company ?? undefined,
        serviceAddress: selectedDoc.serviceAddress,
        serviceCity: selectedDoc.serviceCity,
        addOns: selectedDoc.addOns ?? [],
        matterDetails: selectedDoc.matterDetails,
        internalNotes: selectedDoc.internalNotes ?? "",
        documents: selectedDoc.documents.map((doc) => ({
          originalName: doc.originalName,
          storageKey: doc.storageKey,
          sizeBytes: doc.sizeBytes,
        })),
      }
    : null;

  return (
    <BookingsWorkspace bookings={bookings} selected={selected} />
  );
}
