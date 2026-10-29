import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ServiceRequest } from "@/models/ServiceRequest";
import { serviceRequestBodySchema } from "@/lib/validation/service-request";
import { generateReferenceNumber } from "@/lib/utils";
import { sendAcknowledgement, sendOfficeNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await checkRateLimit(ip, "service-request", 8, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const raw = {
    requesterType: String(formData.get("requesterType") ?? ""),
    fullName: String(formData.get("fullName") ?? ""),
    company: String(formData.get("company") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    serviceAddress: String(formData.get("serviceAddress") ?? ""),
    serviceCity: String(formData.get("serviceCity") ?? ""),
    urgency: String(formData.get("urgency") ?? ""),
    courtDeadline: String(formData.get("courtDeadline") ?? ""),
    addOns: formData.getAll("addOns").map(String),
    matterDetails: String(formData.get("matterDetails") ?? ""),
    website: String(formData.get("website") ?? ""),
    idempotencyKey: String(formData.get("idempotencyKey") ?? ""),
  };

  const parsed = serviceRequestBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true, referenceNumber: "AOD-00000-00000" });
  }

  await connectMongo();

  const existing = await ServiceRequest.findOne({ idempotencyKey: parsed.data.idempotencyKey });
  if (existing) {
    return NextResponse.json({
      success: true,
      referenceNumber: existing.referenceNumber,
      duplicate: true,
    });
  }

  const referenceNumber = generateReferenceNumber();

  let courtDeadline: Date | undefined;
  if (parsed.data.courtDeadline) {
    const d = new Date(parsed.data.courtDeadline);
    if (!Number.isNaN(d.getTime())) courtDeadline = d;
  }

  try {
    const request = await ServiceRequest.create({
      referenceNumber,
      idempotencyKey: parsed.data.idempotencyKey,
      requesterType: parsed.data.requesterType,
      fullName: parsed.data.fullName,
      company: parsed.data.company || undefined,
      email: parsed.data.email,
      phone: parsed.data.phone?.trim() ? parsed.data.phone.trim() : "Not provided",
      serviceAddress: parsed.data.serviceAddress,
      serviceCity: parsed.data.serviceCity,
      urgency: parsed.data.urgency as "standard" | "priority" | "rush",
      courtDeadline,
      addOns: parsed.data.addOns ?? [],
      matterDetails: parsed.data.matterDetails,
      documents: [],
      status: "New" as const,
    });

    const officeResult = await sendOfficeNotification(request);
    request.officeEmailStatus = officeResult.ok ? "sent" : "failed";
    if (!officeResult.ok) request.officeEmailError = officeResult.error;

    const ackResult = await sendAcknowledgement(request);
    request.acknowledgementEmailStatus = ackResult.ok ? "sent" : "failed";
    if (!ackResult.ok) request.acknowledgementEmailError = ackResult.error;

    await request.save();

    return NextResponse.json({
      success: true,
      referenceNumber: request.referenceNumber,
      message:
        "Your request has been received. Our office will review your requirements and contact you. This does not confirm pricing, availability, or acceptance of service.",
    });
  } catch (e) {
    console.error("[service-requests] could not save request:", e);
    if (e && typeof e === "object" && "code" in e && e.code === 11000) {
      const dup = await ServiceRequest.findOne({ idempotencyKey: parsed.data.idempotencyKey });
      if (dup) {
        return NextResponse.json({
          success: true,
          referenceNumber: dup.referenceNumber,
          duplicate: true,
        });
      }
    }
    return NextResponse.json({ error: "Could not save request." }, { status: 500 });
  }
}
