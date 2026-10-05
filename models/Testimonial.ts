import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const TestimonialSchema = new Schema(
  {
    clientName: { type: String, required: true, trim: true },
    clientRole: { type: String, trim: true },
    text: { type: String, required: true, trim: true },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

TestimonialSchema.index({ published: 1, displayOrder: 1 });

export type TestimonialDocument = InferSchemaType<typeof TestimonialSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Testimonial: Model<TestimonialDocument> =
  mongoose.models.Testimonial ??
  mongoose.model<TestimonialDocument>("Testimonial", TestimonialSchema);
