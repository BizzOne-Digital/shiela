import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal, RevealAlternate, RevealSection, RevealText } from "@/components/motion/Reveal";
import { whoWeHelp } from "@/lib/marketing-data";

export function WhoWeHelpSection({
  showHeading = true,
  viewAllHref,
}: {
  showHeading?: boolean;
  viewAllHref?: string;
}) {
  return (
    <section id="who-we-help" className="scroll-mt-24 bg-white py-16 md:py-24">
      <RevealSection>
        <div className="site-container-narrow">
          {showHeading ? (
            <div className="flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-end min-[480px]:justify-between">
              <RevealText>
                <SectionHeading eyebrow="Supporting your success" title="Who We Help" />
              </RevealText>
              {viewAllHref ? (
                <Reveal direction="up" distance={24} delay={0.08}>
                  <Link
                    href={viewAllHref}
                    className="inline-flex shrink-0 text-sm font-semibold text-hero-navy underline-offset-4 hover:underline"
                  >
                    Learn more →
                  </Link>
                </Reveal>
              ) : null}
            </div>
          ) : null}
          <div className={`grid gap-6 md:grid-cols-3 ${showHeading ? "mt-12" : ""}`}>
            {whoWeHelp.map((card, i) => (
              <RevealAlternate key={card.title} index={i}>
                <article
                  id={card.id}
                  className="group card-lift scroll-mt-28 overflow-hidden rounded-2xl border border-pale-gray/50 bg-white shadow-sm"
                >
                  <div className="img-zoom-wrap relative aspect-[4/3] w-full">
                    <Image src={card.image} alt="" fill className="img-zoom-target object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-medium text-hero-navy">{card.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-hero-muted">{card.body}</p>
                  </div>
                </article>
              </RevealAlternate>
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
