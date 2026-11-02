#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getProviderStatuses, providerCatalog } from "../api/_lib/providers.js";

const server = new McpServer({
  name: "awe-resource-control-center",
  version: "1.1.0",
});

server.tool(
  "awe_list_providers",
  "List supported infrastructure providers and the environment variable required for each connection. Never returns credential values.",
  {},
  async () => ({
    content: [{ type: "text", text: JSON.stringify({ policy: "read-only", providers: providerCatalog }, null, 2) }],
  }),
);

server.tool(
  "awe_check_connections",
  "Check authentication reachability for all configured providers. This performs read-only API requests and never changes infrastructure.",
  {},
  async () => {
    const providers = await getProviderStatuses();
    return {
      content: [{ type: "text", text: JSON.stringify({
        checkedAt: new Date().toISOString(),
        policy: "read-only",
        providers,
        note: "Counts are shown only when the provider API returns a supported resource list. No quota pooling or estimated usage.",
      }, null, 2) }],
    };
  },
);

server.tool(
  "awe_check_provider",
  "Check one supported provider. Returns connection status only; credentials remain in the MCP host environment.",
  { provider: z.enum(["github", "cloudflare", "vercel", "render", "supabase", "neon"]) },
  async ({ provider }) => {
    const all = await getProviderStatuses();
    const result = all.find((p) => p.id === provider);
    return { content: [{ type: "text", text: JSON.stringify(result ?? { error: "Provider not found" }, null, 2) }] };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
