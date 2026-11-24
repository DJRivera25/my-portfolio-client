# Worklog roadmap — build step 1: Foundations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## In plain English

**What this is.** This is the first of five build steps from the approved design. It fixes the worklog's
foundations before any roadmap features go on top. Every list says how much it is not showing. A
report counts everything. Entries can say who or what they are waiting on. claude.ai can connect
with its own key. A session started inside a Tools Australia worktree finds its project.

**Who is involved.**
- **You** set one new key on Vercel and in your local env file, add the connector on claude.ai, deploy,
  and say yes before the updated session-start script replaces the one on your machine.
- **Claude Code sessions** get better filters on `list_work` and a briefing about their own project only.
- **claude.ai** can read and write the worklog through the same tools. Its writes are labelled as
  claude.ai's.
- **The dashboard** filters on the server, so nothing beyond the first 300 entries disappears.

**One example, start to finish.** On Tue 25 Nov you open a new session in
`C:\Codes\ToolsAustralia\.worktrees\2027-tradieiq`.
1. The session-start script asks git for this checkout's remote (`…/ToolsAustralia.git`). It strips
   any login details from it and asks the worklog for open items in the project whose repo matches,
   which is `tools-australia`.
2. The session sees "Open worklog items for this project", followed by "Tools Australia · 101
   matching" and the newest 12 items, each with its blocked reason or what it is waiting on. The last
   line is "Showing 12 of 101 — pass offset 12 for more".
3. Nothing from `hclub` or any other project appears. Today's script prints up to five of their
   blocked items, and that block is gone.
4. That evening you ask claude.ai "what is waiting on Derem?". It calls `list_work` with
   `waiting_on: "Derem"` and lists exactly those entries. If you have it log something, the entry
   is marked as coming from claude.ai.

**The rules in ordinary words.**
- A list that has more than it shows always says so, and says how to get the rest.
- A report counts every entry in its window. Only its list of blocked items is shortened, and it
  says by how many.
- "Waiting on" is a short name ("Derem", "PR #1018"). It is cleared automatically when the entry is
  done.
- A project key or repo that matches nothing says so. It is no longer shown as "No entries."

**What you see when it goes wrong.**
- If the worklog is down at session start, you get one line: "Worklog unreachable: no
  cross-session check this time". The session starts within a few seconds.
- If this repo isn't linked to a worklog project, you get one line telling you how to link it.
- If a dashboard filter is typed quickly, only the last result is shown. An older, slower answer
  can't overwrite a newer one.

**Deliberately not in this step.** These come in steps 2–5, each with its own plan:
- tracks and the track filter
- roadmaps
- check-in and briefings by track
- decisions
- file overlaps
- the edit and prompt hooks

One known gap stays open, and the docs will say so: the dashboard still loads only the newest 200
attachments.

---

**Goal:** Remove every silent cap from the worklog's MCP tools and dashboard. Add the `open`, text,
waiting-on, date-range, session and offset filters, a `waitingOn` field, and a second MCP client
(claude.ai) with its own token. Also make the session-start hook resolve the project from the git
remote, so it works in worktrees and never prints other projects.

**Architecture:** New pure modules in `lib/worklog/` hold every rule: repo URL normalisation,
filter → Mongo query, page footer, entry-page formatting, report from counts, and the waiting-on
rule. They are unit-tested without a database. The query shells (`entries.ts`, `projects.ts`) and
the protocol surfaces (`app/api/mcp/tools.ts`, `/api/worklog/*`, the dashboard) call into them.
The hook's source moves into this repo under `scripts/worklog-hooks/`. An install script copies it
to `~/.claude/hooks/`.

**Tech Stack:** Next.js 15 App Router, Mongoose, Zod 4, `mcp-handler` 2.1.1 with
`@modelcontextprotocol/server` 2.0.0, Vitest 4 (node env), `node --test` for the hook helpers.

**Spec:** [docs/superpowers/specs/2026-11-23-worklog-roadmap-design.md](../specs/2026-11-23-worklog-roadmap-design.md),
§14 step 1, plus §6 (WorkProject repo, WorkEntry `waitingOn`), §8 (`list_work`, `work_report`,
`log_work`, `update_work_status` changes, except `track`), §9 (session-start hook, project
resolution, context budget rules 1 and 4), §10 (auth), and §11 (entry filters, server-side counts).

## Global Constraints

- **No commits, pushes or PRs.** The owner commits by hand (`CLAUDE.md` rule 1, enforced by hook).
  Each task ends at a green check, not a commit.
- **Secrets.** Never open `.env*` (except `.env.example`), `~/.claude.json`, `~/.claude/settings*.json` or
  any file the global secrets rule lists, and never print env values. The hook script reads
  `~/.claude.json` at runtime itself; the builder never does. Brief every subagent with this rule.
- Pure modules in `lib/worklog/` (`repo.ts`, `filters.ts`, `format.ts`, `report.ts`, `status.ts`,
  `since.ts`, `types.ts`) import no mongoose and nothing from `lib/db.ts`.
- Mongoose only through `dbConnect()`; models use `models.X || model("X", …)`.
- Route handlers stay thin: parse (Zod) → `isAuthorizedAdmin` → delegate to `lib/worklog/`.
- MCP exposes no delete. Unchanged.
- Vitest runs `lib/**/*.test.ts` only, `node` environment. Hook helpers are tested with
  `node --test`.
- Dashboard copy lives in `src/config/worklog.ts`. No string literals in JSX. Path aliases:
  `@/lib/*`, `@/src/*`, `@/app/*` only.
- Naming: reuse `status`, `group`, `groupKey`, `matchKey`, `source`, `repo`, `blockedReason`. New names,
  coined in the spec: `waitingOn` (field) / `waiting_on` (MCP arg), `McpClient` = `"claude-code" | "claude-ai"`,
  and the entry `source` value `"claude-ai"`. Existing source values `"claude"` and `"web"` are unchanged.
- Exact strings (spec §8, §9):
  - `Showing 25 of 96 — pass offset 25 for more` (page footer)
  - `Worklog unreachable: no cross-session check this time.`
  - ``No worklog project matches this repo — set it with `set_work_project_status` (repo).``
