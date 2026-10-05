import Link from "next/link";
import { Reveal, RevealSection, RevealText } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const links = [
  {
    href: "/services",
    title: "Our Services",
    description: "Process serving, court filing, e-filing, writ searches and occupancy confirmations.",
  },
  {
    href: "/who-we-help",
    title: "Who We Help",
    description: "Legal professionals, businesses and individuals across Ontario.",
  },
  {
    href: "/how-it-works",
    title: "How It Works",
    description: "Submit, review and confirm — a clear path from request to completion.",
  },
  {
    href: "/service-area",
    title: "Service Area",
    description: "Durham Region and surrounding Ontario communities.",
  },
  {
    href: "/testimonials",
    title: "Testimonials",
    description: "Feedback from clients we have supported.",
  },
  {
    href: "/contact",
    title: "Contact",
    description: "Request a quote or submit documents for service.",
  },
];

export function HomeExplore() {
  return (
    <section className="bg-white py-16 md:py-24">
      <RevealSection>
        <div className="site-container-narrow">
          <RevealText>
            <SectionHeading
              eyebrow="Explore"
              title="Everything in one place"
              description="Each topic has its own page — browse services, learn how we work, and get in touch when you are ready."
            />
          </RevealText>
          <ul className="mt-10 grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {links.map((item, i) => (
              <Reveal key={item.href} direction="up" distance={32} delay={0.05 + i * 0.05}>
                <li>
                  <Link
                    href={item.href}
                    className="card-lift flex h-full min-h-[120px] flex-col rounded-2xl border border-pale-gray/60 bg-[#fafbfc] p-6 transition hover:border-hero-navy/20 hover:bg-white"
                  >
                    <h3 className="font-display text-lg font-medium text-hero-navy">{item.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-hero-muted">{item.description}</p>
                    <span className="mt-4 text-sm font-semibold text-hero-navy">Learn more →</span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </RevealSection>
    </section>
  );
}
