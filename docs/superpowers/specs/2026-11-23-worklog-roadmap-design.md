# Worklog roadmap and session awareness — design

**Date:** 2026-11-23
**Status:** approved 2026-11-24 (context-budget rules in §9 added on approval)
**Domain:** worklog (see `docs/worklog/`)

---

## In plain English

**What this is.** The worklog becomes the one place where the plan, the progress against
it, and what every Claude session is doing right now all live together. Today the plan is a
claude.ai page whose ticks nobody updates, the progress is scattered across worklog entries
and per-worktree notes files, and the parallel sessions cannot see each other.

**Who is involved.**
- **You** plan in claude.ai and watch everything on the `/worklog` dashboard.
- **The claude.ai roadmap chat** owns the plan: it puts the roadmap into the worklog once,
  then moves dates and adds features through the same tools, and can answer "how are we
  doing?" from live data.
- **The Claude Code tracks** (four sessions, one per worktree) move features through their
  stages as they work, see what the other tracks are doing, hear about every rule another
  session changed, and get warned when another worktree is changing the same file.
- **Two small scripts on your machine** (hooks) report each session's branch and changed
  files automatically and hand every session a briefing when it starts. They need nothing
  from you after install.
- **The worklog server** (this repo, on Vercel) stores it all and works out what is late,
  what is blocked, and who overlaps with whom.

**One day, walked through (Tools Australia, Mon 24 Nov 2026).**
1. In the morning you open Track 3 in the `2027-tradieiq` worktree. Before you type
   anything, the session already knows: Track 2 is on FT-7 in `2027-credit-shop` (last active
   6 minutes ago), Track 4 is on FT-34 and has uncommitted changes in
   `src/lib/tradieiq/trades.ts`, and there is one decision Track 3 posted yesterday that
   Tracks 1, 2 and 4 have not acknowledged yet.
2. Track 3 checks in on FT-11. The briefing adds: FT-11 is at stage 3 of 6 (Build), due
   2 Dec; FT-12 comes after it; nobody else is on FT-11.
3. Track 4, an hour later, edits `trades.ts` too. Right after that edit Track 4 is told
   "Track 3 (2027-tradieiq, branch feature/ft-11-1-records) also has changes in this file."
   It stops and asks you before going further.
4. When Track 2 next starts a task, it is shown "Decision #3 from Track 3: a failed payment
   makes TradieIQ read-only at once." It applies it and acknowledges. The dashboard now shows
   Tracks 2 and 3 have it; 1 and 4 still don't.
5. Track 3 opens FT-11's pull request and moves FT-11 to Review (4 of 6). The roadmap
   updates. Nobody ticks anything by hand.
6. In the evening you ask the claude.ai roadmap chat "how are we doing against 17 Dec?" It
   reads the roadmap from the worklog and answers: per feature, which stage it is at, what is
   late, what is blocked and on whom, and how far each due date has slipped since the plan
   was put into the worklog. If you want the roadmap page refreshed, it republishes it from
   that data.
7. If the chat moves FT-17 from 16 Dec to 7 Jan, it must give a reason, and that move is
   announced to every track as a decision automatically. No date moves quietly.

**The rules in ordinary words.**
- The worklog is the master copy of the plan. The claude.ai page is a picture of it.
- A feature on the roadmap is a worklog group with a plan attached. Work logged under the
  group `FT-11` belongs to feature FT-11 — that is the whole link.
- Tracks move stages forward freely. Moving a due date, parking or dropping a feature needs
  a reason and is announced to everyone.
- A feature is **late** when its due date has passed and it is not finished. It is **at
  risk** when one of its stage dates has passed and it has not reached that stage.
- A session is **live** if it did anything in the last 30 minutes, **idle** up to 12 hours,
  and **gone** after that.
- A decision stays in front of a track until that track acknowledges it.
- A session only ever hears about **its own project**. Within that project it gets its own
  track in detail and each other track as one line. Anything more, it has to ask for. News
  (a decision, an overlap) is told once, briefly, and never repeated.
- Two worktrees "overlap" on a file when both have changed it and their versions differ.
  Identical copies of the same file (the shared handoff docs, for example) do not warn.
- Nothing is deleted over MCP — not entries, not features, not decisions. Deleting stays a
  dashboard action for you, including wiping a whole roadmap to redo a bad import.
- "Slip" is measured from the dates the plan had when it was put into the worklog, unless
  the import gives older original dates on purpose.

