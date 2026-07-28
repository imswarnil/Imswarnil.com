---
name: design-system
description: The Creator Design System (Frame & Signal) that this Ghost theme is built on — its tokens, layers, component classes, and the rules for consuming or extending it. Use whenever writing or editing CSS, adding/changing a .hbs template's markup or classes, picking a colour/spacing/radius/font value, styling a new page or component, or deciding whether something belongs in the theme vs the design system. Also use when asked what the design system provides or where a class comes from.
---

# Creator Design System — how this theme uses it

The theme does **not** own its styling. `creator-design-system` does. This skill
is the live view into that system so nothing gets reinvented here.

## Step 1 — refresh, always

Run this first, every time the skill is invoked:

```bash
node .claude/skills/design-system/sync.mjs --if-stale
```

It rewrites `INVENTORY.md` from the DS source only when the DS has actually
changed (git HEAD or file mtimes), so it's near-free. Anything Swarnil adds to
the design system shows up here on the next run — the inventory is generated,
never hand-edited.

## Step 2 — read the inventory

`.claude/skills/design-system/INVENTORY.md` (generated, in this folder) lists
**every token and every class the system defines**, grouped by layer and source
file. Treat it as the closed set:

> If a class or token isn't in the inventory, it does not exist. Add it to the
> design system — do not invent an equivalent inside the theme.

For real markup examples of any component, read the matching doc page in the DS
repo: `<DS>/docs/<name>.html` (e.g. `card.html`, `navbar.html`, `hero.html`).
The doc pages are also live at https://creator.imswarnil.com.

## Step 3 — build it in the lab first

`lab/` is this theme's preview surface: plain HTML pages that load the theme's
own `assets/built/screen.css`, the same icon sprite and the same `nav.js` /
`main.js`. A new component or a reworked section gets designed there and only
then becomes a `.hbs`.

```bash
npm run lab      # http://localhost:3002/lab/  (also runs inside npm run dev)
```

`lab/USAGE.md` is the full method — read it before adding or promoting a preview.

- Add a preview: copy `lab/_template.html`, set `<body data-lab="…">`, add an
  entry to `lab/_pages.json`.
- Markup inside `#lab-canvas` must be the real thing — DS classes, Ghost-shaped
  structure, no `lab-*`. The toolbar's **copy markup** copies that block for
  pasting into a template.
- `lab/_lab.css` and `lab/_lab.js` are the toolbar's only. They must never style
  anything inside the canvas.
- `lab/` is excluded from `npm run zip`, and `lab/**/*.html` is in Tailwind's
  `content` so a utility works while prototyping.

## Where it lives

- Source of truth: `~/Projects/Creator-Design-System` (its own git repo, **not**
  part of this theme — never copy it in; reference it)
- Linked into this theme as `creator-design-system: file:../../../../Projects/Creator-Design-System`,
  so `node_modules/creator-design-system` is a symlink — edits in the DS repo are
  visible here immediately, no reinstall.
- Rebuilding the DS's own dist/docs: `npm run build` **in the DS repo**. The theme
  imports `src/`, not `dist/`, so a DS source edit needs only the theme's
  `npm run build:css`.

## The layer model

The DS ships six layers; the theme's `assets/css/` mirrors them one-to-one.

| DS layer | DS path | Theme file |
|---|---|---|
| 1 Foundation — tokens, reset, type, space, motion, frames, logo, icons | `src/1-foundation/` | `assets/css/0-foundation/tokens.css` |
| 2 Elements — text, badge, table, indicator, syntax | `src/2-elements/` | `assets/css/1-element/index.css` |
| 3 Components — button, form, card, collection, nav, navbar, media, feedback, editorial, content | `src/3-components/` | `assets/css/2-components/index.css` |
| 4 Broadcast — YouTube/Instagram/channel art | `src/4-broadcast/` | **not imported** — ships to platforms, not the site |
| 5 Sections — header, hero, stats, CTA, footer | `src/5-sections/` | `assets/css/3-sections/index.css` |
| 6 Utilities — `u-*` helpers | `src/6-utilities/` | `assets/css/4-utilities/index.css` |

Entry point and ordering: `assets/css/tailwind.css` → built to `assets/built/screen.css`
via `npm run build:css`.

JS the DS ships: `src/highlight.js` (own syntax highlighter), `src/nav.js`.

## Rules that govern edits here

1. **The design system is the styling. Tailwind is utilities only** — a one-off
   flex row or spacing override in a template. Never use Tailwind to define what
   a thing *looks like*.
2. **Templates carry no CSS.** No `<style>` blocks, no appearance-defining class
   piles in `.hbs`. A template that needs a new look needs a DS component.
3. **No new raw values in the theme** — no hex colours, no invented radii,
   durations, or font sizes. Everything is `var(--token)`. If the ladder is
   missing a rung, fix the ladder in the DS.
4. **Theme-level tokens are the one exception**, and only for things the DS can't
   know: nav height, header offsets, reading-column width, Ghost card widths.
   They live in `assets/css/0-foundation/tokens.css` and are themselves composed
   from DS tokens. Note `--w-site` / `--gutter` there stay the single source of
   horizontal rhythm (see CLAUDE.md).
5. **Adding a component:** write it in the DS repo (`src/3-components/NN-name.css`,
   wired through that layer's `index.css`), add a `docs/<name>.html` page, then
   `npm run build:css` here and try it in `lab/`. Re-run the sync so the
   inventory picks it up.
6. **State lives in ARIA** (`aria-expanded`, `aria-current`, `[open]`), not in
   `.is-*` classes — the DS styles off the accessibility tree on purpose.
7. **Light and dark come from the same variables.** Never write a dark-mode-only
   colour; set the token.

## Design intent (so extensions match)

"Frame & Signal": almost monochrome, so one colour can mean something. A 14-step
`--ink-*` ramp does the whole site; `--signal-*` is rationed to mean *live, now,
here*. Three faces, three jobs — Space Grotesk (display), Inter (body),
IBM Plex Mono (labels/code). One spacing ladder, one radius set. Plain CSS,
no runtime, platform-first (`<details>`, `<dialog>`, Popover API, native inputs).

## Related

- `DESIGN-SYSTEM.md` at the theme root — theme-side notes.
- `CLAUDE.md` — theme working notes, the 20-setting cap, widths rule, backlog.
