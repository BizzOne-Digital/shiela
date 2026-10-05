import Image from "next/image";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal, RevealSection } from "@/components/motion/Reveal";
import { SERVICE_AREAS } from "@/lib/constants";

export function ServiceAreaSection({
  showLake,
  showHeading = true,
}: {
  showLake: boolean;
  showHeading?: boolean;
}) {
  return (
    <section id="service-area" className="scroll-mt-24 overflow-hidden bg-white py-16 md:py-24">
      <RevealSection>
        <div className="relative site-container-narrow">
          {showLake ? (
            <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 opacity-30 lg:block">
              <Image src="/images/lake-ontario.jpg" alt="" fill className="object-cover object-center" sizes="50vw" />
            </div>
          ) : null}
          <div className="relative max-w-xl">
            {showHeading ? (
              <Reveal direction="left" distance={48}>
                <SectionHeading
                  align="left"
                  eyebrow="Local expertise"
                  title="Service Area"
                  description="Proudly serving Durham Region and beyond, including:"
                />
              </Reveal>
            ) : null}
            <ul className={`flex flex-wrap gap-3 ${showHeading ? "mt-8" : ""}`}>
              {SERVICE_AREAS.filter((a) => !a.toLowerCase().includes("lake")).map((area, i) => (
                <Reveal key={area} direction="up" distance={24} delay={0.05 + i * 0.04}>
                  <li className="inline-flex items-center gap-2 rounded-full border border-pale-gray/60 bg-[#fafbfc] px-4 py-2 text-sm text-hero-navy/90">
                    <svg className="h-3.5 w-3.5 text-hero-navy/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" strokeWidth="1.4" />
                      <circle cx="12" cy="10" r="2" strokeWidth="1.4" />
                    </svg>
                    {area}
                  </li>
                </Reveal>
              ))}
              <Reveal direction="up" distance={24} delay={0.3}>
                <li className="inline-flex items-center gap-2 rounded-full border border-pale-gray/60 bg-[#fafbfc] px-4 py-2 text-sm text-hero-navy/90">
                  <svg className="h-3.5 w-3.5 text-hero-navy/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                    <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" strokeWidth="1.4" />
                    <circle cx="12" cy="10" r="2" strokeWidth="1.4" />
                  </svg>
                  and surrounding Ontario locations
                </li>
              </Reveal>
            </ul>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
