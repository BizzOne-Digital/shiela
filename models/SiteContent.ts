import mongoose, { Schema, type Model } from "mongoose";
import type { SiteContentData } from "@/lib/site-content";

const WhoBlockSchema = new Schema(
  {
    title: { type: String, default: "" },
    body: { type: String, default: "" },
  },
  { _id: false },
);

const SiteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    brandName: String,
    heroTitle: String,
    heroText: String,
    ctaLabel: String,
    whoHeading: String,
    whoBlocks: { type: [WhoBlockSchema], default: [] },
    formHeading: String,
    contactHeading: String,
    email: String,
    phone: String,
    hours: String,
    address: String,
    serviceArea: String,
    responseTime: String,
  },
  { timestamps: true },
);

export type SiteContentDocument = SiteContentData & { key: string };

export const SiteContent: Model<SiteContentDocument> =
  mongoose.models.SiteContent ??
  mongoose.model<SiteContentDocument>("SiteContent", SiteContentSchema);
