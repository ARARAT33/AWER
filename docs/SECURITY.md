# Security model

- Google OpenID Connect with verified-email allowlist.
- Authorization Code + PKCE S256 and state validation.
- Eight-hour HMAC-SHA256 signed Secure, HttpOnly, SameSite=Lax session cookie.
- Provider credentials are read only by server functions and never returned to the browser.
- Protected API routes, provider request timeouts, sanitized errors, and no-store resource response.
- CSP, frame denial, nosniff, and strict referrer policy.
- No secrets in Git, browser storage, or client build variables.

Use minimum-scope provider tokens, enable MFA on provider accounts, rotate exposed credentials, and review audit logs. This is a security baseline, not a guarantee of invulnerability. Phase 1 is read-only; MCP execution and resource mutation are excluded.