import { PageBanner } from "@/components/marketing/PageBanner";
import { RequestQuoteCta } from "@/components/marketing/RequestQuoteCta";
import { WhoWeHelpSection } from "@/components/marketing/sections/WhoWeHelpSection";

export const metadata = {
  title: "Who We Help",
  description: "Supporting legal professionals, small businesses and members of the public in Ontario.",
};

export default function WhoWeHelpPage() {
  return (
    <>
      <PageBanner
        eyebrow="Supporting your success"
        title="Who We Help"
        description="Clear, dependable court document support for every type of client we serve."
      />
      <WhoWeHelpSection showHeading={false} />
      <RequestQuoteCta />
    </>
  );
}
