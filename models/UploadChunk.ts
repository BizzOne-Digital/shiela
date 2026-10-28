import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const UploadChunkSchema = new Schema({
  uploadId: { type: String, required: true },
  index: { type: Number, required: true },
  data: { type: Buffer, required: true },
  // Abandoned uploads are removed automatically after 24 hours.
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
});

UploadChunkSchema.index({ uploadId: 1, index: 1 }, { unique: true });

export type UploadChunkDocument = InferSchemaType<typeof UploadChunkSchema>;

export const UploadChunk: Model<UploadChunkDocument> =
  mongoose.models.UploadChunk ?? mongoose.model<UploadChunkDocument>("UploadChunk", UploadChunkSchema);
