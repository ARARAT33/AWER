# AWE Resource Control Center — MCP Server (Phase 2)

A local **stdio MCP server** for the AWE Resource Control Center. It reuses the Phase 1 provider adapters and exposes read-only tools to MCP-compatible clients.

## Tools

- `awe_list_providers` — supported provider catalog and required environment-variable names.
- `awe_check_connections` — checks all configured providers.
- `awe_check_provider` — checks one provider by ID.

Supported providers: GitHub, Cloudflare, Vercel, Render, Supabase and Neon.

## Run

Requirements: Node.js 20+.

```bash
npm install
npm run mcp
```

Configure provider credentials in the MCP host's private environment. Do not put secrets in this repository, MCP arguments, logs, or chat messages.

## Example MCP client configuration

Use an absolute path to this repository and your local Node executable:

```json
{
  "mcpServers": {
    "awe-resource-control-center": {
      "command": "node",
      "args": ["/absolute/path/to/AWER/mcp-server/index.js"],
      "env": {
        "GITHUB_TOKEN": "set-in-your-MCP-host-secret-store",
        "CLOUDFLARE_API_TOKEN": "set-in-your-MCP-host-secret-store",
        "VERCEL_TOKEN": "set-in-your-MCP-host-secret-store",
        "RENDER_API_KEY": "set-in-your-MCP-host-secret-store",
        "SUPABASE_ACCESS_TOKEN": "set-in-your-MCP-host-secret-store",
        "NEON_API_KEY": "set-in-your-MCP-host-secret-store"
      }
    }
  }
}
```

The values above are placeholders. Prefer the MCP client's encrypted secret/environment management rather than saving actual values in a checked-in JSON file.

## Security boundary

- stdio only; no public HTTP listener or remotely exposed MCP endpoint.
- Provider operations are read-only in this phase.
- No credential values are returned by tools.
- No resource create/update/delete, deployments, DNS changes, billing actions, or quota aggregation.
- MCP host access is equivalent to local access to the configured credentials. Only install this server in a trusted client.

## Google sign-in / OAuth

The web dashboard uses Google OpenID Connect Authorization Code + PKCE. The supplied Google OAuth Client ID is a public identifier and is configured as the default client ID in the web login routes. The OAuth **client secret is not included**; set `GOOGLE_CLIENT_SECRET` privately in Vercel. Also set the exact `GOOGLE_REDIRECT_URI` and keep the owner email allowlist restricted.

This Google sign-in protects the web dashboard; it is not a remote MCP authorization server. The MCP server in this phase is local stdio. A remotely hosted MCP OAuth authorization server requires a separate deployment and issuer/client registration, and is intentionally not exposed here.
