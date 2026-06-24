"use client";

import React from "react";
import { footerContent } from "../../config/atelier";

const SiteFooter: React.FC = () => (
  <footer className="relative z-10 border-t border-white/10 px-12 py-[42px] max-[880px]:px-[22px] max-[880px]:pb-28 max-[560px]:px-4">
    <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-6">
      <div className="flex items-center gap-[13px]">
        <span className="h-[7px] w-[7px] rounded-full bg-atelier-gold" />
        <span className="text-sm text-atelier-muted">{footerContent.name}</span>
      </div>
      <div className="flex items-center gap-[26px] max-[560px]:gap-3.5 max-[380px]:gap-2.5">
        <span className="whitespace-nowrap font-codet text-[11px] tracking-[0.08em] text-atelier-faint max-[380px]:text-[10px] max-[380px]:tracking-normal">
          {footerContent.copyright}
        </span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="whitespace-nowrap rounded-md border border-white/[0.14] bg-transparent px-[13px] py-2 font-codet text-[11px] tracking-[0.08em] text-atelier-muted transition hover:border-atelier-gold hover:text-atelier-gold max-[380px]:px-2.5 max-[380px]:text-[10px]"
        >
          {footerContent.backToTop}
        </button>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
