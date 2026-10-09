import Image from "next/image";
import { IMAGES } from "@/lib/images";

function BlendedCompanyName({
  variant,
  compact,
}: {
  variant: "dark" | "light";
  compact?: boolean;
}) {
  const foreground = variant === "dark" ? "text-hero-navy" : "text-white";
  const ghost = variant === "dark" ? "text-[#8fa4c4]/55" : "text-white/30";

  return (
    <span
      className={`relative inline-block max-w-full px-0.5 font-display font-medium leading-none tracking-tight ${
        compact
          ? "text-[0.82rem] min-[360px]:text-[0.95rem] sm:text-[1.05rem] md:text-[1.15rem]"
          : "text-[1.05rem] min-[400px]:text-[1.28rem] md:text-[1.42rem]"
      }`}
    >
      <span
        className={`pointer-events-none absolute left-1/2 top-1/2 z-0 max-w-[140%] -translate-x-1/2 -translate-y-1/2 truncate text-[0.62em] font-medium tracking-[0.12em] mix-blend-multiply min-[400px]:tracking-[0.16em] ${ghost}`}
        aria-hidden
      >
        DOCUMENTS
      </span>
      <span className={`relative z-10 whitespace-nowrap ${foreground}`}>ANGEL ONE</span>
    </span>
  );
}

export function LogoWordmark({
  variant = "dark",
  compact = false,
  className = "",
}: {
  variant?: "dark" | "light";
  compact?: boolean;
  className?: string;
}) {
  const ring = variant === "dark" ? "ring-hero-navy/15 shadow-sm" : "ring-white/30 shadow-md";

  return (
    <span className={`inline-flex min-w-0 max-w-full items-center gap-1.5 min-[400px]:gap-2 ${className}`}>
      <span
        className={`relative z-10 shrink-0 overflow-hidden rounded-full ring-2 ${ring} ${
          compact
            ? "h-8 w-8 min-[360px]:h-9 min-[360px]:w-9 sm:h-10 sm:w-10"
            : "h-10 w-10 min-[400px]:h-11 min-[400px]:w-11 md:h-12 md:w-12"
        }`}
      >
        <Image
          src={IMAGES.logoSs2}
          alt=""
          fill
          sizes={compact ? "40px" : "48px"}
          className="object-cover object-[50%_18%]"
          priority={!compact}
        />
      </span>
      <BlendedCompanyName variant={variant} compact={compact} />
    </span>
  );
}
