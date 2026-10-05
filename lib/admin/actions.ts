"use server";

import { revalidatePath } from "next/cache";
import { connectMongo } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth/session";
import { Service } from "@/models/Service";
import { Testimonial } from "@/models/Testimonial";
import { ServiceRequest } from "@/models/ServiceRequest";
import { ICON_KEYS, REQUEST_STATUSES, type IconKey } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { sendOfficeNotification } from "@/lib/email";
import { getStorage } from "@/lib/storage";
import { z } from "zod";

async function guard() {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createService(data: {
  title: string;
  description: string;
  iconKey: string;
  displayOrder: number;
  active: boolean;
}) {
  await guard();
  await connectMongo();
  if (!ICON_KEYS.includes(data.iconKey as IconKey)) throw new Error("Invalid icon");
  await Service.create({
    title: data.title,
    slug: slugify(data.title),
    description: data.description,
    iconKey: data.iconKey as IconKey,
    displayOrder: data.displayOrder,
    active: data.active,
  });
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/services");
}

export async function updateService(
  id: string,
  data: {
    title: string;
    description: string;
    iconKey: string;
    displayOrder: number;
    active: boolean;
  },
) {
  await guard();
  await connectMongo();
  if (!ICON_KEYS.includes(data.iconKey as IconKey)) throw new Error("Invalid icon");
  await Service.findByIdAndUpdate(id, {
    title: data.title,
    slug: slugify(data.title),
    description: data.description,
    iconKey: data.iconKey as IconKey,
    displayOrder: data.displayOrder,
    active: data.active,
  });
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/services");
}

export async function deleteService(id: string) {
  await guard();
  await connectMongo();
  const inUse = await ServiceRequest.exists({ "services.serviceId": id });
  if (inUse) {
    await Service.findByIdAndUpdate(id, { active: false });
  } else {
    await Service.findByIdAndDelete(id);
  }
  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function updateBooking(
  id: string,
  data: { status: string; internalNotes: string },
) {
  await guard();
  if (!REQUEST_STATUSES.includes(data.status as (typeof REQUEST_STATUSES)[number])) {
    throw new Error("Invalid status");
  }
  await connectMongo();
  await ServiceRequest.findByIdAndUpdate(id, {
    status: data.status,
    internalNotes: data.internalNotes,
  });
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
}

export async function deleteBooking(id: string) {
  await guard();
  await connectMongo();
  const request = await ServiceRequest.findById(id);
  if (!request) return;
  const storage = getStorage();
  for (const doc of request.documents) {
    await storage.delete(doc.storageKey).catch(() => undefined);
  }
  await ServiceRequest.findByIdAndDelete(id);
  revalidatePath("/admin/bookings");
}

export async function retryOfficeEmail(id: string) {
  await guard();
  await connectMongo();
  const request = await ServiceRequest.findById(id);
  if (!request) throw new Error("Not found");
  const result = await sendOfficeNotification(request);
  request.officeEmailStatus = result.ok ? "sent" : "failed";
  request.officeEmailError = result.ok ? undefined : result.error;
  await request.save();
  revalidatePath(`/admin/bookings/${id}`);
  return { ok: result.ok, error: result.error };
}

const testimonialSchema = z.object({
  clientName: z.string().min(1),
  clientRole: z.string().optional(),
  text: z.string().min(1),
  displayOrder: z.number(),
  published: z.boolean(),
});

export async function saveTestimonial(
  id: string | null,
  data: z.infer<typeof testimonialSchema>,
) {
  await guard();
  const parsed = testimonialSchema.parse(data);
  await connectMongo();
  if (id) {
    await Testimonial.findByIdAndUpdate(id, parsed);
  } else {
    await Testimonial.create(parsed);
  }
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await guard();
  await connectMongo();
  await Testimonial.findByIdAndDelete(id);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}
