import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export const runtime = "nodejs";

/** Development helper — confirms API sees MongoDB and admin records */
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await connectMongo();
    const adminCount = await Admin.countDocuments();
    return NextResponse.json({
      mongoConfigured: Boolean(process.env.MONGODB_URI),
      adminCount,
      database: mongoose.connection.db?.databaseName ?? null,
    });
  } catch (e) {
    return NextResponse.json(
      {
        mongoConfigured: Boolean(process.env.MONGODB_URI),
        error: e instanceof Error ? e.message : "Connection failed",
      },
      { status: 500 },
    );
  }
}
