"use client";

import React, { useEffect, useState } from "react";
import { usePortfolio } from "./PortfolioContext";

const ITEMS = [
  {
    id: "hero",
    label: "HOME",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 11l9-8 9 8M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    id: "work",
    label: "WORK",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    id: "process",
    label: "SHIP",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 12h4l3-7 4 14 3-7h2" />
      </svg>
    ),
  },
] as const;

const SECTION_IDS = ["hero", "work", "about", "stack", "process", "resume", "contact"];

const MobileBottomNav: React.FC = () => {
  const { scrollToId } = usePortfolio();
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      let current = "hero";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // SHIP groups the process/resume span; HIRE highlights contact.
  const isShip = active === "process" || active === "resume";
  const isHire = active === "contact";
  const stateOf = (id: string) => (id === "process" ? isShip : active === id);

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#141416]/90 p-1.5 shadow-[0_12px_44px_rgba(0,0,0,0.6)] backdrop-blur-xl max-[880px]:flex max-[380px]:gap-0.5 max-[380px]:p-1">
      {ITEMS.map((item) => {
        const on = stateOf(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToId(item.id)}
            aria-current={on ? "true" : undefined}
            className={`flex w-[58px] flex-col items-center gap-1 rounded-full py-2 transition-colors max-[380px]:w-[52px] ${
              on ? "bg-white/[0.06] text-atelier-gold" : "text-atelier-muted hover:text-atelier-paper"
            }`}
          >
            {item.icon}
            <span className="font-codet text-[9px] tracking-[0.06em]">{item.label}</span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => scrollToId("contact")}
        aria-current={isHire ? "true" : undefined}
        className={`ml-0.5 flex w-[64px] flex-col items-center gap-1 rounded-full py-2 text-atelier-ink transition max-[380px]:w-[56px] ${
          isHire ? "bg-atelier-gold-deep" : "bg-atelier-gold"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
        </svg>
        <span className="font-codet text-[9px] font-semibold tracking-[0.06em]">HIRE</span>
      </button>
    </div>
  );
};

export default MobileBottomNav;
