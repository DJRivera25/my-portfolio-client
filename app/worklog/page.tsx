"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import WorkProjectCards from "../../src/components/worklog/WorkProjectCards";
import WorkEntryList from "../../src/components/worklog/WorkEntryList";
import WorkSessionStrip from "../../src/components/worklog/WorkSessionStrip";
import WorkReportPanel from "../../src/components/worklog/WorkReportPanel";
import { STATUS_META, STATUS_ORDER, worklogContent } from "../../src/config/worklog";
import { fetchDashboard, updateEntryStatus } from "../../src/lib/api/worklog";
import { aggregateReport } from "@/lib/worklog/report";
import { parseSince } from "@/lib/worklog/since";
import type { WorkEntryLike } from "@/lib/worklog/types";
import type {
  WorkAttachmentSummary,
  WorkEntry,
  WorkEntryStatus,
  WorkProjectSummary,
  WorkSessionSummary,
} from "../../src/types/worklog";

function WorklogDashboard() {
  const [projects, setProjects] = useState<WorkProjectSummary[]>([]);
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [sessions, setSessions] = useState<WorkSessionSummary[]>([]);
  const [attachments, setAttachments] = useState<WorkAttachmentSummary[]>([]);

  const [project, setProject] = useState<string | null>(null);
  const [status, setStatus] = useState<WorkEntryStatus | null>(null);
  const [reportWindow, setReportWindow] = useState<string>("7d");

  const [loading, setLoading] = useState(true);
  const [busyRef, setBusyRef] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * One request for everything. Filtering and report aggregation happen in memory
   * below, so selecting a project or changing the window costs no network — the
   * previous version refetched all four endpoints on every filter change, which is
   * why the card highlighted instantly but its content lagged behind.
   */
  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchDashboard();
      setProjects(data.projects);
      setEntries(data.entries);
      setSessions(data.sessions);
      setAttachments(data.attachments ?? []);
    } catch {
      setError("Could not load the worklog. Check that you are still signed in.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // --- everything below is instant: no network, no refetch ---

  const visibleEntries = useMemo(
    () =>
      entries.filter(
        (e) =>
          (!project || e.project?.slug === project) && (!status || e.status === status)
      ),
    [entries, project, status]
  );

  const report = useMemo(() => {
    const scoped = project ? entries.filter((e) => e.project?.slug === project) : entries;
    // aggregateReport is a pure function with no server dependencies, so the client
    // can run the same aggregation the MCP report tool uses.
    return aggregateReport(scoped as unknown as WorkEntryLike[], {
      since: parseSince(reportWindow),
    });
  }, [entries, project, reportWindow]);

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

  const handleStatusChange = async (ref: number, next: WorkEntryStatus) => {
    setBusyRef(ref);
    // Optimistic: the row updates immediately, and is reconciled from the response.
    setEntries((prev) => prev.map((e) => (e.ref === ref ? { ...e, status: next } : e)));
    try {
      const updated = await updateEntryStatus(ref, next);
      setEntries((prev) => prev.map((e) => (e.ref === ref ? { ...e, ...updated } : e)));
    } catch {
      setError(`Could not update entry #${ref}.`);
      load();
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

        {error && (
          <p
            className="mb-6 rounded-lg border px-4 py-3 text-[13px]"
            style={{ borderColor: "rgba(224,122,95,0.4)", color: "#E07A5F" }}
            role="alert"
          >
            {error}
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
            <WorkProjectCards projects={projects} selected={project} onSelect={setProject} />

            <WorkReportPanel
              report={report}
              window={reportWindow}
              onWindowChange={setReportWindow}
            />

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="m-0 font-codet text-xs tracking-[0.2em] text-atelier-muted">
                  ENTRIES
                  <span className="ml-2 text-atelier-faint">{visibleEntries.length}</span>
                </h2>
                <div className="flex flex-wrap gap-1.5">
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
                        borderColor: status === s ? STATUS_META[s].color : "rgba(255,255,255,0.12)",
                        color: status === s ? STATUS_META[s].color : "#6E6A62",
                      }}
                    >
                      {STATUS_META[s].label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <WorkEntryList
                entries={visibleEntries}
                attachmentsByEntry={attachmentsByEntry}
                busyRef={busyRef}
                onStatusChange={handleStatusChange}
              />
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
