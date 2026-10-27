import type { MarketingTestimonial } from "@/lib/marketing-data";

export function mapMarketingTestimonials(
  testimonials: {
    _id: unknown;
    clientName: string;
    clientRole?: string | null;
    text: string;
  }[],
): MarketingTestimonial[] {
  return testimonials.map((t) => ({
    _id: String(t._id),
    clientName: t.clientName,
    clientRole: t.clientRole ?? undefined,
    text: t.text,
  }));
}
