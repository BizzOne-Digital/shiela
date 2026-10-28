import { BUSINESS } from "@/lib/constants";
import { escapeHtml, siteUrl } from "@/lib/utils";
import type { ServiceRequestDocument } from "@/models/ServiceRequest";
import { URGENCY_OPTIONS } from "@/lib/constants";
import { getStorage } from "@/lib/storage";
import { getMailTransport } from "@/lib/smtp";

function urgencyLabel(value: string) {
  return URGENCY_OPTIONS.find((u) => u.value === value)?.label ?? value;
}

export async function sendOfficeNotification(
  request: ServiceRequestDocument,
  adminDownloadBase?: string,
): Promise<{ ok: boolean; error?: string }> {
  const transport = getMailTransport();
  const to = process.env.OFFICE_EMAIL ?? BUSINESS.serviceRequestsEmail;
  if (!transport) {
    return { ok: false, error: "SMTP not configured" };
  }

  const storage = getStorage();
  const base = adminDownloadBase ?? siteUrl();
  const docLines: string[] = [];
  const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
  for (const doc of request.documents) {
    // Opens the PDF in the browser; the admin must be signed in.
    const link = `${base}/api/admin/documents?requestId=${request._id}&key=${encodeURIComponent(doc.storageKey)}&inline=1`;
    docLines.push(
      `<li>${escapeHtml(doc.originalName)} (${Math.round(doc.sizeBytes / 1024)} KB) — attached, or <a href="${escapeHtml(link)}">open in admin portal</a></li>`,
    );
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of await storage.getStream(doc.storageKey)) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      attachments.push({
        filename: doc.originalName,
        content: Buffer.concat(chunks),
        contentType: "application/pdf",
      });
    } catch {
      /* the portal link above still works */
    }
  }

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
      <li><strong>Location:</strong> ${escapeHtml(request.serviceAddress)}, ${escapeHtml(request.serviceCity)}</li>
      <li><strong>Urgency:</strong> ${escapeHtml(urgencyLabel(request.urgency))}</li>
      <li><strong>Court deadline:</strong> ${request.courtDeadline ? escapeHtml(request.courtDeadline.toISOString().slice(0, 10)) : "—"}</li>
      <li><strong>Add-ons:</strong> ${request.addOns?.length ? escapeHtml(request.addOns.join(", ")) : "—"}</li>
    </ul>
    <h3>Matter details</h3>
    <p style="white-space:pre-wrap">${escapeHtml(request.matterDetails)}</p>
    <h3>Documents</h3>
    ${docLines.length ? `<ul>${docLines.join("")}</ul>` : "<p>No documents uploaded.</p>"}
    <p><a href="${escapeHtml(base)}/admin/bookings?id=${request._id}">View in admin portal</a></p>
  `;

  const message = {
    from: process.env.SMTP_FROM ?? `Angel One Documents <${BUSINESS.infoEmail}>`,
    to,
    replyTo: request.email,
    subject: `[${request.referenceNumber}] New service request — ${request.fullName}`,
    html,
  };

  try {
    try {
      await transport.sendMail({ ...message, attachments });
    } catch (e) {
      // Some mail servers reject large attachments; resend with portal links only.
      if (!attachments.length) throw e;
      await transport.sendMail({
        ...message,
        html: `<p><em>PDFs could not be attached to this email — open them from the links below or the admin portal.</em></p>${html}`,
      });
    }
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Send failed";
    return { ok: false, error: message };
  }
}

export async function sendAcknowledgement(
  request: ServiceRequestDocument,
): Promise<{ ok: boolean; error?: string }> {
  const transport = getMailTransport();
  if (!transport) {
    return { ok: false, error: "SMTP not configured" };
  }

  const html = `
    <p>Hello ${escapeHtml(request.fullName)},</p>
    <p>Thank you for contacting ${escapeHtml(BUSINESS.shortName)}. We have received your service request and appreciate your business.</p>
    <p><strong>Reference number:</strong> ${escapeHtml(request.referenceNumber)}</p>
    <p>Our office will review your requirements and contact you regarding pricing and availability. Submitting this form does not confirm acceptance of service.</p>
    <p>If you need to reach us: <a href="tel:+19052137809">${BUSINESS.phone}</a> · <a href="mailto:${BUSINESS.receptionEmail}">${BUSINESS.receptionEmail}</a></p>
    <p>${escapeHtml(BUSINESS.address.full)}</p>
  `;

  try {
    const ackFrom =
      process.env.SMTP_ACK_FROM ??
      `Angel One Documents <${BUSINESS.receptionEmail}>`;

    await transport.sendMail({
      from: ackFrom,
      to: request.email,
      replyTo: BUSINESS.receptionEmail,
      subject: `Thank you — request received (${request.referenceNumber})`,
      html,
    });
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Send failed";
    return { ok: false, error: message };
  }
}
