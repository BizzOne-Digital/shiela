import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { REQUEST_STATUSES, REQUESTER_TYPES, URGENCY_OPTIONS } from "@/lib/constants";

const urgencyValues = URGENCY_OPTIONS.map((u) => u.value);

const DocumentMetaSchema = new Schema(
  {
    originalName: { type: String, required: true },
    storageKey: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    mimeType: { type: String, required: true },
  },
  { _id: false },
);

const ServiceSnapshotSchema = new Schema(
  {
    serviceId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
  },
  { _id: false },
);

const ServiceRequestSchema = new Schema(
  {
    referenceNumber: { type: String, required: true, unique: true },
    idempotencyKey: { type: String, unique: true, sparse: true },
    requesterType: { type: String, enum: REQUESTER_TYPES, required: true },
    fullName: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    services: { type: [ServiceSnapshotSchema], required: true },
    serviceAddress: { type: String, required: true, trim: true },
    serviceCity: { type: String, required: true, trim: true },
    urgency: { type: String, enum: urgencyValues, required: true },
    courtDeadline: { type: Date },
    addOns: { type: [String], default: [] },
    matterDetails: { type: String, required: true },
    documents: { type: [DocumentMetaSchema], default: [] },
    status: { type: String, enum: REQUEST_STATUSES, default: "New" },
    internalNotes: { type: String, default: "" },
    officeEmailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    officeEmailError: { type: String },
    acknowledgementEmailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    acknowledgementEmailError: { type: String },
  },
  { timestamps: true },
);

ServiceRequestSchema.index({ referenceNumber: 1 });
ServiceRequestSchema.index({ status: 1, createdAt: -1 });
ServiceRequestSchema.index({ "services.serviceId": 1 });
ServiceRequestSchema.index({ urgency: 1 });
ServiceRequestSchema.index({ createdAt: -1 });

export type ServiceRequestDocument = InferSchemaType<typeof ServiceRequestSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ServiceRequest: Model<ServiceRequestDocument> =
  mongoose.models.ServiceRequest ??
  mongoose.model<ServiceRequestDocument>("ServiceRequest", ServiceRequestSchema);
