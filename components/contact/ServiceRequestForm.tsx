"use client";

import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { BUSINESS, MATTER_DETAILS_MAX, REQUESTER_TYPES } from "@/lib/constants";

const REQUESTER_LABELS: Record<(typeof REQUESTER_TYPES)[number], string> = {
  "Legal Professional": "Legal professional (lawyer, paralegal, law office)",
  "Small Business": "Small business",
  "Member of the Public": "Member of the public / self-represented",
};

type FormState = {
  requesterType: string;
  company: string;
  fullName: string;
  email: string;
  phone: string;
  serveFileBy: string;
  styleOfCause: string;
  courtCourthouse: string;
  documentsDescription: string;
  personToServe: string;
  serviceAddress: string;
  instructions: string;
};

const initial: FormState = {
  requesterType: "",
  company: "",
  fullName: "",
  email: "",
  phone: "",
  serveFileBy: "",
  styleOfCause: "",
  courtCourthouse: "",
  documentsDescription: "",
  personToServe: "",
  serviceAddress: "",
  instructions: "",
};

function buildMatterDetails(form: FormState): string {
  const parts: string[] = [];
  if (form.styleOfCause.trim()) {
    parts.push(`Style of cause & court file number:\n${form.styleOfCause.trim()}`);
  }
  if (form.documentsDescription.trim()) {
    parts.push(`Documents to serve / file:\n${form.documentsDescription.trim()}`);
  }
  if (form.personToServe.trim()) {
    parts.push(`Person / corporation to be served:\n${form.personToServe.trim()}`);
  }
  if (form.instructions.trim()) {
    parts.push(`Instructions & description:\n${form.instructions.trim()}`);
  }
  return parts.join("\n\n");
}

/** Opens the sender's email app addressed to reception, with the request reference in the subject. */
function documentsMailto(reference: string, form: FormState) {
  const subject = `Documents for request ${reference}`;
  const lines = [
    "Hello,",
    "",
    `Please find my documents attached for service request ${reference}.`,
    "",
    `Name: ${form.fullName.trim()}`,
    `Email: ${form.email.trim()}`,
  ];
  if (form.phone.trim()) lines.push(`Phone: ${form.phone.trim()}`);
  lines.push("", "Thank you.");
  const body = lines.join("\n");
  const to = BUSINESS.receptionEmail;
  const q = (v: string) => encodeURIComponent(v);
  return {
    subject,
    href: `mailto:${to}?subject=${q(subject)}&body=${q(body)}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${q(to)}&su=${q(subject)}&body=${q(body)}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${q(to)}&subject=${q(subject)}&body=${q(body)}`,
  };
}

