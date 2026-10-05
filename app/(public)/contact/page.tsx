import Image from "next/image";
import { ServiceRequestForm } from "@/components/contact/ServiceRequestForm";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal, RevealSection, RevealText } from "@/components/motion/Reveal";
import { BUSINESS } from "@/lib/constants";
import { getActiveServices } from "@/lib/data/public";
import { IMAGES } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact & Service Request",
};

function ContactIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-hero-sky/80 text-hero-navy">
      {children}
    </span>
  );
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const services = await getActiveServices();
  const serviceItems = services.map((s) => ({
    _id: s._id.toString(),
    title: s.title,
    iconKey: s.iconKey,
  }));

  return (
    <div className="mesh-soft bg-gradient-to-b from-hero-sky/40 via-white to-white">
      <div className="site-container-narrow pb-8 pt-10 sm:pt-12 md:pt-16">
        <RevealSection>
          <div className="text-center md:text-left">
            <RevealText>
              <SectionHeading
                as="h1"
                align="left"
                eyebrow="Durham Region & beyond"
                title="Let's move your matter forward."
              />
            </RevealText>
            <Reveal direction="up" distance={32} delay={0.1}>
              <p className="mt-4 text-sm text-hero-muted md:text-[15px]">
                Request a quote or submit a service request.
              </p>
            </Reveal>
          </div>
        </RevealSection>

        <div className="mt-8 overflow-hidden rounded-2xl border border-pale-gray/50 bg-white shadow-[0_8px_40px_rgba(10,31,68,0.06)] min-[400px]:mt-10 min-[400px]:rounded-3xl">
          <div className="grid lg:grid-cols-[minmax(300px,360px)_1fr]">
            <aside className="border-b border-pale-gray/40 bg-[#fafbfc] lg:border-b-0 lg:border-r">
              <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-48">
                <Image
                  src={IMAGES.contactOffice}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 340px"
                  priority
                />
              </div>
              <Reveal direction="left" distance={48} className="p-6 md:p-8">
                <h2 className="font-display text-2xl font-medium text-hero-navy">Get in touch</h2>
                <p className="mt-3 text-sm leading-relaxed text-hero-muted">
                  We&apos;re here to help with your court document needs across Durham Region and beyond.
                </p>
                <ul className="mt-8 space-y-5 text-sm text-hero-navy/90">
                  <li className="flex items-start gap-3">
                    <ContactIcon>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        <path d="M6.5 4h3l1.5 5-2 1.5a11 11 0 005 5l1.5-2 5 1.5v3a2 2 0 01-2 2C10 19 5 14 5 7.5a2 2 0 012-3.5z" strokeWidth="1.4" />
                      </svg>
                    </ContactIcon>
                    <a href={BUSINESS.phoneHref} className="font-medium hover:text-hero-navy">
                      {BUSINESS.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <ContactIcon>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        <rect x="3" y="6" width="18" height="14" rx="2" strokeWidth="1.4" />
                        <path d="M3 8l9 6 9-6" strokeWidth="1.4" />
                      </svg>
                    </ContactIcon>
                    <a
                      href={`mailto:${BUSINESS.infoEmail}`}
                      className="min-w-0 whitespace-nowrap text-[13px] hover:text-hero-navy min-[400px]:text-sm"
                    >
                      {BUSINESS.infoEmail}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <ContactIcon>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        <rect x="3" y="6" width="18" height="14" rx="2" strokeWidth="1.4" />
                        <path d="M3 8l9 6 9-6" strokeWidth="1.4" />
                      </svg>
                    </ContactIcon>
                    <a
                      href={`mailto:${BUSINESS.receptionEmail}`}
                      className="min-w-0 whitespace-nowrap text-[13px] hover:text-hero-navy min-[400px]:text-sm"
                    >
                      {BUSINESS.receptionEmail}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <ContactIcon>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" strokeWidth="1.4" />
                        <circle cx="12" cy="10" r="2" strokeWidth="1.4" />
                      </svg>
                    </ContactIcon>
                    <span className="leading-relaxed">{BUSINESS.address.full}</span>
                  </li>
                </ul>
              </Reveal>
            </aside>

            <Reveal direction="right" distance={48} delay={0.08} className="min-w-0 p-4 sm:p-6 md:p-8 lg:p-10">
              <ServiceRequestForm services={serviceItems} preselectedServiceId={params.service} />
            </Reveal>
          </div>
        </div>
      </div>

      <section className="site-container-narrow relative mb-10 overflow-hidden rounded-2xl min-[400px]:mb-12 min-[400px]:rounded-3xl">
        <div className="relative min-h-[220px] md:min-h-[260px]">
          <Image
            src={IMAGES.emailBanner}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40" aria-hidden />
          <RevealSection>
            <div className="relative flex min-h-[200px] max-w-xl flex-col justify-center px-5 py-8 min-[400px]:min-h-[220px] min-[400px]:px-8 min-[400px]:py-10 md:min-h-[260px] md:px-12">
              <RevealText>
                <p className="text-[11px] font-semibold tracking-[0.28em] text-hero-muted uppercase">
                  Have questions?
                </p>
                <h2 className="font-display mt-3 text-2xl font-medium text-hero-navy md:text-3xl">
                  Prefer to email your documents directly?
                </h2>
              </RevealText>
              <Reveal direction="up" distance={32} delay={0.1}>
                <p className="mt-3 text-sm leading-relaxed text-hero-muted">
                  You can send your documents to{" "}
                  <a href={`mailto:${BUSINESS.receptionEmail}`} className="font-medium text-hero-navy underline-offset-2 hover:underline">
                    {BUSINESS.receptionEmail}
                  </a>{" "}
                  and we&apos;ll take it from there.
                </p>
              </Reveal>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
