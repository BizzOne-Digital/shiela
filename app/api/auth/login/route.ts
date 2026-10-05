import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectMongo } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { getAdminSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await checkRateLimit(ip, "admin-login", 10, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many login attempts." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password.trim();

  await connectMongo();
  const admin = await Admin.findOne({ email }).select("email passwordHash");
  if (!admin?.passwordHash) {
    if (process.env.NODE_ENV === "development") {
      console.error("[auth/login] No admin for email:", email);
    }
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const session = await getAdminSession();
  session.adminId = admin._id.toString();
  session.email = admin.email;
  session.isLoggedIn = true;
  await session.save();

  return NextResponse.json({ success: true });
}
