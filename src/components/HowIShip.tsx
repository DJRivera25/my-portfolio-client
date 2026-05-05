"use client";

import React from "react";
import { motion } from "framer-motion";
import { howIShipContent } from "../config/content";
import AuroraBackdrop from "./ui/AuroraBackdrop";
import GlassCard from "./ui/GlassCard";
import SectionHeader from "./ui/SectionHeader";

const HowIShip: React.FC = () => {
  return (
    <section
      id="process"
      className="relative overflow-hidden bg-brand-navy py-section-sm md:py-section text-white"
    >
      <AuroraBackdrop tint="yellow-cyan" />
      <div className="container relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader
          eyebrow={howIShipContent.eyebrow}
          heading={howIShipContent.heading}
          subhead={howIShipContent.subhead}
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {howIShipContent.steps.map((step) => (
            <motion.div
              key={step.number}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <GlassCard className="h-full p-6 sm:p-7" hoverLift>
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-eyebrow text-accent-cyan">{step.number}</span>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-white/70">{step.body}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowIShip;