- Hook rules (spec §9):
  - 4-second timeout per call, everything in try/catch, always exit 0.
  - Never print the token or the remote URL.
  - Output at most 40 lines, and nothing about another project.
- Plan checkboxes are ticked the moment a step is verified (global rule). Run
  `npm run type-check && npm test` at the end of every task.

## Review Focus

1. **A git remote with login details in it** (`https://user:token@github.com/…`). The hook must
   strip the credentials before anything leaves the machine. The stored `repo` must never contain
   them. Tests: Task 1 (TS) and Task 10 (hook) both assert the credential string is absent.
2. **A project key or repo that matches nothing.** The answer must be the explicit "No worklog project
   matches…" line, not "No entries.", which reads as "nothing open". Test: Task 3,
   `formatEntryPage` unmatched cases.
3. **Search text with regex characters** (`C++`, `(v2)`, `a.b`, `[`). It must match literally and
   never throw a Mongo regex error. Test: Task 2, `entryQueryFrom` literal-escape case.
4. **Fast typing in a dashboard filter.** A slow, older response must not replace a newer one.
   Not unit-testable here (no component tests), so it is a named hand check in Task 11.
5. **Session start when git is missing, the folder is not a repo, or the worklog is down.** The
   result is silence or exactly one line, within a few seconds (one 4-second network cap), with
   exit 0. An MCP error reply counts as unreachable and is never printed raw. Tests: Task 10
   `projectLookup` null cases. Hand check in Task 11 for the unreachable case.

---

### Task 1: Repo URL normalisation (shared rule)

**Files:**
- Create: `lib/worklog/repo.ts`
- Test: `lib/worklog/repo.test.ts`

**Interfaces:**
- Produces:
  - `normaliseRepoUrl(input: string | null | undefined): string | null`: returns lowercase
    `host/owner/repo`, with no scheme, credentials, port, `.git` or trailing slash. Returns `null`
    when there is no host containing a dot, or fewer than two path segments.
  - `repoNameKey(normalised: string): string`: `projectMatchKey` of the last segment.

- [x] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { normaliseRepoUrl, repoNameKey } from "./repo";

describe("normaliseRepoUrl", () => {
  it.each([
    ["https://github.com/Owner/ToolsAustralia.git", "github.com/owner/toolsaustralia"],
    ["https://github.com/owner/toolsaustralia/", "github.com/owner/toolsaustralia"],
    ["git@github.com:Owner/ToolsAustralia.git", "github.com/owner/toolsaustralia"],
    ["ssh://git@github.com:22/owner/ToolsAustralia.git", "github.com/owner/toolsaustralia"],
    ["github.com/owner/toolsaustralia", "github.com/owner/toolsaustralia"],
  ])("%s → %s", (input, expected) => {
    expect(normaliseRepoUrl(input)).toBe(expected);
  });

  it("drops credentials embedded in the URL", () => {
    const out = normaliseRepoUrl("https://someone:not-a-real-secret@github.com/owner/repo.git");
    expect(out).toBe("github.com/owner/repo");
    expect(out).not.toContain("not-a-real-secret");
  });

  it.each([[""], [null], [undefined], ["C:/Codes/ToolsAustralia"], ["just-a-name"],
    ["https://github.com/"], ["file:///srv/repo.git"]])("returns null for %s", (input) => {
    expect(normaliseRepoUrl(input)).toBeNull();
  });

  it("is idempotent", () => {
    const once = normaliseRepoUrl("git@github.com:Owner/Repo.git")!;
    expect(normaliseRepoUrl(once)).toBe(once);
  });
});

describe("repoNameKey", () => {
  it("keys the repo by its last segment, separator-free", () => {
    expect(repoNameKey("github.com/owner/tools-australia")).toBe("toolsaustralia");
  });
});
```

- [x] **Step 2: Run it to make sure it fails.** Run `npx vitest run lib/worklog/repo.test.ts`.
  Expected: FAIL, cannot resolve `./repo`.
- [x] **Step 3: Implement both functions in `lib/worklog/repo.ts`.** Handle scp-style
  `user@host:path` before URL parsing. A Windows drive (`C:`) fails the "host contains a dot"
  rule. `repoNameKey` imports `projectMatchKey` from `./slug`.
- [x] **Step 4: Run the test.** Run `npx vitest run lib/worklog/repo.test.ts`. Expected: PASS.

---

### Task 2: Filter → query, and the `until` bound

**Files:**
- Create: `lib/worklog/filters.ts`
- Modify: `lib/worklog/since.ts` (add `parseUntil`)
- Test: `lib/worklog/filters.test.ts`, `lib/worklog/since.test.ts` (extend)

**Interfaces:**
- Consumes: `groupKey` (`./slug`), `OPEN_STATUSES`, `WORK_ENTRY_STATUSES`, `WorkEntryStatus` (`./types`)
- Produces:
  - `type EntryStatusFilter = WorkEntryStatus | "open"`
  - `type EntryQueryInput = { projectId?: unknown; sessionId?: unknown; group?: string; status?: EntryStatusFilter; text?: string; waitingOn?: string; since?: Date; until?: Date }`
  - `entryQueryFrom(input: EntryQueryInput): Record<string, unknown>`
  - `type EntryListParams = { project?: string; group?: string; status?: EntryStatusFilter; text?: string; waitingOn?: string; since?: Date; until?: Date; offset: number; limit: number }`
  - `parseEntryQuery(params: URLSearchParams, now?: Date): { value: EntryListParams } | { error: string }`
    is the dashboard route's Zod parse. `limit` defaults to 300 (max 500) and `offset` to 0.
    Query keys: `project group status text waitingOn since until offset limit`.
  - `parseUntil(input?: string | null, now?: Date): Date | undefined`. A bare `YYYY-MM-DD` gives the
    next UTC midnight (an exclusive bound). Otherwise it behaves exactly like `parseSince`.

- [x] **Step 1: Write the failing tests**

```ts
// lib/worklog/filters.test.ts
import { describe, it, expect } from "vitest";
import { entryQueryFrom, parseEntryQuery } from "./filters";

