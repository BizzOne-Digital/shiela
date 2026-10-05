import { connectMongo } from "@/lib/mongodb";
import { seedServicesToDb } from "@/lib/seed-services";
import { Service } from "@/models/Service";
import { Testimonial } from "@/models/Testimonial";

export async function getActiveServices() {
  await connectMongo();
  let services = await Service.find({ active: true }).sort({ displayOrder: 1 }).lean();
  if (services.length === 0 && process.env.NODE_ENV === "development") {
    try {
      await seedServicesToDb();
      services = await Service.find({ active: true }).sort({ displayOrder: 1 }).lean();
    } catch {
      // DB unavailable during build or misconfigured env — public pages still render fallbacks.
    }
  }
  return services;
}

export async function getPublishedTestimonials() {
  await connectMongo();
  return Testimonial.find({ published: true }).sort({ displayOrder: 1 }).lean();
}
