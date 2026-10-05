import mongoose, { Schema, type Model } from "mongoose";

export interface IRateLimit {
  key: string;
  action: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    key: { type: String, required: true },
    action: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

RateLimitSchema.index({ action: 1, key: 1 });
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimit: Model<IRateLimit> =
  mongoose.models.RateLimit ?? mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);
