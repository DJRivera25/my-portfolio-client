"use client";

import React from "react";
import { worklogContent } from "../../config/worklog";
import type { WorkSessionSummary } from "../../types/worklog";

interface Props {
  sessions: WorkSessionSummary[];
}

const WorkSessionStrip: React.FC<Props> = ({ sessions }) => (
  <section>
    <h2 className="mb-4 font-codet text-xs tracking-[0.2em] text-atelier-muted">
      {worklogContent.sessionsTitle.toUpperCase()}
    </h2>

    {!sessions.length ? (
      <p className="m-0 text-[13px] text-atelier-faint">{worklogContent.sessionsEmpty}</p>
    ) : (
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {sessions.map((s) => {
          const active = s.status === "active";
          return (
            <li
              key={s.sessionId}
              className="rounded-xl border border-white/[0.09] bg-white/[0.02] px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: active ? "#7FB996" : "#6E6A62" }}
                  aria-hidden
                />
                <span className="font-codet text-[11px] text-atelier-muted">
                  {s.sessionId.length > 24 ? `${s.sessionId.slice(0, 24)}…` : s.sessionId}
                </span>
                {s.project && (
                  <span className="font-codet text-[11px] text-atelier-faint">
                    {s.project.name}
                  </span>
                )}
                <span className="font-codet text-[11px] text-atelier-faint">
                  {s.entryCount} {s.entryCount === 1 ? "entry" : "entries"}
                </span>
                <span
                  className="font-codet text-[10px] tracking-[0.06em]"
                  style={{ color: active ? "#7FB996" : "#6E6A62" }}
                >
                  {active ? "ACTIVE" : "ENDED"}
                </span>
              </div>
              {s.summary && (
                <p className="m-0 mt-1.5 text-[13px] leading-relaxed text-[#9D988E]">{s.summary}</p>
              )}
            </li>
          );
        })}
      </ul>
    )}
  </section>
);

export default WorkSessionStrip;
