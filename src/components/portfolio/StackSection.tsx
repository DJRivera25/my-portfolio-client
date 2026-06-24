"use client";

import React from "react";
import { stackContent } from "../../config/atelier";
import type { StackGroup } from "../../config/atelier";

const monogram = (name: string) => {
  const letters = name.replace(/[^A-Za-z]/g, "");
  return (letters.slice(0, 1).toUpperCase() + (letters.slice(1, 2) || "")).trim();
};

const StackSection: React.FC<{ groups: StackGroup[] }> = ({ groups }) => (
  <section
    id="stack"
    className="relative z-10 mx-auto max-w-[1320px] border-t border-white/[0.07] px-12 py-24 max-[880px]:px-[22px] max-[880px]:py-16 max-[560px]:px-4 max-[560px]:py-[54px]"
  >
    <div className="mb-[54px] flex flex-wrap items-end justify-between gap-6 max-[880px]:flex-col max-[880px]:items-start max-[880px]:gap-5">
      <div>
        <div className="mb-[22px] flex items-center gap-3.5">
          <span className="h-px w-11 bg-atelier-gold" />
          <span className="font-codet text-xs tracking-[0.2em] text-atelier-muted">{stackContent.eyebrow}</span>
        </div>
        <h2 className="m-0 font-serifd text-[clamp(34px,4.4vw,58px)] font-normal leading-[1.06] text-atelier-paper">
          {stackContent.headingTop}
          <span className="italic text-atelier-gold">{stackContent.headingAccent}</span>.
        </h2>
      </div>
      <p className="m-0 max-w-[360px] text-[15px] leading-[1.6] text-[#9D988E]">{stackContent.subhead}</p>
    </div>

    <div className="grid grid-cols-3 gap-5 max-[1024px]:grid-cols-2 max-[880px]:grid-cols-1">
      {groups.map((group) => (
        <div
          key={group.label}
          className="rounded-[14px] border border-white/[0.09] bg-gradient-to-b from-[#101012] to-[#0C0C0E] px-6 pb-7 pt-[26px]"
        >
          <div className="mb-6 flex items-center gap-2.5 font-codet text-[11px] tracking-[0.16em] text-atelier-muted">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: group.dot }} />
            {group.label}
          </div>
          <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-2">
            {group.items.map((item) => (
              <div
                key={item.name}
                className="group flex flex-col items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0E0E10] px-3.5 pb-[18px] pt-[22px] text-center transition duration-300 [transition-timing-function:cubic-bezier(.2,.7,.3,1)] hover:-translate-y-[5px] hover:border-atelier-gold/45 hover:shadow-[0_16px_34px_-18px_rgba(0,0,0,0.8)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-[13px] bg-[#F4F1EA] p-3 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.6)]">
                  {item.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.icon} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <span className="font-grotesk text-[18px] font-bold text-atelier-ink">{monogram(item.name)}</span>
                  )}
                </div>
                <div>
                  <div className="mb-[5px] text-[15px] font-medium leading-[1.1] text-atelier-paper">{item.name}</div>
                  <div className="font-codet text-[10px] tracking-[0.04em] text-atelier-faint">{item.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default StackSection;
