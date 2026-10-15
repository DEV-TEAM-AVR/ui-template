# CLAUDE.md

This is the UI template: the reference implementation of the design system shared by all of the
user's web apps (originally extracted from GAP-AVR-REC).

- The rules are in `docs/ui-standards.md`. Read it before building or changing any screen.
- Compose screens from `app/components/ui/*`. When none fits, add a primitive there (and show
  it on `/ui-kit`) rather than styling one screen by hand.
- Colors: only `brand-*`, the semantic tokens (`primary`, `danger`, `warning`, `accent`) and
  `zinc-*`. Never a named hue. The lint enforces it.
- `app/ejemplo/` is the reference list + form screen and `app/page.tsx` the reference dashboard.
  New features copy their structure.
- Verify with `pnpm typecheck && pnpm lint` day to day. Before handing off, also run `pnpm test && pnpm build`.
- A change to a primitive here should be ported to the projects that copied it (GAP-AVR-REC first).
