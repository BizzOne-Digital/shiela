import type { MarketingService, MarketingTestimonial } from "@/lib/marketing-data";

export function mapMarketingServices(
  services: { _id: unknown; title: string; description: string; iconKey: string }[],
): MarketingService[] {
  return services.map((s) => ({
    _id: String(s._id),
    title: s.title,
    description: s.description,
    iconKey: s.iconKey,
  }));
}

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
