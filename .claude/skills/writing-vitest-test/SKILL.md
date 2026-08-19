---
name: writing-vitest-test
description: Use when adding a unit test, writing a test file, or asked to "add a test for X" / "test this function" / "add a regression test" in this repo. Encodes the vitest config constraints — node environment, the lib-only include glob, and the module-scope throw in lib/db.ts — that decide whether a test is even possible.
---

# writing-vitest-test

## When to use

Any request to add or change a test in my-portfolio-client. Read this **before** writing the file
— the constraints below decide whether the test can exist at all, and getting it wrong produces a
file that silently never runs.

## What is actually wired

```bash
npm test           # vitest run
npm run test:watch # vitest
```

From `vitest.config.mts`:

| Setting | Value | Consequence |
|---|---|---|
| `environment` | `"node"` | No jsdom. **Component tests are impossible** as configured. |
| `include` | `lib/**/*.test.ts` | A test outside `lib/` is **silently not run** — no error, no warning. |
| alias | `@` → repo root | `@/lib/...` resolves in tests. |

Ignore the `@testing-library/*` packages, `@types/jest`, and `src/setupTests.ts` in
`package.json` — they are CRA leftovers wired to nothing. Their presence makes it look like
component testing is set up. It is not.

## The constraint that catches people

`lib/db.ts` validates `MONGODB_URI` and throws **at module scope**:

```ts
const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI environment variable…");
```

So a test that imports — directly or transitively — anything reaching `@/lib/db` dies on import.
Not as a failed assertion: the whole file fails to load.

This is exactly why `lib/worklog/` is split into a pure core and query shells. `types.ts`,
`format.ts`, `report.ts`, `status.ts`, `slug.ts`, and `since.ts` import neither `mongoose` nor
`@/lib/db`, which is what makes them testable with no database and no mocks.

## Triage before writing

| Target | Do this |
|---|---|
| Pure module under `lib/` | Write the test. |
| Pure logic outside `lib/` | Say the include glob needs widening; ask before editing `vitest.config.mts`. |
| Query shell (`entries.ts`, `projects.ts`, `sessions.ts`) | No integration harness exists. Propose extracting the pure logic first. |
| Route handler | Same — no harness. Test the `lib/` helper it delegates to. |
| React component | Not possible. `environment: "node"`, no jsdom. |

Stopping with a clear explanation is the right outcome for the bottom four rows. Do not invent a
harness, do not add jsdom, and do not mock mongoose to get around the split.

## Pattern

Co-locate as `<module>.test.ts` beside the module under test.

```ts
import { describe, expect, it } from "vitest";
import { parseSince } from "./since";

describe("parseSince", () => {
  it("parses a day offset", () => {
    const now = new Date("2026-08-19T00:00:00Z");
    expect(parseSince("7d", now)).toEqual(new Date("2026-08-12T00:00:00Z"));
  });

  it("returns undefined for junk", () => {
    expect(parseSince("nonsense")).toBeUndefined();
  });
});
```

Notice the injected `now`. `parseSince` and `resolveCompletedAt` both take an explicit clock
parameter so tests are deterministic — pass it rather than mocking time.

## Standards to match

The four existing suites set the bar:

| Suite | What it demonstrates |
|---|---|
| `since.test.ts` | Junk input, not just valid input |
| `status.test.ts` | State transitions — stamp, clear, **and preserve** |
| `report.test.ts` | Aggregation over a realistic fixture array |
| `format.test.ts` | Exact output strings, including pluralisation edges |

Assert on values, not snapshots. Cover the boundary and the surprising case — a test that only
exercises the happy path documents nothing.

## Finish

Run `npm test` and report the real output. Never describe a test as passing without having seen it
pass.

If it fails, decide whether the test or the code is wrong. If the code is wrong, report the defect
— do not quietly reshape the assertion to match the bug.
