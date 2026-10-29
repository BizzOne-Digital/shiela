import { z } from "zod";
import {
  ADD_ON_OPTIONS,
  MATTER_DETAILS_MAX,
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