describe("entryQueryFrom", () => {
  it("returns an empty query for no filters", () => expect(entryQueryFrom({})).toEqual({}));
  it("expands 'open' to the three open statuses", () =>
    expect(entryQueryFrom({ status: "open" })).toEqual({
      status: { $in: ["todo", "in_progress", "blocked"] },
    }));
  it("passes one status through", () =>
    expect(entryQueryFrom({ status: "blocked" })).toEqual({ status: "blocked" }));
  it("matches text in title or summary, case-insensitively and literally", () => {
    const re = { $regex: "C\\+\\+ \\(v2\\) a\\.b \\[", $options: "i" };
    expect(entryQueryFrom({ text: "C++ (v2) a.b [" })).toEqual({
      $or: [{ title: re }, { summary: re }],
    });
  });
  it("matches waiting-on as a case-insensitive substring", () =>
    expect(entryQueryFrom({ waitingOn: "derem" })).toEqual({
      waitingOn: { $regex: "derem", $options: "i" },
    }));
  it("ignores blank text and waiting-on", () =>
    expect(entryQueryFrom({ text: "  ", waitingOn: "" })).toEqual({}));
  it("bounds createdAt: since inclusive, until exclusive", () => {
    const since = new Date("2026-11-01T00:00:00Z");
    const until = new Date("2026-11-21T00:00:00Z");
    expect(entryQueryFrom({ since, until })).toEqual({ createdAt: { $gte: since, $lt: until } });
  });
  it("keys the group separator-free", () =>
    expect(entryQueryFrom({ group: "FT-11" })).toEqual({ groupKey: "ft11" }));
  it("scopes by resolved project and session ids", () =>
    expect(entryQueryFrom({ projectId: "p1", sessionId: "s1" })).toEqual({
      project: "p1",
      session: "s1",
    }));
});

describe("parseEntryQuery", () => {
  const now = new Date("2026-11-24T12:00:00Z");
  it("defaults to the first page of 300", () =>
    expect(parseEntryQuery(new URLSearchParams(), now)).toEqual({ value: { offset: 0, limit: 300 } }));
  it("reads every filter", () => {
    const q = new URLSearchParams(
      "project=tools-australia&group=FT-11&status=open&text=upsell&waitingOn=Derem" +
        "&since=2026-11-01&until=2026-11-20&offset=300&limit=300"
    );
    expect(parseEntryQuery(q, now)).toEqual({
      value: {
        project: "tools-australia", group: "FT-11", status: "open", text: "upsell", waitingOn: "Derem",
        since: new Date("2026-11-01T00:00:00Z"), until: new Date("2026-11-21T00:00:00Z"),
        offset: 300, limit: 300,
      },
    });
  });
  it("rejects an unknown status", () =>
    expect(parseEntryQuery(new URLSearchParams("status=nope"), now)).toHaveProperty("error"));
  it("rejects a limit over 500", () =>
    expect(parseEntryQuery(new URLSearchParams("limit=501"), now)).toHaveProperty("error"));
});
```

Add to `lib/worklog/since.test.ts`:

```ts
describe("parseUntil", () => {
  const now = new Date("2026-11-24T12:00:00Z");
  it("makes a bare date inclusive by returning the next midnight", () =>
    expect(parseUntil("2026-11-20", now)).toEqual(new Date("2026-11-21T00:00:00.000Z")));
  it("keeps a full timestamp as given", () =>
    expect(parseUntil("2026-11-20T15:00:00Z", now)).toEqual(new Date("2026-11-20T15:00:00Z")));
  it("reads relative windows like parseSince", () =>
    expect(parseUntil("7d", now)).toEqual(new Date("2026-11-17T12:00:00Z")));
  it("returns undefined for blank input", () => expect(parseUntil("", now)).toBeUndefined());
});
```

- [x] **Step 2: Run them to make sure they fail.** Run
  `npx vitest run lib/worklog/filters.test.ts lib/worklog/since.test.ts`. Expected: FAIL, with
  missing exports.
- [x] **Step 3: Implement `entryQueryFrom`, `parseEntryQuery` (Zod schema over
  `Object.fromEntries(params)` with coerced numbers) and `parseUntil`.** Blank strings count as
  absent. Escape regex input with `s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")`.
- [x] **Step 4: Run the tests.** Same command. Expected: PASS.

---

### Task 3: Page footer, entry page and report formatting

**Files:**
- Modify: `lib/worklog/types.ts`, `lib/worklog/format.ts`
- Test: `lib/worklog/format.test.ts` (extend)

**Interfaces:**
- Produces, in `types.ts`:
  - `WorkEntryLike.waitingOn?: string | null`
  - `ReportBlocker.waitingOn: string | null`
  - `type WorkEntryPage = { entries: WorkEntryLike[]; total: number; offset: number; project: { name: string; slug: string } | null; unmatched: { kind: "project" | "repo" | "session"; value: string } | null }`
- Produces, in `format.ts`:
  - `formatPageFooter(shown: number, total: number, offset: number): string` returns `""` when
    nothing is beyond this page.
  - `formatEntries(entries: WorkEntryLike[], opts?: { showProject?: boolean }): string`.
    `showProject` defaults to true. Any entry that is not done and has a `waitingOn` gets a
    `      ↳ waiting on <name>` line.
  - `formatEntryPage(page: WorkEntryPage): string`
  - `REPORT_BLOCKER_LINES = 15`. `formatReport` prints at most that many blockers, then
    `  …and N more — list_work status 'blocked'`, where N is `byStatus.blocked` minus the number
    shown.

- [x] **Step 1: Write the failing tests** (add to `format.test.ts`, reusing its `entry()` helper)

