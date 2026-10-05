import Link from "next/link";

export function CardArrowLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-pale-gray/80 text-hero-navy transition hover:border-hero-navy hover:bg-hero-navy hover:text-white hover:shadow-md active:scale-95"
    >
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </Link>
  );
}
