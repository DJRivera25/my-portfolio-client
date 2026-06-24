"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { workContent } from "../../config/atelier";
import { usePortfolio } from "./PortfolioContext";

type Mode = "track" | "reel";

const CARD_GAP = 28;

const SelectedWork: React.FC = () => {
  const { cases, openCase, isAdmin, onAddProject, onEditProject, onDeleteProject } = usePortfolio();
  const [mode, setMode] = useState<Mode>("track");
  const [counter, setCounter] = useState("01");

  // Mobile defaults to the calmer INDEX grid (cinematic track is desktop-first).
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 880px)").matches) {
      setMode("reel");
    }
  }, []);
  const trackRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const total = String(cases.length).padStart(2, "0");
  const canEdit = (id: string) => Boolean(isAdmin && !id.startsWith("fallback-"));

  const updateProgress = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pct = max > 0 ? el.scrollLeft / max : 0;
    if (progRef.current) progRef.current.style.width = `${10 + pct * 90}%`;
    const n = Math.max(cases.length, 1);
    const idx = Math.round(pct * (n - 1));
    setCounter(String(idx + 1).padStart(2, "0"));
  }, [cases.length]);

  const scrollTrack = useCallback((dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const w = card ? card.getBoundingClientRect().width + CARD_GAP : el.clientWidth * 0.6;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  }, []);

  // mouse drag-to-pan (touch/trackpad use native scrolling). Snap is suspended
  // while dragging so it doesn't fight the pointer, then restored to snap on release.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || mode !== "track") return;

    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.style.scrollSnapType = "none";
      el.style.cursor = "grabbing";
      el.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!down) return;
      if (Math.abs(e.clientX - startX) > 4) moved = true;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const endDrag = () => {
      if (!down) return;
      down = false;
      el.style.cursor = "grab";
      el.style.scrollSnapType = ""; // back to CSS default → snaps to nearest
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("scroll", updateProgress, { passive: true });
    requestAnimationFrame(updateProgress);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("scroll", updateProgress);
    };
  }, [mode, updateProgress]);

  // arrow keys advance the track (ignored while an overlay is open)
  useEffect(() => {
    if (mode !== "track") return;
    const onKey = (e: KeyboardEvent) => {
      if (document.body.hasAttribute("data-atelier-overlay")) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") scrollTrack(1);
      if (e.key === "ArrowLeft") scrollTrack(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, scrollTrack]);

  const adminControls = (id: string, index: number) =>
    canEdit(id) ? (
      <div className="absolute right-2.5 top-2.5 z-20 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="Edit project"
          onClick={(e) => {
            e.stopPropagation();
            onEditProject?.(index);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/20 bg-atelier-ink/70 text-atelier-paper backdrop-blur-sm transition hover:border-atelier-gold hover:text-atelier-gold"
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          aria-label="Delete project"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteProject?.(index);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/20 bg-atelier-ink/70 text-red-300 backdrop-blur-sm transition hover:border-red-400 hover:text-red-400"
        >
          <Trash2 size={13} />
        </button>
      </div>
    ) : null;

  return (
    <section id="work" className="relative z-10 border-t border-white/[0.07] pb-[70px] pt-[90px] max-[880px]:pt-16 max-[560px]:pt-[54px]">
      {/* header */}
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-6 px-12 max-[880px]:flex-col max-[880px]:items-start max-[880px]:px-[22px] max-[560px]:px-4">
        <div>
          <div className="mb-[22px] flex items-center gap-3.5">
            <span className="h-px w-11 bg-atelier-gold" />
            <span className="font-codet text-xs tracking-[0.2em] text-atelier-muted">{workContent.eyebrow}</span>
          </div>
          <h2 className="m-0 font-serifd text-[clamp(34px,4.4vw,58px)] font-normal leading-none tracking-[-0.01em] text-atelier-paper">
            {workContent.heading}
            <span className="italic text-atelier-gold">.</span>
          </h2>
        </div>
        <div className="flex items-center gap-4 max-[560px]:flex-wrap">
          {isAdmin && (
            <button
              type="button"
              onClick={() => onAddProject?.()}
              className="inline-flex items-center gap-2 rounded-lg border border-atelier-gold/50 bg-atelier-gold/10 px-3.5 py-[9px] font-codet text-[11px] tracking-[0.06em] text-atelier-gold transition hover:bg-atelier-gold/20"
            >
              <Plus size={14} /> ADD PROJECT
            </button>
          )}
          <div className="flex rounded-lg border border-white/10 bg-white/[0.04] p-1">
            <button
              type="button"
              onClick={() => setMode("track")}
              className={`rounded-[5px] px-4 py-[9px] font-codet text-[11px] tracking-[0.08em] transition ${
                mode === "track" ? "bg-atelier-gold text-atelier-ink" : "bg-transparent text-atelier-muted"
              }`}
            >
              ▸ CINEMATIC
            </button>
            <button
              type="button"
              onClick={() => setMode("reel")}
              className={`rounded-[5px] px-4 py-[9px] font-codet text-[11px] tracking-[0.08em] transition ${
                mode === "reel" ? "bg-atelier-gold text-atelier-ink" : "bg-transparent text-atelier-muted"
              }`}
            >
              ▦ INDEX
            </button>
          </div>
          <div className="font-codet text-[13px] text-atelier-muted">
            <span className="text-atelier-gold">{mode === "track" ? counter : "01"}</span> / {total}
          </div>
        </div>
      </div>

      {mode === "track" ? (
        <div className="mt-10">
          <div
            ref={trackRef}
            className="atelier-track flex cursor-grab gap-7 overflow-x-auto px-12 pb-2 max-[880px]:px-[22px] max-[560px]:px-4 max-[380px]:px-[13px]"
          >
            {cases.map((p, i) => (
              <div
                key={p.id}
                onClick={() => openCase(i)}
                className="flex-none basis-[clamp(440px,62vw,820px)] cursor-pointer max-[880px]:basis-[84vw] max-[560px]:basis-[90vw] max-[380px]:basis-[92vw]"
                style={{ scrollSnapAlign: "center" }}
              >
                <div className="group relative h-[clamp(360px,56vh,560px)] overflow-hidden rounded-lg border border-white/10 bg-atelier-surface-2 transition-colors hover:border-atelier-gold/50">
                  <div
                    className="pointer-events-none h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${p.image}')`, filter: "saturate(0.92) contrast(1.03)" }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(10,10,11,0) 26%, rgba(10,10,11,0.62) 58%, rgba(10,10,11,0.97) 100%)",
                    }}
                  />
                  {adminControls(p.id, i)}
                  <div className="pointer-events-none absolute left-[26px] top-6 font-serifd text-[60px] leading-none text-atelier-paper/90">
                    {p.no}
                  </div>
                  <div className="pointer-events-none absolute right-[26px] top-[30px] font-codet text-[11px] text-[#D8D2C5]">
                    {p.year}
                  </div>
                  <div className="pointer-events-none absolute inset-x-[26px] bottom-6">
                    <div className="mb-2.5 flex items-center gap-2.5">
                      <span className="h-[7px] w-[7px] rounded-full" style={{ background: p.dot }} />
                      <span className="font-codet text-[11px] tracking-[0.06em] text-[#D8D2C5]">{p.kind}</span>
                    </div>
                    <h3 className="m-0 mb-3 font-serifd text-[clamp(28px,3.2vw,42px)] font-normal leading-none text-[#F8F6F0]">
                      {p.title}
                    </h3>
                    <p className="m-0 mb-4 max-w-[520px] text-[15px] leading-[1.5] text-[#C7C2B8]">{p.tagline}</p>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        {p.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-white/[0.22] bg-atelier-ink/40 px-3 py-[5px] font-codet text-[11px] text-[#D8D2C5]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <span className="font-grotesk text-[14px] font-semibold text-atelier-gold">View project →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex-none basis-6" />
          </div>

          {/* progress + nav */}
          <div className="mx-auto mt-6 flex max-w-[1320px] items-center gap-5 px-12 max-[880px]:px-[22px] max-[560px]:px-4">
            <div className="h-0.5 flex-1 overflow-hidden rounded-sm bg-white/10">
              <div ref={progRef} className="h-full w-[10%] rounded-sm bg-atelier-gold transition-[width] duration-200" />
            </div>
            <span className="font-codet text-[11px] tracking-[0.08em] text-atelier-faint max-[560px]:hidden">
              DRAG · SWIPE · ← →
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollTrack(-1)}
                className="h-10 w-10 rounded-[7px] border border-white/[0.16] bg-transparent text-base text-atelier-paper transition hover:border-atelier-gold hover:text-atelier-gold"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollTrack(1)}
                className="h-10 w-10 rounded-[7px] border border-white/[0.16] bg-transparent text-base text-atelier-paper transition hover:border-atelier-gold hover:text-atelier-gold"
                aria-label="Next"
              >
                →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-10 grid max-w-[1320px] grid-cols-3 gap-5 px-12 max-[1024px]:grid-cols-2 max-[880px]:grid-cols-1 max-[880px]:px-[22px] max-[560px]:px-4">
          {cases.map((p, i) => (
            <div
              key={p.id}
              onClick={() => openCase(i)}
              className="cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-[#101012] transition-colors hover:border-atelier-gold/50"
            >
              <div className="relative h-[200px] overflow-hidden">
                <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('${p.image}')`, filter: "saturate(0.9)" }} />
                <div className="absolute left-3.5 top-3 font-serifd text-[30px] text-atelier-paper [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
                  {p.no}
                </div>
                {adminControls(p.id, i)}
              </div>
              <div className="p-[22px]">
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="m-0 font-serifd text-2xl font-normal text-atelier-paper">{p.title}</h3>
                  <span className="font-codet text-[11px] text-atelier-faint">{p.year}</span>
                </div>
                <p className="m-0 mb-4 text-sm leading-[1.55] text-[#9D988E]">{p.tagline}</p>
                <div className="flex flex-wrap gap-[7px]">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/[0.14] px-[11px] py-1 font-codet text-[11px] text-atelier-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SelectedWork;