```ts
describe("formatPageFooter", () => {
  it.each([
    [25, 96, 0, "Showing 25 of 96 — pass offset 25 for more"],
    [25, 96, 25, "Showing 26–50 of 96 — pass offset 50 for more"],
    [21, 96, 75, ""],
    [5, 5, 0, ""],
  ])("shown %i of %i at offset %i", (shown, total, offset, expected) =>
    expect(formatPageFooter(shown, total, offset)).toBe(expected));
});

describe("formatEntries — waiting on", () => {
  it("shows who an open entry waits on", () =>
    expect(formatEntries([entry({ ref: 4, status: "todo", waitingOn: "Derem" })])).toContain(
      "↳ waiting on Derem"));
  it("hides waiting-on once done", () =>
    expect(formatEntries([entry({ ref: 5, status: "done", waitingOn: "Derem" })])).not.toContain(
      "waiting on"));
  it("can drop the per-line project when the page names it once", () =>
    expect(formatEntries([entry({ ref: 6 })], { showProject: false })).not.toContain(
      "[Tools Australia]"));
});

describe("formatEntryPage", () => {
  const page = (over: Partial<WorkEntryPage>): WorkEntryPage => ({
    entries: [], total: 0, offset: 0, project: null, unmatched: null, ...over,
  });
  it("names an unmatched project key", () =>
    expect(formatEntryPage(page({ unmatched: { kind: "project", value: "tools-oz" } }))).toBe(
      'No worklog project matches "tools-oz".'));
  it("tells the hook how to link an unmatched repo", () =>
    expect(formatEntryPage(page({ unmatched: { kind: "repo", value: "github.com/o/r" } }))).toBe(
      "No worklog project matches this repo — set it with `set_work_project_status` (repo)."));
  it("names an unknown session", () =>
    expect(formatEntryPage(page({ unmatched: { kind: "session", value: "abc" } }))).toBe(
      "No session abc."));
  it("says so plainly when nothing matches", () => expect(formatEntryPage(page({}))).toBe("No entries."));
  it("explains an offset past the end", () =>
    expect(formatEntryPage(page({ total: 96, offset: 200 }))).toBe(
      "No entries at offset 200 (96 in total)."));
  it("heads a project page once and ends with the footer", () => {
    const out = formatEntryPage(page({
      entries: [entry({ ref: 1, status: "todo" })], total: 96,
      project: { name: "Tools Australia", slug: "tools-australia" },
    }));
    expect(out.split("\n")[0]).toBe("Tools Australia · 96 matching");
    expect(out).not.toContain("[Tools Australia]");
    expect(out.endsWith("Showing 1 of 96 — pass offset 1 for more")).toBe(true);
  });
});

describe("formatReport — blocker cap", () => {
  it("lists 15 blockers and counts the rest", () => {
    const blockers = Array.from({ length: 20 }, (_, i) => ({
      ref: i + 1, title: `B${i + 1}`, project: "Tools Australia", reason: null, waitingOn: null,
    }));
    const out = formatReport({
      total: 20, since: null, minutesSpent: 0,
      byStatus: { todo: 0, in_progress: 0, blocked: 20, done: 0 },
      byProject: [], blockers,
    });
    expect(out).toContain("#15 B15");
    expect(out).not.toContain("#16 B16");
    expect(out).toContain("…and 5 more — list_work status 'blocked'");
  });
});
```

- [x] **Step 2: Run them to make sure they fail.** Run `npx vitest run lib/worklog/format.test.ts`.
  Expected: FAIL.
- [x] **Step 3: Implement it.** A blocker line becomes
  `  #ref title (project) — reason · waiting on X`. Each part shows only when present.
- [x] **Step 4: Run the tests.** Same command. Expected: PASS.

---

### Task 4: Report from counts (no cap)

**Files:**
- Modify: `lib/worklog/report.ts` (replace `aggregateReport` with `reportFromCounts`), `lib/worklog/types.ts`,
  `lib/worklog/entries.ts` (`buildReport`)
- Test: `lib/worklog/report.test.ts` (port every existing case)

**Interfaces:**
- Produces:
  - `type ReportCountRow = { project: { name: string; slug: string }; status: WorkEntryStatus; count: number; minutesSpent: number }`
    in `types.ts`
  - `reportFromCounts(rows: ReportCountRow[], blockers: ReportBlocker[], opts?: { since?: Date }): ReportDigest`.
    It gives the same digest `aggregateReport` gave for the same data. Projects are sorted busiest
    first, then by slug.
  - `buildReport(opts: { project?: string; since?: Date }): Promise<ReportDigest>`. The signature
    is unchanged; it now runs a Mongo aggregation, not a capped `find`.

- [x] **Step 1: Port `report.test.ts` to `reportFromCounts`.** Every existing expectation stays,
  with rows as input, e.g. `row("toolsaustralia", "done", 1, 10)`. Add one case:
  `blockers are passed through unchanged and since is echoed as ISO`.
- [x] **Step 2: Run it to make sure it fails.** Run `npx vitest run lib/worklog/report.test.ts`.
  Expected: FAIL, `reportFromCounts` is not exported.
- [x] **Step 3: Implement `reportFromCounts`, then delete `aggregateReport`.** Its only other
  caller, `app/worklog/page.tsx`, moves to the server report in Task 8.
- [x] **Step 4: Rewrite `buildReport` in `entries.ts`.**
  - Resolve the project id as `listWorkEntries` does. An unmatched key returns the zero digest.
  - Build `match = entryQueryFrom({ projectId, since })`.
  - `WorkEntry.aggregate([{ $match: match }, { $group: { _id: { project: "$project", status: "$status" }, count: { $sum: 1 }, minutesSpent: { $sum: { $ifNull: ["$minutesSpent", 0] } } } }])`.
  - Look up names with one `WorkProject.find({ _id: { $in } }).select("name slug")`. A missing
    project becomes `{ name: "Unassigned", slug: "unassigned" }`.
  - Blockers: `WorkEntry.find({ ...match, status: "blocked" }).sort({ createdAt: -1 }).limit(50)`, populated.
- [x] **Step 5: Run the checks.** Run `npx vitest run lib/worklog/report.test.ts && npm run type-check`.
  Expected: PASS. Type-check fails only on `app/worklog/page.tsx`'s `aggregateReport` import,
  which Task 8 removes. Note it in the ledger.

---

### Task 5: `waitingOn` on entries

**Files:**
- Modify: `lib/models/WorkEntry.ts`, `lib/worklog/status.ts`, `lib/worklog/entries.ts`,
  `app/api/mcp/tools.ts` (`log_work`, `update_work_status` args)
- Test: `lib/worklog/status.test.ts` (extend)

