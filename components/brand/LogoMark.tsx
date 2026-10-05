export function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="6" y="6" width="20" height="26" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="12" y="10" width="20" height="26" rx="1.5" stroke="currentColor" strokeWidth="1.6" fill="white" />
      <path d="M16 16h12M16 20h10M16 24h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
