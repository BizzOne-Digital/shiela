import Link from "next/link";
import { LogoWordmark } from "@/components/brand/LogoWordmark";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex min-w-0 max-w-[min(100%,calc(100%-7.5rem))] shrink items-center sm:max-w-none ${className}`}
      aria-label="Angel One Documents — Home"
    >
      <LogoWordmark variant="dark" compact />
    </Link>
  );
}
