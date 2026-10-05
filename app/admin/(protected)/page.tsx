import { connectMongo } from "@/lib/mongodb";
import { ServiceRequest } from "@/models/ServiceRequest";
import { Service } from "@/models/Service";
import { Testimonial } from "@/models/Testimonial";
import { guardAdmin } from "@/lib/admin/guard";
import { DashboardView } from "@/components/admin/DashboardView";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await guardAdmin();
  await connectMongo();

  const [total, newCount, inProgress, completed, services, testimonials, recent, failedEmail] =
    await Promise.all([
      ServiceRequest.countDocuments(),
      ServiceRequest.countDocuments({ status: "New" }),
      ServiceRequest.countDocuments({ status: "In Progress" }),
      ServiceRequest.countDocuments({ status: "Completed" }),
      Service.countDocuments({ active: true }),
      Testimonial.countDocuments({ published: true }),
      ServiceRequest.find().sort({ createdAt: -1 }).limit(8).lean(),
      ServiceRequest.countDocuments({ officeEmailStatus: "failed" }),
    ]);

  const stats = [
    { label: "Total Requests", value: total },
    { label: "New Requests", value: newCount },
    { label: "In Progress", value: inProgress },
    { label: "Completed", value: completed },
    { label: "Active Services", value: services },
    { label: "Published Testimonials", value: testimonials },
  ];

  const rows = recent.map((r) => ({
    id: r._id.toString(),
    referenceNumber: r.referenceNumber,
    fullName: r.fullName,
    services: r.services.map((s) => s.title).join(", "),
    urgency: r.urgency,
    status: r.status,
    createdAt: r.createdAt?.toISOString() ?? "",
  }));

  return (
    <DashboardView stats={stats} recent={rows} failedEmailCount={failedEmail} />
  );
}
