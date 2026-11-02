# Phase 2 — MCP server and Google OAuth client configuration

## Delivered in this branch

- A local stdio MCP server built on the official Model Context Protocol TypeScript SDK.
- Tools for provider catalog, all-provider connection checks, and a single-provider check.
- Reuses the same Phase 1 adapters and status vocabulary.
- No secrets are sent to the model or returned by MCP tools.
- MCP server has no network listener; it is not exposed publicly.
- Google web sign-in uses the supplied OAuth Client ID as a non-secret default.

## Required private configuration

Set these in Vercel and, separately, in the MCP host's private environment as applicable:

- `GOOGLE_CLIENT_SECRET` — Google OAuth Web client secret; never commit it.
- `GOOGLE_REDIRECT_URI` — exact deployed callback URL: `https://YOUR_DOMAIN/api/auth/callback`.
- `SESSION_SECRET` — random value with at least 32 bytes.
- `ALLOWED_EMAILS` — only the intended owner email.
- Provider API tokens — minimum required scopes, preferably read-only.

In Google Cloud Console, add the exact callback URL to **Authorized redirect URIs** for this Web application OAuth client. The client ID alone cannot complete the OAuth code exchange; the client secret and redirect URI are still required.

## Validation

Run:

```bash
npm install
npm test
npm run build
npm run mcp
```

The MCP process waits for an MCP stdio client. A successful process start alone does not prove that provider credentials work; invoke the tools from a connected MCP client.

## Not implemented in Phase 2

- Remote/HTTP MCP transport or public MCP endpoint.
- Remote MCP OAuth authorization server.
- Provider write operations, provisioning, deletion, deployment, DNS, database mutation, or billing actions.
- Cross-provider resource pooling or invented quota totals.
