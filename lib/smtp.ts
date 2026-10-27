import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

/** TekSavvy-hosted domain mail: smtp.teksavvy.com:587 (STARTTLS) or :465 (SSL). */
export function getSmtpPassword(): string | undefined {
  const app = process.env.SMTP_APP_PASS?.trim();
  if (app) return app;
  const pass = process.env.SMTP_PASS?.trim();
  return pass || undefined;
}

export function getMailTransport(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) return null;

  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure =
    process.env.SMTP_SECURE === "true" || (process.env.SMTP_SECURE !== "false" && port === 465);
  const user = process.env.SMTP_USER?.trim();
  const pass = getSmtpPassword();

  const tlsServername = process.env.SMTP_TLS_SERVERNAME?.trim();

  return nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      minVersion: "TLSv1.2",
      ...(tlsServername ? { servername: tlsServername } : {}),
    },
  });
}

export async function verifySmtpConnection(): Promise<{ ok: true } | { ok: false; error: string }> {
  const transport = getMailTransport();
  if (!transport) {
    return { ok: false, error: "SMTP_HOST is not set." };
  }
  try {
    await transport.verify();
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "SMTP verify failed";
    return { ok: false, error: message };
  }
}
