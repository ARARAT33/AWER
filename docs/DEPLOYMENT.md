# Deployment and private configuration

## Vercel project

1. Import `ARARAT33/AWER` into Vercel. Framework: Vite; build command: `npm run build`; output directory: `dist`.
2. Set the environment variables below in Project Settings → Environment Variables for Production (and Preview only if desired).
3. Redeploy after changing environment variables.

## Google owner login and Gmail notifications

- Client ID is preconfigured to the supplied public ID: `741485932725-e8p4qfj97i322kscf8amjqk88r4k8fkn.apps.googleusercontent.com`.
- Set `GOOGLE_CLIENT_SECRET` privately.
- Set `GOOGLE_REDIRECT_URI` to the exact deployed URL ending in `/api/auth/callback`.
- Add that exact URL to the Google OAuth Web client’s Authorized redirect URIs.
- The app hard-restricts both OAuth callback and signed sessions to `araratavetisyan777999@gmail.com`. There is no multi-user allowlist.
- Enable the Gmail API in the same Google Cloud project and ensure the OAuth consent configuration allows the `https://www.googleapis.com/auth/gmail.send` scope. The app sends a sign-in notice to the owner after each successful sign-in using the short-lived access token; it does not store Gmail tokens.
- The first sign-in after the scope change will ask you to grant Gmail send permission. If Gmail API or scope consent is unavailable, sign-in still succeeds but the notification send fails and is logged server-side.

## GitHub repository management

Set `GITHUB_TOKEN` to a fine-grained token for the intended GitHub owner. Grant repository metadata read and repository administration/create permissions as needed by GitHub's current token model. The dashboard lists repositories and creates new repositories as private by default; public creation is not exposed in the UI.

## Vercel project management

Set `VERCEL_TOKEN` with permission to read and create projects in the selected scope. For a team, set `VERCEL_TEAM_ID`. Project creation is a real Vercel API request; it does not automatically connect a Git repository or deploy source code.

## Supabase and Neon project management

- Set `SUPABASE_ACCESS_TOKEN` with permission to list and create projects. The form requires your Supabase organization ID, a supported region slug, and a new database password (12+ characters). The dashboard does not retain the database password.
- Set `NEON_API_KEY` with permission to list and create projects. The form requires a valid Neon region ID; an organization ID can optionally scope creation.

## Session security

Set `SESSION_SECRET` to a unique cryptographically random value of at least 32 bytes. Do not reuse provider credentials or commit any secret. Use least-privilege tokens and rotate them if exposed.

## Verification

```bash
npm install
npm test
npm run build
```

The dashboard shows explicit provider/API errors if credentials are missing or permissions are insufficient. No resource totals or quotas are fabricated.
