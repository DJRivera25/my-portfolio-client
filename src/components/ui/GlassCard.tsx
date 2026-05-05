"use client";

import React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  hoverLift?: boolean;
  as?: "div" | "article" | "section";
} & Omit<HTMLMotionProps<"div">, "ref">;

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  hoverLift = false,
  as = "div",
  ...rest
}) => {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      className={`relative rounded-2xl border border-hairline bg-surface-glass backdrop-blur-glass shadow-glass-lift ${className}`}
      whileHover={
        hoverLift && !reduceMotion
          ? { y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.45), 0 0 28px rgba(0,224,255,0.20)", borderColor: "rgba(0,224,255,0.35)" }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default GlassCard;
