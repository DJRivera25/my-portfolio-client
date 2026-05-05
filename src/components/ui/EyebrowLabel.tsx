import React from "react";

type EyebrowLabelProps = {
  children: React.ReactNode;
  withDot?: boolean;
  dotColor?: string;
  className?: string;
};

const EyebrowLabel: React.FC<EyebrowLabelProps> = ({
  children,
  withDot = false,
  dotColor = "#00E0FF",
  className = "",
}) => (
  <span
    className={`inline-flex items-center gap-2 text-eyebrow uppercase text-white/60 ${className}`}
  >
    {withDot && (
      <span
        className="inline-block h-1.5 w-1.5 rounded-full animate-pulse-soft"
        style={{ background: dotColor, boxShadow: `0 0 8px ${dotColor}` }}
        aria-hidden
      />
    )}
    {children}
  </span>
);

export default EyebrowLabel;
