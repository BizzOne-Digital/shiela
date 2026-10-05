export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as = "h2",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
}) {
  const centered = align === "center";

  return (
    <div className={centered ? "text-center" : "text-left"}>
      <div
        className={`flex max-w-full items-center gap-2 min-[400px]:gap-3 ${centered ? "mx-auto w-fit" : ""}`}
      >
        <span className="hidden h-px w-6 bg-gradient-to-r from-transparent via-hero-navy/25 to-hero-navy/40 min-[400px]:block min-[400px]:w-8" aria-hidden />
        <p className="text-[10px] font-semibold tracking-[0.18em] text-hero-muted uppercase min-[400px]:text-[11px] min-[400px]:tracking-[0.28em]">
          {eyebrow}
        </p>
        <span className="hidden h-px w-6 bg-gradient-to-l from-transparent via-hero-navy/25 to-hero-navy/40 min-[400px]:block min-[400px]:w-8" aria-hidden />
      </div>
      {as === "h1" ? (
        <h1 className="text-balance-safe font-display mt-4 text-[1.75rem] font-medium text-hero-navy min-[400px]:text-4xl md:text-[2.75rem] md:leading-tight">
          {title}
        </h1>
      ) : (
        <h2 className="text-balance-safe font-display mt-4 text-2xl font-medium text-hero-navy min-[400px]:text-3xl md:text-[2.5rem] md:leading-[1.15]">
          {title}
        </h2>
      )}
      {description ? (
        <p
          className={`mt-4 text-sm leading-relaxed text-hero-muted md:text-[15px] ${
            centered ? "mx-auto max-w-2xl" : "max-w-xl"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
