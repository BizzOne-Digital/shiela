import nodemailer from "nodemailer";
import { BUSINESS } from "@/lib/constants";
import { escapeHtml, siteUrl } from "@/lib/utils";
import type { ServiceRequestDocument } from "@/models/ServiceRequest";
import { URGENCY_OPTIONS } from "@/lib/constants";
import { getStorage } from "@/lib/storage";

function getTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
}

function urgencyLabel(value: string) {
  return URGENCY_OPTIONS.find((u) => u.value === value)?.label ?? value;
}

export async function sendOfficeNotification(
  request: ServiceRequestDocument,
  adminDownloadBase?: string,
): Promise<{ ok: boolean; error?: string }> {
  const transport = getTransport();
  const to = process.env.OFFICE_EMAIL ?? BUSINESS.receptionEmail;
  if (!transport) {
    return { ok: false, error: "SMTP not configured" };
  }

  const storage = getStorage();
  const docLines: string[] = [];
  for (const doc of request.documents) {
    let link = `${adminDownloadBase ?? siteUrl()}/admin/bookings/${request._id}?doc=${encodeURIComponent(doc.storageKey)}`;
    if (storage.getSignedDownloadUrl) {
      try {
        link = await storage.getSignedDownloadUrl(doc.storageKey, 60 * 60 * 24 * 7);
      } catch {
        /* use admin link */
      }
    }
    docLines.push(
      `<li>${escapeHtml(doc.originalName)} (${Math.round(doc.sizeBytes / 1024)} KB) — <a href="${escapeHtml(link)}">Secure access</a></li>`,
    );
  }

  const services = request.services.map((s) => escapeHtml(s.title)).join(", ");
  const html = `
    <h2>New service request — ${escapeHtml(request.referenceNumber)}</h2>
    <p><strong>Status:</strong> ${escapeHtml(request.status)}</p>
    <h3>Contact</h3>
    <ul>
      <li><strong>Type:</strong> ${escapeHtml(request.requesterType)}</li>
      <li><strong>Name:</strong> ${escapeHtml(request.fullName)}</li>
      <li><strong>Company:</strong> ${escapeHtml(request.company || "—")}</li>
      <li><strong>Email:</strong> ${escapeHtml(request.email)}</li>
      <li><strong>Phone:</strong> ${escapeHtml(request.phone)}</li>
    </ul>
    <h3>Service details</h3>
    <ul>
      <li><strong>Services:</strong> ${services}</li>
      <li><strong>Location:</strong> ${escapeHtml(request.serviceAddress)}, ${escapeHtml(request.serviceCity)}</li>
      <li><strong>Urgency:</strong> ${escapeHtml(urgencyLabel(request.urgency))}</li>
      <li><strong>Court deadline:</strong> ${request.courtDeadline ? escapeHtml(request.courtDeadline.toISOString().slice(0, 10)) : "—"}</li>
      <li><strong>Add-ons:</strong> ${request.addOns?.length ? escapeHtml(request.addOns.join(", ")) : "—"}</li>
    </ul>
    <h3>Matter details</h3>
    <p style="white-space:pre-wrap">${escapeHtml(request.matterDetails)}</p>
    <h3>Documents</h3>
    ${docLines.length ? `<ul>${docLines.join("")}</ul>` : "<p>No documents uploaded.</p>"}
    <p><a href="${escapeHtml(siteUrl())}/admin/bookings/${request._id}">View in admin portal</a></p>
  `;

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM ?? `noreply@angelonedocuments.com`,
      to,
      replyTo: request.email,
      subject: `[${request.referenceNumber}] New service request — ${request.fullName}`,
      html,
    });
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Send failed";
    return { ok: false, error: message };
  }
}

export async function sendAcknowledgement(
  request: ServiceRequestDocument,
): Promise<{ ok: boolean; error?: string }> {
  const transport = getTransport();
  if (!transport) {
    return { ok: false, error: "SMTP not configured" };
  }

  const html = `
    <p>Hello ${escapeHtml(request.fullName)},</p>
    <p>Thank you for contacting ${escapeHtml(BUSINESS.shortName)}. We have received your service request.</p>
    <p><strong>Reference number:</strong> ${escapeHtml(request.referenceNumber)}</p>
    <p>Our office will review your requirements and contact you regarding pricing and availability. Submitting this form does not confirm acceptance of service.</p>
    <p>If you need to reach us: <a href="tel:+19052137809">${BUSINESS.phone}</a> · <a href="mailto:${BUSINESS.receptionEmail}">${BUSINESS.receptionEmail}</a></p>
    <p>${escapeHtml(BUSINESS.address.full)}</p>
  `;

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM ?? `noreply@angelonedocuments.com`,
      to: request.email,
      subject: `Request received — ${request.referenceNumber}`,
      html,
    });
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Send failed";
    return { ok: false, error: message };
  }
}