**Interfaces:**
- Produces:
  - Model field `waitingOn: { type: String, trim: true }`
  - `resolveWaitingOn(status: WorkEntryStatus, given: string | undefined): string | null | undefined`.
    Returns `null` when the status is `done` or `given` is blank, `given` when non-blank, and
    `undefined` (meaning leave it) when not given.
  - `LogWorkInput.waitingOn?: string`
  - `updateWorkEntryStatus(ref: number, status: WorkEntryStatus, blockedReason?: string, waitingOn?: string)`
  - MCP arg `waiting_on` on `log_work` and `update_work_status`, described as: "Who or what this
    waits on, as a short name: 'Derem', 'PR #1018', 'Track 4'. Pass an empty string to clear.
    Cleared automatically when done."

- [x] **Step 1: Write the failing test**

```ts
describe("resolveWaitingOn", () => {
  it("clears on done, whatever was given", () => expect(resolveWaitingOn("done", "Derem")).toBeNull());
  it("clears on a blank value", () => expect(resolveWaitingOn("blocked", "  ")).toBeNull());
  it("sets a given name", () => expect(resolveWaitingOn("todo", "Derem")).toBe("Derem"));
  it("leaves it alone when not given", () => expect(resolveWaitingOn("blocked", undefined)).toBeUndefined());
});
```

- [x] **Step 2: Run it to make sure it fails.** Run `npx vitest run lib/worklog/status.test.ts`.
  Expected: FAIL.
- [x] **Step 3: Implement `resolveWaitingOn`, then wire it in.** In `logWork`'s `fieldsFrom` and in
  `updateWorkEntryStatus`, set `waitingOn` only when the result is not `undefined`. Add the field
  to the model and the two tool schemas.
- [x] **Step 4: Run the checks.** Run `npx vitest run lib/worklog/status.test.ts && npm run type-check`.
  Expected: PASS, apart from the known page.tsx error from Task 4.

---

### Task 6: `list_work` filters, pages and project resolution

**Files:**
- Modify: `lib/worklog/entries.ts`, `lib/worklog/projects.ts`, `lib/worklog/dashboard.ts`,
  `app/api/mcp/tools.ts` (`list_work`, `set_work_project_status` description)

**Interfaces:**
- Consumes:
  - `entryQueryFrom`, `EntryStatusFilter` (Task 2)
  - `normaliseRepoUrl`, `repoNameKey` (Task 1)
  - `formatEntryPage`, `WorkEntryPage` (Task 3)
- Produces:
  - `type ListWorkFilter = { project?: string; repo?: string; group?: string; status?: EntryStatusFilter; text?: string; waitingOn?: string; since?: Date; until?: Date; sessionId?: string; offset?: number; limit?: number }`
  - `listWorkEntries(filter?: ListWorkFilter): Promise<WorkEntryPage>`
    - `limit` defaults to 25 and is clamped to 1–500. `offset` is floored at 0.
    - `project` wins over `repo`.
    - An unmatched project, repo or session returns an empty page with `unmatched` set.
    - Entries and total come from `Promise.all([find…skip…limit…populate, countDocuments])`.
  - `findWorkProjectByRepo(repoUrl: string): Promise<{ _id: unknown; name: string; slug: string } | null>`
    in `projects.ts`. Matching happens in this order:
    1. Any project whose stored `repo` normalises to the same value. Load the few projects with a
       repo and compare in JS, so older un-normalised values still match.
    2. Otherwise, the project whose `matchKey === repoNameKey(n)`. This match counts only when that
       project has no `repo` yet. When it does match, store `repo = n` (self-heal).
    3. Otherwise `null`. A project whose repo is set to a different URL never matches by name.
  - `resolveWorkProject` stores `normaliseRepoUrl(patch.repo) ?? patch.repo`. The
    `set_work_project_status` `repo` arg is described as "The git remote URL; stored normalised
    and used to match sessions to this project."
  - `getDashboard(entryLimit = 300)` returns `{ projects, entries, entryTotal, sessions, attachments, groups }`.
  - The MCP `list_work` input gains `repo`, `status` (adds `"open"`), `text`, `waiting_on`,
    `until`, `session_id` and `offset`. `limit` stays 1–100. Use this description:
    > List worklog entries, newest first, one page at a time. Use it to answer what is outstanding
    > (status 'open'), blocked, or waiting on someone, or what was done in a window — and check it
    > before starting work so nothing is redone. Always pass `project` for your own project; omit
    > it only to look across every project on purpose. When there is more than one page, the reply
    > ends with the offset to pass for the next.

- [x] **Step 1: Implement `findWorkProjectByRepo` and the `resolveWorkProject` change.**
- [x] **Step 2: Rewrite `listWorkEntries` to the new signature.** Update its callers: `getDashboard`,
  the `list_work` tool (now `text(formatEntryPage(page))`) and the entries route, which Task 7 owns.
  Type-check guides this.
- [x] **Step 3: Run the checks.** Run `npm run type-check && npm test`. Expected: PASS, except the
  page.tsx import (Task 8) and the entries route (Task 7).

---

### Task 7: Dashboard API — filtered, paged entries

**Files:**
- Modify: `app/api/worklog/entries/route.ts` (GET), `src/types/worklog.ts`, `src/lib/api/worklog.ts`

**Interfaces:**
- Consumes: `parseEntryQuery` (Task 2), `listWorkEntries` (Task 6)
- Produces:
  - `GET /api/worklog/entries?project&group&status&text&waitingOn&since&until&offset&limit`:
    - `401` when not admin
    - `400 { message }` on a parse error
    - otherwise `200 { entries, total, offset }`
  - In `src/types/worklog.ts`:
    - `WorkEntry.waitingOn?: string | null`
    - `DashboardPayload.entryTotal: number`
    - `interface WorkEntryPage { entries: WorkEntry[]; total: number; offset: number }`
    - `type WorkEntryFilterValue = { text: string; waitingOn: string; from: string; to: string }`
    - `ReportDigest.blockers[].waitingOn: string | null`
  - In `src/lib/api/worklog.ts`:
    - `EntryFilter = { project?: string; group?: string; status?: WorkEntryStatus | "open"; text?: string; waitingOn?: string; since?: string; until?: string; offset?: number; limit?: number }`
    - `fetchWorkEntries(filter?: EntryFilter): Promise<WorkEntryPage>`. It has no other callers
      today; checked with grep on 24 Nov.

