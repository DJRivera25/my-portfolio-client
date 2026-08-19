---
description: Add or run vitest tests for a module. Usage /test [path or description]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
argument-hint: [module path or what to test]
---

# /test — vitest in this repo

`$ARGUMENTS` is the target — a path, or a description of the behaviour to cover. If empty, run the
suite and report.

## What is actually wired

```bash
npm test           # vitest run
npm run test:watch # vitest
```

From `vitest.config.mts`:

- `environment: "node"` — **no jsdom, so no component tests**
- `include` is `lib/**/*.test.ts` only — a test outside `lib/` is silently not run
- alias `@` resolves to the repo root

The `@testing-library/*` packages in `package.json` are CRA leftovers and are not usable as
configured. So are `@types/jest` and `src/setupTests.ts`.

## Before writing a test

Check the target is **testable without a database**. `lib/db.ts` throws at module scope when
`MONGODB_URI` is unset, so any module that transitively imports it kills the suite on import.

- **Pure module** — no `mongoose`, no `@/lib/db` — test it directly. This is exactly why
  `lib/worklog/` is split into a pure core and query shells.
- **Query shell or route handler** — there is no integration harness. Say so rather than inventing
  one. If a test is genuinely needed, propose extracting the pure logic first.

## Pattern

Co-locate as `<module>.test.ts` beside the module. Follow the existing four:
`lib/worklog/format.test.ts`, `report.test.ts`, `since.test.ts`, `status.test.ts`.

```ts
import { describe, expect, it } from "vitest";
import { thing } from "./thing";

describe("thing", () => {
  it("does the expected thing", () => {
    expect(thing(input)).toBe(expected);
  });
});
```

Cover the boundaries, not just the happy path. The existing suites test junk input (`parseSince`)
and state transitions (`resolveCompletedAt` stamp / clear / preserve).

## Then

Run `npm test` and report the actual output. If it fails, report the failure — never describe a
test as passing without having seen it pass.

If the module sits outside `lib/`, say that the include glob needs widening and ask before editing
`vitest.config.mts`.
