import { Ss1OnePage } from "@/components/marketing/ss1/Ss1OnePage";
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

  return <Ss1OnePage services={formServices} preselectedServiceId={preselectedServiceId} />;
}
