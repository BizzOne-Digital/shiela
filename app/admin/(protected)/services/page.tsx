import { connectMongo } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { guardAdmin } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  await guardAdmin();
  await connectMongo();
  const services = await Service.find().sort({ displayOrder: 1 }).lean();
  const rows = services.map((s) => ({
    _id: s._id.toString(),
    title: s.title,
    description: s.description,
    iconKey: s.iconKey,
    displayOrder: s.displayOrder,
    active: s.active,
  }));
  return <ServicesManager initial={rows} />;
}
