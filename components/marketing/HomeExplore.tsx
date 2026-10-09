import Link from "next/link";

const cards = [
  {
    title: "Services",
    href: "/#services",
    description: "Process serving, filing, searches, and more.",
  },
  {
    title: "Who We Help",
    href: "/#who-we-help",
    description: "Legal professionals, businesses, and the public.",
  },
  {
    title: "Contact",
    href: "/#contact",
    description: "Request a quote or submit a service request.",
  },
];

export function HomeExplore() {
  return (
    <section className="site-container-narrow py-12">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-pale-gray/60 bg-white p-6 shadow-sm transition hover:border-hero-navy/20 hover:shadow-md"
          >
            <h2 className="font-display text-lg font-medium text-hero-navy">{card.title}</h2>
            <p className="mt-2 text-sm text-hero-muted">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
