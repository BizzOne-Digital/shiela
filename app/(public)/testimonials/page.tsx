import { PageBanner } from "@/components/marketing/PageBanner";
import { RequestQuoteCta } from "@/components/marketing/RequestQuoteCta";
import { TestimonialsSection } from "@/components/marketing/sections/TestimonialsSection";
import { getPublishedTestimonials } from "@/lib/data/public";
import { mapMarketingTestimonials } from "@/lib/map-public-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Testimonials",
  description: "Client feedback on court document services from Angel One Documents.",
};

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();
  const items = mapMarketingTestimonials(testimonials);

  return (
    <>
      <PageBanner
        eyebrow="Client voices"
        title="Testimonials"
        description="Published feedback from clients we have supported."
      />
      {items.length > 0 ? (
        <TestimonialsSection testimonials={items} showHeading={false} />
      ) : (
        <div className="site-container-narrow py-16 text-center text-sm text-hero-muted">
          Testimonials will appear here once published in the admin portal.
        </div>
      )}
      <RequestQuoteCta />
    </>
  );
}