- [x] **Step 1: Make the GET handler parse with `parseEntryQuery` and delegate.** It must stay under
  about 15 lines.
- [x] **Step 2: Update the client types and `fetchWorkEntries`.**
- [x] **Step 3: Run the checks.** Run `npm run type-check`. Expected: the only error left is the
  page.tsx `aggregateReport` import.

---

### Task 8: Dashboard UI — server-side filters, Load more, server report

**Files:**
- Create: `src/components/worklog/WorkEntryFilters.tsx` (follow the `adding-component` skill)
- Modify:
  - `app/worklog/page.tsx`
  - `src/components/worklog/WorkEntryList.tsx`, `WorkBoard.tsx`, `WorkReportPanel.tsx`
  - `src/config/worklog.ts`

**Interfaces:**
- Consumes:
  - `fetchDashboard` (now with `entryTotal`), `fetchWorkEntries`, `fetchWorkReport`
  - `WorkEntryFilterValue`
- Produces:
  - `WorkEntryFilters: React.FC<{ value: WorkEntryFilterValue; onChange: (next: WorkEntryFilterValue) => void }>`
    renders a search box, a waiting-on box, and from/to date inputs.
  - New `worklogContent` keys:
    - `searchPlaceholder: "Search titles and summaries"`
    - `waitingOnPlaceholder: "Waiting on…"`
    - `fromLabel: "From"`, `toLabel: "To"`
    - `showing: "Showing"`, `of: "of"`, `loadMore: "Load more"`
    - `waitingOnPrefix: "Waiting on"`
    - `moreBlocked: "more blocked"`
  - The header comment of `src/config/worklog.ts` drops "and the public Build Log", which is stale
    (spec §11).

**Required behaviour (the checks for this task):**
- The first load makes exactly two requests: one dashboard request and one report request. No
  entries request.
- Changing project, group, status (list view only), search, waiting-on or a date makes one entries
  request with `offset=0`. Search and waiting-on are debounced by 300 ms.
- A response that arrives after a newer request was sent is discarded (request-sequence ref).
- Under the list or board: "Showing {loaded} of {total}" and a Load more button while
  loaded < total. Load more appends the next 300.
- The ENTRIES header count shows `total`, not the loaded count.
- The report panel uses `fetchWorkReport({ project, since })` whenever the project or window
  changes, and shows "+N more blocked" when `byStatus.blocked > blockers.length`.
- An entry that is not done and has `waitingOn` shows "Waiting on X" under its blocked reason, in
  both list and board. Use the muted text colour, not the blocked colour.

- [x] **Step 1: Add the copy and the `WorkEntryFilters` component.**
- [x] **Step 2: Rework `page.tsx` to the behaviour above.** Remove the `aggregateReport` and
  `parseSince` imports.
- [x] **Step 3: Add the waiting-on line to `WorkEntryList` and `WorkBoard`, and the "+N more
  blocked" line to `WorkReportPanel`.**
- [x] **Step 4: Run the checks.** Run `npm run type-check && npm test`. Expected: PASS with no
  errors left.
- [x] **Step 5: Look at it locally.** *(The owner looked at it locally on 24 Nov: "looks good for now".)* Run `npm run dev`, sign in, open `/worklog`, and check the
  behaviour list above in the browser's network panel. Expected: as listed. This is the only
  local check; data checks happen in Task 10.

---

### Task 9: Second MCP client (claude.ai)

**Files:**
- Modify: `lib/auth.ts`, `app/api/mcp/route.ts`, `app/api/mcp/tools.ts`, `.env.example`
- Test: `lib/auth.test.ts` (create)

**Interfaces:**
- Produces:
  - `type McpClient = "claude-code" | "claude-ai"`, exported from `lib/auth.ts`
  - `mcpClientFor(req: NextRequest | Request): McpClient | null`
    - checks `MCP_TOKEN` first, then `MCP_CLAUDE_AI_TOKEN`
    - an unset or empty variable never matches
    - comparison is constant-time after a length check
  - `isAuthorizedMcp(req)` is `mcpClientFor(req) !== null`, so existing callers are unchanged.
  - `route.ts` `guarded()` sets `req.auth = { token: "", clientId: client, scopes: [] }` before
    `handler(req)`. The token stays out of the context the tools see. `mcp-handler` forwards
    `req.auth` as `authInfo`, which tool callbacks receive as `ctx.http?.authInfo`.
  - `tools.ts` has a private `clientOf(ctx?: { http?: { authInfo?: { clientId?: string } } }): McpClient`.
    `log_work` passes `source: "claude-ai"` for claude.ai and leaves the default `"claude"` otherwise.
  - `.env.example` gets this block, after `MCP_TOKEN=`:
    ```
    # claude.ai custom connector — its own credential, revocable without touching Claude Code's.
    # Paste "Bearer <value>" into the connector's Authorization request header. No default.
    MCP_CLAUDE_AI_TOKEN=
    ```

- [x] **Step 1: Write the failing test**

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { isAuthorizedMcp, mcpClientFor } from "./auth";

const req = (token?: string) =>
  new Request("https://example.test/api/mcp", {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });

afterEach(() => vi.unstubAllEnvs());

