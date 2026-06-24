"use client";

import React from "react";
import type { CaseStudy } from "../../types/portfolio";

type Props = {
  cases: CaseStudy[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E0A53D" strokeWidth="2.4">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const CaseStudyDrawer: React.FC<Props> = ({ cases, index, onClose, onPrev, onNext }) => {
  const active = cases[index];
  if (!active) return null;
  const counter = String(index + 1).padStart(2, "0");
  const total = String(cases.length).padStart(2, "0");

  return (
    <div
      className="fixed inset-0 z-[80] animate-fade-in bg-[#060607]/[0.72] backdrop-blur-[10px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-y-0 right-0 w-[min(980px,100%)] animate-drawer-in overflow-y-auto border-l border-white/12 bg-[#0B0B0D] shadow-[-50px_0_140px_rgba(0,0,0,0.7)]"
      >
        {/* sticky header */}
        <div className="sticky top-0 z-[3] flex flex-wrap items-center justify-between gap-3.5 border-b border-white/[0.08] bg-[#0B0B0D]/[0.88] px-9 py-[18px] backdrop-blur-[12px] max-[880px]:px-[18px] max-[880px]:py-3">
          <span className="font-codet text-xs tracking-[0.1em] text-atelier-muted">
            CASE STUDY · <span className="text-atelier-gold">{counter}</span> / {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              title="Previous"
              className="flex h-9 w-9 items-center justify-center rounded-[7px] border border-white/[0.16] bg-transparent text-[15px] text-atelier-paper transition hover:border-atelier-gold hover:text-atelier-gold"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={onNext}
              title="Next"
              className="flex h-9 w-9 items-center justify-center rounded-[7px] border border-white/[0.16] bg-transparent text-[15px] text-atelier-paper transition hover:border-atelier-gold hover:text-atelier-gold"
            >
              ›
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-1.5 flex items-center gap-2 rounded-[7px] border border-white/[0.16] bg-transparent px-3.5 py-2 font-codet text-[11px] text-atelier-paper transition hover:border-atelier-gold"
            >
              CLOSE ✕
            </button>
          </div>
        </div>

        {/* hero */}
        <div className="relative h-[380px] overflow-hidden max-[880px]:h-[230px] max-[560px]:h-[200px]">
          <div
            className="h-full w-full scale-[1.04] bg-cover"
            style={{ backgroundImage: `url('${active.image}')`, backgroundPosition: "center top" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/10 via-transparent to-[#0B0B0D]/[0.97]" />
          <div className="absolute left-9 top-6 inline-flex items-center gap-[9px] rounded-full bg-[#0B0B0D]/60 px-[13px] py-[7px] font-codet text-[11px] text-atelier-green backdrop-blur-[6px] max-[880px]:left-[18px]">
            <span className="h-[7px] w-[7px] animate-pulse-ring rounded-full bg-atelier-green" />
            {active.statusLabel}
          </div>
          <div className="absolute inset-x-9 bottom-[30px] max-[880px]:inset-x-[18px]">
            <div className="mb-3 font-codet text-xs tracking-[0.08em] text-atelier-gold">
              {active.kind} · {active.year}
            </div>
            <h2 className="m-0 font-serifd text-[clamp(38px,5.4vw,64px)] font-normal leading-[0.96] text-[#F8F6F0]">
              {active.title}
            </h2>
          </div>
        </div>

        {/* body */}
        <div className="px-10 pb-[60px] pt-11 max-[880px]:px-[22px] max-[880px]:pb-12 max-[880px]:pt-8 max-[560px]:px-4">
          <p className="m-0 mb-10 font-serifd text-[clamp(22px,3vw,27px)] italic leading-[1.35] text-[#E6E1D6]">
            {active.tagline}
          </p>

          {active.highlights.length > 0 && (
            <>
              <div className="mb-4 font-codet text-[11px] tracking-[0.16em] text-atelier-faint">HIGHLIGHTS</div>
              <div className="mb-12 grid grid-cols-3 gap-3.5 max-[880px]:grid-cols-1 max-[880px]:gap-3">
                {active.highlights.map((h) => (
                  <div
                    key={h}
                    className="rounded-[10px] border border-white/10 bg-gradient-to-b from-[#111113] to-[#0C0C0E] px-5 py-[22px] transition hover:-translate-y-[3px] hover:border-atelier-gold/45"
                  >
                    <div className="mb-4 flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-atelier-gold/[0.14]">
                      <CheckIcon />
                    </div>
                    <div className="text-[14.5px] font-medium leading-[1.4] text-atelier-paper">{h}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="grid grid-cols-[140px_1fr] gap-x-7 gap-y-10 max-[880px]:grid-cols-1 max-[880px]:gap-x-2 max-[880px]:gap-y-[26px]">
            <div className="pt-1 font-codet text-[11px] tracking-[0.1em] text-atelier-faint">THE PROBLEM</div>
            <p className="m-0 text-[16.5px] leading-[1.7] text-[#C7C2B8]">{active.problem}</p>
            {active.solution && (
              <>
                <div className="pt-1 font-codet text-[11px] tracking-[0.1em] text-atelier-faint">WHAT I BUILT</div>
                <p className="m-0 text-[16.5px] leading-[1.7] text-[#C7C2B8]">{active.solution}</p>
              </>
            )}
            <div className="pt-1 font-codet text-[11px] tracking-[0.1em] text-atelier-faint">ROLE</div>
            <div className="text-base text-atelier-paper">{active.role}</div>
            <div className="pt-1 font-codet text-[11px] tracking-[0.1em] text-atelier-faint">STACK</div>
            <div className="flex flex-wrap gap-2">
              {active.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/[0.14] px-[13px] py-1.5 font-codet text-xs text-atelier-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-[52px] flex flex-wrap items-center justify-between gap-[18px] border-t border-white/[0.09] pt-8">
            <a
              href={active.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-[7px] bg-atelier-gold px-6 py-3.5 font-grotesk text-[15px] font-semibold text-atelier-ink no-underline"
            >
              Visit the live project →
            </a>
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2.5 rounded-[7px] border border-white/[0.18] bg-transparent px-[22px] py-3.5 font-grotesk text-[14px] font-medium text-atelier-paper transition hover:border-atelier-gold hover:text-atelier-gold"
            >
              Next project ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDrawer;
