# AWE Resource Control Center

Owner-only infrastructure control plane for inspecting connected AWE providers.

## Phase 1
- Google OIDC sign-in with verified-email allowlist and PKCE.
- Signed HttpOnly sessions; provider tokens remain server-side.
- Read-only checks for GitHub, Cloudflare, Vercel, Render, Supabase and Neon.
- Honest states: connected, not configured, invalid credentials, provider error, unreachable.
- No fabricated quotas, usage totals, or resource pooling.
- GitHub Actions tests and production build.

## Deploy
Import this repository into Vercel as a Vite project. Set environment variables from `.env.example` in Vercel. Register `https://YOUR_DOMAIN/api/auth/callback` as the Google OAuth redirect URI and set `GOOGLE_REDIRECT_URI` to exactly the same value. See `docs/DEPLOYMENT.md`.

Provider API credentials must be added privately in Vercel environment settings. Never commit secrets. Phase 1 is read-only and does not provision infrastructure or execute commands. Phase 2 (MCP server/OAuth client) is intentionally excluded.