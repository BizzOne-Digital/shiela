import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { checkRateLimit } from "@/lib/rate-limit";
import { MAX_PDF_BYTES, UPLOAD_CHUNK_BYTES } from "@/lib/constants";
import { UploadChunk } from "@/models/UploadChunk";

export const runtime = "nodejs";
export const maxDuration = 60;

const UPLOAD_ID = /^[A-Za-z0-9_-]{16,64}$/;
const MAX_CHUNKS = Math.ceil(MAX_PDF_BYTES / UPLOAD_CHUNK_BYTES) + 1;

/** Receives one piece of a PDF. The pieces are joined when the request form is submitted. */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await checkRateLimit(ip, "upload-chunk", 400, 60 * 60 * 1000))) {
    return NextResponse.json({ error: "Too many uploads. Please try again later." }, { status: 429 });
  }

  const uploadId = req.nextUrl.searchParams.get("uploadId") ?? "";
  const index = Number(req.nextUrl.searchParams.get("index"));
  if (!UPLOAD_ID.test(uploadId) || !Number.isInteger(index) || index < 0 || index >= MAX_CHUNKS) {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const data = Buffer.from(await req.arrayBuffer());
  if (data.length === 0 || data.length > UPLOAD_CHUNK_BYTES + 1024) {
    return NextResponse.json({ error: "Invalid upload piece size." }, { status: 400 });
  }
  if (index === 0 && data.subarray(0, 4).toString("ascii") !== "%PDF") {
    return NextResponse.json({ error: "Only valid PDF files are allowed." }, { status: 400 });
  }

  await connectMongo();
  await UploadChunk.findOneAndUpdate({ uploadId, index }, { $set: { data } }, { upsert: true });
  return NextResponse.json({ ok: true });
}
