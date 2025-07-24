"use client";

import React from "react";
import aboutImage from "../images/about-image.png";
import Image from "next/image";
import { motion } from "framer-motion";

const darkBlue = "#0a0f29";
const yellow = "#FFD600";
const lightBg = "#f7fafc";

const aboutParagraphs = [
  "I’m Derem Joshua Rivera, a Full Stack Web Developer who transforms ideas into engaging digital solutions. With roots in engineering and a strong drive to innovate, I transitioned into web development to merge my technical expertise with a passion for building creative, user-centered experiences.",
  "I specialize in building intuitive, responsive applications that serve both users and business goals. From designing seamless front-end interfaces with Vue.js to developing powerful back-end systems using Laravel, I thrive in every stage of the development process.",
  "My mission is to help individuals and organizations succeed in the digital space through thoughtful, efficient, and impactful solutions. Outside of coding, I enjoy spending time with my family, studying the Word of God, and playing guitar — using my gifts to glorify Him and serve others.",
];

const About: React.FC = () => {
  return (
    <motion.section
      id="about"
      className="relative py-20 border-t border-yellow-300 min-h-[70vh] flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, #f7fafc 80%, #e3e9f7 100%)` }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Glowing border accent */}
      <div className="absolute left-0 right-0 top-0 h-1 pointer-events-none z-10" style={{ filter: "blur(4px)" }}>
        <div className="w-full h-full bg-gradient-to-r from-yellow-400/60 via-yellow-200/40 to-yellow-400/60" />
      </div>
      <div className="container mx-auto sm:px-20 flex justify-center">
        <div className="bg-white/90 rounded-3xl shadow-2xl border border-yellow-100 flex flex-col xl:flex-row items-center justify-center gap-10 p-10 w-full max-w-8xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            whileHover={{ scale: 1.04, boxShadow: `0 0 48px 8px ${yellow}55` }}
            className="flex justify-center relative"
          >
            <div className="absolute inset-0 z-0 rounded-full" style={{ boxShadow: `0 0 80px 10px ${yellow}33` }} />
            <Image
              src={aboutImage}
              alt="About"
              width={400}
              height={400}
              className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full object-contain bg-[#fffc67] border-4 border-yellow-400 z-10 shadow-lg"
            />
          </motion.div>
          <motion.div
            className="max-w-2xl text-lg leading-relaxed"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.18 } },
            }}
          >
            <motion.h2
              className="text-center text-[#0a0f29] text-4xl font-bold mb-10 relative "
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, type: "spring" }}
            >
              ABOUT ME
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-24 h-2 rounded-full"
                style={{ background: yellow, filter: "blur(2px)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              />
            </motion.h2>
            {aboutParagraphs.map((text, i) => (
              <motion.p
                key={i}
                className="mb-6 font-semibold text-justify text-[#0a0f29]/90"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.18, duration: 0.7, type: "spring" }}
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