describe("mcpClientFor", () => {
  it("names Claude Code for MCP_TOKEN and claude.ai for MCP_CLAUDE_AI_TOKEN", () => {
    vi.stubEnv("MCP_TOKEN", "fixture-code-aaaa");
    vi.stubEnv("MCP_CLAUDE_AI_TOKEN", "fixture-web-bbbbbb");
    expect(mcpClientFor(req("fixture-code-aaaa"))).toBe("claude-code");
    expect(mcpClientFor(req("fixture-web-bbbbbb"))).toBe("claude-ai");
  });
  it("denies a wrong token of either length", () => {
    vi.stubEnv("MCP_TOKEN", "fixture-code-aaaa");
    expect(mcpClientFor(req("fixture-code-aaab"))).toBeNull();
    expect(mcpClientFor(req("short"))).toBeNull();
  });
  it("denies everything when both are unset", () => {
    vi.stubEnv("MCP_TOKEN", "");
    vi.stubEnv("MCP_CLAUDE_AI_TOKEN", "");
    expect(mcpClientFor(req("anything"))).toBeNull();
    expect(mcpClientFor(req())).toBeNull();
  });
  it("keeps isAuthorizedMcp true for either client", () => {
    vi.stubEnv("MCP_TOKEN", "fixture-code-aaaa");
    vi.stubEnv("MCP_CLAUDE_AI_TOKEN", "fixture-web-bbbbbb");
    expect(isAuthorizedMcp(req("fixture-web-bbbbbb"))).toBe(true);
  });
});
```

- [x] **Step 2: Run it to make sure it fails.** Run `npx vitest run lib/auth.test.ts`. Expected:
  FAIL, `mcpClientFor` is not exported. (`next/server` loads under plain node; checked 24 Nov.)
- [x] **Step 3: Implement `mcpClientFor` and wire the route, `clientOf` and `.env.example`.**
- [x] **Step 4: Run the checks.** Run `npx vitest run lib/auth.test.ts && npm run type-check && npm test`.
  Expected: PASS.

---

### Task 10: Session-start hook — the worktree fix and the project wall

**Files:**
- Create:
  - `scripts/worklog-hooks/worklog-hook-lib.mjs`
  - `scripts/worklog-hooks/worklog-hook-lib.test.mjs`
  - `scripts/worklog-hooks/worklog-context.mjs`
  - `scripts/worklog-hooks/install.mjs`
- Modify:
  - `package.json`: add `"test:hooks": "node --test scripts/worklog-hooks/worklog-hook-lib.test.mjs"`
  - `CLAUDE.md` Domain Manifest, worklog paths: add `"scripts/worklog-hooks/**"` and the missing
    `"lib/models/WorkAttachment.ts"`
- Reference (read, don't copy blindly): `~/.claude/hooks/worklog-context.mjs`, the current hook. Its
  `readServerConfig` and `callTool` move into the lib with two changes:
  - `callTool` returns `null` when the JSON-RPC result has `isError: true` or carries an `error`.
  - `readServerConfig` uses `process.env.WORKLOG_HOOK_URL_OVERRIDE`, when set, in place of the
    configured URL only. The token is still read from config. This exists for the unreachable
    hand check.

**Interfaces:**
- Produces, in `worklog-hook-lib.mjs`:
  - `TIMEOUT_MS = 4000`, `MAX_BRIEFING_LINES = 40`
  - `readServerConfig(home?: string): { url, auth } | null`
  - `callTool(cfg, name, args): Promise<string | null>`
  - `normaliseRepoUrl(url): string | null`, with the same rules and cases as Task 1. It is
    duplicated on purpose, because the hook cannot import TS. Each copy points at the other in a
    one-line comment.
  - `mainCheckoutName(gitCommonDir: string | null): string | null`. When the basename is `.git`,
    returns the parent's basename. Otherwise returns the basename without `.git`.
  - `projectLookup({ remoteUrl, commonDir }): { repo: string } | { project: string } | null`.
    It prefers the normalised remote, then the main checkout name.
  - `capLines(text: string, max: number): string`. Over `max`, it keeps `max - 1` lines and adds
    `…and N more lines`.
  - `parseHookInput(raw: string): { sessionId?: string; cwd?: string }`. Never throws.
- `worklog-context.mjs` (SessionStart):
  1. Read stdin with a 1 s cap.
  2. `cwd = input.cwd ?? process.cwd()`.
  3. Run `git remote get-url origin` and `git rev-parse --path-format=absolute --git-common-dir`
     via `execFileSync`, each with `{ cwd, timeout: 2000, stdio: ["ignore", "pipe", "ignore"] }`.
     A failure counts as null.
  4. Call `projectLookup`. If it returns null, exit silently.
  5. Call `list_work` with `{ ...lookup, status: "open", limit: 12 }`. The reply is then handled
     as follows:
     - `null` → print the unreachable line.
     - Starts `No worklog project matches` → print it as is.
     - `No entries.` → silent.
     - Otherwise print `Open worklog items for this project:`, then the reply, then the two
       guidance lines from today's hook, all through `capLines(…, MAX_BRIEFING_LINES)`.
  6. Output goes in `hookSpecificOutput.additionalContext`, as today.
  7. There is no "Blocked in other projects" block. The remote URL and the token are never printed.
- `install.mjs` copies `worklog-context.mjs` and `worklog-hook-lib.mjs` into `~/.claude/hooks/`.
  Before overwriting a file that differs, it keeps it as `<name>.bak-YYYYMMDD`. It prints only the
  file names. It never touches any settings file. The existing SessionStart registration already
  points at `worklog-context.mjs`.

- [x] **Step 1: Write the failing test** (`node:test` + `node:assert/strict`, mirroring `secret-guard.test.mjs`)

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { normaliseRepoUrl, mainCheckoutName, projectLookup, capLines, parseHookInput }
  from "./worklog-hook-lib.mjs";

test("normaliseRepoUrl strips credentials and matches the server's rules", () => {
  const out = normaliseRepoUrl("https://someone:not-a-real-secret@github.com/Owner/Repo.git");
  assert.equal(out, "github.com/owner/repo");
  assert.ok(!out.includes("not-a-real-secret"));
  assert.equal(normaliseRepoUrl("git@github.com:Owner/ToolsAustralia.git"), "github.com/owner/toolsaustralia");
  assert.equal(normaliseRepoUrl("C:/Codes/ToolsAustralia"), null);
});

test("mainCheckoutName finds the main checkout from a worktree's common dir", () => {
  assert.equal(mainCheckoutName("C:/Codes/ToolsAustralia/.git"), "ToolsAustralia");
  assert.equal(mainCheckoutName("/srv/repos/app.git"), "app");
  assert.equal(mainCheckoutName(null), null);
});

test("projectLookup prefers the remote, then the main checkout name, else null", () => {
  assert.deepEqual(projectLookup({ remoteUrl: "git@github.com:o/ToolsAustralia.git", commonDir: "C:/Codes/ToolsAustralia/.git" }),
    { repo: "github.com/o/toolsaustralia" });
  assert.deepEqual(projectLookup({ remoteUrl: null, commonDir: "C:/Codes/ToolsAustralia/.git" }),
    { project: "ToolsAustralia" });
  assert.equal(projectLookup({ remoteUrl: null, commonDir: null }), null);
});

test("capLines keeps the budget and says what it cut", () => {
  const text = Array.from({ length: 45 }, (_, i) => `line ${i + 1}`).join("\n");
  const out = capLines(text, 40).split("\n");
  assert.equal(out.length, 40);
  assert.equal(out[39], "…and 6 more lines");
});

test("parseHookInput never throws", () => {
  assert.deepEqual(parseHookInput("not json"), {});
  assert.deepEqual(parseHookInput('{"session_id":"abc","cwd":"C:/x"}'), { sessionId: "abc", cwd: "C:/x" });
});
```

