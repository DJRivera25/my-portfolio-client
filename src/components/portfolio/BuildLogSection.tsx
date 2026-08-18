"use client";

import React from "react";
import { buildLogContent } from "../../config/worklog";
import type { PublicEntry } from "../../types/worklog";

interface Props {
  entries: PublicEntry[];
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Renders nothing at all when nothing has been published — an empty band with a heading
 * over it reads as broken, and this section is only a strength when it has content.
 */
const BuildLogSection: React.FC<Props> = ({ entries }) => {
  if (!entries.length) return null;

  return (
    <section
      id="buildlog"
      className="relative z-10 mx-auto max-w-[1320px] border-t border-white/[0.07] px-12 py-24 max-[880px]:px-[22px] max-[880px]:py-16 max-[560px]:px-4 max-[560px]:py-[54px]"
    >
      <div className="mb-[50px] flex flex-wrap items-end justify-between gap-6 max-[880px]:flex-col max-[880px]:items-start max-[880px]:gap-5">
        <div>
          <div className="mb-[22px] flex items-center gap-3.5">
            <span className="h-px w-11 bg-atelier-gold" />
            <span className="font-codet text-xs tracking-[0.2em] text-atelier-muted">
              {buildLogContent.eyebrow}
            </span>
          </div>
          <h2 className="m-0 font-serifd text-[clamp(34px,4.4vw,58px)] font-normal leading-[1.06] text-atelier-paper">
            {buildLogContent.headingTop}
            <span className="italic text-atelier-gold">{buildLogContent.headingAccent}</span>.
          </h2>
        </div>
        <p className="m-0 max-w-[380px] text-[15px] leading-[1.6] text-[#9D988E]">
          {buildLogContent.subhead}
        </p>
      </div>

      <ul className="m-0 list-none p-0">
        {entries.map((entry, i) => (
          <li
            key={entry.ref}
            className={`flex flex-wrap items-baseline gap-x-5 gap-y-1.5 py-4 ${
              i === 0 ? "" : "border-t border-white/[0.07]"
            }`}
          >
            <span className="w-[52px] shrink-0 font-codet text-[11px] tracking-[0.06em] text-atelier-faint">
              {shortDate(entry.createdAt)}
            </span>

            <span className="min-w-0 flex-1 text-[16px] leading-snug text-atelier-paper">
              {entry.title}
              {entry.summary && (
                <span className="mt-1 block text-[13px] leading-relaxed text-[#9D988E]">
                  {entry.summary}
                </span>
              )}
            </span>

            {entry.project && (
              <span className="shrink-0 font-codet text-[11px] tracking-[0.06em] text-atelier-gold">
                {entry.project.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BuildLogSection;
