"use client";

import React from "react";
import { PROJECT_STATUS_LABEL, worklogContent } from "../../config/worklog";
import type { WorkProjectSummary } from "../../types/worklog";

interface Props {
  projects: WorkProjectSummary[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

const WorkProjectCards: React.FC<Props> = ({ projects, selected, onSelect }) => {
  if (!projects.length) return null;

  return (
    <section>
      <h2 className="mb-4 font-codet text-xs tracking-[0.2em] text-atelier-muted">
        {worklogContent.projectsTitle.toUpperCase()}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`rounded-xl border px-4 py-3 text-left transition-colors ${
            selected === null
              ? "border-atelier-gold/55 bg-atelier-gold/[0.07]"
              : "border-white/[0.09] bg-white/[0.02] hover:border-white/20"
          }`}
        >
          <span className="block text-[15px] font-medium text-atelier-paper">
            {worklogContent.filterAll}
          </span>
          <span className="mt-1 block font-codet text-[11px] text-atelier-faint">
            {projects.reduce((n, p) => n + p.total, 0)} entries
          </span>
        </button>

        {projects.map((p) => {
          const active = selected === p.slug;
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => onSelect(active ? null : p.slug)}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                active
                  ? "border-atelier-gold/55 bg-atelier-gold/[0.07]"
                  : "border-white/[0.09] bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[15px] font-medium leading-tight text-atelier-paper">
                  {p.name}
                </span>
                <span className="mt-0.5 shrink-0 font-codet text-[10px] tracking-[0.08em] text-atelier-faint">
                  {PROJECT_STATUS_LABEL[p.status].toUpperCase()}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-codet text-[11px] text-atelier-muted">
                <span>{p.total} logged</span>
                {p.open > 0 && <span className="text-atelier-gold">{p.open} open</span>}
                {p.blocked > 0 && <span style={{ color: "#E07A5F" }}>{p.blocked} blocked</span>}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default WorkProjectCards;
