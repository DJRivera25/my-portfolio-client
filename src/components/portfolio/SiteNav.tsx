"use client";

import React from "react";
import { atelierNavLinks } from "../../config/atelier";
import { usePortfolio } from "./PortfolioContext";

const SiteNav: React.FC = () => {
  const { scrollToId, setPaletteOpen } = usePortfolio();

  return (
    <nav className="relative z-20 mx-auto flex max-w-[1320px] items-center justify-between px-12 py-[30px] max-[880px]:px-[22px] max-[880px]:py-5 max-[560px]:px-4 max-[560px]:py-4 max-[380px]:px-[13px] max-[380px]:py-[14px]">
      {/* brand */}
      <button
        type="button"
        onClick={() => scrollToId("hero")}
        className="flex items-center gap-[13px]"
        aria-label="Back to top"
      >
        <span className="relative block h-9 w-9 overflow-hidden rounded-full border border-atelier-gold/60 p-0.5">
          <span
            className="block h-full w-full rounded-full bg-cover"
            style={{ backgroundImage: "url('/atelier/my-photo.png')", backgroundPosition: "56% 12%" }}
          />
        </span>
        <span className="font-codet text-xs tracking-[0.18em] text-atelier-muted">DJR</span>
      </button>

      {/* center links */}
      <div className="flex items-center gap-[38px] max-[880px]:hidden">
        {atelierNavLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => scrollToId(link.id)}
            className="text-[13px] text-atelier-muted transition-colors hover:text-atelier-paper"
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* right side */}
      <div className="flex items-center gap-[18px]">
        <div className="flex items-center gap-2 font-codet text-[11px] tracking-[0.05em] text-atelier-green">
          <span className="h-[7px] w-[7px] rounded-full bg-atelier-green" />
          AVAILABLE
        </div>
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-3 py-2 text-atelier-muted transition hover:border-atelier-gold/50 hover:text-atelier-paper max-[560px]:hidden"
          aria-label="Open command palette"
        >
          <span className="font-codet text-[11px]">⌘K</span>
        </button>
      </div>
    </nav>
  );
};

export default SiteNav;
