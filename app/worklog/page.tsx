"use client";

import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import WorkProjectCards from "../../src/components/worklog/WorkProjectCards";
import WorkEntryList from "../../src/components/worklog/WorkEntryList";
import WorkSessionStrip from "../../src/components/worklog/WorkSessionStrip";
import WorkReportPanel from "../../src/components/worklog/WorkReportPanel";
import { STATUS_META, STATUS_ORDER, worklogContent } from "../../src/config/worklog";
import {
  fetchWorkEntries,
  fetchWorkProjects,
  fetchWorkReport,
  fetchWorkSessions,
  updateEntryStatus,
  updateEntryVisibility,
} from "../../src/lib/api/worklog";
import type {
  ReportDigest,
  WorkEntry,
  WorkEntryStatus,
  WorkProjectSummary,
  WorkSessionSummary,
} from "../../src/types/worklog";

function WorklogDashboard() {
  const [projects, setProjects] = useState<WorkProjectSummary[]>([]);
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [sessions, setSessions] = useState<WorkSessionSummary[]>([]);
  const [report, setReport] = useState<ReportDigest | null>(null);

  const [project, setProject] = useState<string | null>(null);
  const [status, setStatus] = useState<WorkEntryStatus | null>(null);
  const [reportWindow, setReportWindow] = useState<string>("7d");

  const [loading, setLoading] = useState(true);
  const [busyRef, setBusyRef] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [nextProjects, nextEntries, nextSessions, nextReport] = await Promise.all([
        fetchWorkProjects(),
        fetchWorkEntries({
          project: project ?? undefined,
          status: status ?? undefined,
          limit: 100,
        }),
        fetchWorkSessions(),
        fetchWorkReport({ project: project ?? undefined, since: reportWindow || undefined }),
      ]);
      setProjects(nextProjects);
      setEntries(nextEntries);
      setSessions(nextSessions);
      setReport(nextReport);
    } catch {
      setError("Could not load the worklog. Check that you are still signed in.");
    } finally {
      setLoading(false);
    }
  }, [project, status, reportWindow]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (ref: number, next: WorkEntryStatus) => {
    setBusyRef(ref);
    try {
      const updated = await updateEntryStatus(ref, next);
      setEntries((prev) => prev.map((e) => (e.ref === ref ? { ...e, ...updated } : e)));
      load();
    } catch {
      setError(`Could not update entry #${ref}.`);
    } finally {
      setBusyRef(null);
    }
  };

  const handleVisibilityToggle = async (entry: WorkEntry) => {
    setBusyRef(entry.ref);
    const next = entry.visibility === "public" ? "private" : "public";
    try {
      const updated = await updateEntryVisibility(entry.ref, next);
      setEntries((prev) => prev.map((e) => (e.ref === entry.ref ? { ...e, ...updated } : e)));
    } catch {
      setError(`Could not change visibility for entry #${entry.ref}.`);
    } finally {
      setBusyRef(null);
    }
  };

  return (
    <main className="min-h-screen bg-atelier-ink px-6 pb-20 pt-24 max-[560px]:px-4">
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-10">
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
              <div
                key={i}
                className="h-20 rounded-xl border border-white/[0.07] bg-white/[0.03] shimmer"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            <WorkProjectCards projects={projects} selected={project} onSelect={setProject} />

            <WorkReportPanel report={report} window={reportWindow} onWindowChange={setReportWindow} />

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="m-0 font-codet text-xs tracking-[0.2em] text-atelier-muted">
                  ENTRIES
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStatus(null)}
                    className={`rounded-md border px-2.5 py-1 font-codet text-[10px] tracking-[0.06em] transition-colors ${
                      status === null
                        ? "border-atelier-gold/55 text-atelier-gold"
                        : "border-white/12 text-atelier-faint hover:border-white/25"
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
                entries={entries}
                busyRef={busyRef}
                onStatusChange={handleStatusChange}
                onVisibilityToggle={handleVisibilityToggle}
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
