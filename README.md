# AWE Resource Control Center

Private, single-owner infrastructure control panel for the verified Google account `araratavetisyan777999@gmail.com`.

## Current control-center capabilities

- Google OIDC Authorization Code + PKCE sign-in; the callback and signed-session validator accept only the exact owner email.
- Signed HttpOnly/Secure/SameSite session cookie; provider credentials remain server-side.
- Live connection checks for GitHub, Cloudflare, Vercel, Render, Supabase and Neon.
- Real GitHub repository listing and repository creation.
- Real Vercel project listing and project creation.
- Same-origin protection on state-changing browser API requests.
- Optional login email alerts through Resend. Configure a verified sender and API key to activate delivery.
- Local stdio MCP server from Phase 2; it currently exposes read-only provider inspection tools.
- GitHub Actions checks tests, MCP syntax, management API syntax, and frontend production build.

## Required private environment

Set values in Vercel Project Settings → Environment Variables. Never commit credentials.

- `GOOGLE_CLIENT_ID` — prefilled with the supplied public client ID.
- `GOOGLE_CLIENT_SECRET` — required for Google OAuth code exchange.
- `GOOGLE_REDIRECT_URI` — exact deployed callback URL.
- `SESSION_SECRET` — random secret of at least 32 bytes.
- `GITHUB_TOKEN` — token with repository read/create permissions for the intended owner account.
- `VERCEL_TOKEN` and optionally `VERCEL_TEAM_ID` — project read/create access in the intended Vercel scope.
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` — verified Resend sender for login notifications.
- Other provider tokens are used for connection checks; their write-management adapters are not yet enabled.

## Deploy and configure

See [deployment guide](docs/DEPLOYMENT.md) and [security notes](docs/SECURITY.md).

## Important boundaries

The dashboard executes real GitHub and Vercel API operations when credentials and permissions are configured. It does not pretend unsupported operations succeeded. Other provider write operations, full billing/usage aggregation, infrastructure deletion, and remote MCP hosting are not claimed as implemented. Destructive operations should require explicit per-action confirmation and audit logging before being added.