- [x] **Step 2: Run it to make sure it fails.** Run `npm run test:hooks`. Expected: FAIL, the
  module is not found.
- [x] **Step 3: Implement the lib, `worklog-context.mjs` and `install.mjs`. Edit the manifest and
  `package.json`.**
- [x] **Step 4: Run the checks.** Run `npm run test:hooks && npm run type-check && npm test`.
  Expected: PASS.
- [x] **Step 5: Dry-run the new hook outside a repo, without installing.** Run
  `echo '{"cwd":"C:/Users/Public"}' | node scripts/worklog-hooks/worklog-context.mjs; echo "exit $?"`.
  Expected: no output, then `exit 0`. The worktree dry run needs the deployed server, because the
  live one rejects `status: "open"`, so it happens in Task 11.

---

### Task 11: Docs, deploy and hand checks

**Files:**
- Modify (via `/doc-domain worklog`, `/doc-domain auth`, `/doc-domain infrastructure`):
  - `docs/worklog/api.md`: `list_work` args and the entries route shape
  - `docs/worklog/models.md`: `waitingOn`, normalised `repo`
  - `docs/worklog/gotchas.md`:
    - hook project resolution
    - the 200-attachment dashboard gap
    - repo self-heal only when unset
    - bare `until` dates are inclusive, in UTC
  - `docs/worklog/testing.md`: the new tests and `test:hooks`
  - `docs/worklog/frontend.md`: filters and Load more
  - `docs/auth/*`: `MCP_CLAUDE_AI_TOKEN`, `mcpClientFor`
  - `docs/infrastructure/README.md`: env table row

- [x] **Step 1: Run the three `/doc-domain` refreshes.** Each must bump `lastVerified` to 2026-11-24.
- [ ] **Step 2: Stop and hand over to the owner.** The owner:
  1. Generates a value with the command in `.env.example` in their own terminal.
  2. Sets `MCP_CLAUDE_AI_TOKEN` in `.env.local` and on Vercel.
  3. Commits and deploys.
- [ ] **Step 3: Ask the owner's yes, then install the hook.** Run `node scripts/worklog-hooks/install.mjs`.
  Expected: two file names printed, and a `.bak-20261124` copy of the old hook.
- [ ] **Step 4: Hand checks against production.**

  Write only under project `worklog-selftest`. Delete its entries from the dashboard at the end.

  1. `log_work` with project `worklog-selftest`, status `todo`, `waiting_on: "Derem"`. Then
     `list_work` with `project: "worklog-selftest"` and `waiting_on: "derem"`. Expected: the entry,
     with a `↳ waiting on Derem` line.
  2. `update_work_status` to `done` on that ref. Then `list_work` with `waiting_on: "derem"`.
     Expected: `No entries.`
  3. `list_work` with `project: "tools-australia"`, `status: "open"`, `limit: 25`. Expected: the
     `Tools Australia · N matching` header and a footer. N equals the open count shown by
     `list_work_projects`.
  4. `work_report` with `project: "tools-australia"`. Expected: the total equals the
     `list_work_projects` "logged" count, with no 500 cap.
  5. `list_work` with `project: "tools-oz"`. Expected: `No worklog project matches "tools-oz".`
  6. **claude.ai.** The owner adds the connector: Plugins → Add → Add custom connector → URL
     `https://<site>/api/mcp` → No sign-in → Request headers → `Authorization: Bearer <value>`.
     Then they ask it to log one `worklog-selftest` entry. Expected: the tools are listed, and the
     dashboard shows that entry with source `claude-ai`.
  7. **Hook dry run in a worktree, before installing.** Run
     `echo '{"cwd":"C:/Codes/ToolsAustralia/.worktrees/2027-tradieiq"}' | node scripts/worklog-hooks/worklog-context.mjs`.
     Expected: Tools Australia items only, no URL, at most 40 lines.
  8. **Hook in a worktree, after install.** Open a new Claude Code session in
     `C:\Codes\ToolsAustralia\.worktrees\2027-tradieiq`. Expected: "Open worklog items for this
     project:" with Tools Australia items only, at most 40 lines. The repo is then stored on
     `tools-australia` by self-heal; check with `list_work_projects` or the dashboard card.
  9. **Hook outside a repo.** Open a session in a plain folder. Expected: no worklog text at all.
  10. **Hook while the worklog is unreachable.** Point the URL at a dead host via a temporary
     `WORKLOG_HOOK_URL_OVERRIDE` env var, which only the hook reads. Run the dry-run command from
     Task 10. Expected: exactly `Worklog unreachable: no cross-session check this time.` within
     about 4 s, exit 0.
  11. **Dashboard.** Type quickly in search ("up", "ups", "upsell"). Expected: the final list
      matches "upsell". Load more appears while loaded < total.
- [ ] **Step 5: Tell the owner about this repo.** The new strict matching links this checkout
  (`my-portfolio-client`) to the empty `my-portfolio-client` project, not to `my-portfolio`, which
  holds its 19 entries. The old hook's substring match blurred the two. The owner decides which
  project this repo logs to and sets that project's `repo` with `set_work_project_status`.
