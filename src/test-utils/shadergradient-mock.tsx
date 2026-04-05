import React from "react";

export const ShaderGradientCanvas = ({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) => <div style={style}>{children}</div>;

export const ShaderGradient = (_props: Record<string, unknown>) => null;
