"use client";

import { useEffect, useState } from "react";
import type { TermSegment } from "../config/atelier";

type Pos = { line: number; seg: number; ch: number; done: boolean };

/**
 * Reveals segmented terminal lines character-by-character.
 * Returns the lines revealed so far (last segment partially filled) and a `done` flag.
 * Renders instantly when the user prefers reduced motion.
 */
export function useTypewriter(
  lines: TermSegment[][],
  { charDelay = 18, lineDelay = 110 }: { charDelay?: number; lineDelay?: number } = {}
) {
  const [pos, setPos] = useState<Pos>({ line: 0, seg: 0, ch: 0, done: false });

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPos({ line: lines.length, seg: 0, ch: 0, done: true });
      return;
    }

    let cancelled = false;
    let l = 0;
    let s = 0;
    let c = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      if (l >= lines.length) {
        setPos({ line: l, seg: 0, ch: 0, done: true });
        return;
      }
      const line = lines[l];
      if (s >= line.length) {
        l += 1;
        s = 0;
        c = 0;
        setPos({ line: l, seg: 0, ch: 0, done: false });
        timer = setTimeout(tick, lineDelay);
        return;
      }
      const seg = line[s];
      if (c < seg.t.length) {
        c += 1;
        setPos({ line: l, seg: s, ch: c, done: false });
        timer = setTimeout(tick, charDelay);
      } else {
        s += 1;
        c = 0;
        tick();
      }
    };

    timer = setTimeout(tick, lineDelay);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [lines, charDelay, lineDelay]);

  if (pos.done) return { revealed: lines, done: true };

  const revealed: TermSegment[][] = [];
  for (let i = 0; i < Math.min(pos.line, lines.length); i++) revealed.push(lines[i]);
  if (pos.line < lines.length) {
    const cur = lines[pos.line];
    const partial: TermSegment[] = [];
    for (let i = 0; i < pos.seg; i++) partial.push(cur[i]);
    if (pos.seg < cur.length) {
      const seg = cur[pos.seg];
      partial.push({ ...seg, t: seg.t.slice(0, pos.ch) });
    }
    revealed.push(partial);
  }
  return { revealed, done: false };
}
