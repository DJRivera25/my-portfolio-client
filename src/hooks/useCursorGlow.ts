"use client";

import { useEffect, useRef } from "react";

/**
 * Attaches a gold radial cursor-glow that lerps toward the pointer (0.12/frame via rAF).
 * Disabled on touch devices and when the user prefers reduced motion.
 * Returns a ref to spread onto the glow element.
 */
export function useCursorGlow<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx;
    let gy = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      if (ref.current) ref.current.style.transform = `translate(${gx}px,${gy}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
