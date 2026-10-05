import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true },
);

export type AdminDocument = InferSchemaType<typeof AdminSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Admin: Model<AdminDocument> =
  mongoose.models.Admin ?? mongoose.model<AdminDocument>("Admin", AdminSchema);
