import "./load-env";
import { getMailTransport, verifySmtpConnection } from "../lib/smtp";

async function main() {
  const verify = await verifySmtpConnection();
  if (!verify.ok) {
    console.error("SMTP verify failed:", verify.error);
    console.error(
      "Check SMTP_USER, SMTP_APP_PASS (or SMTP_PASS), SMTP_HOST, and SMTP_PORT. " +
        "For Gmail use smtp.gmail.com with a Google App Password (2-Step Verification on).",
    );
    process.exit(1);
  }
  console.log("SMTP connection OK.");

  const to = process.env.SMTP_TEST_TO ?? process.env.OFFICE_EMAIL ?? process.env.SMTP_USER;
  if (!to) {
    console.log("Set SMTP_TEST_TO or OFFICE_EMAIL to send a test message.");
    return;
  }

  const transport = getMailTransport();
  if (!transport) {
    console.error("No transport.");
    process.exit(1);
  }

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  await transport.sendMail({
    from,
    to,
    subject: "Angel One Documents — SMTP test",
    text: "If you received this, SMTP is configured correctly.",
  });
  console.log(`Test email sent to ${to}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
