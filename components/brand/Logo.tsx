import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex min-w-0 items-center gap-2 text-hero-navy min-[400px]:gap-3 ${className}`}
      aria-label="Angel One Documents — Home"
    >
      <LogoMark className="h-9 w-9 shrink-0 min-[400px]:h-10 min-[400px]:w-10 md:h-[42px] md:w-[42px]" />
      <span className="flex min-w-0 flex-col leading-[1.05]">
        <span className="font-display text-[1.05rem] font-medium tracking-tight text-hero-navy min-[360px]:text-[1.2rem] min-[400px]:text-[1.28rem] md:text-[1.42rem]">
          ANGEL ONE
        </span>
        <span className="font-display mt-0.5 text-[0.5rem] font-medium tracking-[0.22em] text-hero-navy min-[400px]:mt-1 min-[400px]:text-[0.58rem] min-[400px]:tracking-[0.28em] md:text-[0.62rem]">
          DOCUMENTS
        </span>
      </span>
    </Link>
  );
}
