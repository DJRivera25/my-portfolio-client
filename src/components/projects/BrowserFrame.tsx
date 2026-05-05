"use client";

import React from "react";
import { Lock } from "lucide-react";

type BrowserFrameProps = {
  url: string;
  image: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  autoScrollOnHover?: boolean;
};

const BrowserFrame: React.FC<BrowserFrameProps> = ({
  url,
  image,
  alt,
  className = "",
  imageClassName = "",
  autoScrollOnHover = false,
}) => {
  const displayUrl = formatUrl(url);
  const scrollClasses = autoScrollOnHover
    ? "object-top transition-[object-position] duration-[3000ms] ease-linear group-hover:object-bottom"
    : "object-top";

  return (
    <div
      className={`group/browser relative overflow-hidden rounded-xl border border-hairline-strong bg-brand-navy-mid shadow-glass-lift ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-hairline bg-gradient-to-b from-brand-navy-light to-brand-navy-mid px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
        <div className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-md bg-black/25 px-2 py-1 font-mono text-[10px] text-white/45 sm:text-[11px]">
          <Lock className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">{displayUrl}</span>
        </div>
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-navy">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={alt}
          className={`h-full w-full object-cover ${scrollClasses} ${imageClassName}`}
          loading="lazy"
        />
      </div>
    </div>
  );
};

function formatUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname === "/" ? "" : u.pathname}`;
  } catch {
    return url;
  }
}

export default BrowserFrame;
