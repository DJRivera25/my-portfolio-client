# auth — testing

## What is covered

`lib/auth.test.ts` (vitest, `node` environment) tests `mcpClientFor` and `isAuthorizedMcp` from `lib/auth.ts`
with stubbed env vars:

- `MCP_TOKEN` resolves to `"claude-code"`, `MCP_CLAUDE_AI_TOKEN` to `"claude-ai"`.
- A wrong token of the same length, and a token of a different length, are denied (`null`).
- With both env vars unset or empty, every request is denied, including one with no bearer token.
- `isAuthorizedMcp` is true for either client's token.

## How to run

```bash
npx vitest run lib/auth.test.ts
```

Run from the worktree/checkout root with an uppercase drive letter on Windows (`C:\...`), or vitest loads twice
and every suite fails.

## Deliberately untested

- **Route to tool wiring.** That `app/api/mcp/route.ts` passes the client from `mcpClientFor` through the SDK's
  `authInfo` to the tool handlers is not covered by a test. It was verified by reading the SDK source, not by
  running it.
