import { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  as?: ElementType;
  style?: React.CSSProperties;
}

const Heading = ({
  children,
  level = 1,
  className,
  as,
  style,
}: HeadingProps) => {
  const Component = as ?? (`h${level}` as ElementType);

  const levelStyles = {
    1: "font-display font-black text-5xl md:text-7xl tracking-tight leading-none",
    2: "font-display font-black text-3xl md:text-5xl tracking-tight leading-none",
    3: "text-xl md:text-2xl font-semibold tracking-tight",
    4: "text-lg md:text-xl font-semibold",
    5: "text-base md:text-lg font-medium",
    6: "text-sm md:text-base font-medium",
  }[level];

  return (
    <Component className={cn(levelStyles, className)} style={style}>
      {children}
    </Component>
  );
};

export default Heading;
