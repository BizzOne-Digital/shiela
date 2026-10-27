"use server";

import { revalidatePath } from "next/cache";
import { connectMongo } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth/session";
import { SiteContent } from "@/models/SiteContent";
import { Testimonial } from "@/models/Testimonial";
import { ServiceRequest } from "@/models/ServiceRequest";
import { REQUEST_STATUSES } from "@/lib/constants";
import { sendOfficeNotification } from "@/lib/email";
import { getStorage } from "@/lib/storage";
import { z } from "zod";

async function guard() {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized");
  return session;
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

const siteContentSchema = z.object({
  brandName: z.string().trim().min(1).max(100),
  heroTitle: z.string().trim().min(1).max(200),
  heroText: z.string().trim().max(2000),
  ctaLabel: z.string().trim().min(1).max(80),
  whoHeading: z.string().trim().max(100),
  whoBlocks: z
    .array(z.object({ title: z.string().trim().max(150), body: z.string().trim().max(3000) }))
    .max(10),
  formHeading: z.string().trim().min(1).max(100),
  contactHeading: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1).max(40),
  hours: z.string().trim().max(150),
  address: z.string().trim().min(1).max(300),
  serviceArea: z.string().trim().max(200),
  responseTime: z.string().trim().max(200),
});

export async function saveSiteContent(data: z.infer<typeof siteContentSchema>) {
  await guard();
  const parsed = siteContentSchema.parse(data);
  await connectMongo();
  await SiteContent.findOneAndUpdate(
    { key: "main" },
    { $set: { ...parsed, whoBlocks: parsed.whoBlocks.filter((b) => b.title || b.body) } },
    { upsert: true },
  );
  revalidatePath("/");
  revalidatePath("/admin/content");
}
