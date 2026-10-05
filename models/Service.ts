import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { ICON_KEYS } from "@/lib/constants";

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    iconKey: { type: String, enum: ICON_KEYS, required: true },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ServiceSchema.index({ active: 1, displayOrder: 1 });

export type ServiceDocument = InferSchemaType<typeof ServiceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Service: Model<ServiceDocument> =
  mongoose.models.Service ?? mongoose.model<ServiceDocument>("Service", ServiceSchema);
