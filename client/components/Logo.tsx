import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Codeinsight-Analyzer logo"
    >
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#g)" />
      <g fill="#0B0B0C">
        <circle cx="24" cy="24" r="0" />
      </g>
      <g stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 19l-6 5 6 5" />
        <path d="M30 19l6 5-6 5" />
        <path d="M23 32h2" />
      </g>
    </svg>
  );
}

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark className="h-6 w-6" />
      <span className="font-extrabold">Codeinsight-Analyzer</span>
    </div>
  );
}

export default LogoMark;
