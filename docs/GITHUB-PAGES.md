# GitHub Pages — static AWE interface preview

This folder is a standalone, dependency-free interface preview for the AWE Resource Control Center.

## What works in this preview

- Responsive navigation between Overview, Projects, Operations, Providers, Activity, Security and Settings.
- Local resource search, provider/type filters and pagination.
- Provider detail dialogs and operation information panels.
- Local preference toggles and preview notifications.
- Export of the illustrative activity list to CSV.
- Mobile navigation and responsive layouts.

## What does not connect

This is intentionally a **static UI preview**, not the authenticated control plane.

- No provider API calls are made.
- No login or session is created.
- No secrets, OAuth tokens or API keys are included.
- Sample resource names, statuses, metrics and activity are illustrative.
- Buttons that represent provider mutations explain the preview boundary instead of changing real services.

Use the private Vercel application and its server-side API routes for real provider operations. Never move provider credentials into this Pages site.

## GitHub Actions deployment

Workflow: `.github/workflows/pages.yml`

It validates the standalone files, uploads only the `pages/` directory and deploys it with the official GitHub Pages Actions.

To enable deployment:

1. Open repository **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. GitHub Pages is available for public repositories on GitHub Free. Private repositories require GitHub Pro, Team, or Enterprise. This repository is currently private; do not change repository visibility without the owner's explicit decision.
4. Run the **GitHub Pages — AWE UI Preview** workflow or push a change to `pages/` on `phase-4/github-pages-ui`.
5. Open the URL shown in the workflow's deployment environment.

GitHub Pages sites are publicly accessible when published. The Pages artifact contains only the static UI preview, not backend source or secrets.

## Traffic-conscious design

The preview is static HTML, CSS and JavaScript. It has no polling, analytics, external fonts, images, third-party scripts, API requests or runtime package dependencies.