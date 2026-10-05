import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal, RevealSection, RevealText } from "@/components/motion/Reveal";
import { MATTER_TYPES } from "@/lib/constants";

export function MatterTypesSection() {
  return (
    <section className="bg-white py-14 md:py-20">
      <RevealSection>
        <div className="site-container-narrow text-center">
          <RevealText>
            <SectionHeading eyebrow="A wide range of cases" title="Common Matter Types" />
          </RevealText>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {MATTER_TYPES.map((m, i) => (
              <Reveal key={m} direction="up" distance={24} delay={0.06 + i * 0.05}>
                <span className="inline-block rounded-full border border-transparent bg-hero-sky/90 px-5 py-2.5 text-sm font-medium text-hero-navy/90">
                  {m}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
