"use client";

import React from "react";

type PhoneFrameProps = {
  image: string;
  alt: string;
  side?: "left" | "right";
  className?: string;
};

const PhoneFrame: React.FC<PhoneFrameProps> = ({ image, alt, side = "right", className = "" }) => {
  const sidePosition = side === "right" ? "right-[-14px]" : "left-[-14px]";

  return (
    <div
      className={`pointer-events-none absolute bottom-[-22px] ${sidePosition} z-10 hidden w-[110px] rounded-[20px] bg-brand-navy p-1 shadow-[0_18px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08)] md:block ${className}`}
      aria-hidden="true"
    >
      <div className="overflow-hidden rounded-[16px] bg-brand-navy-mid" style={{ aspectRatio: "9 / 16" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} className="h-full w-full object-cover object-top" loading="lazy" />
      </div>
    </div>
  );
};

export default PhoneFrame;
