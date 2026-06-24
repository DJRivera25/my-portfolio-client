"use client";

import React, { useEffect, useState } from "react";
import { ATELIER, processContent, processStages } from "../../config/atelier";

const HowIShip: React.FC = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setStage((s) => (s + 1) % processStages.length), 2100);
    return () => clearInterval(id);
  }, []);

  const procStep = String(stage + 1).padStart(2, "0");
  const procPct = `${((stage + 1) / processStages.length) * 100}%`;

  return (
    <section
      id="process"
      className="relative z-10 mx-auto max-w-[1320px] border-t border-white/[0.07] px-12 py-24 max-[880px]:px-[22px] max-[880px]:py-16 max-[560px]:px-4 max-[560px]:py-[54px]"
    >
      <div className="mb-[50px] flex flex-wrap items-end justify-between gap-6 max-[880px]:flex-col max-[880px]:items-start max-[880px]:gap-5">
        <div>
          <div className="mb-[22px] flex items-center gap-3.5">
            <span className="h-px w-11 bg-atelier-gold" />
            <span className="font-codet text-xs tracking-[0.2em] text-atelier-muted">{processContent.eyebrow}</span>
          </div>
          <h2 className="m-0 font-serifd text-[clamp(34px,4.4vw,58px)] font-normal leading-[1.06] text-atelier-paper">
            {processContent.headingTop}
            <span className="italic text-atelier-gold">{processContent.headingAccent}</span>.
          </h2>
        </div>
        <p className="m-0 max-w-[380px] text-[15px] leading-[1.6] text-[#9D988E]">{processContent.subhead}</p>
      </div>

      {/* progress header */}
      <div className="mb-6 flex flex-wrap items-center gap-[18px]">
        <span className="whitespace-nowrap font-codet text-xs tracking-[0.1em] text-atelier-gold">
          STEP {procStep} / 05
        </span>
        <span className="whitespace-nowrap text-[15px] font-medium text-atelier-paper">{processStages[stage].title}</span>
        <div className="h-0.5 min-w-[120px] flex-1 overflow-hidden rounded-sm bg-white/10">
          <div
            className="h-full rounded-sm bg-atelier-gold transition-[width] duration-[600ms] [transition-timing-function:cubic-bezier(.2,.7,.3,1)]"
            style={{ width: procPct }}
          />
        </div>
      </div>

      {/* pipeline */}
      <div className="flex items-stretch gap-0 max-[880px]:flex-col max-[880px]:items-stretch">
        {processStages.map((s, i) => {
          const active = i === stage;
          const done = i < stage;
          const connFilled = i < stage;
          const flowColor = connFilled ? ATELIER.gold : "rgba(167,159,150,0.55)";
          const trackColor = connFilled ? "rgba(224,165,61,0.28)" : "rgba(255,255,255,0.1)";
          return (
            <React.Fragment key={s.no}>
              <div
                className="flex min-w-0 flex-1 flex-col rounded-[13px] px-5 pb-5 pt-[22px] transition-all duration-[600ms] [transition-timing-function:cubic-bezier(.2,.7,.3,1)]"
                style={{
                  border: `1px solid ${active ? "rgba(224,165,61,0.55)" : "rgba(255,255,255,0.09)"}`,
                  background: active
                    ? "linear-gradient(180deg,#17150F,#0E0E10)"
                    : "linear-gradient(180deg,#101012,#0C0C0E)",
                  transform: active ? "translateY(-7px)" : "translateY(0)",
                }}
              >
                <div className="mb-3.5 flex items-center justify-between">
                  <span
                    className="font-serifd text-[38px] leading-none transition-colors duration-[600ms]"
                    style={{ color: active || done ? ATELIER.gold : "#33312D" }}
                  >
                    {s.no}
                  </span>
                  <span
                    className="inline-flex items-center gap-[7px] font-codet text-[10px] tracking-[0.08em]"
                    style={{ color: active ? ATELIER.gold : done ? ATELIER.green : ATELIER.faint }}
                  >
                    <span
                      className={`h-[7px] w-[7px] rounded-full ${active ? "animate-pulse-ring" : ""}`}
                      style={{ background: active ? ATELIER.gold : done ? ATELIER.green : "#33312D" }}
                    />
                    {active ? "PROCESSING" : done ? "DONE" : "QUEUED"}
                  </span>
                </div>
                <span className="mb-3.5 self-start rounded-full border border-white/[0.14] px-2.5 py-1 font-codet text-[10px] tracking-[0.06em] text-atelier-muted">
                  {s.time}
                </span>
                <h3 className="m-0 mb-[9px] font-grotesk text-[17px] font-semibold text-atelier-paper">{s.title}</h3>
                <p className="m-0 mb-4 text-[13px] leading-[1.6] text-[#9D988E]">{s.desc}</p>
                <div className="mt-auto flex gap-2 border-t border-white/[0.07] pt-3.5">
                  <span className="shrink-0 text-[13px] leading-[1.4] text-atelier-gold">↳</span>
                  <span className="text-[12.5px] leading-[1.45] text-[#C7C2B8]">{s.deliver}</span>
                </div>
              </div>

              {i < processStages.length - 1 && (
                <div className="flex flex-[0_0_44px] items-center px-1 max-[880px]:h-[30px] max-[880px]:flex-[0_0_30px] max-[880px]:justify-center max-[880px]:px-0">
                  {/* desktop connector */}
                  <div
                    className="relative h-0.5 w-full overflow-hidden rounded-sm transition-colors duration-[600ms] max-[880px]:hidden"
                    style={{ background: trackColor }}
                  >
                    <div
                      className="absolute left-0 top-0 h-full w-[45%] animate-travel"
                      style={{ background: `linear-gradient(90deg,transparent,${flowColor},transparent)` }}
                    />
                  </div>
                  {/* mobile connector */}
                  <div
                    className="relative hidden h-full w-0.5 overflow-hidden rounded-sm max-[880px]:block"
                    style={{ background: trackColor }}
                  >
                    <div
                      className="absolute left-0 top-0 h-[45%] w-full animate-travel-v"
                      style={{ background: `linear-gradient(180deg,transparent,${flowColor},transparent)` }}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* build console */}
      <div className="mt-[34px] overflow-hidden rounded-[11px] border border-white/10 bg-gradient-to-b from-[#121214] to-[#0D0D0F]">
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-[18px] py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3A3A40]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3A3A40]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3A3A40]" />
          <span className="ml-2.5 font-codet text-[11px] text-atelier-faint">~/dj/ship.log</span>
          <span className="ml-auto flex items-center gap-[7px] font-codet text-[11px] text-atelier-green">
            <span className="h-[7px] w-[7px] animate-pulse-ring rounded-full bg-atelier-green" />
            running
          </span>
        </div>
        <div className="px-[22px] py-5 font-codet text-[13px] leading-[1.9]">
          {processStages.map((s, i) => (
            <div
              key={s.no}
              className="transition-colors duration-500"
              style={{ color: i <= stage ? (s.log.done ? ATELIER.green : ATELIER.gold) : "#3A3833" }}
            >
              {s.log.t}
            </div>
          ))}
          <span className="inline-block h-[15px] w-2 animate-blink bg-atelier-gold align-[-2px]" />
        </div>
      </div>
    </section>
  );
};

export default HowIShip;
