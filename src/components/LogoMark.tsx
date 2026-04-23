interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({
  size = 26,
  className = "text-brand-accent",
}: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-labelledby="logo-title"
    >
      <title id="logo-title">Linked List Logo</title>
      <path d="M15 10V85H50L35 70H27V10H15Z" fill="currentColor" />
      <path
        d="M40 60L55 75L90 40L82 32L55 59L48 52L40 60Z"
        fill="currentColor"
      />
    </svg>
  );
}
