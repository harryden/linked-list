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
    1: "text-4xl md:text-5xl font-semibold tracking-tight",
    2: "text-2xl md:text-3xl font-semibold tracking-tight",
    3: "text-xl md:text-2xl font-medium tracking-tight",
    4: "text-xl md:text-2xl font-semibold",
    5: "text-lg md:text-xl font-medium",
    6: "text-base md:text-lg font-medium",
  }[level];

  return (
    <Component className={cn(levelStyles, className)} style={style}>
      {children}
    </Component>
  );
};

export default Heading;
