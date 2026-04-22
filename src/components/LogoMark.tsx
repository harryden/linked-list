interface LogoMarkProps {
  size?: number;
}

export function LogoMark({ size = 26 }: LogoMarkProps) {
  return (
    <div
      style={{ width: size, height: size, borderRadius: 6 }}
      className="bg-brand-accent flex items-center justify-center flex-shrink-0"
    >
      <span className="sr-only">Linked List Logo</span>
      <span
        style={{ fontSize: size * 0.54, lineHeight: 1, letterSpacing: -0.5 }}
        className="text-white font-semibold select-none"
      >
        L
      </span>
    </div>
  );
}
