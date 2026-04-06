"use client";

import React from "react";
import aboutImage from "../images/about-image.png";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { aboutContent } from "../config/content";

const yellow = "#FFD600";

const About: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="about"
      className="relative py-section-sm md:py-section border-t border-yellow-300/40 min-h-[70vh] flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, #f7fafc 80%, #e3e9f7 100%)` }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <div className="absolute left-0 right-0 top-0 h-1 pointer-events-none z-10" style={{ filter: "blur(4px)" }}>
        <div className="w-full h-full bg-gradient-to-r from-yellow-400/60 via-yellow-200/40 to-yellow-400/60" />
      </div>
      <div className="container mx-auto px-4 sm:px-8 lg:px-20 flex justify-center max-w-7xl">
        <div className="bg-white/90 rounded-3xl shadow-2xl border border-yellow-100 flex flex-col xl:flex-row items-center justify-center gap-10 p-8 md:p-10 w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, type: "spring" }}
            whileHover={reduceMotion ? undefined : { scale: 1.03, boxShadow: `0 0 48px 8px ${yellow}44` }}
            className="flex justify-center relative shrink-0"
          >
            <div className="absolute inset-0 z-0 rounded-full" style={{ boxShadow: `0 0 80px 10px ${yellow}33` }} />
            <Image
              src={aboutImage}
              alt="Derem Joshua Rivera"
              width={400}
              height={400}
              className="w-[260px] h-[260px] md:w-[360px] md:h-[360px] rounded-full object-contain bg-[#fffc67] border-4 border-yellow-400 z-10 shadow-lg"
            />
          </motion.div>
          <motion.div
            className="max-w-2xl text-base md:text-lg leading-relaxed text-brand-navy"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <motion.h2
              className="text-center xl:text-left text-brand-navy text-3xl md:text-4xl font-bold mb-10 relative"
              initial={{ opacity: 0, y: -24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.7, type: "spring" }}
            >
              {aboutContent.heading}
              <motion.div
                className="absolute left-1/2 xl:left-0 -translate-x-1/2 xl:translate-x-0 bottom-[-10px] w-24 h-2 rounded-full"
                style={{ background: yellow, filter: "blur(2px)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.25, duration: 0.6, type: "spring" }}
              />
            </motion.h2>
            {aboutContent.paragraphs.map((text, i) => (
              <motion.p
                key={i}
                className="mb-6 font-normal text-brand-navy/90 text-left max-w-readable mx-auto xl:mx-0"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.65, type: "spring" }}
              >
                {text}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
