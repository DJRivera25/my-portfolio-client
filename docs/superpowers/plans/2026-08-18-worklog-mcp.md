# Worklog MCP Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking.
> **This project forbids agent-run git commits** (CLAUDE.md hard rule #1). No task ends in a
> commit; the working tree is handed to the repo owner.

**Goal:** Claude Code can log work, tasks, and session status to the portfolio site over MCP,
with a private dashboard and an opt-in public Build Log feed.

**Architecture:** One service layer in `lib/worklog/` holding all business logic, with two thin
protocol adapters over it — `app/api/mcp/` for Claude Code and `app/api/worklog/` for the
dashboard and public feed. Each service module splits a Mongoose query shell from a pure,
directly-testable core.

**Tech Stack:** Next.js 15 App Router, Mongoose 8, `mcp-handler@2`, `@modelcontextprotocol/server@2`,
zod 4, vitest, Tailwind 3, Framer Motion.

**Spec:** `docs/superpowers/specs/2026-08-18-worklog-mcp-design.md`

## Global Constraints

- DB access only via `dbConnect()` from `@/lib/db`. Never `mongoose.connect`. Never a second driver.
- Models use the `models.X || model("X", …)` HMR-safe pattern, one collection per file.
- Route handlers stay under ~30 lines of logic: parse, authorize, delegate.
- Model fields are camelCase. MCP tool arguments are snake_case; map at the adapter boundary.
- No `any` unless unavoidable.
- No comments except non-obvious *why*.
- No hardcoded copy in JSX — content goes in `src/config/`.
- Node 20+ required by `mcp-handler@2`.
- `MCP_TOKEN` has no default. Unset means deny.

---

## Phase 1 — Foundation

### Task 1: Dependencies and test harness

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install**

```bash
npm install mcp-handler@^2 @modelcontextprotocol/server@^2 zod@^4
npm install -D vitest
```

- [ ] **Step 2: Add scripts to `package.json`**

```json
"test": "vitest run",
"test:watch": "vitest",
"type-check": "tsc --noEmit"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: { environment: "node", include: ["lib/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname) } },
});
```

- [ ] **Step 4: Verify** — `npm run test` exits 0 with "No test files found".

---

### Task 2: Counter model and short ids

**Files:**
- Create: `lib/models/Counter.ts`

**Interfaces:**
- Produces: `nextSeq(name: string): Promise<number>`

- [ ] **Step 1: Implement**

Schema is `{ _id: String, seq: Number }`. `nextSeq` does a `findOneAndUpdate` with
`$inc: { seq: 1 }`, `upsert: true`, `new: true`, and returns `doc.seq`.

- [ ] **Step 2: Verify** — `npm run type-check` passes.

---

### Task 3: Worklog models

**Files:**
- Create: `lib/models/WorkProject.ts`, `lib/models/WorkEntry.ts`, `lib/models/WorkSession.ts`

**Interfaces:**
- Produces: default-exported Mongoose models `WorkProject`, `WorkEntry`, `WorkSession`.

- [ ] **Step 1: Write the three schemas** exactly as specified in the spec's Data model section.

- [ ] **Step 2: Add indexes on `WorkEntry`**

```ts
WorkEntrySchema.index({ project: 1, createdAt: -1 });
WorkEntrySchema.index({ status: 1, createdAt: -1 });
WorkEntrySchema.index({ visibility: 1, createdAt: -1 });
WorkEntrySchema.index(
  { session: 1, title: 1 },
  { unique: true, partialFilterExpression: { session: { $type: "objectId" } } }
);
```

The `$type: "objectId"` is load-bearing — `$exists: true` would match explicit nulls and
collide every session-less entry sharing a title.

- [ ] **Step 3: Verify** — `npm run type-check` passes.

---

### Task 4: Pure core + tests

This is the task the test suite exists for. Written test-first.

**Files:**
- Create: `lib/worklog/public.ts`, `lib/worklog/report.ts`, `lib/worklog/format.ts`
- Create: `lib/worklog/types.ts`
- Test: `lib/worklog/public.test.ts`, `lib/worklog/report.test.ts`, `lib/worklog/format.test.ts`

**Interfaces:**
- Produces:
  - `toPublicEntry(doc: WorkEntryLike): PublicEntry`
  - `PUBLIC_ENTRY_KEYS: readonly string[]`
  - `aggregateReport(entries: WorkEntryLike[], opts?: { since?: Date }): ReportDigest`
  - `formatReport(d: ReportDigest): string`
  - `formatEntries(entries: WorkEntryLike[]): string`
  - `resolveCompletedAt(prev, next, now): Date | null`  *(lives in `entries.ts`, Task 5)*
  - `deriveProjectName(slug: string): string`  *(lives in `projects.ts`, Task 5)*

- [ ] **Step 1: Write the allowlist test first**

```ts
it("emits exactly the allowed keys, given an entry with every field populated", () => {
  const out = toPublicEntry(entryWithEveryFieldSet);
  expect(Object.keys(out).sort()).toEqual([...PUBLIC_ENTRY_KEYS].sort());
});
it("never emits blockedReason", () => {
  expect(toPublicEntry(entryWithEveryFieldSet)).not.toHaveProperty("blockedReason");
});
```

- [ ] **Step 2: Run — expect failure** (`toPublicEntry` is not defined).

- [ ] **Step 3: Implement `toPublicEntry`** as an explicit construction of an object literal
  from the allowed fields. Not a delete-list, not a spread-minus-omit.

- [ ] **Step 4: Run — expect pass.**

- [ ] **Step 5: Write `aggregateReport` tests** — totals, per-project grouping, per-status
  grouping, `since` boundary inclusive, empty input returns zeroed digest not undefined.

- [ ] **Step 6: Implement `aggregateReport`. Run — expect pass.**

- [ ] **Step 7: Write `format.ts` tests** — an empty digest renders a readable
  "Nothing logged" line rather than an empty string or a bare header.

- [ ] **Step 8: Implement `format.ts`. Run — expect pass.**

- [ ] **Step 9: Verify** — `npm run test` all green, `npm run type-check` passes.

---

### Task 5: Service query shells

**Files:**
- Create: `lib/worklog/projects.ts`, `lib/worklog/entries.ts`, `lib/worklog/sessions.ts`
- Modify: `lib/worklog/report.ts`, `lib/worklog/public.ts` (add the query wrappers)
- Test: `lib/worklog/entries.test.ts`, `lib/worklog/projects.test.ts` (pure helpers only)

**Interfaces:**
- Produces:
  - `resolveWorkProject(slug, opts?): Promise<WorkProjectDoc>` — upserts
  - `listWorkProjects(): Promise<WorkProjectSummary[]>` — with open/blocked counts
  - `setWorkProjectStatus(slug, patch): Promise<WorkProjectDoc | null>`
  - `logWork(input: LogWorkInput): Promise<WorkEntryDoc>`
  - `listWorkEntries(filter): Promise<WorkEntryDoc[]>`
  - `updateWorkEntryStatus(ref, status, blockedReason?): Promise<WorkEntryDoc | null>`
  - `touchSession(sessionId, projectId): Promise<WorkSessionDoc>`
  - `endSession(sessionId, summary?): Promise<WorkSessionDoc | null>`
  - `getSessionStatus(sessionId?): Promise<WorkSessionDoc[]>`
  - `buildReport(opts): Promise<ReportDigest>`
  - `listPublicEntries(limit?): Promise<PublicEntry[]>`

- [ ] **Step 1: Write tests for `resolveCompletedAt` and `deriveProjectName`** — the two pure
  helpers that live in these modules. Cover: entering `done` stamps, leaving `done` clears,
  `todo` → `in_progress` leaves it null; `toolsaustralia` → `Toolsaustralia`.

- [ ] **Step 2: Run — expect failure.**

- [ ] **Step 3: Implement all query shells.** Every exported async function starts with
  `await dbConnect()`. `logWork` resolves the project, touches the session when `sessionId` is
  given, and upserts on `(session, title)`. `listPublicEntries` queries
  `{ visibility: "public" }` and maps through `toPublicEntry`.

- [ ] **Step 4: Run — expect pass.** `npm run type-check` passes.

---

## Phase 2 — MCP endpoint

### Task 6: MCP auth

**Files:**
- Modify: `lib/auth.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces: `isAuthorizedMcp(req: Request): boolean`

- [ ] **Step 1: Implement**

Reads `process.env.MCP_TOKEN`. Returns `false` when unset — no default, unlike the existing
`ADMIN_API_TOKEN || "admin-static-token"`. Compares length first, then constant-time via
`crypto.timingSafeEqual` over `Buffer.from(...)`.

- [ ] **Step 2: Add `MCP_TOKEN=` to `.env.example`** with a comment saying unset means deny.

- [ ] **Step 3: Verify** — `npm run type-check` passes.

---

### Task 7: MCP tools and route

**Files:**
- Create: `app/api/mcp/tools.ts`, `app/api/mcp/route.ts`

**Interfaces:**
- Consumes: everything from Task 5, `isAuthorizedMcp` from Task 6.
- Produces: `registerWorklogTools(server)`; GET/POST handlers at `/api/mcp`.

- [ ] **Step 1: Register the eight tools** — `log_work`, `list_work`, `update_work_status`,
  `list_work_projects`, `set_work_project_status`, `work_report`, `session_status`,
  `end_session`. `inputSchema` is a full `z.object({...})` (SDK v2 takes a Standard Schema,
  not a raw shape). Descriptions state *when to reach for the tool*.

- [ ] **Step 2: Wire the route**

```ts
export const runtime = "nodejs";
const handler = createMcpHandler((server) => registerWorklogTools(server), {
  serverInfo: { name: "worklog", version: "1.0.0" },
});
async function guarded(req: Request) {
  if (!isAuthorizedMcp(req)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  return handler(req);
}
export { guarded as GET, guarded as POST };
```

- [ ] **Step 3: Verify locally**

```bash
npm run dev
curl -s -X POST http://localhost:3000/api/mcp -H "Authorization: Bearer $MCP_TOKEN" \
  -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Expected: JSON listing eight tools. Then repeat without the header and expect `401`.

---

## Phase 3 — Dashboard and public feed

### Task 8: REST routes

**Files:**
- Create: `app/api/worklog/entries/route.ts`, `app/api/worklog/projects/route.ts`,
  `app/api/worklog/sessions/route.ts`, `app/api/worklog/report/route.ts`,
  `app/api/worklog/public/route.ts`

- [ ] **Step 1:** Implement each as parse → `isAuthorizedAdmin` → delegate → `NextResponse.json`.
- [ ] **Step 2:** `public/route.ts` has **no** auth gate and calls only `listPublicEntries()`.
- [ ] **Step 3: Verify** — `curl` each; authed routes 401 without a token, public route 200.

---

### Task 9: Client types and fetchers

**Files:**
- Create: `src/types/worklog.ts`, `src/lib/api/worklog.ts`

- [ ] **Step 1:** Mirror the service return shapes as plain types.
- [ ] **Step 2:** Fetchers use the existing `api` axios instance from `src/lib/api/client.ts`,
  which already attaches the admin token.

---

### Task 10: Dashboard

**Files:**
- Create: `app/worklog/page.tsx`
- Create: `src/components/worklog/WorkProjectCards.tsx`, `WorkEntryList.tsx`,
  `WorkSessionStrip.tsx`, `WorkReportPanel.tsx`

- [ ] **Step 1:** Page wraps content in `ProtectedRoute`, mirroring `app/inbox/page.tsx`.
- [ ] **Step 2:** Components take data as props; no DB access, no fetching inside leaf components.
- [ ] **Step 3:** Inline status change PATCHes `/api/worklog/entries` and updates local state.
- [ ] **Step 4: Verify** — visit `/worklog` logged out, expect redirect to `/login`.

---

### Task 11: Public Build Log section

**Files:**
- Create: `src/components/portfolio/BuildLogSection.tsx`
- Modify: `src/config/atelier.ts` (copy + fallback), `src/components/portfolio/PortfolioPage.tsx`

- [ ] **Step 1:** Add `buildLogContent` to `atelier.ts` — eyebrow, heading, and empty-state copy.
- [ ] **Step 2:** Build the section against `ATELIER` tokens, matching sibling section structure.
- [ ] **Step 3:** Render nothing when the feed is empty.
- [ ] **Step 4:** Compose into `PortfolioPage`.

---

### Task 12: Documentation

**Files:**
- Modify: `CLAUDE.md` (Domain Manifest — add the `worklog` domain from the spec)
- Create: `docs/worklog.md` (setup and tool reference)

- [ ] **Step 1:** Add the manifest entry verbatim from the spec.
- [ ] **Step 2:** Document `claude mcp add` setup and each tool.
- [ ] **Step 3: Final verify** — `npm run test`, `npm run type-check`, `npm run build` all pass.

---

## Self-review notes

- Spec coverage: models (T2–3), pure core + tests (T4), services (T5), auth (T6), MCP (T7),
  REST incl. public feed (T8), dashboard (T9–10), Build Log section (T11), env + manifest
  (T6, T12). No spec section is unclaimed.
- `resolveCompletedAt` and `deriveProjectName` are declared in Task 4's interface block but
  implemented in Task 5, where their modules live — tested in Task 5 Step 1. Flagged so an
  out-of-order reader does not look for them in `report.ts`.
- Naming is consistent across tasks: `listWorkEntries` / `listWorkProjects` /
  `listPublicEntries`, never a bare `listEntries`.
