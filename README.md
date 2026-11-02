# AWE Resource Control Center

Owner-only infrastructure control plane for inspecting connected AWE providers.

## Phase 1
- Google OIDC sign-in with verified-email allowlist and PKCE.
- Signed HttpOnly sessions; provider tokens remain server-side.
- Read-only checks for GitHub, Cloudflare, Vercel, Render, Supabase and Neon.
- Honest states: connected, not configured, invalid credentials, provider error, unreachable.
- No fabricated quotas, usage totals, or resource pooling.

## Phase 2 (this branch)
- Local stdio MCP server with provider catalog and read-only connection-check tools.
- Uses the same provider adapters as the dashboard.
- Google OAuth Client ID is configured as a public default; the client secret and redirect URI must be set privately.
- See [Phase 2 documentation](docs/PHASE-2.md) and [MCP server guide](mcp-server/README.md).

## Deploy
Import this repository into Vercel as a Vite project. Set environment variables from `.env.example` in Vercel. Register `https://YOUR_DOMAIN/api/auth/callback` as the Google OAuth redirect URI and set `GOOGLE_REDIRECT_URI` to exactly the same value. See `docs/DEPLOYMENT.md`.

Provider API credentials must be added privately in Vercel environment settings. Never commit secrets. Phase 2 MCP server runs locally over stdio; it does not expose a public endpoint or perform infrastructure mutations.
