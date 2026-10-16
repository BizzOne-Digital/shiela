import Image from "next/image";
import { IMAGES } from "@/lib/images";

export function LogoWordmark({
  compact = false,
  className = "",
}: {
  variant?: "dark" | "light";
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex min-w-0 max-w-full items-center ${className}`}>
      <Image
        src={IMAGES.logoBrand}
        alt="Angel One Documents — Process Serving & Court Filing Services"
        width={320}
        height={80}
        priority={!compact}
        className={
          compact
            ? "h-9 w-auto max-w-[min(48vw,190px)] rounded-sm object-contain object-left min-[360px]:h-10 min-[360px]:max-w-[210px] sm:h-11"
            : "h-11 w-auto max-w-[min(70vw,260px)] rounded-sm object-contain object-left min-[400px]:h-12 min-[400px]:max-w-[280px] md:h-[52px] md:max-w-[300px]"
        }
      />
    </span>
  );
}
