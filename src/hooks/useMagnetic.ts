"use client";

import { useEffect, useRef } from "react";

/**
 * Magnetic button: translates toward the cursor (×0.3 / ×0.4) and scales 1.04 on hover.
 * No-op on touch / reduced-motion. Returns a ref to attach to the element.
 */
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.transition = "transform .25s cubic-bezier(.2,.7,.3,1), box-shadow .25s";

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.3}px,${y * 0.4}px) scale(1.04)`;
      el.style.boxShadow = "0 16px 40px -10px rgba(224,165,61,0.5)";
    };
    const onLeave = () => {
      el.style.transform = "translate(0,0)";
      el.style.boxShadow = "none";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return ref;
}
