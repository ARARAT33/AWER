# Security model

- Google OpenID Connect with verified-email enforcement for exactly `araratavetisyan777999@gmail.com`; no configurable multi-user allowlist.
- Authorization Code + PKCE S256 and OAuth state validation.
- Eight-hour HMAC-SHA256 signed Secure, HttpOnly, SameSite=Lax session cookie.
- Same-origin validation for browser state-changing project-creation endpoints.
- Provider credentials are read only by server functions and never returned to the browser.
- GitHub, Vercel, Supabase and Neon project creation/deletion requests are sent directly to their provider APIs; provider permissions remain the effective authorization boundary. Deletion requires same-origin POST semantics and the exact resource name as a confirmation value; GitHub deletion is limited to repositories owned by the authenticated GitHub account.
- Login email notifications are optional and require a verified Resend sender plus private API key.
- CSP, frame denial, nosniff, strict referrer policy, no-store resource responses, and provider timeouts where configured.
- No secrets in Git, browser storage, or client build variables.

Use minimum-scope provider tokens, enable MFA on provider accounts, rotate exposed credentials, and review provider activity logs. Creating infrastructure may incur provider charges; review each provider's plan and pricing before submitting. This security baseline is not a guarantee of invulnerability. Destructive operations and broad write permissions are deliberately not exposed by the current control panel.
