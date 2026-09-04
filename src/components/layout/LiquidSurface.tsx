"use client";

interface LiquidSurfaceProps {
  calm?: boolean;
}

export function LiquidSurface({ calm = false }: LiquidSurfaceProps) {
  return (
    <div
      className="clinical-backdrop"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      {/* Soft warm ambient lighting accents */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(11, 90, 66, 0.04) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(224, 90, 56, 0.03) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
