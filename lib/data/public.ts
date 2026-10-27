import { connectMongo } from "@/lib/mongodb";
import { SiteContent } from "@/models/SiteContent";
import { Testimonial } from "@/models/Testimonial";
import { DEFAULT_SITE_CONTENT, type SiteContentData } from "@/lib/site-content";

/** Saved page content merged over defaults, so a blank or missing field falls back safely. */
export async function getSiteContent(): Promise<SiteContentData> {
  try {
    await connectMongo();
    const doc = await SiteContent.findOne({ key: "main" }).lean();
    if (!doc) return DEFAULT_SITE_CONTENT;
    const merged: SiteContentData = { ...DEFAULT_SITE_CONTENT };
    for (const k of Object.keys(DEFAULT_SITE_CONTENT) as (keyof SiteContentData)[]) {
      if (k === "whoBlocks") continue;
      const v = doc[k];
      if (typeof v === "string" && v.trim()) (merged[k] as string) = v;
    }
    if (doc.whoBlocks?.length) {
      merged.whoBlocks = doc.whoBlocks.map((b) => ({ title: b.title ?? "", body: b.body ?? "" }));
    }
    return merged;
  } catch {
    // DB unavailable (e.g. during build) — the page still renders the defaults.
    return DEFAULT_SITE_CONTENT;
  }
}

export async function getPublishedTestimonials() {
  await connectMongo();
  return Testimonial.find({ published: true }).sort({ displayOrder: 1 }).lean();
}
