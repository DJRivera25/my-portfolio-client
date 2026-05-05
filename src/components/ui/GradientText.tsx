import React from "react";

type Variant = "yellow" | "cyan" | "violet";

type GradientTextProps = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

const GRADIENTS: Record<Variant, string> = {
  yellow: "linear-gradient(110deg, #FFD600 0%, #FFF6B0 100%)",
  cyan: "linear-gradient(110deg, #00E0FF 0%, #FFFFFF 100%)",
  violet: "linear-gradient(110deg, #FFFFFF 30%, #8A6DFF 100%)",
};

const GradientText: React.FC<GradientTextProps> = ({ children, variant = "yellow", className = "" }) => (
  <span
    className={`bg-clip-text text-transparent ${className}`}
    style={{ backgroundImage: GRADIENTS[variant] }}
  >
    {children}
  </span>
);

export default GradientText;
