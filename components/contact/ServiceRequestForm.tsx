"use client";

import { useCallback, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { BUSINESS, MATTER_DETAILS_MAX, MAX_PDF_BYTES } from "@/lib/constants";

type FormState = {
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

export function ServiceRequestForm({ embedded = false }: { embedded?: boolean }) {
  const [form, setForm] = useState<FormState>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const idempotencyKey = useMemo(() => nanoid(24), []);

  const totalBytes = files.reduce((a, f) => a + f.size, 0);

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
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
    if (totalBytes > MAX_PDF_BYTES) e.files = "Combined PDFs must be under 20 MB.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const pdfs = Array.from(incoming).filter((f) => f.name.toLowerCase().endsWith(".pdf"));
    setFiles((prev) => [...prev, ...pdfs]);
  }, []);

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    const matterDetails = buildMatterDetails(form);
    const body = new FormData();
    body.append("requesterType", "Member of the Public");
    body.append("fullName", form.fullName.trim());
    body.append("company", "");
    body.append("email", form.email.trim());
    body.append("phone", form.phone.trim());
    body.append("serviceAddress", form.serviceAddress.trim());
    body.append("serviceCity", form.courtCourthouse.trim());
    body.append("urgency", "standard");
    body.append("courtDeadline", form.serveFileBy);
    body.append("matterDetails", matterDetails);
    body.append("idempotencyKey", idempotencyKey);
    body.append("website", "");
    files.forEach((f) => body.append("documents", f));

    try {
      const res = await fetch("/api/service-requests", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Submission failed.");
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
    return (
      <div className="rounded-xl border border-pale-gray/70 bg-white p-8 text-center">
        <h2 className="text-xl font-bold text-hero-navy">Request received</h2>
        <p className="mt-4 text-sm text-hero-navy/80">
          Reference: <strong>{success}</strong>
        </p>
        <p className="mt-4 text-sm text-hero-muted">
          Thank you — a confirmation will be sent from {BUSINESS.receptionEmail}. Our team will review your
          request and contact you, usually within one business day.
        </p>
      </div>
    );
  }

  const shellClass = embedded
    ? "min-w-0 rounded-xl border border-pale-gray/70 bg-white p-5 md:p-6"
    : "min-w-0 rounded-2xl border border-pale-gray/80 bg-soft-white p-4 shadow-sm sm:p-6 md:p-8";

  return (
    <div className={shellClass}>
      <div className="space-y-5">
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

        <Field label="Phone (optional)" error={errors.phone}>
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

        <Field label="Style of cause & court file number" error={errors.styleOfCause}>
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

        <Field label="Documents to serve / file" error={errors.documentsDescription}>
          <input
            className="input"
            value={form.documentsDescription}
            onChange={(e) => update({ documentsDescription: e.target.value })}
          />
        </Field>

        <Field label="Person / corporation to be served" error={errors.personToServe}>
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

        <PdfUpload
          files={files}
          setFiles={setFiles}
          onFiles={onFiles}
          totalBytes={totalBytes}
          error={errors.files}
        />
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

      <p className="mt-4 text-sm leading-relaxed text-hero-muted">
        Submitting opens your email app with the details filled in. Your email app cannot receive files from this
        page automatically, so please attach the PDFs you selected there before sending.
      </p>
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

function PdfUpload({
  files,
  setFiles,
  onFiles,
  totalBytes,
  error,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onFiles: (f: FileList | null) => void;
  totalBytes: number;
  error?: string;
}) {
  const [drag, setDrag] = useState(false);
  const maxMb = MAX_PDF_BYTES / 1024 / 1024;

  return (
    <div>
      <p className="text-sm font-bold text-[#35546C]">Attach PDF documents (optional)</p>
      <p className="mt-1 text-sm text-hero-muted">PDF files only, up to {maxMb} MB in total.</p>
      <div
        className={`mt-3 rounded-xl border-2 border-dashed p-5 text-center transition ${
          drag ? "border-[#5D8AB4] bg-[#E3F0FB]/60" : "border-pale-gray/80 bg-pale-blue/15"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          onFiles(e.dataTransfer.files);
        }}
      >
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="sr-only"
          onChange={(e) => onFiles(e.target.files)}
        />
        <label
          htmlFor="pdf-upload"
          className="inline-flex cursor-pointer rounded-xl bg-[#5D8AB4] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4f7aa3]"
        >
          Choose PDF files
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
      {files.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-start justify-between gap-2 rounded-lg bg-pale-blue/30 px-3 py-2"
            >
              <span className="min-w-0 break-all">
                {f.name} ({(f.size / 1024).toFixed(1)} KB)
              </span>
              <button
                type="button"
                className="shrink-0 text-xs font-semibold text-[#5D8AB4]"
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </li>
          ))}
          <li className="text-xs font-medium text-hero-muted">
            Total: {(totalBytes / 1024 / 1024).toFixed(2)} MB / {maxMb} MB
          </li>
        </ul>
      )}
    </div>
  );
}
