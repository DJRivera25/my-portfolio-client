"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Check, ChevronDown, Clock, GitCommitHorizontal, Paperclip } from "lucide-react";
import { STATUS_META, STATUS_ORDER, worklogContent } from "../../config/worklog";
import type { WorkAttachmentSummary, WorkEntry, WorkEntryStatus } from "../../types/worklog";

interface Props {
  entries: WorkEntry[];
  attachmentsByEntry: Map<number, WorkAttachmentSummary[]>;
  busyRef: number | null;
  onStatusChange: (ref: number, status: WorkEntryStatus) => void;
}

const SUMMARY_CLAMP = 150;

function shortDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "1d";
  if (days < 30) return `${days}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function clamp(text: string): string {
  return text.length > SUMMARY_CLAMP ? `${text.slice(0, SUMMARY_CLAMP).trimEnd()}…` : text;
}

const WorkBoard: React.FC<Props> = ({ entries, attachmentsByEntry, busyRef, onStatusChange }) => {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<WorkEntryStatus | null>(null);

  const drop = (status: WorkEntryStatus) => {
    if (dragging !== null) {
      const entry = entries.find((e) => e.ref === dragging);
      if (entry && entry.status !== status) onStatusChange(dragging, status);
    }
    setDragging(null);
    setOver(null);
  };

  return (
    <div className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-2">
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_META[status];
        const column = entries.filter((e) => e.status === status);
        const isTarget = over === status;

        return (
          <section
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(status);
            }}
            onDragLeave={() => setOver((s) => (s === status ? null : s))}
            onDrop={(e) => {
              e.preventDefault();
              drop(status);
            }}
            className="flex max-h-[72vh] min-w-[250px] flex-1 basis-0 flex-col rounded-xl border transition-colors"
            style={{
              borderColor: isTarget ? meta.color : "rgba(255,255,255,0.09)",
              background: isTarget ? meta.dim : "rgba(255,255,255,0.015)",
            }}
            aria-label={`${meta.label} column, ${column.length} entries`}
          >
            <header className="flex shrink-0 items-center gap-2.5 border-b border-white/[0.07] px-3.5 py-3">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: meta.color }}
                aria-hidden
              />
              <span
                className="font-codet text-[11px] uppercase tracking-[0.12em]"
                style={{ color: meta.color }}
              >
                {meta.label}
              </span>
              <span className="ml-auto font-codet text-[11px] text-atelier-faint">
                {column.length}
              </span>
            </header>

            {/* Each column scrolls on its own. Without this the board grows to the
                height of the tallest column — Done, which only ever gets longer — and
                the page becomes thousands of pixels tall. */}
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
              {column.length === 0 ? (
                <p className="px-1.5 py-6 text-center font-codet text-[11px] text-atelier-faint">
                  {isTarget ? "Drop here" : "Empty"}
                </p>
              ) : (
                column.map((entry) => {
                  const busy = busyRef === entry.ref;
                  const links = attachmentsByEntry.get(entry.ref) ?? [];
                  const isDragging = dragging === entry.ref;

                  return (
                    <article
                      key={entry._id ?? entry.ref}
                      draggable={!busy}
                      onDragStart={() => setDragging(entry.ref)}
                      onDragEnd={() => {
                        setDragging(null);
                        setOver(null);
                      }}
                      className={`cursor-grab rounded-lg border border-white/[0.09] bg-atelier-surface p-3 transition-opacity active:cursor-grabbing ${
                        busy || isDragging ? "opacity-40" : "hover:border-white/20"
                      }`}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="font-codet text-[10px] text-atelier-faint">
                          #{entry.ref}
                        </span>
                        {entry.project && (
                          <span className="truncate font-codet text-[10px] text-atelier-muted">
                            {entry.project.name}
                          </span>
                        )}
                        <span className="ml-auto shrink-0 font-codet text-[10px] text-atelier-faint">
                          {shortDate(entry.createdAt)}
                        </span>
                      </div>

                      <p className="m-0 text-[13.5px] leading-snug text-atelier-paper">
                        {entry.title}
                      </p>

                      {entry.summary && (
                        <p className="m-0 mt-1.5 text-[12px] leading-relaxed text-[#8F8A81]">
                          {clamp(entry.summary)}
                        </p>
                      )}

                      {entry.status === "blocked" && entry.blockedReason && (
                        <p
                          className="m-0 mt-2 border-l-2 pl-2 text-[12px] leading-snug"
                          style={{ color: "#E07A5F", borderColor: "rgba(224,122,95,0.45)" }}
                        >
                          {clamp(entry.blockedReason)}
                        </p>
                      )}

                      {entry.group && (
                        <span className="mt-2 inline-block rounded border border-atelier-gold/30 px-1.5 py-0.5 font-codet text-[10px] text-atelier-gold/90">
                          {entry.group}
                        </span>
                      )}

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/[0.06] pt-2">
                        {entry.minutesSpent ? (
                          <span className="inline-flex items-center gap-1 font-codet text-[10px] text-atelier-faint">
                            <Clock size={10} aria-hidden />
                            {entry.minutesSpent}m
                          </span>
                        ) : null}

                        {entry.commitSha && (
                          <span
                            className="inline-flex items-center gap-1 font-codet text-[10px] text-atelier-muted"
                            title={entry.commitMessage ?? undefined}
                          >
                            <GitCommitHorizontal size={10} aria-hidden />
                            {entry.commitSha.slice(0, 7)}
                          </span>
                        )}

                        {links.length > 0 && (
                          <a
                            href={links[0].url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 font-codet text-[10px] text-atelier-gold transition-colors hover:text-atelier-paper"
                          >
                            <Paperclip size={10} aria-hidden />
                            {links.length}
                          </a>
                        )}

                        {/* Drag is mouse-only, so the menu is the keyboard path to the
                            same action — not a fallback, an accessibility requirement. */}
                        <Menu as="div" className="relative ml-auto">
                          <MenuButton
                            disabled={busy}
                            aria-label={`Move entry ${entry.ref}`}
                            className="inline-flex items-center gap-1 rounded px-1 py-0.5 font-codet text-[10px] text-atelier-faint transition-colors hover:text-atelier-paper disabled:opacity-50"
                          >
                            Move
                            <ChevronDown size={10} aria-hidden />
                          </MenuButton>
                          <MenuItems
                            anchor="bottom end"
                            className="z-[60] mt-1 w-[150px] overflow-hidden rounded-lg border border-white/[0.12] p-1 shadow-atelier-card focus:outline-none"
                            style={{ background: "linear-gradient(180deg,#161618,#101012)" }}
                          >
                            {STATUS_ORDER.map((s) => (
                              <MenuItem key={s}>
                                <button
                                  type="button"
                                  onClick={() => onStatusChange(entry.ref, s)}
                                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left font-codet text-[11px] transition-colors data-[focus]:bg-white/[0.06]"
                                  style={{
                                    color: s === entry.status ? STATUS_META[s].color : "#A39F96",
                                  }}
                                >
                                  <span
                                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ background: STATUS_META[s].color }}
                                    aria-hidden
                                  />
                                  <span className="flex-1">{STATUS_META[s].label}</span>
                                  {s === entry.status && <Check size={12} aria-hidden />}
                                </button>
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Menu>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default WorkBoard;
