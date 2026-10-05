import { PageBanner } from "@/components/marketing/PageBanner";
import { RequestQuoteCta } from "@/components/marketing/RequestQuoteCta";
import { ServiceAreaSection } from "@/components/marketing/sections/ServiceAreaSection";
import { lakeImageExists } from "@/lib/lake-image";

export const metadata = {
  title: "Service Area",
  description: "Court document services across Durham Region and surrounding Ontario locations.",
};

export default function ServiceAreaPage() {
  const showLake = lakeImageExists();

  return (
    <>
      <PageBanner
        eyebrow="Local expertise"
        title="Service Area"
        description="Proudly serving Durham Region and beyond."
      />
      <ServiceAreaSection showLake={showLake} showHeading={false} />
      <RequestQuoteCta />
    </>
  );
}
