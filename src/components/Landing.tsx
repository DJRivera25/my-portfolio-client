"use client";

import React from "react";
import { scroller } from "react-scroll";
import landingImage from "../images/landing-image.png";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { heroContent } from "../config/content";
import { NAV_SCROLL_OFFSET } from "../config/navigation";

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
    <motion.section
      id="landing"
      className="relative text-white bg-cover bg-center min-h-screen flex flex-col items-center justify-start pt-28 pb-16 md:pb-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/background-landing.png')",
        backgroundColor: "#0a0f29",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 80 }}
        className="w-full flex justify-center"
      >
        <Image
          src={landingImage}
          alt="Derem Joshua Rivera — fullstack engineer portfolio hero illustration"
          width={800}
          height={400}
          priority
          className="w-full max-h-[55vh] sm:max-h-[65vh] md:max-h-[75vh] lg:max-h-[85vh] object-contain px-4 sm:px-8 md:px-12"
        />
      </motion.div>

      <div className="hidden md:block absolute top-1/2 left-1/2 w-full px-4 sm:px-6 md:px-10 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none md:pointer-events-auto">
        <div className="container mx-auto max-w-6xl pointer-events-auto">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
            className="grid md:grid-cols-2 gap-8 rounded-2xl p-6 sm:p-10"
          >
            <div className="space-y-6 text-left">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "5rem" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="h-1 bg-yellow-400 mb-2 rounded-full"
              />
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
              >
                {heroContent.headline}
              </motion.h1>
              <motion.p
                className="text-white/85 text-base md:text-lg leading-relaxed max-w-prose"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
              >
                {heroContent.subhead}
              </motion.p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                className="inline-block bg-yellow-400 text-black font-bold px-8 py-3 rounded-lg shadow-lg relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                onClick={() => handleScrollTo("contact")}
                aria-label={heroContent.primaryCta}
              >
                <span className="relative z-10 uppercase tracking-wide text-sm">{heroContent.primaryCta}</span>
              </motion.button>
            </div>

            <div className="flex flex-col justify-between gap-6 text-white/90">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65, duration: 0.7, type: "spring" }}
                className="bg-black/30 rounded-xl p-5 shadow border border-yellow-400/10"
              >
                <h2 className="text-lg font-bold mb-2 text-yellow-300 tracking-wide">{heroContent.secondaryAbout}</h2>
                <p className="text-sm leading-relaxed text-white/85">{heroContent.teaserAbout}</p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  className="text-yellow-400 mt-3 inline-block underline underline-offset-4 font-semibold text-sm"
                  onClick={() => handleScrollTo("about")}
                  aria-label="Go to about section"
                >
                  Learn more →
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.7, type: "spring" }}
                className="bg-black/30 rounded-xl p-5 shadow border border-yellow-400/10"
              >
                <h2 className="text-lg font-bold mb-2 text-yellow-300 tracking-wide">{heroContent.secondaryWork}</h2>
                <p className="text-sm leading-relaxed text-white/85">{heroContent.teaserWork}</p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  className="text-yellow-400 mt-3 inline-block underline underline-offset-4 font-semibold text-sm"
                  onClick={() => handleScrollTo("projects")}
                  aria-label="Go to projects section"
                >
                  View projects →
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="md:hidden mt-10 px-4 max-w-xl mx-auto text-center space-y-6 w-full">
        <motion.h1
          className="text-2xl sm:text-3xl font-bold leading-tight px-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, type: "spring" }}
        >
          {heroContent.headline}
        </motion.h1>
        <motion.p
          className="text-white/85 text-base leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          {heroContent.subhead}
        </motion.p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            className="rounded-lg border border-yellow-400/40 bg-black/30 py-3 text-sm font-semibold text-yellow-300"
            onClick={() => handleScrollTo("about")}
          >
            {heroContent.secondaryAbout}
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            className="rounded-lg border border-yellow-400/40 bg-black/30 py-3 text-sm font-semibold text-yellow-300"
            onClick={() => handleScrollTo("projects")}
          >
            {heroContent.secondaryWork}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default Landing;
