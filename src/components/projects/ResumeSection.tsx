"use client";

import React from "react";
import { motion } from "framer-motion";
import { resumeSectionContent } from "../../config/content";

type ResumeSectionProps = {
  resumeUrl: string | null;
};

export default function ResumeSection({ resumeUrl }: ResumeSectionProps) {
  return (
    <motion.section
      id="resume"
      className="mt-16 w-full max-w-4xl mx-auto px-2"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, type: "spring" }}
      aria-labelledby="resume-heading"
    >
      <h3
        id="resume-heading"
        className="text-2xl md:text-3xl font-bold text-center text-accent mb-2 tracking-tight"
      >
        {resumeSectionContent.heading}
      </h3>
      <p className="text-center text-white/70 text-sm md:text-base mb-8 max-w-2xl mx-auto">
        {resumeSectionContent.subhead}
      </p>

      {resumeUrl ? (
        <div className="w-full">
          <motion.div
            className="border border-white/10 rounded-xl overflow-hidden shadow-lg bg-black/20"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
          >
            <iframe
              src={`${resumeUrl}#toolbar=0`}
              title={resumeSectionContent.iframeTitle}
              className="w-full h-72 sm:h-[55vh] md:h-[75vh] rounded-md bg-white/5"
            />
          </motion.div>
          <div className="text-center mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-accent hover:bg-yellow-300 text-black font-bold rounded-lg shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {resumeSectionContent.viewDownload}
            </a>
            <p className="text-white/50 text-xs sm:text-sm max-w-md text-center sm:text-left">
              PDF preview can vary by browser. Use the button to open or download the file.
            </p>
          </div>
        </div>
      ) : (
        <p className="text-white/60 text-center italic py-8 rounded-xl border border-dashed border-white/15 bg-black/20">
          {resumeSectionContent.noResume}
        </p>
      )}
    </motion.section>
  );
}
