"use client";

import React from "react";
import { aboutContent } from "../../config/atelier";

const AboutSection: React.FC = () => (
  <section
    id="about"
    className="relative z-10 mx-auto grid max-w-[1320px] grid-cols-[0.82fr_1.18fr] items-center gap-[72px] px-12 pb-[110px] pt-[120px] max-[880px]:grid-cols-1 max-[880px]:gap-10 max-[880px]:px-[22px] max-[880px]:py-16 max-[560px]:px-4 max-[560px]:py-[52px]"
  >
    {/* portrait */}
    <div className="relative">
      <div className="absolute -left-[18px] -top-[18px] bottom-[18px] right-[18px] z-0 rounded-md border border-atelier-gold/40" />
      <div
        className="relative z-[1] flex aspect-[4/5] items-end justify-center overflow-hidden rounded-md"
        style={{ background: "radial-gradient(120% 90% at 50% 12%, #2a2620 0%, #15140F 55%, #0C0C0E 100%)" }}
      >
        <div
          className="absolute left-1/2 top-[8%] z-0 h-[78%] w-[78%] -translate-x-1/2"
          style={{ background: "radial-gradient(circle, rgba(224,165,61,0.22) 0%, transparent 65%)" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={aboutContent.photo}
          alt="Derem Joshua Rivera"
          className="relative z-[1] h-[97%] w-[96%] object-contain object-bottom"
          style={{ filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.55))" }}
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-transparent to-[#0C0C0E]/55" />
        <div className="absolute bottom-4 left-[18px] z-[3] flex items-center gap-[9px]">
          <span className="h-[7px] w-[7px] rounded-full bg-atelier-green" />
          <span className="font-codet text-[11px] tracking-[0.08em] text-[#D8D2C5]">{aboutContent.photoCaption}</span>
        </div>
      </div>
      <div className="absolute -right-2.5 top-3.5 z-[4] rounded-[5px] border border-white/12 bg-atelier-ink px-3 py-2 font-codet text-[11px] text-atelier-muted">
        {aboutContent.photoTag}
      </div>
    </div>

    {/* copy */}
    <div>
      <div className="mb-[30px] flex items-center gap-3.5">
        <span className="h-px w-11 bg-atelier-gold" />
        <span className="font-codet text-xs tracking-[0.2em] text-atelier-muted">{aboutContent.eyebrow}</span>
      </div>
      <h2 className="m-0 mb-7 font-serifd text-[clamp(34px,4vw,52px)] font-normal leading-[1.05] tracking-[-0.01em] text-atelier-paper">
        {aboutContent.headingTop}
        <br />
        <span className="italic text-atelier-gold">{aboutContent.headingAccent}</span>
        {aboutContent.headingTail}
      </h2>
      <p className="m-0 mb-[22px] max-w-[560px] text-[16.5px] leading-[1.72] text-[#C7C2B8]">
        {aboutContent.paragraphs[0]}
      </p>
      <p className="m-0 max-w-[560px] text-[16.5px] leading-[1.72] text-[#9D988E]">{aboutContent.paragraphs[1]}</p>
      <div className="mt-[42px] flex gap-9 border-t border-white/[0.09] pt-[34px] max-[560px]:flex-wrap max-[560px]:gap-6">
        {aboutContent.facts.map((f) => (
          <div key={f.k}>
            <div className="mb-[9px] font-codet text-[11px] tracking-[0.08em] text-atelier-faint">{f.k}</div>
            <div className="text-[15px] text-atelier-paper">{f.v}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
