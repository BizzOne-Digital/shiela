import { MarketingHome } from "@/components/marketing/MarketingHome";
import { getActiveServices } from "@/lib/data/public";
import { mapMarketingServices } from "@/lib/map-public-data";
import { localBusinessJsonLd } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const services = await getActiveServices();
  const serviceItems = mapMarketingServices(services);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />
      <MarketingHome services={serviceItems} preselectedServiceId={params.service} />
    </>
  );
}
