"use client";

import React, { useEffect, useState } from "react";
import { heroContent, marqueeItems } from "../../config/atelier";

const loop = [...marqueeItems, ...marqueeItems];

const MarqueeBand: React.FC = () => {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="relative z-10 mt-10 overflow-hidden border-y border-white/[0.07] py-[22px]">
        <div className="flex w-max animate-marquee">
          {loop.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-3.5 whitespace-nowrap px-[30px] font-serifd text-[22px] italic text-atelier-faint"
            >
              {item}
              <span className="h-[5px] w-[5px] rounded-full bg-atelier-gold opacity-60" />
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-12 pb-10 pt-[26px] max-[880px]:px-[22px] max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-2 max-[560px]:px-4">
        <span className="whitespace-nowrap font-codet text-[11px] tracking-[0.1em] text-atelier-faint max-[380px]:text-[10px]">
          {heroContent.scrollCue}
        </span>
        <span className="whitespace-nowrap font-codet text-[11px] tracking-[0.1em] text-atelier-faint max-[380px]:text-[10px]">
          {heroContent.locale} · {clock}
        </span>
      </div>
    </>
  );
};

export default MarqueeBand;
