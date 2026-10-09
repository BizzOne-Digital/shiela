import { SectionHeading } from "@/components/marketing/SectionHeading";
import { RevealSection, RevealText } from "@/components/motion/Reveal";

export function PageBanner({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="mesh-soft overflow-x-clip border-b border-black/[0.04] py-10 md:py-16">
      <RevealSection>
        <div className="site-container-narrow">
          <RevealText>
            <SectionHeading as="h1" align="left" eyebrow={eyebrow} title={title} description={description} />
          </RevealText>
        </div>
      </RevealSection>
    </section>
  );
}