**What you see when it goes wrong.**
- If the worklog is down when a session starts, the session gets one line — "Worklog
  unreachable: no cross-session check this time" — and carries on. It is never blocked or
  slowed by more than a few seconds.
- If a list is longer than one page, it says so ("showing 25 of 96 — ask for the next page").
  Nothing is cut off silently.
- If a track forgets to check in, the hooks still report its branch, files and activity, so
  it still shows up — just without saying which feature it is on.

**What is deliberately not covered.**
- Live pushes into a running session. A session hears news at its next prompt, edit or
  check-in, not the instant it happens.
- Pull request and CI status from GitHub. Tracks still say when a PR is opened or merged.
- The roadmap's 168 rules, 60 tasks, 45 checks and 46 open questions. They stay in the
  handoff files; only features and key dates are imported.
- Other machines. The hooks are installed on this one; another machine needs the same
  install.
- Sign-in (OAuth) for claude.ai. Not needed: your account's connector dialog offers request
  headers, verified 23 Nov.
- Automatically editing the claude.ai roadmap page. The chat republishes it when asked.

---

## 1. Why

The worklog records work but cannot hold a plan, and the sessions writing to it cannot see
each other. Evidence from the live data and the Tools Australia 2027 setup, read 23 Nov:

- **The plan is disconnected from progress.** The roadmap page (claude.ai artifact
  `1pe1nyfaMbGgsVwCHxYQws`) records each feature's stage by hand-ticked boxes. Its own export
  (`docs/2027/handoffs/cc-roadmap-rules-1.md` §4) says nothing has been ticked since 13 Nov —
  every feature "stage 0 of 6" — while FT-00b PR 1 is open and FT-11 is in build. The tracks
  are told never to click the ticks.
- **Shared docs drift between worktrees.** Each of the four worktrees has its own copy of
  `docs/2027/HANDOFF.md`. Track 3's notes (`tracks/track-3.md`, Decided §) record changing the
  failed-payment rule in its copy and that "the other tracks' worktrees and the claude.ai
  project still hold the old line".
- **Cross-track contracts are negotiated by reading each other's folders.** Track 3 read
  Track 4's spec in `.worktrees/2027-level5` to learn what Track 4 expects of FT-11.
