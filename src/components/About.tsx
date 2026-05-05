"use client";

import React from "react";
import { motion } from "framer-motion";
import { aboutContent } from "../config/content";
import AuroraBackdrop from "./ui/AuroraBackdrop";
import GlassCard from "./ui/GlassCard";
import SectionHeader from "./ui/SectionHeader";

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-brand-navy py-section-sm md:py-section text-white"
    >
      <AuroraBackdrop tint="cyan-violet" />
      <div className="container relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader
          eyebrow={aboutContent.eyebrow}
          heading={aboutContent.heading}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
            className="flex flex-col gap-6"
          >
            {aboutContent.paragraphs.map((text, i) => (
              <motion.p
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6 }}
                className="text-base md:text-lg leading-relaxed text-white/80"
              >
                {text}
              </motion.p>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            className="flex flex-col gap-4"
          >
            {aboutContent.principles.map((principle, i) => (
              <motion.div
                key={principle.title}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="p-5 sm:p-6" hoverLift>
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-eyebrow text-accent-cyan">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-semibold text-white">{principle.title}</h3>
                      <p className="text-sm leading-relaxed text-white/65">{principle.body}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
