import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-metadata";

const paths = [
  "",
  "/services",
  "/who-we-help",
  "/how-it-works",
  "/service-area",
  "/testimonials",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  return paths.map((path, i) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/contact" ? 0.9 : 0.8 - i * 0.02,
  }));
}