- **The cross-track summary is a hand-pasted prompt** (`SESSION-PROMPTS.md`, Part C, "One
  summary across all tracks").
- **Sessions all look alive.** All ten recent sessions show `active`; nothing calls
  `end_session`, so the status carries no information.
- **Data is cut off silently.** The dashboard loads the newest 300 entries
  (`lib/worklog/dashboard.ts`); there are 372, so 72 are missing from its list, board and
  report panel. `list_work` returns at most 100, one status at a time. Tools Australia alone
  has 96 open entries.
- **The session-start hook misses worktrees.** `~/.claude/hooks/worklog-context.mjs` matches
  the project by the folder name, so in `.worktrees/2027-tradieiq` it finds nothing for Tools
  Australia. It also reads only the newest 100 entries.
- **Blocked reasons are prose only.** "Waiting on Derem's OK", "waits on PR #1018" — nothing
  answers "what is waiting on whom" without reading every sentence.

## 2. Goals, non-goals, anti-goals

**Goals**
1. The plan lives in the worklog, and progress against it is answerable in one call.
2. claude.ai can read and change the plan through the same MCP server.
3. Every session knows, before it starts a task, who else is working on what, which shared
   decisions it has not applied, and which files another worktree is changing.
4. Filters across project, track, feature, stage, status, waiting-on, text and dates — in
   the tools and the dashboard — and nothing truncated without saying so.

**Non-goals** — see "What is deliberately not covered" above.

**Anti-goals** (failure even if it technically works)
- A session start or an edit that is noticeably slowed, or blocked, by the worklog.
- Noise: briefings and warnings so frequent or long that sessions learn to ignore them.
- Context spill: a session reading another project's work, or a whole project's backlog,
  when it needs its own track. (Today's hook already prints up to five blocked items from
  other projects into every session start; this design removes that.)
- A second master copy of the plan.
- Any secret value, or a fingerprint of one, leaving the machine.
- Dates that move without anyone being told.

## 3. Constraints

- Repo rules (`CLAUDE.md`): Mongoose via `dbConnect()`; `models.X || model(...)`; thin route
  handlers; Zod for new inputs; pure/query split in `lib/worklog/` so logic is testable
  without a database (`docs/worklog/architecture.md`).
- Vitest only runs `lib/**/*.test.ts` in a `node` environment.
- MCP tools never delete (existing rule, `lib/worklog/entries.ts` `deleteWorkEntries`).
- MCP auth fails closed; constant-time compare (`lib/auth.ts` `isAuthorizedMcp`).
- Hooks: never block, hard timeout, always exit 0; read the token from the MCP config
  `claude mcp add` already wrote (`~/.claude.json`), never a second copy (existing hook's
  design rules). Never read or fingerprint secret files (global secrets rule).
- `mcp-handler` 2.1.1 (stateless Streamable HTTP), `@modelcontextprotocol/server` ^2.
- claude.ai connects from Anthropic's servers with a static `Authorization` header in the
  "Request headers" section under "No sign-in" — confirmed present in this account's
  "Add custom connector" dialog on 23 Nov (read, not yet connected).

## 4. Approaches

### Where the plan's master copy lives — **chosen: A**

| | Approach | Trade-off |
|---|---|---|
| **A** | **The worklog is the master.** Features imported once; tracks move stages; claude.ai changes the plan through tools; the roadmap page becomes a picture of the worklog. | One truth, no ticks to forget. Costs a one-off import and claude.ai write access. |
| B | The artifact stays the master; the worklog records progress tagged with FT numbers; claude.ai re-publishes the page on request. | Smaller build, but two truths again — the page is only as fresh as the last refresh, the same drift as the handoff copies. |

Picked by the owner on 23 Nov.

### What sessions see of each other — **chosen: all three**

1. Who's on what (track, feature, branch, liveness).
2. Changed decisions, delivered until acknowledged.
3. Files being changed, with a warning on overlap.

The owner chose to include 3 now (23 Nov).

### How claude.ai authenticates — **chosen: request header**

| | Approach | Trade-off |
|---|---|---|
| **Header** | "No sign-in" + `Authorization: Bearer <token>` in Request headers. | Small server change (a second token). Verified available on this account. |
| OAuth | Implement an OAuth 2.1 authorization server. | Large, security-sensitive, and known to be flaky with claude.ai (claude-ai-mcp issues). Unneeded. |

### How a feature links to its work — **chosen: the group label** *(my call)*

A roadmap item is identified by a group label (`FT-11`), and entries join it through the
existing `group` / `groupKey` they already carry. The alternative — a new `item` field on
entries — would give one concept two names (the skill already tells sessions to log
`group: "FT-11"`-style labels) and would not reach entries logged before this ships. Old
entries are joined later with the existing `set_work_group`.

## 5. Vocabulary — newly coined names

No existing worklog name covers these; the terms below are coined once and used
everywhere. `plan` is avoided on purpose: in Tools Australia it already means membership
plans (`src/config/plans.ts`, "the plans config"), and sessions hold both in context.

| Term | Meaning |
|---|---|
| **roadmap** (`WorkRoadmap`) | A plan for one project: its stages, tracks and milestones. A project may have several (Tools Australia: "2027 model"). |
| **roadmap item** (`WorkRoadmapItem`) | One feature or ticket on a roadmap, identified by its group label (`FT-11`). |
| **stage** | One step in a roadmap's ordered stage list. Tools Australia: Talk, Spec, Build, Test, Review, Ready. Progress is `stagesDone` — the roadmap's own "stage N of 6". |
| **track** | A lane of work, usually one Claude Code session in one worktree ("Track 3"). Listed on the roadmap; carried by items and sessions. |
| **phase** | Optional grouping label on an item (Tools Australia: "Level 3"). Generic because other projects won't have levels. |
| **milestone** | A fixed date on a roadmap ("Feature freeze", 18 Dec). |
| **decision** (`WorkDecision`) | A change to a shared rule or contract that every other session must hear. |
| **check-in** | A session telling the worklog which track and item it is on, and getting the briefing back. |
| **briefing** | The text a session gets at start and on check-in. |
| **overlap** | Another worktree has changed the same file, and its version differs. |
| **liveness** | live / idle / gone, derived from last activity. |
| `waiting_on` / `waitingOn` | Short label for who or what a blocked entry waits on ("Derem", "PR #1026", "FT-11"). |

Existing names are reused exactly: `group`, `groupKey`, `matchKey`, `ref`, `status`,
`source`, `session_id`, `lastActivityAt`.

## 6. Data model

All new schemas: `{ timestamps: true }`, HMR-safe pattern. Enum values live in
`lib/worklog/types.ts` (single source, mongoose-free).

### `WorkRoadmap` — `lib/models/WorkRoadmap.ts` (new)

| Field | Type | Notes |
|---|---|---|
| `project` | ObjectId → WorkProject | required |
| `name` | String | required. Display, "2027 model" |
| `matchKey` | String | required. `projectMatchKey(name)`-style identity; unique with `project` |
| `stages` | [String] | ordered, ≥ 1. Default `["Spec", "Build", "Review", "Done"]` *(my call)* |
| `tracks` | [{ `name`, `note?`, `worktree?` }] | `worktree` is a folder name (`2027-tradieiq`); lets the server infer a session's track |
| `milestones` | [{ `name`, `date` }] | |
| `status` | enum `active \| done \| archived` | default `active` |

Index: `{ project: 1, matchKey: 1 }` unique.

### `WorkRoadmapItem` — `lib/models/WorkRoadmapItem.ts` (new)

| Field | Type | Notes |
|---|---|---|
| `roadmap` | ObjectId → WorkRoadmap | required |
| `project` | ObjectId → WorkProject | required, denormalised for the join |
| `group` | String | required. Display label, `FT-11` |
| `groupKey` | String | required. `groupKey(group)` — the same function entries use |
| `title` | String | required |
| `phase`, `track`, `notes` | String | optional |
| `size` | Number | optional, session-days |
| `after` | [String] | group labels this item comes after |
| `stagesDone` | Number | 0 … `stages.length`; finished when equal |
| `stageDates` | [{ `stage`, `due` }] | optional per-stage targets |
| `due` | Date | when it must be finished |
| `baselineDue` | Date | the first `due` ever set, or an explicit `baseline_due` passed to `set_roadmap` while it is still unset; never changed afterwards — slip is `due − baselineDue` *(my call: the baseline is the plan as imported — the 13 Nov page dates put Levels 4–5 in January, which the 20 Nov direction overruled, so slip against them would mostly show features pulled earlier)* |
| `status` | enum `active \| parked \| dropped` | default `active` |
| `order` | Number | display order |
| `history` | [{ `at`, `client`, `sessionId?`, `track?`, `field`, `from`, `to`, `reason?` }] | every stage, date, track and status change |

Indexes: `{ project: 1, groupKey: 1 }` **unique** (a label means one item per project, so the
entry join is unambiguous); `{ roadmap: 1, order: 1 }`. Two labels that normalise to the same
key (`FT-11.1` and `FT-1.11`) cannot coexist: `set_roadmap` refuses the second item and names
the clash, rather than failing the whole call.

### `WorkDecision` — `lib/models/WorkDecision.ts` (new)

| Field | Type | Notes |
|---|---|---|
| `ref` | Number | required, unique, `nextSeq("workDecision")` |
| `project` | ObjectId → WorkProject | required |
| `roadmap` | ObjectId → WorkRoadmap | optional |
| `title`, `detail` | String | `title` required |
| `affects` | { `groups: [String]`, `tracks: [String]`, `files: [String]` } | all optional; empty `tracks` means everyone |
| `postedBy` | { `client`, `sessionId?`, `track?` } | |
| `acks` | [{ `track?`, `sessionId?`, `at` }] | |
| `status` | enum `active \| superseded \| withdrawn` | default `active` |
| `supersededBy` | Number | ref |

Index: `{ project: 1, createdAt: -1 }`.

### `WorkSession` — changed

New fields: `track`, `focus` (group label), `focusNote`, `repo` (normalised remote,
`github.com/toolsaustralia/toolsaustralia`), `machine`, `worktree` (absolute path),
`branch`, `changedFiles: [{ path, hash? }]`, `filesReportedAt`, `noticedDecisionsAt`
(the last time new decisions were delivered to this session, so each is delivered once).
`status`/`endedAt` stay; **liveness is derived**, not stored.

### `WorkEntry` — changed

New optional `waitingOn` (String) and `track` (String). `track` is **stamped when the entry is
logged** — the matching roadmap item's track if there is one, else the session's track — and
not rewritten later, so history does not move when a session changes track *(my call)*.
`source` gains a value: existing `"claude"` keeps meaning Claude Code; **`"claude-ai"`** is
new. Not enum-validated today (gotchas.md) — leave it so.

### `WorkProject` — changed

`repo` is stored **normalised** (`host/owner/name`, lowercase, no protocol, credentials or
`.git`) by one `normaliseRepoUrl` used by the server, `set_work_project_status` and the hooks.
When a hook's project is found only through the folder-name fallback and that project has no
`repo`, the server records the remote on it, so the next lookup matches directly.

## 7. Pure rules — `lib/worklog/` (no mongoose, unit-tested)

| Function (new file) | Rule |
|---|---|
| `roadmapItemState(item, stages, now)` (`roadmapStatus.ts`) | `stageName`, `finished`, `late` (due passed, not finished, status active), `atRisk` (a `stageDates` entry passed and `stagesDone` has not reached it), `slipDays` (`due − baselineDue`), `waitsFor` (unfinished `after` items) |
| `summariseRoadmap(items, stages, milestones, now)` | counts per stage; late / at-risk / blocked counts; for the next milestone, how many items due by it are finished vs not |
| `diffRoadmapItems(before, after)` (`roadmapDiff.ts`) | field-level changes; date moves; `baselineDue` set only when previously unset |
| `sessionLiveness(lastActivityAt, endedAt, now)` (`liveness.ts`) | live < 30 min, idle < 12 h, else gone; `endedAt` ⇒ gone |
| `pendingDecisions(decisions, { track, sessionId, now })` (`decisions.ts`) | active, not posted by this track, not acked by this track, `affects.tracks` empty or includes it; a session with no track sees active ones from the last 7 days not posted by itself |
| `newDecisionsSince(decisions, since)` | for once-only delivery through the hooks |
| `findFileOverlaps(mine, others, now)` (`overlaps.ts`) | latest report per (machine, worktree); same `repo`; different worktree; reported within 14 days; same path and (hashes differ or either missing) |
| `entryQueryFrom(filter)` (`filters.ts`) | builds the Mongo filter for `list_work` and the dashboard, so both filter identically |
| `formatPageFooter(shown, total, offset)` (`format.ts`) | "Showing 25 of 96 — pass offset 25 for more" |

## 8. MCP tools

Descriptions say **when** to call (existing convention, `app/api/mcp/tools.ts`). All logic in
`lib/worklog/`.

### New

| Tool | Arguments | Returns / effect |
|---|---|---|
| `check_in` | `session_id`, `project`, `track?`, `focus?` (group label), `note?` | Updates the session (track inferred from roadmap `tracks[].worktree` when omitted and the hook reported a worktree). Returns the **briefing**: this session's id and track; the focus item's stage, due, flags, unfinished `after` items, blocked entries, entries logged on it by other sessions in the last 7 days; other sessions on the project, one line each, with liveness, track, focus, branch; this worktree's file overlaps; pending decisions, title only; this track's open entries (top 8) and a single count for the rest of the project. Within the §9 context budget. |
| `report_files` | `session_id`, `repo`, `machine`, `worktree`, `branch`, `files: [{path, hash?}]`, `project?` | Called by the hooks. Stores the report, bumps activity. Returns new overlaps and decisions not yet delivered to this session (then marks them delivered). |
| `get_roadmap` | `project`, `roadmap?`, `track?`, `phase?`, `stage?`, `only?` (`late`, `at_risk`, `blocked`, `open`, `finished`), `milestone?` | Summary header + one line per item: label, title, track, stage (n of N), due, slip, flags, who is on it now. |
| `set_roadmap` | `project`, `roadmap`, `stages?`, `tracks?`, `milestones?`, `items?: [...]`, `reason?` | Creates or updates a roadmap and upserts items by label. Never deletes — an item missing from the list is left alone; `status: dropped` drops it. Returns counts and every date move. If an existing item's `due` or `status` changes, `reason` is required and **one** decision summarising all such changes is posted. |
| `update_roadmap_item` | `project`, `group`, `stage?` (name) or `stages_done?`, `due?`, `track?`, `status?`, `note?`, `reason?`, `session_id?` | One item. Stage moves are recorded in `history`; `due` / `status` changes need `reason` and post a decision. |
| `post_decision` | `project`, `title`, `detail?`, `affects_groups?`, `affects_tracks?`, `affects_files?`, `supersedes?`, `session_id?` | Returns the ref. The poster's track is auto-acknowledged. `supersedes` marks the old one superseded. |
| `list_decisions` | `project`, `pending_for_track?`, `since?`, `include_superseded?` | Each with who has acknowledged and which roadmap tracks have not. |
| `acknowledge_decision` | `refs`, `session_id?`, `track?` | Records the ack for the session's track (or the given one). |

### Changed

| Tool | Change |
|---|---|
| `log_work` | `waiting_on?`. When `group` matches a roadmap item, the reply adds `→ FT-11 · Build (3 of 6)` so the link is visible. `source` is `claude-ai` when the claude.ai token called. |
| `update_work_status` | `waiting_on?` |
| `list_work` | `status` also accepts `open` (todo + in_progress + blocked); new `track`, `text` (title/summary, case-insensitive), `waiting_on`, `until`, `session_id`, `offset`. Always ends with the page footer when more exist. `track` matches the entry's stamped `track`, or entries in a roadmap item currently on that track (which covers entries logged before this ships). |
| `work_report` | Counts every entry in the window via aggregation — no 500-entry cap. If anything must be sampled, the text says so. |
| `session_status` | Shows liveness, track, focus, branch, worktree, file count; default lists live and idle first. |
| `list_groups` | Marks groups that are roadmap items, with their stage. |

## 9. Hooks on the machine

Source versioned in this repo under `scripts/worklog-hooks/`; **copied** (not linked) to
`~/.claude/hooks/` by a small install script, so editing the repo — or a worktree of it —
never changes the live hooks until the install is re-run. `worklog-context.mjs` is upgraded
**in place** under the same name, so its existing SessionStart registration keeps working and
nothing runs twice. The two new hooks need one registration each in user settings; the
builder adds them through the settings tooling **after the owner says yes at that step**
(it is a change to global config), and does not read or print anything else in that file.
Shared rules: 4-second timeout per call, everything in try/catch, exit 0, token read by the
script itself from `~/.claude.json` `mcpServers.worklog.headers` exactly as today, never
printed. The hooks talk to the same URL that MCP config points at — production.

Project resolution, in order: the normalised `origin` remote against `WorkProject.repo`; the
remote's repo name by `matchKey` (`ToolsAustralia` → `tools-australia`); the main checkout's
folder name by `matchKey`. If none match, the briefing is one line: "No worklog project
matches this repo — set it with `set_work_project_status` (repo)."

| Script | Event | Does |
|---|---|---|
| `worklog-context.mjs` (upgraded) | SessionStart | Resolves the project from `git remote get-url origin` (server matches `WorkProject.repo`, then the repo name's `matchKey`), falling back to the **main** checkout's folder name — not the cwd basename. Calls `report_files` then `check_in` with the session id from the hook's stdin. Prints the briefing, including "Your worklog session id is …; pass it as `session_id`." On failure prints one line: "Worklog unreachable: no cross-session check this time." Silent in a folder that is not a git repo and matches no project. |
| `worklog-files.mjs` (new) | PostToolUse on `Edit\|Write\|MultiEdit\|NotebookEdit` | Collects changed files: `git diff --name-only <merge-base with origin's default branch>` plus untracked, non-ignored files. Hashes each with `git hash-object`, **except paths matching the secret-file patterns** (same list as `secret-guard.mjs`): those are sent with no hash. Sends `report_files` only when the set or a hash changed since the last send for this session, at most once per 20 s (state in the OS temp dir). Prints overlaps and new decisions as additional context **only when something new appears**. |
| `worklog-prompt.mjs` (new) | UserPromptSubmit | Delivers decisions posted since this session last heard, once each. Silent otherwise. *(my call — the edit hook alone misses sessions that are planning, not editing)* |

A warning **before** an edit (PreToolUse) is preferred if the hook API can pass context to
the model without blocking; otherwise the warning comes right after the first edit. The
builder confirms which, and records it in `docs/worklog/gotchas.md`.

### Context budget — what a session is allowed to read *(added on approval, 2026-11-24)*

The hooks run no model and cost no tokens on their own; the only context cost is the text
they print and the tool results a session asks for. These rules bound both.

1. **Project wall.** The hooks resolve one project and send it with every call; the server
   filters before answering, so other projects' entries never reach the machine, let alone the
   context. The upgraded session-start hook drops today's "Blocked in other projects" block.
2. **Session-scoped defaults.** When a tool gets `session_id` and no `project`, it uses the
   project that session checked in with, not every project (`list_work`, `list_decisions`,
   `get_roadmap`, `session_status`). With neither, behaviour is as today, so you and claude.ai
   can still ask across projects on purpose.
3. **Track first.** The briefing gives this track in detail; other tracks one line each;
   other tracks' open entries as one count ("+31 open on other tracks"). The skill tells
   Claude Code sessions to pass `track` to `get_roadmap` and `list_work` unless they need the
   whole project.
4. **Hard caps.** Session-start briefing at most 40 lines. A prompt-hook or edit-hook message
   at most 10 lines. A decision is delivered as ref + title + one line; the detail is one
   `list_decisions` call away. An overlap is delivered as path + track + branch. Anything cut
   for length ends with how many more and which call shows them.
5. **Once only.** Each decision and each overlap is printed to a session once. Nothing is
   printed when there is nothing new, which is the normal case.
6. **Call rate.** The prompt hook checks at most once per 2 minutes per session, sharing its
   throttle with the edit hook's sends, so most prompts make no network call.

## 10. Auth and clients

- `MCP_CLAUDE_AI_TOKEN` (new env var) is accepted beside `MCP_TOKEN`. Each fails closed when
  unset; each is compared in constant time. A new `mcpClientFor(req)` in `lib/auth.ts`
  returns `"claude-code" | "claude-ai" | null`; `isAuthorizedMcp` becomes `!== null`.
- The client reaches tool handlers through `mcp-handler`'s auth info, and is recorded on
  writes: entry `source`, item `history[].client`, decision `postedBy.client`.
- Both clients get the same tools. MCP still exposes no delete.
- `.env.example` gains the variable. The owner sets the real value in `.env.local` and
  Vercel, and pastes `Bearer <value>` into the claude.ai connector's request header
  (Plugins → Add → Add custom connector → No sign-in → Request headers). Claude never sees it.

## 11. Dashboard — `/worklog`

- **Roadmap** (new section, own component): roadmap picker; milestone strip with days left;
  items grouped by track, each with a stage bar (n of N, stage name), due date and slip,
  late / at-risk / blocked flags, who is on it now. Filters: track, phase, stage, flag.
- **Sessions** (`WorkSessionStrip` upgraded): live / idle / gone; track, focus, branch,
  worktree, changed-file count; overlaps highlighted; pending-decision count per track.
- **Decisions** (new): each with ack chips per roadmap track; actions are "mark superseded"
  and delete. Posting happens from Claude. *(my call)*
- **Deleting** (admin-only, behind a confirm, mirroring the existing entry delete): a whole
  roadmap with its items — the way to redo a bad import — a single item, or a decision.
  MCP gets none of these.
- **Entries:** new filters — track, text, waiting-on, date range. Filtering and counts move
  server-side; the list shows "Showing 300 of 412 · Load more". The 300 cap no longer hides
  anything silently. New routes follow the existing `/api/worklog/*` pattern behind
  `isAuthorizedAdmin`.
- Copy in `src/config/worklog.ts`; fix its stale "public Build Log" header comment in passing.

## 12. Getting the roadmap in, and day-to-day use

Deliverables are text for the owner to paste. Nothing is sent on their behalf.

1. **Import prompt** for the claude.ai roadmap chat: read the roadmap page, then call
   `set_roadmap` for project `tools-australia`, roadmap "2027 model", with stages Talk…Ready,
   tracks 1–5 with their worktrees, the key dates as milestones, and FT-00a…FT-35 with
   phase, track, size, after, stages done and the **current** dates. Fallback if the chat
   cannot: a Claude Code session reads the artifact with the Artifact tool and imports.
2. **Regroup prompt** for one Claude Code session: move existing entries whose titles start
   with an FT label into that label's group with `set_work_group`, listing what it changed.
3. **claude.ai project instruction lines**: read `get_roadmap` and `list_decisions` before
   answering about progress; post the owner's directions with `post_decision`; change dates
   only through `set_roadmap` / `update_roadmap_item` with a reason.
4. **One line for the Tools Australia session-prompt shared header** (client repo — the
   owner edits it): check in before each task with your track and FT label; post any shared
   rule you change; acknowledge pending decisions once applied; move your feature's stage.
5. **`~/.claude/skills/worklog/SKILL.md`** updated with check-in, decisions, stages,
   `waiting_on`, and "never change a date without a reason".

## 13. Testing

Vitest, pure layer only, `lib/worklog/*.test.ts` — no database, no mocks:
`roadmapStatus` (stage names, finished, late, at risk, slip, waits-for, parked and dropped
excluded, milestone summary), `roadmapDiff` (baseline set once, date moves listed),
`liveness` (both thresholds and `endedAt`), `decisions` (per-track pending, poster excluded,
superseded excluded, no-track 7-day window, once-only delivery), `overlaps` (differing hash,
identical hash, missing hash, same worktree, stale report, latest-per-worktree),
`filters` (each filter, `open`, `track`), page footer, `mcpClientFor` (each token, unset
tokens fail closed, wrong length), and the briefing formatter (never over 40 lines, never
names another project, cut lists say how many more).

Hook helpers get a `node --test` file beside them, as `secret-guard.test.mjs` does: git
output parsing, secret-path exclusion (no hash ever produced), throttle decision, project
resolution from a remote URL.

Verified by hand **against production, after the owner deploys each step** — the hooks and
claude.ai can only reach the deployed site. Hand checks write under a throwaway project
(`worklog-selftest`) and are deleted from the dashboard afterwards, so the real worklog is
not polluted *(my call)*. Local `npm run dev` is for the dashboard's look only. Checks: two
sessions in two Tools Australia worktrees see each other; editing the same file in both
warns; an identical file does not; a decision reaches the other session on its next prompt;
the claude.ai connector lists the tools and `get_roadmap` answers.

## 14. Build order

Each step ships on its own and is useful without the next.

1. **Foundations** — filters, pagination and no silent caps (`list_work`, `work_report`,
   dashboard); `waiting_on`; the claude.ai token and client recording; the session-start
   hook's worktree fix. *claude.ai can connect and read from here on.*
2. **Roadmap** — models, `set_roadmap`, `update_roadmap_item`, `get_roadmap`, the `log_work`
   link line, `list_groups` marking, entry `track` stamping, dashboard Roadmap section with
   its deletes. Then the import (§12.1–2).
3. **Sessions and decisions** — session fields, `check_in`, the decision tools, briefing in
   the session-start hook, the prompt hook, dashboard Sessions and Decisions.
4. **Files** — `report_files`, overlap rules, the edit hook, overlaps on the dashboard.
5. **Words** — skill update, the paste-in lines (§12.3–4), `docs/worklog/` refresh, Domain
   Manifest paths (`lib/models/WorkRoadmap*.ts`, `WorkDecision.ts`, `WorkAttachment.ts`
   which is already missing, `scripts/worklog-hooks/**`).

## 15. Calls made without the owner (check these)

1. A roadmap item is a group with a plan; entries link through `group`.
2. Tracks move stages freely; date, park and drop changes need a reason and are broadcast.
3. Late / at-risk definitions (§7). Live 30 min, idle 12 h.
4. Decisions are acknowledged per track, not per session.
5. Files are compared against the remote's default branch, by path and content fingerprint;
   secret-looking files are never fingerprinted.
6. Hooks run in every project on this machine; silent when there is nothing to say.
7. claude.ai gets the same tools as Claude Code under its own token.
8. Dashboard can mark a decision superseded and delete roadmaps, items and decisions; it
   does not post decisions.
9. Default stages for a new roadmap: Spec, Build, Review, Done.
10. A third hook on each prompt, for decisions.
11. Build order (§14).
12. Slip is measured from the plan as imported (§6, `baselineDue`).
13. Entries get a stamped `track` at log time.
14. Hooks are copied from the repo, not linked; the new registrations need your yes at
    install time.
15. Hand checks run against production under a throwaway project, deleted afterwards.
16. Context budget (§9): project wall, session-scoped defaults, track-first briefing,
    40 / 10-line caps, once-only news, prompt hook at most once per 2 minutes.

## 16. Left to the builder

Exact text layout of the briefing and `get_roadmap` lines, within the §9 context budget; the dashboard's visual layout within the Atelier tokens; whether the pre-edit warning
is possible (§9); the Zod schemas; how `mcp-handler` exposes auth info to handlers; index
choices beyond those listed.

## 17. Risks

| Risk | Mitigation |
|---|---|
| Edit hook slows editing | Throttled, change-only sends, 4 s cap, exit 0 always |
| Warnings become noise | Only new overlaps and new decisions are printed; identical files never warn |
| A secret's fingerprint leaves the machine | Secret-pattern paths are never hashed; ignored files never listed; tested |
| A track quietly moves its own dates | Reason required; every move broadcast as a decision and kept in `history`; slip shown against `baselineDue` |
| Import uses stale dates | The roadmap chat imports from the page it owns; `set_roadmap` returns every date it set for review |
| claude.ai token leaks | Separate from Claude Code's; revoke one without the other |
| Schema change in dev | Restart `npm run dev` (gotchas.md) |
