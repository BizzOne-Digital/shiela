import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { connectMongo } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth/session";
import { ServiceRequest } from "@/models/ServiceRequest";
import { getStorage } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestId = req.nextUrl.searchParams.get("requestId");
  const storageKey = req.nextUrl.searchParams.get("key");
  if (!requestId || !storageKey) {
    return NextResponse.json({ error: "Missing parameters." }, { status: 400 });
  }

  await connectMongo();
  const request = await ServiceRequest.findById(requestId);
  if (!request) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const doc = request.documents.find((d) => d.storageKey === storageKey);
  if (!doc) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const storage = getStorage();
  try {
    const stream = await storage.getStream(storageKey);
    const webStream = Readable.toWeb(stream as Readable) as ReadableStream;
    return new NextResponse(webStream, {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Disposition": `attachment; filename="${doc.originalName.replace(/"/g, "")}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not retrieve document." }, { status: 500 });
  }
}
