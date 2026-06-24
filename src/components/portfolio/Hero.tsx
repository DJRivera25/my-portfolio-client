"use client";

import React from "react";
import { heroContent, terminalScript } from "../../config/atelier";
import { useTypewriter } from "../../hooks/useTypewriter";
import { useMagnetic } from "../../hooks/useMagnetic";
import { usePortfolio } from "./PortfolioContext";

const Hero: React.FC = () => {
  const { scrollToId } = usePortfolio();
  const { revealed } = useTypewriter(terminalScript);
  const ctaRef = useMagnetic<HTMLButtonElement>();

  return (
    <section
      id="hero"
      className="relative z-10 mx-auto grid max-w-[1320px] grid-cols-[1.15fr_0.85fr] items-center gap-14 px-12 pt-12 max-[880px]:grid-cols-1 max-[880px]:gap-9 max-[880px]:px-[22px] max-[880px]:pt-6 max-[560px]:gap-[30px] max-[560px]:px-4 max-[560px]:pt-3.5"
      style={{ minHeight: "calc(100vh - 200px)" }}
    >
      {/* left */}
      <div>
        <div className="atelier-reveal mb-[34px] flex items-center gap-3.5" style={{ animationDelay: ".05s" }}>
          <span className="h-px w-11 bg-atelier-gold" />
          <span className="font-codet text-xs uppercase tracking-[0.2em] text-atelier-muted">
            {heroContent.eyebrow}
          </span>
        </div>

        <h1 className="m-0 font-grotesk text-[clamp(46px,6.6vw,92px)] font-semibold leading-[0.96] tracking-[-0.03em] text-atelier-paper">
          {heroContent.headlineLines.map((line, i) => (
            <span key={line} className="atelier-reveal block" style={{ animationDelay: `${0.12 + i * 0.1}s` }}>
              {line}
            </span>
          ))}
          <span
            className="atelier-reveal block font-serifd font-normal italic tracking-[-0.01em] text-atelier-gold"
            style={{ animationDelay: ".32s" }}
          >
            {heroContent.headlineAccent}
          </span>
        </h1>

        <p
          className="atelier-reveal mt-[34px] max-w-[482px] text-base leading-[1.66] text-atelier-muted"
          style={{ animationDelay: ".45s" }}
        >
          {heroContent.intro}
        </p>

        <div
          className="atelier-reveal mt-10 flex flex-wrap items-center gap-[18px] max-[480px]:flex-col max-[480px]:items-stretch max-[480px]:gap-3"
          style={{ animationDelay: ".55s" }}
        >
          <button
            ref={ctaRef}
            type="button"
            onClick={() => scrollToId("contact")}
            className="cursor-pointer whitespace-nowrap rounded-[7px] border-none bg-atelier-gold px-7 py-[15px] font-grotesk text-[15px] font-semibold text-atelier-ink [will-change:transform]"
          >
            {heroContent.primaryCta}
          </button>
          <button
            type="button"
            onClick={() => scrollToId("work")}
            className="cursor-pointer whitespace-nowrap rounded-[7px] border border-white/[0.16] bg-transparent px-[26px] py-[15px] font-grotesk text-[15px] font-medium text-atelier-paper transition-colors hover:border-white/40"
          >
            {heroContent.secondaryCta}
          </button>
        </div>
      </div>

      {/* right: live terminal */}
      <div className="atelier-reveal" style={{ animationDelay: ".4s" }}>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[#121214] to-[#0D0D0F] shadow-atelier-card">
          <div className="flex items-center gap-2 border-b border-white/[0.07] px-[18px] py-3.5">
            <span className="h-[11px] w-[11px] rounded-full bg-[#3A3A40]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#3A3A40]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#3A3A40]" />
            <span className="ml-2.5 font-codet text-[11px] text-atelier-faint">{heroContent.terminalTitle}</span>
            <span className="ml-auto h-3.5 w-3.5 animate-spin-slow rounded-full border-[1.5px] border-atelier-gold/50 border-t-atelier-gold" />
          </div>
          <div className="min-h-[268px] whitespace-pre-wrap p-6 font-codet text-[13.5px] leading-[1.85] text-atelier-muted">
            {revealed.map((line, li) => (
              <React.Fragment key={li}>
                {line.map((seg, si) => (
                  <span key={si} style={seg.c ? { color: seg.c } : undefined}>
                    {seg.t}
                  </span>
                ))}
                {li < revealed.length - 1 ? "\n" : ""}
              </React.Fragment>
            ))}
            <span className="ml-0.5 inline-block h-4 w-2 animate-blink bg-atelier-gold align-[-2px]" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2.5 max-[560px]:gap-2">
          {heroContent.chips.map((chip) => (
            <span
              key={chip}
              className="shrink-0 whitespace-nowrap rounded-full border border-white/12 px-[13px] py-1.5 font-codet text-[11px] text-atelier-muted max-[560px]:px-2.5 max-[560px]:py-1 max-[560px]:text-[10px] max-[380px]:px-2 max-[380px]:text-[9.5px]"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
