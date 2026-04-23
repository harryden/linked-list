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
      <path d="M10 5V75H45L30 60H22V5H10Z" fill="currentColor" />
      <path
        d="M35 55L55 75L95 35L85 25L55 55L45 45L35 55Z"
        fill="currentColor"
      />
    </svg>
  );
}
