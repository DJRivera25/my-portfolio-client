"use client";

import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { STATUS_META, STATUS_ORDER, worklogContent } from "../../config/worklog";
import type { WorkEntry, WorkEntryStatus } from "../../types/worklog";

interface Props {
  entries: WorkEntry[];
  busyRef: number | null;
  onStatusChange: (ref: number, status: WorkEntryStatus) => void;
}

function relative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 0)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days < 30 ? `${days}d ago` : new Date(iso).toLocaleDateString();
}

const WorkEntryList: React.FC<Props> = ({ entries, busyRef, onStatusChange }) => {
  if (!entries.length) {
    return (
      <div className="rounded-xl border border-white/[0.09] bg-white/[0.02] px-6 py-12 text-center">
        <p className="m-0 text-[15px] text-atelier-paper">{worklogContent.emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-atelier-faint">
          {worklogContent.emptyBody}
        </p>
      </div>
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {entries.map((entry) => {
        const meta = STATUS_META[entry.status];
        const busy = busyRef === entry.ref;

        return (
          <li
            key={entry._id ?? entry.ref}
            className={`rounded-xl border border-white/[0.09] bg-white/[0.02] p-4 transition-opacity ${
              busy ? "opacity-50" : ""
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-codet text-[11px] text-atelier-faint">#{entry.ref}</span>
                  <span
                    className="rounded-full px-2 py-0.5 font-codet text-[10px] tracking-[0.06em]"
                    style={{ color: meta.color, background: meta.dim }}
                  >
                    {meta.label.toUpperCase()}
                  </span>
                  {entry.project && (
                    <span className="font-codet text-[11px] text-atelier-muted">
                      {entry.project.name}
                    </span>
                  )}
                  <span className="font-codet text-[11px] text-atelier-faint">
                    {relative(entry.createdAt)}
                  </span>
                  {entry.minutesSpent ? (
                    <span className="font-codet text-[11px] text-atelier-faint">
                      {entry.minutesSpent}m
                    </span>
                  ) : null}
                </div>

                <p className="m-0 mt-2 text-[15px] leading-snug text-atelier-paper">{entry.title}</p>

                {entry.summary && (
                  <p className="m-0 mt-1.5 text-[13px] leading-relaxed text-[#9D988E]">
                    {entry.summary}
                  </p>
                )}

                {entry.status === "blocked" && entry.blockedReason && (
                  <p className="m-0 mt-1.5 text-[13px]" style={{ color: "#E07A5F" }}>
                    ↳ {entry.blockedReason}
                  </p>
                )}

                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-white/10 px-1.5 py-0.5 font-codet text-[10px] text-atelier-faint"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Menu as="div" className="relative">
                  <MenuButton
                    disabled={busy}
                    aria-label={`Status for entry ${entry.ref}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.12] px-2.5 py-1.5 font-codet text-[10px] tracking-[0.06em] transition-colors hover:border-white/25 disabled:opacity-50"
                    style={{ color: meta.color }}
                  >
                    {meta.label.toUpperCase()}
                    <ChevronDown size={12} aria-hidden />
                  </MenuButton>

                  <MenuItems
                    anchor="bottom end"
                    className="z-[60] mt-1.5 w-[168px] overflow-hidden rounded-lg border border-white/[0.12] p-1 shadow-atelier-card focus:outline-none"
                    style={{ background: "linear-gradient(180deg,#161618,#101012)" }}
                  >
                    {STATUS_ORDER.map((s) => {
                      const active = s === entry.status;
                      return (
                        <MenuItem key={s}>
                          <button
                            type="button"
                            onClick={() => onStatusChange(entry.ref, s)}
                            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left font-codet text-[11px] transition-colors data-[focus]:bg-white/[0.06]"
                            style={{ color: active ? STATUS_META[s].color : "#A39F96" }}
                          >
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ background: STATUS_META[s].color }}
                              aria-hidden
                            />
                            <span className="flex-1">{STATUS_META[s].label}</span>
                            {active && <Check size={13} aria-hidden />}
                          </button>
                        </MenuItem>
                      );
                    })}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default WorkEntryList;
