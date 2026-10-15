# ui-template

The starting point for new web apps. It carries the same UI/UX as GAP-AVR: the dark collapsible
sidebar, page header, buttons, fields, modals, confirms, toasts, alerts, tables, filters,
loading/empty/error states and number/date formatting. The color comes from one swappable palette.

Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · MUI 6 (dialogs, inputs,
toasts, icons) · pnpm.

## Run

```bash
pnpm install
pnpm dev            # http://localhost:3000. Log in with any email and password (demo auth)
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

## Start a new project from it

1. Copy the folder (or use this repo as a GitHub template) and `pnpm install`.
2. Rebrand, following [docs/ui-standards.md#rebranding-a-new-project](docs/ui-standards.md#rebranding-a-new-project):
   the BRAND block in `app/globals.css`, `app/lib/design-tokens.ts`, `app/config/brand.ts`, `public/logo.svg`.
3. Replace the demo auth in `app/contexts/AuthContext.tsx` with the real one. Keep its
   `{ user, userName, role, loading, login, signOut }` shape so the shell keeps working.
4. Put the real roles in `app/lib/roles.ts` and the real pages in `app/components/ui/navigation/navItems.tsx`.
5. Delete `app/ejemplo` and `app/reportes` once you've copied their patterns. Keep `/ui-kit`
   while the project is young: it's the visual reference.

## What's where

| Path | What |
|---|---|
| `app/components/ui/` | The design system primitives (one component per file) |
| `app/components/ui/navigation/` | Sidebar + the nav list that drives sidebar, Ctrl+K and route guard |
| `app/components/ui/typography.ts` | Text roles |
| `app/globals.css` | Tailwind tokens: BRAND palette, semantic colors, radius, small type scale |
| `app/lib/design-tokens.ts` | The same tokens as JS values for MUI / charts |
| `app/lib/utils/number-format.ts`, `date-format.ts` | The only way to show numbers and dates |
| `app/ui-kit/page.tsx` | Live catalog of every component |
| `app/ejemplo/` | Reference CRUD screen: list + filters + form modal + confirm + toasts |
| `docs/ui-standards.md` | The rules |
| `eslint.config.mjs` | Guardrails: no `alert`/`confirm`/`toLocaleString`/`text-[Npx]`/named brand hues |
