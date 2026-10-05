import { customAlphabet } from "nanoid";

const refAlphabet = customAlphabet("0123456789", 5);

export function generateReferenceNumber(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `AOD-${y}${m}${day}-${refAlphabet()}`;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function normalizeFilename(name: string): string {
  const base = name.replace(/[/\\]/g, "").replace(/\.\./g, "");
  const cleaned = base.replace(/[^\w.\-() ]/g, "_").trim();
  return cleaned.slice(0, 200) || "document.pdf";
}

export function isPdfBuffer(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("ascii") === "%PDF";
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
