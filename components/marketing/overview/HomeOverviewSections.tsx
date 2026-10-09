import Link from "next/link";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ServiceTierTable } from "@/components/marketing/overview/ServiceTierTable";
import { Reveal, RevealSection, RevealText } from "@/components/motion/Reveal";
import { BUSINESS } from "@/lib/constants";
import { PROCESS_SERVING_TIERS, WHY_CHOOSE_ITEMS } from "@/lib/overview-content";

function ProseBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-5 text-center text-sm leading-relaxed text-hero-muted md:text-[15px]">
      {children}
    </div>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mx-auto mt-6 max-w-2xl space-y-3 text-left text-sm leading-relaxed text-hero-muted md:text-[15px]">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hero-navy/70" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const cardClass =
  "rounded-2xl border border-pale-gray/60 bg-white p-4 shadow-sm min-[400px]:p-6 md:p-8";

export function HomeOverviewSections() {
  return (
    <>
      <section className="overflow-x-clip border-b border-pale-gray/40 bg-pale-blue/50 py-10 md:py-16">
        <RevealSection>
          <div className="site-container-narrow">
            <RevealText>
              <ProseBlock>
                <p className="text-base text-hero-navy md:text-lg">
                  The court can be complicated. Your service provider options shouldn&apos;t be. Whether you
                  practice law, run a company or are facing a matter on your own, we meet you where you are.
                </p>
                <p>
                  Assisting all clients to ensure the best cost-effective service and filing options are
                  provided for their needs to keep their case on track.
                </p>
              </ProseBlock>
            </RevealText>
          </div>
        </RevealSection>
      </section>

      <section id="overview" className="scroll-mt-24 overflow-x-clip bg-white py-12 md:py-24">
        <RevealSection>
          <div className="site-container-narrow">
            <RevealText>
              <SectionHeading
                eyebrow="1. Executive overview"
                title="Simplifying legal logistics"
                description="At Angel One Documents, we simplify legal logistics by providing fast, accurate, and dependable process serving and court filing solutions."
              />
            </RevealText>
            <Reveal direction="up" distance={40} delay={0.06}>
              <ProseBlock>
                <p className="mt-10">
                  Navigating legal procedures and court deadlines can be overwhelming—our mission is to
                  eliminate friction and uncertainty, ensuring your documents are served and filed seamlessly
                  every single time.
                </p>
                <p>
                  Reliable delivery of legal documents for law firms, businesses and self-represented parties.
                  Every serve is attempted by an experienced professional, tracked and backed by a sworn
                  affidavit that the court will accept. A simple, transparent process — you always know where
                  your documents stand.
                </p>
              </ProseBlock>
            </Reveal>
          </div>
        </RevealSection>
      </section>

      <section id="services" className="scroll-mt-24 overflow-x-clip bg-pale-blue/35 py-12 md:py-24">
        <RevealSection>
          <div className="site-container-narrow">
            <RevealText>
              <SectionHeading eyebrow="2. Core services" title="Process serving & court filing" />
            </RevealText>

            <Reveal direction="up" distance={40} delay={0.05}>
              <div className={`mt-10 md:mt-12 ${cardClass}`}>
                <h3 className="font-display text-xl font-medium text-hero-navy md:text-2xl">
                  A. Process Serving
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-hero-muted md:text-[15px]">
                  Our team of experienced process servers handle delivery of critical legal paperwork with
                  precision and compliance within the Rules of Civil Procedure.
                </p>
                <BulletList
                  items={[
                    "Legal Documents Served: Civil, Family Law, Child Protection, Small Claims and Estates.",
                    "Proof & Verification: Detailed Affidavits / Proof of Service provided promptly upon completion to confirm date, time, address and party served.",
                  ]}
                />
                <ServiceTierTable
                  caption="Process serving turnaround tiers"
                  rows={PROCESS_SERVING_TIERS}
                />
              </div>
            </Reveal>

            <Reveal direction="up" distance={40} delay={0.1}>
              <div className={`mt-6 md:mt-8 ${cardClass}`}>
                <h3 className="font-display text-xl font-medium text-hero-navy md:text-2xl">
                  B. Court Filing Services
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-hero-muted md:text-[15px]">
                  Ensure your court documents are properly submitted ahead of strict legal deadlines.
                </p>
                <BulletList
                  items={[
                    "eFiling & In-Person Filing: Fast submission across electronic filing portals and physical court clerk counters.",
                    "Document Retrieval & Records Management: Swift retrieval of court records, case files, certified copies and Sheriff Office Writ Searches.",
                  ]}
                />
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/#contact" className="btn-primary min-h-[44px] px-6">
                    Request service
                  </Link>
                  <a href={BUSINESS.phoneHref} className="inline-flex min-h-[44px] items-center rounded-full border border-pale-gray bg-pale-blue/50 px-6 text-sm font-medium text-hero-navy hover:bg-pale-blue">
                    {BUSINESS.phone}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </RevealSection>
      </section>

      <section className="overflow-x-clip bg-white py-10 md:py-16">
        <RevealSection>
          <div className="site-container-narrow">
            <Reveal direction="up" distance={32}>
              <div className="mx-auto max-w-3xl rounded-2xl border border-pale-gray/60 bg-pale-blue/30 p-4 min-[400px]:p-6 md:p-8">
                <p className="text-center text-[11px] font-semibold tracking-[0.2em] text-hero-muted uppercase">
                  Important note on legal advice
                </p>
                <p className="mt-4 text-center text-sm leading-relaxed text-hero-muted md:text-[15px]">
                  Our process servers handle the physical delivery and filing of legal documents; we do not
                  provide legal advice, legal opinions, or case interpretation. If you are unsure which
                  documents you need or how service rules apply to your matter, we recommend consulting a
                  qualified legal professional or contacting your local court&apos;s self-help centre. We are
                  always happy to explain how our service process works and help you choose the right delivery
                  option.
                </p>
              </div>
            </Reveal>
          </div>
        </RevealSection>
      </section>

      <section id="why-us" className="scroll-mt-24 overflow-x-clip bg-pale-blue/35 py-12 md:py-24">
        <RevealSection>
          <div className="site-container-narrow">
            <RevealText>
              <SectionHeading
                eyebrow="3. Why choose us"
                title="Why Choose Angel One Documents?"
              />
            </RevealText>
            <Reveal direction="up" distance={40} delay={0.06}>
              <BulletList items={WHY_CHOOSE_ITEMS} />
            </Reveal>
          </div>
        </RevealSection>
      </section>
    </>
  );
}
