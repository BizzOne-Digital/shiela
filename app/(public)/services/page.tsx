import { PageBanner } from "@/components/marketing/PageBanner";
import { RequestQuoteCta } from "@/components/marketing/RequestQuoteCta";
import { MatterTypesSection } from "@/components/marketing/sections/MatterTypesSection";
import { ServicesSection } from "@/components/marketing/sections/ServicesSection";
import { SpecialOfferSection } from "@/components/marketing/sections/SpecialOfferSection";
import { getActiveServices } from "@/lib/data/public";
import { mapMarketingServices } from "@/lib/map-public-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services",
  description:
    "Process serving, court filing, e-filing, writ searches and occupancy confirmations across Ontario.",
};

export default async function ServicesPage() {
  const services = await getActiveServices();
  const items = mapMarketingServices(services);

  return (
    <>
      <PageBanner
        eyebrow="Reliable solutions"
        title="Our Services"
        description="Court document services tailored for legal professionals, businesses and individuals."
      />
      <ServicesSection services={items} showHeading={false} />
      <SpecialOfferSection />
      <MatterTypesSection />
      <RequestQuoteCta />
    </>
  );
}