export function ServiceRequestForm({ embedded = false }: { embedded?: boolean }) {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const idempotencyKey = useMemo(() => nanoid(24), []);

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.requesterType) e.requesterType = "Please tell us who you are.";
    if (!form.fullName.trim()) e.fullName = "Required.";
    if (!form.email.trim()) e.email = "Required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email.";
    if (!form.serveFileBy) e.serveFileBy = "Required.";
    if (!form.serviceAddress.trim()) e.serviceAddress = "Required.";
    if (!form.courtCourthouse.trim()) e.courtCourthouse = "Required.";
    const matterDetails = buildMatterDetails(form);
    if (!matterDetails.trim() || matterDetails.length < 10) {
      e.instructions = "Please add instructions or other matter details (at least 10 characters).";
    }
    if (matterDetails.length > MATTER_DETAILS_MAX) {
      e.instructions = `Combined details must be under ${MATTER_DETAILS_MAX} characters.`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    const body = new FormData();
    body.append("requesterType", form.requesterType);
    body.append("fullName", form.fullName.trim());
    body.append("company", form.company.trim());
    body.append("email", form.email.trim());
    body.append("phone", form.phone.trim());
    body.append("serviceAddress", form.serviceAddress.trim());
    body.append("serviceCity", form.courtCourthouse.trim());
    body.append("urgency", "standard");
    body.append("courtDeadline", form.serveFileBy);
    body.append("matterDetails", buildMatterDetails(form));
    body.append("idempotencyKey", idempotencyKey);
    body.append("website", "");

    try {
      const res = await fetch("/api/service-requests", { method: "POST", body });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        setSubmitError(data?.error ?? `Submission failed (error ${res.status}). Please try again.`);
        return;
      }
      setSuccess(data.referenceNumber);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    const mail = documentsMailto(success, form);
    return (
      <div className="rounded-xl border border-pale-gray/70 bg-white p-6 text-center md:p-8">
        <h2 className="text-xl font-bold text-hero-navy">Request received</h2>
        <p className="mt-4 text-sm text-hero-navy/80">
          Reference: <strong>{success}</strong>
        </p>
        <p className="mt-4 text-sm text-hero-muted">
          Thank you — a confirmation will be sent from {BUSINESS.receptionEmail}. Our team will review your
          request and contact you, usually within one business day.
        </p>

        <div className="mt-6 rounded-xl border border-[#5D8AB4]/40 bg-[#E3F0FB]/60 p-5 text-left">
          <h3 className="text-base font-bold text-[#35546C]">Next step: send us your documents</h3>
          <p className="mt-2 text-sm leading-relaxed text-hero-navy/85">
            Click the button below to open your email with the message already filled in (or use one of the options under it). Attach your PDF
            documents to that email and press send. Please keep the reference number in the subject line so we
            can match your documents to this request.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={mail.href}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#5D8AB4] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#4f7aa3]"
            >
              Open my email to send documents
            </a>
          </div>
          <p className="mt-4 text-sm font-semibold text-[#35546C]">
            Nothing happened? Use one of these instead:
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <a
              href={mail.gmail}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#5D8AB4] bg-white px-5 py-2.5 text-sm font-medium text-[#35546C] hover:bg-[#E3F0FB]"
            >
              Write it in Gmail
            </a>
            <a
              href={mail.outlook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#5D8AB4] bg-white px-5 py-2.5 text-sm font-medium text-[#35546C] hover:bg-[#E3F0FB]"
            >
              Write it in Outlook.com
            </a>
          </div>
          <div className="mt-4 rounded-lg border border-pale-gray/80 bg-white p-4 text-sm">
            <p className="text-hero-navy/85">Or open any email account yourself and send your PDFs to:</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <strong className="break-all">{BUSINESS.receptionEmail}</strong>
              <button
                type="button"
                onClick={() => copy("email", BUSINESS.receptionEmail)}
                className="text-xs font-semibold text-[#5D8AB4] underline"
              >
                {copied === "email" ? "Copied" : "Copy address"}
              </button>
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                Subject: <strong>{mail.subject}</strong>
              </span>
              <button
                type="button"
                onClick={() => copy("subject", mail.subject)}
                className="text-xs font-semibold text-[#5D8AB4] underline"
              >
                {copied === "subject" ? "Copied" : "Copy subject"}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const shellClass = embedded
    ? "min-w-0 rounded-xl border border-pale-gray/70 bg-white p-5 md:p-6"
    : "min-w-0 rounded-2xl border border-pale-gray/80 bg-soft-white p-4 shadow-sm sm:p-6 md:p-8";

  return (
    <div className={shellClass}>
      <div className="space-y-5">
        <Field label="I am a" error={errors.requesterType}>
          <select
            className="input"
            value={form.requesterType}
            onChange={(e) => update({ requesterType: e.target.value })}
          >
            <option value="">Select...</option>
            {REQUESTER_TYPES.map((t) => (
              <option key={t} value={t}>{REQUESTER_LABELS[t]}</option>
            ))}
          </select>
        </Field>

        <Field label="Law office / firm / company (optional)" error={errors.company}>
          <input
            className="input"
            value={form.company}
            onChange={(e) => update({ company: e.target.value })}
            autoComplete="organization"
          />
        </Field>

        <Field label="Full name" error={errors.fullName}>
          <input
            className="input"
            value={form.fullName}
            onChange={(e) => update({ fullName: e.target.value })}
            autoComplete="name"
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
            autoComplete="email"
          />
        </Field>

        <Field label="Phone (optional)">
          <input
            type="tel"
            className="input"
            value={form.phone}
            onChange={(e) => update({ phone: e.target.value })}
            autoComplete="tel"
          />
        </Field>

        <Field label="Serve / file by" error={errors.serveFileBy}>
          <input
            type="date"
            className="input"
            value={form.serveFileBy}
            onChange={(e) => update({ serveFileBy: e.target.value })}
          />
        </Field>

        <Field label="Style of cause & court file number">
          <input
            className="input"
            value={form.styleOfCause}
            onChange={(e) => update({ styleOfCause: e.target.value })}
          />
        </Field>

        <Field label="Court / courthouse" error={errors.courtCourthouse}>
          <input
            className="input"
            value={form.courtCourthouse}
            onChange={(e) => update({ courtCourthouse: e.target.value })}
          />
        </Field>

        <Field label="Documents to serve / file">
          <input
            className="input"
            value={form.documentsDescription}
            onChange={(e) => update({ documentsDescription: e.target.value })}
          />
        </Field>

        <Field label="Person / corporation to be served">
          <input
            className="input"
            value={form.personToServe}
            onChange={(e) => update({ personToServe: e.target.value })}
          />
        </Field>

        <Field label="Service address" error={errors.serviceAddress}>
          <input
            className="input"
            value={form.serviceAddress}
            onChange={(e) => update({ serviceAddress: e.target.value })}
            autoComplete="street-address"
          />
        </Field>

        <Field label="Instructions & description" error={errors.instructions}>
          <textarea
            className="input min-h-[140px] resize-y"
            placeholder="Description of recipient, best times, gate codes, filing instructions..."
            maxLength={MATTER_DETAILS_MAX}
            value={form.instructions}
            onChange={(e) => update({ instructions: e.target.value })}
          />
        </Field>

        <div className="rounded-xl border border-[#5D8AB4]/40 bg-[#E3F0FB]/60 p-4">
          <p className="text-sm font-bold text-[#35546C]">Sending your PDF documents</p>
          <p className="mt-1 text-sm leading-relaxed text-hero-navy/85">
            After you submit this request you will see a button that opens your email, already addressed to{" "}
            {BUSINESS.receptionEmail} with your reference number. Attach your PDFs there and press send.
          </p>
        </div>
      </div>

      {submitError && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="button"
        className="mt-8 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#5D8AB4] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#4f7aa3] disabled:opacity-60"
        onClick={submit}
        disabled={submitting}
      >
        {submitting ? "Sending…" : "Send service request"}
      </button>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[#35546C]">{label}</span>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </label>
  );
}
