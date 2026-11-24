"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import WorkProjectCards from "../../src/components/worklog/WorkProjectCards";
import WorkEntryList from "../../src/components/worklog/WorkEntryList";
import WorkBoard from "../../src/components/worklog/WorkBoard";
import WorkEntryFilters from "../../src/components/worklog/WorkEntryFilters";
import WorkSessionStrip from "../../src/components/worklog/WorkSessionStrip";
import WorkReportPanel from "../../src/components/worklog/WorkReportPanel";
import {
  STATUS_META,
  STATUS_ORDER,
  VIEW_MODES,
  worklogContent,
  type WorklogView,
} from "../../src/config/worklog";
import {
  fetchDashboard,
  fetchWorkEntries,
  fetchWorkReport,
  updateEntryStatus,
  type EntryFilter,
} from "../../src/lib/api/worklog";
import type {
  ReportDigest,
  WorkAttachmentSummary,
  WorkEntry,
  WorkEntryFilterValue,
  WorkGroupSummary,
  WorkEntryStatus,
  WorkProjectSummary,
  WorkSessionSummary,
} from "../../src/types/worklog";

const ENTRY_LIMIT = 300;
const DEBOUNCE_MS = 300;
const EMPTY_FILTERS: WorkEntryFilterValue = { text: "", waitingOn: "", from: "", to: "" };
const UNFILTERED: EntryFilter = {};

type ReportScope = { project: string | null; since: string };

type ErrorSource = "update" | "entries" | "report" | "dashboard";
const NO_ERRORS: Record<ErrorSource, string | null> = {
  update: null,
  entries: null,
  report: null,
  dashboard: null,
};

