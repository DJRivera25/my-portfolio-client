"use client";

import React from "react";
import { scroller } from "react-scroll";
import landingImage from "../images/landing-image.png";
import Image from "next/image";
import { motion } from "framer-motion";

const darkBlue = "#0a0f29";
const yellow = "#FFD600";

const headline = ["I'M DJ,", "a Full Stack Web Developer"];

const handleScrollTo = (to: string) => {
  scroller.scrollTo(to, {
    smooth: true,
    duration: 500,
    offset: -80,
  });
};

const Landing: React.FC = () => {
  return (
    <motion.section
      id="landing"
      className="relative text-white bg-cover bg-center min-h-screen flex flex-col items-center justify-start pt-28"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/background-landing.png')",
        backgroundColor: darkBlue,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Main Image with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 80 }}
        whileHover={{ scale: 1.03, boxShadow: `0 8px 32px 0 ${yellow}55` }}
        className="w-full flex justify-center"
      >
        <Image
          src={landingImage}
          alt="Landing"
          width={800}
          height={400}
          className="w-full max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] lg:max-h-[90vh] object-contain px-4 sm:px-8 md:px-12 transition-transform scale-100"
        />
      </motion.div>

      {/* Floating Content on md+ */}
      <div className="hidden md:block absolute top-1/2 left-1/2 w-full px-4 sm:px-6 md:px-10 transform -translate-x-1/2 -translate-y-1/2">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
            className="grid md:grid-cols-2 gap-8 rounded-xl p-6 sm:p-10 shadow-xl  border border-yellow-400/10"
          >
            {/* Left Content */}
            <div className="space-y-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "5rem" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="h-1 bg-yellow-400 mb-2 rounded-full"
              />
              <div>
                {headline.map((line, i) => (
                  <motion.h2
                    key={i}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.7, type: "spring" }}
                  >
                    {line}
                  </motion.h2>
                ))}
              </div>
              <motion.p
                className="text-white/80 text-justify text-base leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                Passionate about creating beautiful and functional web experiences. As a Full Stack Web Developer, I
                bring ideas to life through thoughtful design and seamless development. With expertise in front-end and
                back-end technologies, I craft responsive, user-centered applications that deliver both aesthetic appeal
                and powerful functionality.
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: `0 0 24px 4px ${yellow}` }}
                whileTap={{ scale: 0.96 }}
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3 rounded-lg shadow-lg transition relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                onClick={() => handleScrollTo("contact")}
                aria-label="Get in touch"
              >
                <span className="relative z-10">GET IN TOUCH</span>
                {/* Ripple effect */}
                <motion.span
                  className="absolute inset-0 rounded-lg"
                  initial={{ opacity: 0 }}
                  whileTap={{ opacity: 0.2, scale: 1.2, background: yellow }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>

            {/* Right Content (hidden on mobile) */}
            <div className="flex flex-col justify-between gap-8 text-white/90">
              {/* About Me */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.7, type: "spring" }}
                whileHover={{ y: -6, boxShadow: `0 4px 24px 0 ${yellow}33` }}
                className="bg-black/30 rounded-lg p-4 shadow border border-yellow-400/10"
              >
                <h4 className="text-xl font-semibold mb-2">ABOUT ME</h4>
                <p className="text-sm text-justify leading-relaxed">
                  Hi, I’m DJ, a Full Stack Web Developer dedicated to creating beautiful and functional web experiences.
                  With a background in engineering and a passion for technology, I transitioned to web development to
                  combine my problem-solving skills with my creative side.
                </p>
                <motion.button
                  whileHover={{ scale: 1.06, color: yellow }}
                  whileTap={{ scale: 0.97 }}
                  className="text-yellow-400 mt-2 inline-block underline underline-offset-4 hover:text-yellow-300 font-semibold"
                  onClick={() => handleScrollTo("about")}
                  aria-label="Learn more about me"
                >
                  Learn More →
                </motion.button>
              </motion.div>

              {/* My Work */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.7, type: "spring" }}
                whileHover={{ y: -6, boxShadow: `0 4px 24px 0 ${yellow}33` }}
                className="bg-black/30 rounded-lg p-4 shadow border border-yellow-400/10"
              >
                <h4 className="text-xl font-semibold mb-2">MY WORK</h4>
                <p className="text-sm text-justify leading-relaxed">
                  I develop web applications using Laravel and Vue.js, focusing on creating responsive, functional
                  solutions with seamless front-end and back-end integration.
                </p>
                <motion.button
                  whileHover={{ scale: 1.06, color: yellow }}
                  whileTap={{ scale: 0.97 }}
                  className="text-yellow-400 mt-2 inline-block underline underline-offset-4 hover:text-yellow-300 font-semibold"
                  onClick={() => handleScrollTo("projects")}
                  aria-label="View projects"
                >
                  View Projects →
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Static Version (only the left part, no about/my work) */}
      <div className="md:hidden mt-10 px-4 max-w-xl text-center space-y-6">
        <motion.h2
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
        >
          I'M DJ, a Full Stack Web Developer
        </motion.h2>
        <motion.p
          className="text-white/80 text-base leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Passionate about creating beautiful and functional web experiences. I bring ideas to life through thoughtful
          design and seamless development.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.08, boxShadow: `0 0 24px 4px ${yellow}` }}
          whileTap={{ scale: 0.96 }}
          className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3 rounded-lg shadow-lg transition relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          onClick={() => handleScrollTo("contact")}
          aria-label="Get in touch"
        >
          <span className="relative z-10">GET IN TOUCH</span>
          {/* Ripple effect */}
          <motion.span
            className="absolute inset-0 rounded-lg"
            initial={{ opacity: 0 }}
            whileTap={{ opacity: 0.2, scale: 1.2, background: yellow }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
    </motion.section>
  );
};

export default Landing;
