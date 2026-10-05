import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { seedServicesToDb } from "@/lib/seed-services";

export const runtime = "nodejs";

/** Development only — seeds services on the same MongoDB as the running app */
export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await connectMongo();
  const titles = await seedServicesToDb();
  return NextResponse.json({ message: "Services seeded.", count: titles.length, titles });
}
