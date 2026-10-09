import { RevealAlternate, RevealSection, RevealText } from "@/components/motion/Reveal";
import type { MarketingTestimonial } from "@/lib/marketing-data";

export function TestimonialsSection({
  testimonials,
  showHeading = true,
}: {
  testimonials: MarketingTestimonial[];
  showHeading?: boolean;
}) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-[#f4f7fb] py-16 md:py-20">
      <RevealSection>
        <div className="site-container-narrow">
          {showHeading ? (
            <RevealText>
              <h2 className="font-display text-center text-2xl font-medium text-hero-navy min-[400px]:text-3xl">Testimonials</h2>
            </RevealText>
          ) : null}
          <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${showHeading ? "mt-10" : ""}`}>
            {testimonials.map((t, i) => (
              <RevealAlternate key={t._id} index={i}>
                <blockquote className="card-lift flex h-full flex-col rounded-2xl border border-pale-gray/50 bg-white p-6">
                  <div className="mb-4 font-display text-4xl leading-none text-hero-sky" aria-hidden>&ldquo;</div>
                  <p className="flex-1 text-sm leading-relaxed text-hero-muted">&ldquo;{t.text}&rdquo;</p>
                  <footer className="mt-5 text-sm font-semibold text-hero-navy">
                    {t.clientName}
                    {t.clientRole ? <span className="block font-normal text-hero-muted">{t.clientRole}</span> : null}
                  </footer>
                </blockquote>
              </RevealAlternate>
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
