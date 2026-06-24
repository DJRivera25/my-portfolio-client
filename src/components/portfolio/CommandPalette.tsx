"use client";

import React from "react";
import { paletteSections } from "../../config/atelier";
import { usePortfolio } from "./PortfolioContext";

type PaletteRow = { k: string; label: string; hint: string; action: () => void };

const CommandPalette: React.FC = () => {
  const { cases, scrollToId, openCase, setPaletteOpen } = usePortfolio();

  const close = () => setPaletteOpen(false);

  const rows: PaletteRow[] = [
    {
      k: "↑",
      label: "Back to top",
      hint: "home",
      action: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        close();
      },
    },
    ...paletteSections.map((s) => ({
      k: s.k,
      label: s.label,
      hint: s.hint,
      action: () => {
        scrollToId(s.id);
        close();
      },
    })),
    ...cases.map((p, i) => ({
      k: p.no,
      label: p.title,
      hint: "case",
      action: () => openCase(i),
    })),
  ];

  return (
    <div
      className="fixed inset-0 z-[85] flex items-start justify-center bg-[#080809]/55 pt-[14vh] backdrop-blur-[6px]"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[min(560px,92%)] overflow-hidden rounded-xl border border-white/[0.14] bg-[#131315] shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-[18px]">
          <span className="font-codet text-[13px] text-atelier-gold">⌘</span>
          <span className="text-[15px] text-[#9D988E]">Jump to…</span>
          <span className="ml-auto rounded-[5px] border border-white/12 px-2 py-[3px] font-codet text-[11px] text-atelier-faint">
            ESC
          </span>
        </div>
        <div className="p-2.5">
          {rows.map((row, i) => (
            <button
              key={`${row.label}-${i}`}
              type="button"
              onClick={row.action}
              className="flex w-full items-center gap-3.5 rounded-lg px-3.5 py-[13px] text-left transition hover:bg-atelier-gold/10"
            >
              <span className="w-[18px] font-codet text-xs text-atelier-gold">{row.k}</span>
              <span className="text-[15px] text-atelier-paper">{row.label}</span>
              <span className="ml-auto font-codet text-[11px] text-atelier-faint">{row.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
