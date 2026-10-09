import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-metadata";

const paths = ["", "/service-area", "/testimonials"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  return paths.map((path, i) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8 - i * 0.05,
  }));
}
