import React from "react";

type Tint = "yellow-cyan" | "cyan-violet" | "violet-yellow";

type AuroraBackdropProps = {
  tint?: Tint;
  withGrid?: boolean;
  className?: string;
};

const TINT_BLOBS: Record<Tint, { a: string; b: string; c?: string }> = {
  "yellow-cyan": {
    a: "radial-gradient(circle at 78% 12%, rgba(255,214,0,0.20) 0%, transparent 38%)",
    b: "radial-gradient(circle at 8% 92%, rgba(0,224,255,0.22) 0%, transparent 42%)",
    c: "radial-gradient(circle at 50% 50%, rgba(138,109,255,0.10) 0%, transparent 60%)",
  },
  "cyan-violet": {
    a: "radial-gradient(circle at 12% 18%, rgba(0,224,255,0.22) 0%, transparent 40%)",
    b: "radial-gradient(circle at 84% 88%, rgba(138,109,255,0.20) 0%, transparent 42%)",
  },
  "violet-yellow": {
    a: "radial-gradient(circle at 20% 80%, rgba(138,109,255,0.22) 0%, transparent 42%)",
    b: "radial-gradient(circle at 80% 20%, rgba(255,214,0,0.18) 0%, transparent 40%)",
  },
};

const AuroraBackdrop: React.FC<AuroraBackdropProps> = ({
  tint = "yellow-cyan",
  withGrid = true,
  className = "",
}) => {
  const blobs = TINT_BLOBS[tint];
  const layered = [blobs.a, blobs.b, blobs.c].filter(Boolean).join(", ");

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0" style={{ background: layered }} />
      {withGrid && <div className="absolute inset-0 aurora-grid opacity-60" />}
    </div>
  );
};

export default AuroraBackdrop;
