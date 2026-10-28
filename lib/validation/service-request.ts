import { z } from "zod";
import {
  ADD_ON_OPTIONS,
  MATTER_DETAILS_MAX,
  MAX_PDF_BYTES,
  MAX_PDF_MB,
  REQUESTER_TYPES,
  URGENCY_OPTIONS,
} from "@/lib/constants";

const urgencyValues = URGENCY_OPTIONS.map((u) => u.value) as [string, ...string[]];

export const serviceRequestBodySchema = z.object({
  requesterType: z.enum(REQUESTER_TYPES),
  fullName: z.string().min(1, "Full name is required").max(200),
  company: z.string().max(200).optional().or(z.literal("")),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(30).optional().or(z.literal("")),
  serviceAddress: z.string().min(1, "Address is required").max(300),
  serviceCity: z.string().min(1, "City is required").max(100),
  urgency: z.enum(urgencyValues),
  courtDeadline: z.string().optional().or(z.literal("")),
  addOns: z.array(z.enum(ADD_ON_OPTIONS)).optional().default([]),
  matterDetails: z
    .string()
    .min(10, "Please provide details about your matter")
    .max(MATTER_DETAILS_MAX),
  website: z.string().max(0).optional(), // honeypot
  idempotencyKey: z.string().min(8).max(64),
});

export type ServiceRequestBody = z.infer<typeof serviceRequestBodySchema>;

export const serviceRequestClientSchema = serviceRequestBodySchema;

export function validatePdfFiles(
  files: { name: string; type: string; size: number; buffer: Buffer }[],
): { ok: true } | { ok: false; message: string } {
  let total = 0;
  for (const f of files) {
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      return { ok: false, message: "Only PDF files are allowed." };
    }
    if (f.type && f.type !== "application/pdf") {
      return { ok: false, message: "Invalid file type. PDF only." };
    }
    if (f.buffer.length < 4 || f.buffer.subarray(0, 4).toString("ascii") !== "%PDF") {
      return { ok: false, message: `File "${f.name}" is not a valid PDF.` };
    }
    total += f.size;
  }
  if (total > MAX_PDF_BYTES) {
    return { ok: false, message: `Combined PDF size must not exceed ${MAX_PDF_MB} MB.` };
  }
  return { ok: true };
}
