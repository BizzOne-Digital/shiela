import { PageBanner } from "@/components/marketing/PageBanner";
import { RequestQuoteCta } from "@/components/marketing/RequestQuoteCta";
import { HowItWorksSection } from "@/components/marketing/sections/HowItWorksSection";

export const metadata = {
  title: "How It Works",
  description: "Submit your request, review requirements with our office, and confirm service to move forward.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageBanner
        eyebrow="Simple, efficient, reliable"
        title="How It Works"
        description="A straightforward process from your first message to completed service."
      />
      <HowItWorksSection showHeading={false} />
      <RequestQuoteCta />
    </>
  );
}
