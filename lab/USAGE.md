# Using the lab

How this fits your actual working day. `README.md` is the quick reference; this
is the method.

---

## The loop

```
idea  →  preview in lab/  →  looks right?  →  paste into .hbs  →  check in Ghost
                 ↑                  ↓ no
                 └──── fix, or fix the design system ────┘
```

The point of the middle step: a `.hbs` can only be judged inside Ghost, with a
restart, with real content, with everything else on the page arguing with it. A
lab page has none of that. You see the component and nothing else, at four
widths, in both themes, in about a second.

## Starting a session

```bash
npm run dev
```

Three things come up: Tailwind watching CSS, browser-sync proxying Ghost on
**:3000**, and the lab on **:3002**. Keep :3002 open on the second screen while
you work. Edit CSS in `~/Projects/Creator-Design-System` → Tailwind rebuilds →
the lab reloads. No restart, no Ghost.

Only need the lab: `npm run lab`.

## Building a component

**1. Copy the template.**

```bash
cp lab/_template.html lab/timeline.html
```

Set `<body data-lab="timeline.html">` — that's how the toolbar finds its entry —
and add a line to `lab/_pages.json`:

```json
{ "file": "timeline.html", "title": "Timeline", "note": "Year rail, fill on scroll.", "status": "wip" }
```

`status` is just a label on the index card: `wip`, `done`, `ref`. Use it to see
at a glance what's still open.

**2. Write real markup, not preview markup.**

Everything inside `#lab-canvas` is what you will paste into the template. So:

- Design system classes only (`INVENTORY.md` in the skill folder is the full
  list). No `lab-*` classes in there — those belong to the toolbar.
- Ghost-shaped structure: `<article>` for a card, `<a class="c__link">` for the
  title link, `aria-current` for the active row.
- Dummy content in the house style: “Project Name — 1”, “Episode 4”, “Trip — 2”.
- Notes go **outside** the canvas, in the `.lab-spec` block at the bottom.

**3. Use the toolbar.**

| Control | What it's for |
|---|---|
| `phone / tablet / laptop / full` | The four widths that matter. Check the one you *don't* design in. |
| `outline` | Boxes every element — finds the wrapper you forgot to delete. |
| `theme` | Light ↔ dark. A component that only works in one is not finished. |
| `copy markup` | Copies the canvas contents to the clipboard, ready to paste. |

**4. Promote it.**

Hit **copy markup**, paste into the `.hbs`, then swap the dummy values for
Handlebars:

| Lab | Template |
|---|---|
| `href="#"` | `href="{{url}}"` |
| `Episode Name — 4` | `{{title}}` |
| a repeated block | `{{#foreach posts}} … {{/foreach}}` |
| an inline `<svg class="icon">` | keep it — the sprite is already in `default.hbs` |
| a hardcoded list of links | `{{navigation}}` or a `{{#get}}` block |

Then reload :3000 to see it with real content. **New `.hbs` files need a Ghost
restart** — the template map is cached.

Leave the lab page in place afterwards. It becomes the reference for what the
component is supposed to look like when something later breaks it.

---

## The decision the lab exists to force

While previewing you will want a thing the system doesn't have. There are only
two honest answers:

**It's a new arrangement of existing parts** → it lives in the lab and then the
template. The recruiter block is this: `.stats` + `.chip` + `.c-experience`
placed differently. No CSS was written.

**It's a new appearance** → it lives in
`~/Projects/Creator-Design-System/src/`, not here. Add it to the right layer,
add a `docs/<name>.html` page, then `npm run build:css` in the theme and try it
in the lab. The episode preview is this: nothing fit the 24rem rail it needed,
so `.grid-rail-wide` was added to the system's layout layer.

What must never happen is the third answer — a pile of Tailwind utilities in a
template that describes what something looks like. That's how a design system
stops being one.

---

## Gotchas

**CSS edits need the watcher.** The lab reads `assets/built/screen.css`, not the
source. If `npm run dev:css` isn't running, nothing you change in the design
system shows up. One-off: `npm run build:css`.

**A brand-new Tailwind utility works in the lab** because `lab/**/*.html` is in
`tailwind.config.js` `content`. That's deliberate — but it also means a utility
you only ever used in a preview ships in `screen.css`. Prefer system classes.

**The icon sprite is fetched, not inlined.** `_lab.js` reads
`partials/icons.hbs` at runtime, so icons only work over the server
(`npm run lab`), never by double-clicking the file. Available glyphs:
`i-play i-search i-arrow i-mail i-sun i-moon i-pen i-camera i-code i-book
i-plane i-clock i-tag i-github i-heart i-bag`.

**The theme's JS runs.** `nav.js` and `main.js` are injected, so scroll states,
the nav panel and the theme toggle behave exactly as on the site. If a preview
does something strange, it's the real behaviour — worth knowing now rather than
after it ships.

**The toolbar is pinned to the bottom** so a sticky navbar has the top of the
viewport to itself.

**`lab/` never ships.** It's excluded from `npm run zip`, and gscan doesn't look
at it.

---

## What's in there now

| Page | Backlog item it's working on |
|---|---|
| `navbar.html` | The five scroll behaviours, side by side |
| `recruiter.html` | “Portfolio section for recruiters… CTA to resume” |
| `products.html` | “Products-I-use: smaller cards + fixed sidebar panel filtering by #group-*” |
| `episode.html` | “Episode page: full width, episode list on the RIGHT” |

Good next candidates from the backlog, in rough order of how much the lab helps:
the timeline rail (heavy motion), the trip/travel overview, the course page
without curriculum in the sidebar, the lesson player, and the 404.
