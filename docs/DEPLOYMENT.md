# Deployment

1. Import `ARARAT33/AWER` into Vercel. Select Vite, build `npm run build`, output `dist`.
2. Configure every variable in `.env.example` in Vercel Project Settings → Environment Variables. Keep secrets server-side; do not use `VITE_` prefixes.
3. Create a Google OAuth Web client. Add `https://YOUR_DOMAIN/api/auth/callback` as an authorized redirect URI and set `GOOGLE_REDIRECT_URI` to exactly that URL.
4. Keep `ALLOWED_EMAILS` limited to the owner account. Generate a unique random `SESSION_SECRET` of at least 32 bytes.
5. Deploy and sign in. Add provider credentials as minimum-scope/read-only tokens, then redeploy.

This release checks API authentication and reports returned project counts where supported. It does not mutate infrastructure, calculate billing, expose CPU/RAM/storage, or merge quotas.