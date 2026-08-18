"use client";

import React from "react";
import { REPORT_WINDOWS, STATUS_META, STATUS_ORDER, worklogContent } from "../../config/worklog";
import type { ReportDigest } from "../../types/worklog";

interface Props {
  report: ReportDigest | null;
  window: string;
  onWindowChange: (value: string) => void;
}

function duration(minutes: number): string {
  if (!minutes) return "0m";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours && rest) return `${hours}h ${rest}m`;
  return hours ? `${hours}h` : `${rest}m`;
}

const WorkReportPanel: React.FC<Props> = ({ report, window: activeWindow, onWindowChange }) => (
  <section>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="m-0 font-codet text-xs tracking-[0.2em] text-atelier-muted">
        {worklogContent.reportTitle.toUpperCase()}
      </h2>
      <div className="flex gap-1.5">
        {REPORT_WINDOWS.map((w) => (
          <button
            key={w.label}
            type="button"
            onClick={() => onWindowChange(w.value)}
            className={`rounded-md border px-2.5 py-1 font-codet text-[10px] tracking-[0.06em] transition-colors ${
              activeWindow === w.value
                ? "border-atelier-gold/55 text-atelier-gold"
                : "border-white/12 text-atelier-faint hover:border-white/25"
            }`}
          >
            {w.label.toUpperCase()}
          </button>
        ))}
      </div>
    </div>

    <div className="rounded-xl border border-white/[0.09] bg-white/[0.02] p-5">
      {!report || report.total === 0 ? (
        <p className="m-0 text-[13px] text-atelier-faint">Nothing logged in this window.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="font-serifd text-[40px] leading-none text-atelier-paper">
              {report.total}
            </span>
            <span className="font-codet text-[11px] text-atelier-muted">
              {report.total === 1 ? "entry" : "entries"} · {duration(report.minutesSpent)} tracked
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
            {STATUS_ORDER.map((s) => (
              <span key={s} className="font-codet text-[11px]" style={{ color: STATUS_META[s].color }}>
                {STATUS_META[s].label.toLowerCase()} {report.byStatus[s]}
              </span>
            ))}
          </div>

          {report.byProject.length > 0 && (
            <ul className="m-0 mt-5 flex list-none flex-col gap-1.5 border-t border-white/[0.07] p-0 pt-4">
              {report.byProject.map((p) => (
                <li key={p.slug} className="flex flex-wrap justify-between gap-2">
                  <span className="text-[13px] text-atelier-paper">{p.name}</span>
                  <span className="font-codet text-[11px] text-atelier-faint">
                    {p.total} logged · {p.open} open · {duration(p.minutesSpent)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {report.blockers.length > 0 && (
            <div className="mt-5 border-t border-white/[0.07] pt-4">
              <span className="font-codet text-[10px] tracking-[0.08em]" style={{ color: "#E07A5F" }}>
                BLOCKED
              </span>
              <ul className="m-0 mt-2 flex list-none flex-col gap-1.5 p-0">
                {report.blockers.map((b) => (
                  <li key={b.ref} className="text-[13px] leading-snug text-[#9D988E]">
                    <span className="font-codet text-[11px] text-atelier-faint">#{b.ref}</span>{" "}
                    {b.title}
                    {b.reason ? ` — ${b.reason}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  </section>
);

export default WorkReportPanel;
