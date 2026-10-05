import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectMongo } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export const runtime = "nodejs";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
  reset: z.boolean().optional(),
});

/**
 * Development only — creates admin on the same MongoDB connection as the running app.
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password (min 8 chars)." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password.trim();

  await connectMongo();
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await Admin.findOne({ email });

  if (existing) {
    if (!parsed.data.reset) {
      return NextResponse.json({ message: "Admin already exists. Send reset: true to update password." });
    }
    existing.passwordHash = passwordHash;
    await existing.save();
    return NextResponse.json({ message: "Admin password updated.", email });
  }

  await Admin.create({ email, passwordHash, role: "admin" });
  return NextResponse.json({ message: "Admin created.", email });
}
