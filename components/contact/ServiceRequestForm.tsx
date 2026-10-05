"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { nanoid } from "nanoid";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import {
  ADD_ON_OPTIONS,
  MATTER_DETAILS_MAX,
  MAX_PDF_BYTES,
  REQUESTER_TYPES,
  URGENCY_OPTIONS,
} from "@/lib/constants";
import { smallServicesGridClass } from "@/lib/services-display";

type Service = { _id: string; title: string; iconKey?: string };

type FormState = {
  requesterType: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  serviceIds: string[];
  serviceAddress: string;
  serviceCity: string;
  urgency: string;
  courtDeadline: string;
  addOns: string[];
  matterDetails: string;
};

const initial: FormState = {
  requesterType: "",
  fullName: "",
  company: "",
  email: "",
  phone: "",
  serviceIds: [],
  serviceAddress: "",
  serviceCity: "",
  urgency: "standard",
  courtDeadline: "",
  addOns: [],
  matterDetails: "",
};

export function ServiceRequestForm({
  services,
  preselectedServiceId,
}: {
  services: Service[];
  preselectedServiceId?: string;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(() => ({
    ...initial,
    serviceIds: preselectedServiceId ? [preselectedServiceId] : [],
  }));
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const idempotencyKey = useMemo(() => nanoid(24), []);
  const reduce = useReducedMotion();

  const totalBytes = files.reduce((a, f) => a + f.size, 0);

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const toggleService = (id: string) => {
    setForm((f) => ({
      ...f,
      serviceIds: f.serviceIds.includes(id)
        ? f.serviceIds.filter((x) => x !== id)
        : [...f.serviceIds, id],
    }));
  };

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.requesterType) e.requesterType = "Please select an option.";
      if (!form.fullName.trim()) e.fullName = "Required.";
      if (!form.email.trim()) e.email = "Required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email.";
      if (!form.phone.trim()) e.phone = "Required.";
    }
    if (s === 1) {
      if (!form.serviceIds.length) e.serviceIds = "Select at least one service.";
      if (!form.serviceAddress.trim()) e.serviceAddress = "Required.";
      if (!form.serviceCity.trim()) e.serviceCity = "Required.";
      if (!form.urgency) e.urgency = "Required.";
      if (!form.matterDetails.trim() || form.matterDetails.length < 10)
        e.matterDetails = "Please provide at least 10 characters.";
      if (form.matterDetails.length > MATTER_DETAILS_MAX)
        e.matterDetails = `Maximum ${MATTER_DETAILS_MAX} characters.`;
    }
    if (s === 2) {
      if (totalBytes > MAX_PDF_BYTES) e.files = "Combined PDFs must be under 10 MB.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const pdfs = Array.from(incoming).filter((f) => f.name.toLowerCase().endsWith(".pdf"));
    setFiles((prev) => [...prev, ...pdfs]);
  }, []);

  const submit = async () => {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
      setStep(0);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "serviceIds" || k === "addOns") return;
      body.append(k, String(v));
    });
    form.serviceIds.forEach((id) => body.append("serviceIds", id));
    form.addOns.forEach((a) => body.append("addOns", a));
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
      <div className="rounded-2xl border border-pale-gray bg-pale-blue/30 p-8 text-center">
        <h2 className="font-display text-2xl text-ink">Request received</h2>
        <p className="mt-4 text-sm text-ink/75">
          Reference: <strong>{success}</strong>
        </p>
        <p className="mt-4 text-sm text-ink/70">
          We have saved your request. Our office will review your requirements and contact you.
          Submitting does not confirm pricing, availability, or acceptance of service.
        </p>
      </div>
    );
  }

  const steps = ["Your Details", "Service Details", "Documents & Review"];
  const stepShort = ["Details", "Service", "Review"];

  return (
    <div className="min-w-0 rounded-2xl border border-pale-gray/80 bg-soft-white p-4 shadow-sm sm:p-6 md:p-8">
      <nav aria-label="Form progress" className="mb-6 sm:mb-8">
        <ol className="flex flex-col gap-2 min-[480px]:flex-row">
          {steps.map((label, i) => (
            <li key={label} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`min-h-[44px] w-full rounded-lg px-2 py-2.5 text-left text-xs font-medium leading-snug min-[480px]:text-center md:text-sm ${
                  i === step
                    ? "bg-ink text-soft-white"
                    : i < step
                      ? "bg-pale-blue text-ink"
                      : "bg-pale-blue/40 text-ink/50"
                }`}
                disabled={i > step}
              >
                <span className="min-[480px]:hidden">{i + 1}. {stepShort[i]}</span>
                <span className="hidden min-[480px]:inline">{i + 1}. {label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 && (
            <div className="space-y-5">
              <fieldset>
                <legend className="text-sm font-semibold text-ink">I am a:</legend>
                <div className="mt-3 grid grid-cols-1 gap-2 min-[400px]:grid-cols-3">
                  {REQUESTER_TYPES.map((t) => (
                    <label
                      key={t}
                      className={`flex min-h-[44px] cursor-pointer items-center rounded-xl border px-4 py-3 text-sm ${
                        form.requesterType === t
                          ? "border-ink bg-pale-blue"
                          : "border-pale-gray"
                      }`}
                    >
                      <input
                        type="radio"
                        name="requesterType"
                        className="sr-only"
                        checked={form.requesterType === t}
                        onChange={() => update({ requesterType: t })}
                      />
                      {t}
                    </label>
                  ))}
                </div>
                {errors.requesterType && (
                  <p className="mt-1 text-xs text-red-700">{errors.requesterType}</p>
                )}
              </fieldset>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Full Name *" error={errors.fullName}>
                  <input
                    className="input"
                    value={form.fullName}
                    onChange={(e) => update({ fullName: e.target.value })}
                    required
                  />
                </Field>
                <Field label="Firm or Company" error={errors.company}>
                  <input
                    className="input"
                    value={form.company}
                    onChange={(e) => update({ company: e.target.value })}
                  />
                </Field>
                <Field label="Email *" error={errors.email}>
                  <input
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={(e) => update({ email: e.target.value })}
                    required
                  />
                </Field>
                <Field label="Phone *" error={errors.phone}>
                  <input
                    type="tel"
                    className="input"
                    value={form.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                    required
                  />
                </Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <fieldset>
                <legend className="text-sm font-semibold text-ink">Services needed *</legend>
                <div
                  className={`mt-3 grid items-stretch gap-3 ${smallServicesGridClass(services.length)}`}
                >
                  {services.map((s) => {
                    const selected = form.serviceIds.includes(s._id);
                    return (
                      <label
                        key={s._id}
                        className={`flex h-full min-h-[72px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition ${
                          selected
                            ? "border-hero-navy bg-hero-sky/50 ring-1 ring-hero-navy/15"
                            : "border-pale-gray bg-white hover:border-hero-navy/25 hover:bg-[#fafbfc]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selected}
                          onChange={() => toggleService(s._id)}
                        />
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                            selected ? "bg-white text-hero-navy" : "bg-hero-sky/80 text-hero-navy"
                          }`}
                          aria-hidden
                        >
                          <ServiceIcon iconKey={s.iconKey ?? "document"} className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1 font-medium leading-snug text-ink">{s.title}</span>
                        <span
                          className={`ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? "border-hero-navy bg-hero-navy text-white" : "border-pale-gray"
                          }`}
                          aria-hidden
                        >
                          {selected ? (
                            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M2.5 6l2.5 2.5L9.5 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.serviceIds && (
                  <p className="mt-1 text-xs text-red-700">{errors.serviceIds}</p>
                )}
              </fieldset>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Service address *" error={errors.serviceAddress}>
                  <input
                    className="input"
                    value={form.serviceAddress}
                    onChange={(e) => update({ serviceAddress: e.target.value })}
                  />
                </Field>
                <Field label="City *" error={errors.serviceCity}>
                  <input
                    className="input"
                    value={form.serviceCity}
                    onChange={(e) => update({ serviceCity: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Urgency *" error={errors.urgency}>
                <select
                  className="input"
                  value={form.urgency}
                  onChange={(e) => update({ urgency: e.target.value })}
                >
                  {URGENCY_OPTIONS.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-ink/60">
                  Requested timing is subject to office confirmation.
                </p>
              </Field>
              <Field label="Court deadline (optional)">
                <input
                  type="date"
                  className="input"
                  value={form.courtDeadline}
                  onChange={(e) => update({ courtDeadline: e.target.value })}
                />
              </Field>
              <fieldset>
                <legend className="text-sm font-semibold text-ink">Add-on services (optional)</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ADD_ON_OPTIONS.map((a) => (
                    <label key={a} className="flex items-center gap-2 rounded-full border border-pale-gray px-3 py-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={form.addOns.includes(a)}
                        onChange={() =>
                          update({
                            addOns: form.addOns.includes(a)
                              ? form.addOns.filter((x) => x !== a)
                              : [...form.addOns, a],
                          })
                        }
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </fieldset>
              <Field label="Details of your matter *" error={errors.matterDetails}>
                <textarea
                  className="input min-h-[120px]"
                  maxLength={MATTER_DETAILS_MAX}
                  value={form.matterDetails}
                  onChange={(e) => update({ matterDetails: e.target.value })}
                />
                <p className="text-right text-xs text-ink/50">
                  {form.matterDetails.length}/{MATTER_DETAILS_MAX}
                </p>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <PdfUpload files={files} setFiles={setFiles} onFiles={onFiles} totalBytes={totalBytes} />
              {errors.files && <p className="text-xs text-red-700">{errors.files}</p>}
              <ReviewSummary form={form} services={services} files={files} />
              <p className="text-xs text-ink/60">
                By submitting, you agree that the information provided will be used to respond to your
                service request. Formal privacy policies are available upon request from our office.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {submitError && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800" role="alert">
          {submitError}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 min-[480px]:flex-row min-[480px]:justify-between min-[480px]:gap-4">
        <button
          type="button"
          className="min-h-[44px] w-full rounded-full border border-pale-gray px-5 py-2.5 text-sm font-medium disabled:opacity-40 min-[480px]:w-auto"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || submitting}
        >
          Back
        </button>
        {step < 2 ? (
          <button
            type="button"
            className="min-h-[44px] w-full rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-soft-white min-[480px]:w-auto"
            onClick={() => {
              if (validateStep(step)) setStep((s) => s + 1);
            }}
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            className="min-h-[44px] w-full rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-soft-white disabled:opacity-60 min-[480px]:w-auto"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit request"}
          </button>
        )}
      </div>
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
    <label className="block text-sm">
      <span className="font-medium text-ink">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </label>
  );
}

function PdfUpload({
  files,
  setFiles,
  onFiles,
  totalBytes,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onFiles: (f: FileList | null) => void;
  totalBytes: number;
}) {
  const [drag, setDrag] = useState(false);
  return (
    <div>
      <p className="text-sm font-semibold text-ink">PDF documents (optional)</p>
      <div
        className={`mt-3 rounded-xl border-2 border-dashed p-6 text-center transition ${
          drag ? "border-accent bg-pale-blue" : "border-pale-gray bg-pale-blue/20"
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
          className="inline-flex cursor-pointer rounded-full bg-ink px-5 py-2 text-sm font-semibold text-soft-white"
        >
          Choose PDF files
        </label>
        <p className="mt-3 text-xs text-ink/60">Drag and drop PDFs here. Max 10 MB combined.</p>
      </div>
      <p className="mt-3 text-xs text-ink/70" role="note">
        Don&apos;t want to upload? Email your documents to reception@angelonedocuments.com.
      </p>
      {files.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between rounded-lg bg-pale-blue/40 px-3 py-2">
              <span>{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
              <button
                type="button"
                className="text-xs font-semibold text-accent"
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </li>
          ))}
          <li className="text-xs font-medium text-ink/70">
            Total: {(totalBytes / 1024 / 1024).toFixed(2)} MB / 10 MB
          </li>
        </ul>
      )}
    </div>
  );
}

function ReviewSummary({
  form,
  services,
  files,
}: {
  form: FormState;
  services: Service[];
  files: File[];
}) {
  const names = services.filter((s) => form.serviceIds.includes(s._id)).map((s) => s.title);
  const urgency = URGENCY_OPTIONS.find((u) => u.value === form.urgency)?.label;
  return (
    <div className="rounded-xl border border-pale-gray/70 bg-pale-blue/20 p-4 text-sm">
      <h3 className="font-semibold text-ink">Review</h3>
      <dl className="mt-3 space-y-1 text-ink/80">
        <div><dt className="inline font-medium">Name: </dt>{form.fullName}</div>
        <div><dt className="inline font-medium">Email: </dt>{form.email}</div>
        <div><dt className="inline font-medium">Services: </dt>{names.join(", ")}</div>
        <div><dt className="inline font-medium">Location: </dt>{form.serviceAddress}, {form.serviceCity}</div>
        <div><dt className="inline font-medium">Urgency: </dt>{urgency}</div>
        <div><dt className="inline font-medium">Files: </dt>{files.length ? files.map((f) => f.name).join(", ") : "None"}</div>
      </dl>
    </div>
  );
}
