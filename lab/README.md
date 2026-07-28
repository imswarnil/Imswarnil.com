# lab/

Where a component gets designed before it becomes a `.hbs`.
**The full guide is [USAGE.md](./USAGE.md)** — this file is the quick reference.

Plain HTML files that load the theme's **own** `assets/built/screen.css`. No
second build, no postcss, no docs generator — if it looks right in the lab it
looks right on the site, because it is literally the same stylesheet, the same
icon sprite (`partials/icons.hbs`) and the same `assets/js/nav.js` + `main.js`.

The design system itself lives at `~/Projects/Creator-Design-System` and is not
part of this repo. The lab is the theme side: previewing and composing what the
system already provides.

## Run it

```bash
npm run lab      # lab only  → http://localhost:3002/lab/
npm run dev      # Tailwind watch + Ghost proxy + lab, all three
```

Both watch `assets/built/screen.css` and `lab/**`, so a CSS edit or a markup
edit reloads the page.

`npm run dev:css` must be running (it is, inside `npm run dev`) for CSS edits to
reach the lab — the lab reads the built file, not the source.

## Add a preview

1. `cp lab/_template.html lab/thing.html`
2. Set `<body data-lab="thing.html">` to the new filename.
3. Add an entry to `lab/_pages.json` — that's what the index and the toolbar read.

## The rules it exists to enforce

- Markup inside `#lab-canvas` is the **real** markup. Design system classes and
  Ghost-shaped structure only — no `lab-*` classes, no one-off inline styling
  beyond what you'd genuinely ship. **copy markup** in the toolbar copies exactly
  that block, ready to paste into a template.
- Need something the system doesn't have? It gets built in
  `~/Projects/Creator-Design-System`, not here. Then `npm run build:css` and the
  lab picks it up.
- `_lab.css` / `_lab.js` are the toolbar's, and only the toolbar's. Nothing in
  them may style the canvas.

## Not shipped

`lab/` is excluded from `npm run zip`, so it never reaches Ghost.
