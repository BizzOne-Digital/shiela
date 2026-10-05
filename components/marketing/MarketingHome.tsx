import { Hero } from "@/components/home/Hero";
import { HomeContactSection } from "@/components/marketing/home/HomeContactSection";
import { HomeServicesLine } from "@/components/marketing/home/HomeServicesLine";
import { RequestQuoteCta } from "@/components/marketing/RequestQuoteCta";
import { WhoWeHelpSection } from "@/components/marketing/sections/WhoWeHelpSection";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import type { MarketingService } from "@/lib/marketing-data";

export function MarketingHome({ services }: { services: MarketingService[] }) {
  return (
    <>
      <Hero />
      <TrustStrip />
      <HomeServicesLine services={services} />
      <WhoWeHelpSection viewAllHref="/who-we-help" />
      <HomeContactSection />
      <RequestQuoteCta />
    </>
  );
}
