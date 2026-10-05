import { Reveal, RevealSection } from "@/components/motion/Reveal";

const items = [
  {
    label: "Court-ready documentation",
    icon: (
      <path
        d="M8 4h8l4 4v14H4V4h4zM9 12h6M9 15h4"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    ),
  },
  {
    label: "Secure PDF uploads",
    icon: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="1.5" strokeWidth="1.4" />
        <path d="M8 11V8a4 4 0 118 0v3" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: "Durham Region focus",
    icon: (
      <>
        <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" strokeWidth="1.4" />
        <circle cx="12" cy="10" r="2" strokeWidth="1.4" />
      </>
    ),
  },
  {
    label: "Clear next steps",
    icon: (
      <>
        <path d="M5 12h14M12 5v14" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" strokeWidth="1.4" />
      </>
    ),
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-black/[0.04] bg-[#f8fafc]">
      <RevealSection>
        <div className="site-container py-5 sm:py-6">
          <ul className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 md:grid-cols-4 md:gap-6">
            {items.map((item, i) => (
              <Reveal key={item.label} direction="up" distance={20} delay={0.05 * i}>
                <li className="flex min-h-[52px] items-center gap-3 rounded-xl bg-white/70 px-3 py-3 shadow-[0_1px_0_rgba(10,31,68,0.04)] backdrop-blur-sm md:px-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hero-sky text-hero-navy"
                    aria-hidden
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      {item.icon}
                    </svg>
                  </span>
                  <span className="text-[13px] font-medium leading-snug text-hero-navy/90">
                    {item.label}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </RevealSection>
    </section>
  );
}
