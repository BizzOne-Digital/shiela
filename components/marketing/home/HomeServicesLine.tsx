import Link from "next/link";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { Reveal, RevealSection, RevealText } from "@/components/motion/Reveal";
import type { MarketingService } from "@/lib/marketing-data";
import { SERVICE_SEEDS } from "@/lib/seed-services";

export function HomeServicesLine({ services }: { services: MarketingService[] }) {
  const items =
    services.length > 0
      ? services
      : SERVICE_SEEDS.map((s) => ({
          _id: `fallback-${s.iconKey}`,
          title: s.title,
          description: s.description,
          iconKey: s.iconKey,
        }));

  return (
    <section id="services" className="scroll-mt-24 mesh-soft py-14 md:py-20">
      <RevealSection>
        <div className="site-container-narrow">
          <div className="flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-end min-[480px]:justify-between">
            <RevealText>
              <SectionHeading
                eyebrow="Reliable solutions"
                title="Our Services"
                description="Everything you need for court documents — at a glance."
              />
            </RevealText>
            <Reveal direction="up" distance={24} delay={0.08}>
              <Link
                href="/services"
                className="inline-flex shrink-0 text-sm font-semibold text-hero-navy underline-offset-4 hover:underline"
              >
                View all services →
              </Link>
            </Reveal>
          </div>

          <Reveal immediate direction="up" distance={32} delay={0.05}>
            <div className="mt-8 rounded-2xl border border-pale-gray/60 bg-white shadow-sm">
              <ul
                className="flex w-full snap-x snap-mandatory overflow-x-auto lg:snap-none lg:overflow-visible lg:divide-x lg:divide-pale-gray/50"
                aria-label="Services"
              >
                {items.map((service) => (
                  <li
                    key={service._id}
                    className="flex min-w-[140px] shrink-0 snap-start flex-1 flex-col items-center justify-center gap-2 px-3 py-5 text-center sm:min-w-[160px] lg:min-w-0 lg:px-2 lg:py-6"
                  >
                    <Link
                      href={`/services#service-${service.iconKey}`}
                      className="group flex w-full flex-col items-center gap-2.5 transition hover:text-hero-navy"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-hero-sky/80 text-hero-navy transition group-hover:bg-hero-sky">
                        <ServiceIcon iconKey={service.iconKey} className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-medium leading-snug text-hero-navy/90 min-[400px]:text-[13px] lg:text-sm">
                        {service.title}
                      </span>
                    </Link>
                    <Link
                      href={
                        service._id.startsWith("fallback-")
                          ? "/contact"
                          : `/contact?service=${service._id}`
                      }
                      className="text-[11px] font-semibold text-hero-navy/55 uppercase tracking-wide hover:text-hero-navy"
                    >
                      Request
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </RevealSection>
    </section>
  );
}
