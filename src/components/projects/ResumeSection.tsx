"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, MapPin, Mail, Phone } from "lucide-react";
import { resumeContent, resumeSectionContent } from "../../config/content";
import { siteConfig } from "@/lib/site";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";

type ResumeSectionProps = {
  resumeUrl: string | null;
};

export default function ResumeSection({ resumeUrl }: ResumeSectionProps) {
  return (
    <motion.section
      id="resume"
      className="mt-16 w-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, type: "spring" }}
      aria-label="Resume"
    >
      <SectionHeader
        eyebrow={resumeSectionContent.eyebrow}
        heading={resumeSectionContent.heading}
        subhead={resumeSectionContent.subhead}
        className="mb-12"
      />

      <GlassCard className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {resumeContent.identity.name}
            </h4>
            <p className="text-eyebrow uppercase text-accent-cyan">{resumeContent.identity.title}</p>
            <div className="mt-3 grid gap-2 text-sm text-white/70 sm:grid-cols-1">
              <span className="inline-flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-accent-cyan mt-0.5" aria-hidden />
                <span>{resumeContent.identity.location}</span>
              </span>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex items-center gap-2 transition hover:text-accent-cyan"
              >
                <Mail className="h-4 w-4 shrink-0 text-accent-cyan" aria-hidden />
                <span className="break-all">{siteConfig.contact.email}</span>
              </a>
              <a
                href={siteConfig.contact.phoneHref}
                className="inline-flex items-center gap-2 transition hover:text-accent-cyan"
              >
                <Phone className="h-4 w-4 shrink-0 text-accent-cyan" aria-hidden />
                <span>{siteConfig.contact.phone}</span>
              </a>
            </div>
          </div>

          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold uppercase tracking-wide text-brand-navy shadow-brand-glow transition hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Download className="h-4 w-4" aria-hidden />
              {resumeSectionContent.viewDownload}
            </a>
          ) : (
            <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-dashed border-hairline-strong px-4 py-2.5 text-xs uppercase tracking-wide text-white/45">
              {resumeSectionContent.noResumeFile}
            </span>
          )}
        </div>
      </GlassCard>

      <div className="mt-6">
        <h4 className="text-eyebrow uppercase text-white/55 mb-3">Professional summary</h4>
        <GlassCard className="p-6 sm:p-7">
          <p className="text-base leading-relaxed text-white/80">{resumeContent.summary}</p>
        </GlassCard>
      </div>

      <div className="mt-6">
        <h4 className="text-eyebrow uppercase text-white/55 mb-3">Core competencies</h4>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {resumeContent.competencies.map((group) => (
            <motion.div
              key={group.category}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.45, type: "spring" }}
            >
              <GlassCard className="h-full p-5" hoverLift>
                <h5 className="text-eyebrow uppercase text-accent-cyan mb-3">{group.category}</h5>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-hairline-strong bg-surface-glass px-2 py-1 text-xs text-white/75"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-6">
        <h4 className="text-eyebrow uppercase text-white/55 mb-3">Professional experience</h4>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col gap-4"
        >
          {resumeContent.experience.map((job) => (
            <motion.div
              key={`${job.company}-${job.period}`}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <GlassCard className="p-6 sm:p-7" hoverLift>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="flex flex-col">
                    <h5 className="text-lg font-semibold text-white">{job.role}</h5>
                    <p className="text-sm text-white/70">{job.company}</p>
                  </div>
                  <span className="text-eyebrow uppercase text-accent-cyan shrink-0">{job.period}</span>
                </div>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {job.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-white/75">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-cyan" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