// A bare YYYY-MM-DD reaches the server as a UTC day; the date inputs mean the viewer's own.
function startOfLocalDay(day: string, addDays = 0): string | undefined {
  if (!day) return undefined;
  const date = new Date(`${day}T00:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  date.setDate(date.getDate() + addDays);
  return date.toISOString();
}

function matchesStatus(filter: EntryFilter["status"], status: WorkEntryStatus): boolean {
  if (!filter) return true;
  return filter === "open" ? status !== "done" : filter === status;
}

function WorklogDashboard() {
  const [projects, setProjects] = useState<WorkProjectSummary[]>([]);
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [report, setReport] = useState<ReportDigest | null>(null);
  const [sessions, setSessions] = useState<WorkSessionSummary[]>([]);
  const [attachments, setAttachments] = useState<WorkAttachmentSummary[]>([]);
  const [groups, setGroups] = useState<WorkGroupSummary[]>([]);

  const [project, setProject] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [status, setStatus] = useState<WorkEntryStatus | null>(null);
  const [filters, setFilters] = useState<WorkEntryFilterValue>(EMPTY_FILTERS);
  const [debouncedText, setDebouncedText] = useState("");
  const [debouncedWaitingOn, setDebouncedWaitingOn] = useState("");
  const [reportWindow, setReportWindow] = useState<string>("7d");
  const [view, setView] = useState<WorklogView>("board");

  const [loading, setLoading] = useState(true);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [busyRef, setBusyRef] = useState<number | null>(null);
  // One slot per kind of request, so a success clears only its own failure: entries
  // loading again must not hide that the report is still missing.
  const [errors, setErrors] = useState(NO_ERRORS);

  // Every entries response checks it is still the newest request before it lands, so a
  // slow answer to an old filter can never overwrite the answer to the current one.
  const entrySeq = useRef(0);
  const reportSeq = useRef(0);
  // The filter the loaded entries belong to. Load more continues it, even while a newer
  // filter is still waiting on its debounce.
  const loadedFilter = useRef<EntryFilter>(UNFILTERED);
  // The newest filter and report scope asked for. React's dev Strict Mode runs every effect
  // twice; comparing against these keeps the first load to one dashboard and one report
  // request there too, and stops the dashboard's own first page being fetched again as an
  // entries request. They are also what a refetch after a status change re-asks for.
  const dashboardRequested = useRef(false);
  const requestedFilter = useRef<EntryFilter>(UNFILTERED);
  const requestedReport = useRef<ReportScope | null>(null);

  const setErrorFor = useCallback((source: ErrorSource, message: string | null) => {
    setErrors((prev) => (prev[source] === message ? prev : { ...prev, [source]: message }));
  }, []);

  const loadDashboard = useCallback(async () => {
    const seq = ++entrySeq.current;
    try {
      const data = await fetchDashboard();
      setProjects(data.projects);
      setSessions(data.sessions);
      setAttachments(data.attachments ?? []);
      setGroups(data.groups ?? []);
      if (seq === entrySeq.current) {
        setEntries(data.entries);
        setTotal(data.entryTotal);
      }
      setErrorFor("dashboard", null);
    } catch {
      setErrorFor("dashboard", worklogContent.loadError);
    } finally {
      setLoading(false);
    }
  }, [setErrorFor]);

  const loadEntries = useCallback(async (filter: EntryFilter, offset: number) => {
    const seq = ++entrySeq.current;
    setEntriesLoading(true);
    try {
      const page = await fetchWorkEntries({ ...filter, offset, limit: ENTRY_LIMIT });
      if (seq !== entrySeq.current) return;
      if (offset === 0) loadedFilter.current = filter;
      setEntries((prev) => {
        if (offset === 0) return page.entries;
        const seen = new Set(prev.map((e) => e._id));
        return [...prev, ...page.entries.filter((e) => !seen.has(e._id))];
      });
      setTotal(page.total);
      setErrorFor("entries", null);
    } catch {
      if (seq === entrySeq.current) setErrorFor("entries", worklogContent.loadError);
    } finally {
      if (seq === entrySeq.current) setEntriesLoading(false);
    }
  }, [setErrorFor]);

  const loadReport = useCallback(async (scope: ReportScope) => {
    const seq = ++reportSeq.current;
    try {
      const next = await fetchWorkReport({
        project: scope.project ?? undefined,
        since: scope.since || undefined,
      });
      if (seq !== reportSeq.current) return;
      setReport(next);
      setErrorFor("report", null);
    } catch {
      if (seq === reportSeq.current) {
        setReport(null);
        setErrorFor("report", worklogContent.loadError);
      }
    }
  }, [setErrorFor]);

  useEffect(() => {
    if (dashboardRequested.current) return;
    dashboardRequested.current = true;
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const last = requestedReport.current;
    if (last && last.project === project && last.since === reportWindow) return;
    requestedReport.current = { project, since: reportWindow };
    loadReport(requestedReport.current);
  }, [project, reportWindow, loadReport]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(filters.text.trim());
      setDebouncedWaitingOn(filters.waitingOn.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filters.text, filters.waitingOn]);

  const entryFilter = useMemo<EntryFilter>(
    () => ({
      project: project ?? undefined,
      group: group ?? undefined,
      // Every status is a column on the board, so a status filter there would only hide
      // columns. It belongs to the list view alone.
      status: view === "list" ? (status ?? undefined) : undefined,
      text: debouncedText || undefined,
      waitingOn: debouncedWaitingOn || undefined,
      since: startOfLocalDay(filters.from),
      until: startOfLocalDay(filters.to, 1),
    }),
    [project, group, status, view, debouncedText, debouncedWaitingOn, filters.from, filters.to]
  );

  useEffect(() => {
    if (JSON.stringify(entryFilter) === JSON.stringify(requestedFilter.current)) return;
    requestedFilter.current = entryFilter;
    loadEntries(entryFilter, 0);
  }, [entryFilter, loadEntries]);

  const visibleGroups = useMemo(
    () => (project ? groups.filter((g) => g.project?.slug === project) : groups),
    [groups, project]
  );

  const attachmentsByEntry = useMemo(() => {
    const map = new Map<number, WorkAttachmentSummary[]>();
    for (const a of attachments) {
      if (a.entryRef === null) continue;
      const list = map.get(a.entryRef);
      if (list) list.push(a);
      else map.set(a.entryRef, [a]);
    }
    return map;
  }, [attachments]);

  const errorText = [
    ...new Set(Object.values(errors).filter((m): m is string => m !== null)),
  ].join(" ");

  const handleStatusChange = async (ref: number, next: WorkEntryStatus) => {
    setBusyRef(ref);
    // Cleared on the next attempt, not on success: a failed update reloads the entries, and
    // that reload succeeding must not wipe the notice that the change was rolled back.
    setErrorFor("update", null);
    // Optimistic: the row updates, or leaves a status-filtered list, immediately, and is
    // reconciled from the response.
    const stays = matchesStatus(loadedFilter.current.status, next);
    setEntries((prev) =>
      stays
        ? prev.map((e) => (e.ref === ref ? { ...e, status: next } : e))
        : prev.filter((e) => e.ref !== ref)
    );
    if (!stays) setTotal((t) => Math.max(0, t - 1));
    try {
      const updated = await updateEntryStatus(ref, next);
      setEntries((prev) => prev.map((e) => (e.ref === ref ? { ...e, ...updated } : e)));
      if (requestedReport.current) loadReport(requestedReport.current);
    } catch {
      setErrorFor("update", `${worklogContent.updateError} #${ref}.`);
      loadEntries(requestedFilter.current, 0);
    } finally {
      setBusyRef(null);
    }
  };

  return (
    <main className="min-h-screen px-6 pb-20 pt-14 max-[560px]:px-4">
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-10 pt-10">
          <div className="mb-5 flex items-center gap-3.5">
            <span className="h-px w-11 bg-atelier-gold" />
            <span className="font-codet text-xs tracking-[0.2em] text-atelier-muted">
              {worklogContent.eyebrow}
            </span>
          </div>
          <h1 className="m-0 font-serifd text-[clamp(34px,4.4vw,54px)] font-normal leading-[1.06] text-atelier-paper">
            {worklogContent.heading}
            <span className="italic text-atelier-gold">{worklogContent.headingAccent}</span>.
          </h1>
          <p className="m-0 mt-4 max-w-[520px] text-[15px] leading-[1.6] text-[#9D988E]">
            {worklogContent.subhead}
          </p>
        </header>

        {errorText && (
          <p
            className="mb-6 rounded-lg border px-4 py-3 text-[13px]"
            style={{ borderColor: "rgba(224,122,95,0.4)", color: "#E07A5F" }}
            role="alert"
          >
            {errorText}
          </p>
        )}

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="at-card h-20 shimmer" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            <WorkProjectCards
              projects={projects}
              selected={project}
              onSelect={(slug) => {
                setProject(slug);
                setGroup(null);
              }}
            />

            {visibleGroups.length > 0 && (
              <section>
                <h2 className="mb-4 font-codet text-xs tracking-[0.2em] text-atelier-muted">
                  {worklogContent.groupsTitle.toUpperCase()}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setGroup(null)}
                    className={`rounded-md border px-2.5 py-1.5 font-codet text-[11px] transition-colors ${
                      group === null
                        ? "border-atelier-gold/55 text-atelier-gold"
                        : "border-white/[0.12] text-atelier-faint hover:border-white/25"
                    }`}
                  >
                    {worklogContent.filterAll}
                  </button>
                  {visibleGroups.map((g) => (
                    <button
                      key={`${g.project?.slug ?? ""}:${g.key}`}
                      type="button"
                      onClick={() => setGroup(group === g.name ? null : g.name)}
                      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-codet text-[11px] transition-colors ${
                        group === g.name
                          ? "border-atelier-gold/55 text-atelier-gold"
                          : "border-white/[0.12] text-atelier-muted hover:border-white/25"
                      }`}
                    >
                      {g.name}
                      <span className="text-atelier-faint">{g.total}</span>
                      {g.blocked > 0 && (
                        <span style={{ color: "#E07A5F" }}>{g.blocked}</span>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <WorkReportPanel
              report={report}
              window={reportWindow}
              onWindowChange={setReportWindow}
            />

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="m-0 font-codet text-xs tracking-[0.2em] text-atelier-muted">
                  {worklogContent.entriesTitle.toUpperCase()}
                  <span className="ml-2 text-atelier-faint">{total}</span>
                </h2>
                <div className="flex flex-wrap items-center gap-1.5">
                  {view === "list" && (
                    <>
                      <button
                        type="button"
                        onClick={() => setStatus(null)}
                        className={`rounded-md border px-2.5 py-1 font-codet text-[10px] tracking-[0.06em] transition-colors ${
                          status === null
                            ? "border-atelier-gold/55 text-atelier-gold"
                            : "border-white/[0.12] text-atelier-faint hover:border-white/25"
                        }`}
                      >
                        {worklogContent.filterAll.toUpperCase()}
                      </button>
                      {STATUS_ORDER.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStatus(status === s ? null : s)}
                          className="rounded-md border px-2.5 py-1 font-codet text-[10px] tracking-[0.06em] transition-colors"
                          style={{
                            borderColor:
                              status === s ? STATUS_META[s].color : "rgba(255,255,255,0.12)",
                            color: status === s ? STATUS_META[s].color : "#6E6A62",
                          }}
                        >
                          {STATUS_META[s].label.toUpperCase()}
                        </button>
                      ))}
                      <span className="mx-1 h-4 w-px bg-white/[0.12]" aria-hidden />
                    </>
                  )}

                  <div className="inline-flex overflow-hidden rounded-md border border-white/[0.12]">
                    {VIEW_MODES.map((mode) => (
                      <button
                        key={mode.value}
                        type="button"
                        onClick={() => setView(mode.value)}
                        aria-pressed={view === mode.value}
                        className={`px-2.5 py-1 font-codet text-[10px] tracking-[0.06em] transition-colors ${
                          view === mode.value
                            ? "bg-atelier-gold/[0.16] text-atelier-gold"
                            : "text-atelier-faint hover:text-atelier-paper"
                        }`}
                      >
                        {mode.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <WorkEntryFilters value={filters} onChange={setFilters} />

              <div
                aria-busy={entriesLoading}
                className={`transition-opacity ${entriesLoading ? "opacity-60" : ""}`}
              >
                {view === "board" ? (
                  <WorkBoard
                    entries={entries}
                    attachmentsByEntry={attachmentsByEntry}
                    busyRef={busyRef}
                    onStatusChange={handleStatusChange}
                  />
                ) : (
                  <WorkEntryList
                    entries={entries}
                    attachmentsByEntry={attachmentsByEntry}
                    busyRef={busyRef}
                    onStatusChange={handleStatusChange}
                  />
                )}
              </div>

              {total > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <span className="font-codet text-[11px] text-atelier-faint">
                    {worklogContent.showing} {entries.length} {worklogContent.of} {total}
                  </span>
                  {entries.length < total && (
                    <button
                      type="button"
                      onClick={() => loadEntries(loadedFilter.current, entries.length)}
                      disabled={entriesLoading}
                      className="rounded-md border border-white/[0.12] px-2.5 py-1 font-codet text-[10px] tracking-[0.06em] text-atelier-muted transition-colors hover:border-white/25 hover:text-atelier-paper disabled:opacity-50"
                    >
                      {worklogContent.loadMore.toUpperCase()}
                    </button>
                  )}
                </div>
              )}
            </section>

            <WorkSessionStrip sessions={sessions} />
          </div>
        )}
      </div>
    </main>
  );
}

export default function WorklogPage() {
  return (
    <ProtectedRoute>
      <WorklogDashboard />
    </ProtectedRoute>
  );
}
