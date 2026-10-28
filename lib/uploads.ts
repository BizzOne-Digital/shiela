import { z } from "zod";
import { MAX_FILES, MAX_PDF_BYTES } from "@/lib/constants";
import { UploadChunk } from "@/models/UploadChunk";

export const uploadRefsSchema = z
  .array(
    z.object({
      uploadId: z.string().regex(/^[A-Za-z0-9_-]{16,64}$/),
      name: z.string().min(1).max(255),
      size: z.number().int().positive().max(MAX_PDF_BYTES),
      chunks: z.number().int().positive().max(64),
    }),
  )
  .max(MAX_FILES);

export type UploadRef = z.infer<typeof uploadRefsSchema>[number];

/** Joins the uploaded pieces of one file back together and checks they are all there. */
export async function assembleUpload(ref: UploadRef): Promise<Buffer | null> {
  const chunks = await UploadChunk.find({ uploadId: ref.uploadId }).sort({ index: 1 });
  if (chunks.length !== ref.chunks) return null;
  if (chunks.some((c, i) => c.index !== i)) return null;
  const buffer = Buffer.concat(chunks.map((c) => c.data));
  return buffer.length === ref.size ? buffer : null;
}

export async function deleteUploads(refs: UploadRef[]) {
  if (!refs.length) return;
  await UploadChunk.deleteMany({ uploadId: { $in: refs.map((r) => r.uploadId) } });
}
