# UI standards

How to build screens so every project looks and behaves like the others. Pick the shared
primitive first. Hand-roll only when none fits, and then reuse the tokens below.
The ESLint rules in `eslint.config.mjs` ("UI standards guardrails") enforce the parts marked **(lint)**.
Open `/ui-kit` in the running app to see every component live.

## What to use for what

| Need | Use | Not |
|---|---|---|
| Page wrapper | `<PageContainer>` then `<PageHeader title description actions>` | custom padding / a custom `<h1>` block |
| Ask the user to confirm | `await confirmDialog({ message, tone, confirmText })` (`components/ui/ConfirmDialog`) | `window.confirm` **(lint)** |
| Tell the user something happened | `notify.success/error/info(msg)` (`components/ui/Notifier`; works from lib code and survives a modal closing) | `alert` **(lint)** |
| A message that stays in the layout | `<Alert tone title>` (`components/ui/Alert`) | a hand-colored `bg-red-50` div |
| A button | `<Button variant size>` (`components/ui/Button`); `buttonClasses()` for a `<Link>` that looks like one | a raw `<button>` with color classes |
| A dialog | `<Modal open onClose title subtitle maxWidth>` (`components/ui/Modal`) | a hand-built `fixed inset-0` overlay |
| A text / number / date / password field | `<Input label error helperText>` | a raw `<input>` in an in-app form |
| Pick one of a list | `<Select options>`; long or searchable list: `<Combobox>` | a native `<select>` in a form |
| A quantity with +/− | `<NumericStepper>` | |
| A form label | `<FieldLabel required>` (built into Input/Select) | a hand-styled `<label>` |
| Switch between 2–4 views | `<SegmentedControl>` | two buttons with manual active styling |
| Include / exclude something | `<ToggleChip>` | a checkbox in a toolbar |
| Filter a list | `<MultiGroupFilterDropdown groups>` + `<FilterDateInput>` in a toolbar row | ad-hoc selects |
| Filter/sort a report column | `<ExcelColumnFilter>` in the `<TH>` | |
| A data table | `TableContainer / Table / THead / TBody / TFoot / TR / TH / TD` (`components/ui/Table`) | raw `<table>` with per-cell padding |
| A wide table | `<DualScrollTable>` + `STICKY_ACTIONS_CELL` / `STICKY_ACTIONS_HEAD` | |
| Period data entry/review (days × entities, grouped columns) | `<GridCard>` (black title bar) + one `<GroupedGrid>` per section, `<PeriodNavigator>` above | a list table with dozens of columns |
| Loading / error / empty area | `LoadingState`, `ErrorState` (`components/ui/States`), `EmptyState` | a spinner div or a "Cargando..." text block |
| Placeholder while a known shape loads | `Skeleton`, `TableSkeleton`, `CardSkeleton` | |
| A KPI | `<StatCard label value delta>` | |
| A long multi-step job | `<StepProgressBar>` | |
| A section surface | `<Card>` (+ `CardHeader`/`CardBody`) | a hand-rolled bordered div |
| A chart that can go fullscreen | `<FullscreenChart>` | |
| A photo preview | `<ImageLightbox url>` | |
| Text styles | `text.section / overline / body / muted / hint / strong / number / code` (`components/ui/typography`) | ad-hoc `text-[13px] font-…` **(lint for px sizes)** |
| Show a number | `formatNumber`, `formatInteger`, `formatMoney`, `formatPercent` (`lib/utils/number-format`) | `toLocaleString`, `new Intl.NumberFormat` **(lint)** |
| Show a date | `formatDate`, `formatDateTime`, `formatTime` (`lib/utils/date-format`) | bare `toLocaleDateString()` **(lint)** |
| A color | `brand-*`, `primary`, `danger`, `warning`, `accent`, `zinc-*` | `emerald-*`, `indigo-*`… **(lint)** |

## Layout and shell

- **Sidebar** (`navigation/SidebarContent`): always dark (`zinc-950`), collapsible on desktop (state
  stored in localStorage, default collapsed), slide-in overlay on mobile. The active item is a
  brand-tinted pill: `bg-brand-500/10 text-brand-400 border border-brand-500/20`.
- **Pages, menu, Ctrl+K palette and route guard** all read `navigation/navItems.tsx`. Adding a
  page means adding an entry there with `allowedRoles` (omit it to show the page to every role).
  The guard only hides UI. The API must still enforce access.
- **Header**: `PageHeader` puts the title on the left and actions on the right. On desktop, the
  theme toggle and `UserMenu` follow after a divider. On mobile they move to the sticky top bar
  in `NavigationLayout`.
- **Page body**: sections are separated by `space-y-6` (from `PageContainer`). A filter toolbar is
  a `flex flex-wrap items-center gap-2` row directly under the header, holding small controls
  (h ≈ 31px, `text-xs`) and an optional result counter (`text-2xs`, `sm:ml-auto`).
