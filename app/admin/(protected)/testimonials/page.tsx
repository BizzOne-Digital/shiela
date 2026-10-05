import { connectMongo } from "@/lib/mongodb";
import { Testimonial } from "@/models/Testimonial";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { guardAdmin } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  await guardAdmin();
  await connectMongo();
  const items = await Testimonial.find().sort({ displayOrder: 1 }).lean();
  const rows = items.map((t) => ({
    _id: t._id.toString(),
    clientName: t.clientName,
    clientRole: t.clientRole ?? undefined,
    text: t.text,
    displayOrder: t.displayOrder,
    published: t.published,
  }));
  return <TestimonialsManager initial={rows} />;
}
