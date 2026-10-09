import Image from "next/image";
import { CardArrowLink } from "@/components/marketing/CardArrowLink";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { Reveal, RevealSection, RevealText } from "@/components/motion/Reveal";
import { FEATURED_FALLBACKS, type MarketingService } from "@/lib/marketing-data";
import { partitionFeaturedServices, smallServicesGridClass } from "@/lib/services-display";

export function ServicesSection({
  services,
  showHeading = true,
}: {
  services: MarketingService[];
  showHeading?: boolean;
}) {
  const { featured, others: smallServices } = partitionFeaturedServices(services);
  const largeCards = FEATURED_FALLBACKS.map((fb) => ({
    ...fb,
    service: featured.find((s) => s.iconKey === fb.iconKey),
  }));
  const smallGridClass = smallServicesGridClass(smallServices.length);

  return (
    <section id="services" className="scroll-mt-24 mesh-soft py-16 md:py-24">
      <RevealSection>
        <div className="site-container-narrow">
          {showHeading ? (
            <RevealText>
              <SectionHeading
                eyebrow="Reliable solutions"
                title="Our Services"
                description="Process serving, court filing, e-filing, writ searches and occupancy confirmations — tailored for legal professionals, businesses and individuals across Ontario."
              />
            </RevealText>
          ) : null}

          <div className={`grid items-stretch gap-6 md:grid-cols-2 ${showHeading ? "mt-12" : ""}`}>
            {largeCards.map((card, i) => (
              <Reveal key={card.iconKey} className="h-full" direction="up" distance={48} delay={0.08 + i * 0.1}>
                <article
                  id={`service-${card.iconKey}`}
                  className="group card-lift flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl border border-pale-gray/60 bg-white shadow-sm"
                >
                  <div className="img-zoom-wrap relative aspect-[16/10] w-full shrink-0">
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      className="img-zoom-target object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h3 className="font-display text-xl font-medium text-hero-navy md:text-2xl">
                      {card.service?.title ?? card.fallbackTitle}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-hero-muted">
                      {card.service?.description ?? card.fallbackDescription}
                    </p>
                    <div className="mt-6 flex justify-end">
                      {card.service ? (
                        <CardArrowLink
                          href={`/?service=${card.service._id}#contact`}
                          label={`Request ${card.service.title}`}
                        />
                      ) : (
                        <CardArrowLink href="/#contact" label="Request service" />
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {smallServices.length > 0 ? (
            <div className={`mt-6 grid items-stretch gap-6 ${smallGridClass}`}>
              {smallServices.map((service, i) => (
                <Reveal key={service._id} className="h-full" direction="up" distance={40} delay={0.12 + i * 0.08}>
                  <article
                    id={`service-${service.iconKey}`}
                    className="group card-lift flex h-full min-h-[220px] scroll-mt-28 flex-col rounded-2xl border border-pale-gray/60 bg-gradient-to-br from-white to-[#f6f8fb] p-6 md:p-7"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-hero-navy shadow-sm ring-1 ring-hero-navy/5">
                      <ServiceIcon iconKey={service.iconKey} className="h-6 w-6" />
                    </div>
                    <h3 className="font-display mt-5 text-lg font-medium leading-snug text-hero-navy">{service.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-hero-muted">{service.description}</p>
                    <div className="mt-6 flex justify-end">
                      <CardArrowLink
                        href={`/?service=${service._id}#contact`}
                        label={`Request ${service.title}`}
                      />
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </RevealSection>
    </section>
  );
}