- **Primary action on mobile**: the header button hides under `sm` and a round FAB takes its place
  (`fixed bottom-6 right-6`, `bg-primary`, see `app/ejemplo/page.tsx`).
- **Auth pages** (`/login`) render outside the shell, always dark, with the brand glow.

## Buttons: choose by intent

- `primary`: the main action of a screen or modal (Guardar, Registrar, Aprobar). One per area.
- `secondary`: neutral alternatives (Cancelar, Actualizar, Exportar).
- `ghost`: low-emphasis toolbar actions and icon buttons (`size="icon"` / `"icon-sm"`). Row
  actions in tables are ghost `icon-sm`. A delete icon adds `hover:text-red-600 hover:bg-red-50`.
- `danger`: destructive or irreversible (Eliminar, Anular, Rechazar). Pair with a `tone: "danger"` confirm.
- `accent`: actions that push documents to an external system (ERP/accounting), kept visually
  apart from in-app saves.

Sizes: `sm` (toolbars, page-header actions, dense rows), `md` (default, modal footers), `lg`
(auth / hero CTAs). `loading` disables the button and shows a spinner. `Button` defaults to
`type="button"`. Pass `type="submit"` inside forms. Icons go in `startIcon` / `endIcon` at `fontSize: 18`.

Labels are verbs naming the result ("Registrar pago", "Eliminar"). Avoid "Aceptar" and "OK".

## Forms

- Fields stacked with `space-y-4`. Two short related fields share a row:
  `grid grid-cols-1 sm:grid-cols-2 gap-4`.
- Every field has a label above it (`FieldLabel` style: 10px, bold, uppercase). Mark required
  fields with `required`, which adds a red asterisk.
- Validate on submit. Per-field messages go in `error` (red text with an icon under the field).
  An API or submit error goes in `<Alert tone="danger">` at the top of the form.
- After a successful save: `notify.success("X creado")`, call the parent's refresh, then close.
  Don't re-show the saved data in a toast.
- Number inputs ignore the mouse wheel (built into `Input`).

## Confirms

```ts
if (!(await confirmDialog({
  title: "Eliminar pago",          // optional, defaults to "Confirmar acción"
  message: `¿Eliminar el pago de ${formatMoney(pago.monto)}?`,
  tone: "danger",                  // "primary" | "warning" | "danger"
  confirmText: "Eliminar",         // the verb, not "Aceptar"
}))) return;
```

Use `warning` for bulk or overwriting operations ("Esto reescribirá…"). The handler must be
`async`. The message names the specific thing affected (who, how much).

## Feedback: which one

- **notify** (toast, top-right, auto-hides; errors stay up 7s): the result of an action the user just took.
- **Alert** (inline box): a state that stays true while the user looks at the screen, such as a
  form error, "período cerrado", or a sync warning. Tones: `info`, `success`, `warning`, `danger`.
- **confirmDialog**: before a destructive, irreversible or bulk action.
- **ErrorState**: a whole area failed to load (with `onRetry`).

## Dialogs

- `maxWidth`: `xs` (≈ 444px, short forms/details), `sm` (standard forms), `md` (default), `2xl`…`7xl`, `full`.
- Use `subtitle` for context (the record, the date, the client), not a second header row in the body.
- Use `disableBackdropClose` on forms where a stray click would lose typed input. Esc still closes.
- Footer buttons go last in the body: `secondary` Cancelar on the left and the action on the
  right, both `className="flex-1"`, in a `flex gap-3 pt-2` row.
- On phones every Modal opens as a bottom sheet (built in).
- Lightboxes, the command palette and fullscreen charts are not dialogs. They keep their own overlays.

## Tables

- `density="normal"` (`text-sm`, roomy) for CRUD lists. `density="compact"` (`text-xs`) for
  reports and dense lists.
- Numbers: `<TD numeric>` / `<TH numeric>` are right-aligned with tabular figures. Totals: `<TR total>` in `<TFoot>`.
- `<THead sticky>` for scrolling lists. `<TD flush>` for cells holding an input. `<TR selected>`
  for the active row. `onClick` on a TR adds the pointer cursor.
- `className` on cells is for what's specific to that cell (highlight color, width, sticky
  column, `hidden md:table-cell` for responsive columns). Never use it for padding or font size,
  because the primitives own those.
- Responsive: hide secondary columns under `sm`/`md`. Keep the identifying column, the main
  number and the actions visible.
- Bespoke dense grids (editable spreadsheets, pivots) keep their own markup but should use
  `tableClasses.num` for numeric cells.

### Period grids (the "Registros" layout)

Use these for screens where users fill or review numbers per day (or month) per sub-entity.
Reference: `app/ejemplo/semanal/page.tsx`.

