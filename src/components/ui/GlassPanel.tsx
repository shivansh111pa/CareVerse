import type { ReactNode, CSSProperties, ElementType } from "react";

type GlassVariant = "default" | "auth" | "calm";

interface GlassPanelProps {
  children: ReactNode;
  variant?: GlassVariant;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
}

const variantClass: Record<GlassVariant, string> = {
  default: "glass-panel",
  auth: "glass-panel glass-panel--auth",
  calm: "glass-panel glass-panel--calm",
};

export function GlassPanel({
  children,
  variant = "default",
  className = "",
  style,
  as: Tag = "div",
}: GlassPanelProps) {
  return (
    <Tag className={`${variantClass[variant]} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}
