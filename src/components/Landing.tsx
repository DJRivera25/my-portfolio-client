"use client";

import React from "react";
import { scroller } from "react-scroll";
import { motion, useReducedMotion } from "framer-motion";
import { heroContent } from "../config/content";
import { NAV_SCROLL_OFFSET } from "../config/navigation";
import AuroraBackdrop from "./ui/AuroraBackdrop";
import EyebrowLabel from "./ui/EyebrowLabel";
import GradientText from "./ui/GradientText";

const Landing: React.FC = () => {
  const reduceMotion = useReducedMotion();

  const handleScrollTo = (to: string) => {
    scroller.scrollTo(to, {
      smooth: !reduceMotion,
      duration: reduceMotion ? 0 : 500,
      offset: NAV_SCROLL_OFFSET,
    });
  };

  return (
    <section
      id="landing"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-navy text-white pt-28 pb-20"
    >
      <AuroraBackdrop tint="yellow-cyan" />
      <div className="container relative z-10 mx-auto max-w-5xl px-6 sm:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="flex flex-col items-start gap-8"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
          >
            <EyebrowLabel withDot>{heroContent.eyebrow}</EyebrowLabel>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, type: "spring" }}
            className="text-display-xl"
          >
            {heroContent.headline}{" "}
            <GradientText variant="yellow">{heroContent.headlinePunch}</GradientText>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
            className="max-w-readable text-base md:text-lg text-white/75 leading-relaxed"
          >
            {heroContent.subhead}
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <button
              type="button"
              onClick={() => handleScrollTo("contact")}
              className="rounded-lg bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-navy shadow-brand-glow transition hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={heroContent.primaryCta}
            >
              {heroContent.primaryCta} →
            </button>
            <button
              type="button"
              onClick={() => handleScrollTo("projects")}
              className="rounded-lg border border-hairline-strong bg-surface-glass backdrop-blur-glass px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-accent-cyan hover:text-accent-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              aria-label={heroContent.secondaryCta}
            >
              {heroContent.secondaryCta}
            </button>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-eyebrow uppercase text-white/45"
          >
            {heroContent.stack.map((item, i) => (
              <React.Fragment key={item}>
                <span>{item}</span>
                {i < heroContent.stack.length - 1 && <span aria-hidden>·</span>}
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Landing;