- `PeriodNavigator` on top: ‹ range › with an "Esta semana" pill and a "Sem. N" pill.
- One `GridCard` per entity (galpón, almacén, sucursal). It has a `zinc-900` title bar with an
  icon, the name, muted meta, and `zinc-700` chips for sub-entities.
- Inside it, one `GroupedGrid` per section (AVES, ALIMENTO…), separated by a 4px top border.
  - Header row 1 holds the section name in the sticky corner and one tinted band per group.
  - Header row 2 holds the column labels plus a TOTAL column per group.
  - The day column is sticky. The footer TOTAL row is gray, with a larger grand total per group.
- Band colors come from `groupTones.ts` (red losses, positive inflows, orange outflows,
  amber/yellow consumption, blue production, indigo deliveries, teal measurements). These are
  data categories, so this file is the one place allowed to name hues.
- Cells: a value with a dotted underline is clickable to edit. An empty "–" turns brand-colored
  on row hover and is clickable to create. Warnings use `cellTone` (red). A running balance goes
  in `extraColumn` (SALDOS, "Ant:" opening value, red background when negative).
- Grids are always compact (`text-xs`, `px-1.5 py-1`) and scroll horizontally inside the card.

## States

```tsx
if (loading) return <LoadingState label="Cargando ventas…" />;
if (error) return <ErrorState message={error} onRetry={cargar} />;
if (!rows.length) return <EmptyState title="Sin ventas" description="…" />;
```

`size`: `md` (page section), `sm` (inside a card/modal), `fill` (centers in a box you size,
e.g. `className="h-48"`). Inline hints, such as a select's "Cargando…" option or a button
caption, stay as text. Distinguish "no data yet" from "nothing matches the filters" in the
EmptyState copy.

## Text

Use the roles in `components/ui/typography.ts`:

| Role | Use for | Style |
|---|---|---|
| `text.page` | page title (PageHeader renders it) | 20/24px bold |
| `text.section` | card / section heading | 14px bold |
| `text.overline` | KPI labels, group titles | 10px bold uppercase, tracking-wider |
| `text.body` | running text | 14px zinc-700 |
| `text.muted` | descriptions, subtitles | 12px zinc-500 |
| `text.hint` | counters, timestamps, hints | 11px zinc-400 |
| `text.number` | numbers in columns | tabular-nums |
| `text.code` | codes, IDs | mono 12px |

The small scale below `text-xs` is `text-2xs` (11px), `3xs` (10px), `4xs` (9px) and `5xs` (8px).
No arbitrary `text-[Npx]` **(lint)**. UI copy is Spanish: sentence case, no trailing period on
labels and buttons.

## Tokens

Defined in `app/globals.css` and mirrored for MUI and charts in `app/lib/design-tokens.ts`.

- **Brand**: `brand-50 … brand-950`, the one palette that carries the project's hue (BRAND block).
  Semantic aliases: `bg-primary` / `hover:bg-primary-hover` / `active:bg-primary-active`
  (brand-600/700/800), `bg-primary-soft`.
- **Status**: `danger` (red-600), `warning` (amber-500), `accent` (blue-600, external-system actions).
  Success messages use brand. Neutrals are always **zinc**.
- **Radius roles**: `rounded-control` (inputs, buttons, 12px), `rounded-card` (cards, panels,
  tables, 16px), `rounded-dialog` (24px).
- **Dark mode**: a `dark` class on `<html>`, toggled by `ThemeToggle` and applied before paint by
  the script in `layout.tsx`. Every light color class needs its `dark:` pair. Surfaces are white
  → `zinc-950`, borders `zinc-200` → `zinc-800`, body text `zinc-700` → `zinc-200`. Never put
  two conflicting `dark:` classes for the same property on one element.

## Rebranding a new project

1. `app/globals.css` → BRAND block: replace `emerald` with the new Tailwind hue (or literal hex
   values) in the 11 `--color-brand-*` lines, and adjust `--color-accent*` if needed.
2. `app/lib/design-tokens.ts` → same hues as hex (MUI's palette and charts read these).
3. `app/config/brand.ts` → name, tagline, logo path, credits. Replace `public/logo.svg`.
4. `app/lib/utils/number-format.ts` → `NUMBER_LOCALE`, `CURRENCY_PREFIX`. `date-format.ts` → `DATE_LOCALE`.

Nothing else should need to change. If something does, it's hard-coding a hue and should move to a token.

## Number and date formats

Numbers show as `1,234.50` (`NUMBER_LOCALE = "en-US"`) and dates as `15/10/2026`
(`DATE_LOCALE = "es-BO"`), independent of the browser's language. `formatNumber(null)` returns
`""`, so `formatNumber(x) || "—"` shows a dash for missing values. Machine dates use
`toLocaleDateString("en-CA")` → `YYYY-MM-DD`.
