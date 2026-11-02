# AWE Resource Control Center

Private, single-owner infrastructure control panel for the verified Google account `araratavetisyan777999@gmail.com`.

## Current control-center capabilities

- Google OIDC Authorization Code + PKCE sign-in; the callback and signed-session validator accept only the exact owner email.
- Signed HttpOnly/Secure/SameSite session cookie; provider credentials remain server-side.
- Live connection checks for GitHub, Cloudflare, Vercel, Render, Supabase and Neon.
- Real GitHub repository listing and repository creation.
- Real Vercel project listing and project creation.
- Real Supabase project listing and creation (requires organization, region and a new database password).
- Real Neon project listing and creation.
- Login notification email sent through the owner's Google Gmail API access token after successful sign-in. No third-party email key is required; Gmail API and the Gmail send OAuth scope must be enabled/consented in Google Cloud.
- Same-origin protection on state-changing browser API requests.
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
- `SUPABASE_ACCESS_TOKEN` — project read/create access.
- `NEON_API_KEY` — project read/create access.
- `CLOUDFLARE_API_TOKEN` and `RENDER_API_KEY` — currently used for connection checks.

## Deploy and configure

See [deployment guide](docs/DEPLOYMENT.md) and [security notes](docs/SECURITY.md).

## Important boundaries

The dashboard executes real GitHub repository, Vercel project, Supabase project and Neon project listing, creation and typed-confirmation deletion requests when credentials and permissions are configured. It does not pretend unsupported operations succeeded. Cloudflare write operations, Vercel deployment mutation/log streaming, resource editing, full billing/usage aggregation, database branch/backup/SQL administration, and remote MCP hosting are not claimed as implemented. The operations page is intentionally read-on-demand; it does not poll providers in the background. Vercel project creation does not automatically connect a Git repository or deploy source code.
