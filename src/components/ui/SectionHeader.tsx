"use client";

import React from "react";
import { motion } from "framer-motion";
import EyebrowLabel from "./EyebrowLabel";

type SectionHeaderProps = {
  eyebrow: string;
  heading: React.ReactNode;
  subhead?: string;
  withDot?: boolean;
  align?: "left" | "center";
  className?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  heading,
  subhead,
  withDot = false,
  align = "left",
  className = "",
}) => {
  const alignClass = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, type: "spring" }}
      className={`flex flex-col gap-4 max-w-3xl ${alignClass} ${className}`}
    >
      <EyebrowLabel withDot={withDot}>{eyebrow}</EyebrowLabel>
      <h2 className="text-display-lg text-white">{heading}</h2>
      {subhead && <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-readable">{subhead}</p>}
    </motion.div>
  );
};

export default SectionHeader;
