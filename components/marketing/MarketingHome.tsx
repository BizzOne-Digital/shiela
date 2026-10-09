import { Hero } from "@/components/home/Hero";
import { HomeContactSection } from "@/components/marketing/home/HomeContactSection";
import { HomeOverviewSections } from "@/components/marketing/overview/HomeOverviewSections";
import type { MarketingService } from "@/lib/marketing-data";

export function MarketingHome({
  services,
  preselectedServiceId,
}: {
  services: MarketingService[];
  preselectedServiceId?: string;
}) {
  const formServices = services.map((s) => ({
    _id: s._id,
    title: s.title,
    iconKey: s.iconKey,
  }));

  return (
    <>
      <Hero />
      <HomeOverviewSections />
      <HomeContactSection services={formServices} preselectedServiceId={preselectedServiceId} />
    </>
  );
}
