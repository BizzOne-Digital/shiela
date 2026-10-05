import { connectMongo } from "@/lib/mongodb";
import { RateLimit } from "@/models/RateLimit";

export async function checkRateLimit(
  key: string,
  action: string,
  maxAttempts: number,
  windowMs: number,
): Promise<boolean> {
  await connectMongo();
  const since = new Date(Date.now() - windowMs);
  const count = await RateLimit.countDocuments({
    action,
    key: { $regex: new RegExp(`^${escapeRegex(key)}`) },
    createdAt: { $gte: since },
  });
  if (count >= maxAttempts) return false;
  await RateLimit.create({
    key: `${key}:${Date.now()}`,
    action,
    expiresAt: new Date(Date.now() + windowMs),
  });
  return true;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
