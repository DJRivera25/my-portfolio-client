import { createMcpHandler } from "mcp-handler";
import { isAuthorizedMcp } from "@/lib/auth";
import { registerWorklogTools } from "./tools";

// Mongoose and node:crypto both need the Node runtime; this cannot run on edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = createMcpHandler((server) => registerWorklogTools(server), {
  serverInfo: { name: "worklog", version: "1.0.0" },
});

async function guarded(req: Request): Promise<Response> {
  if (!isAuthorizedMcp(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  return handler(req);
}

export { guarded as GET, guarded as POST, guarded as DELETE };
