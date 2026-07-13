# lala.md — how to verify this session's changes

Session date: **2026-07-13**. This is a step-by-step guide to validate everything
we changed. Work top-to-bottom; each section says **what changed**, **how to
check it**, and **what "good" looks like**.

## 0. Build & static validation (do this first)

```bash
npm run build          # compiles assets/built/screen.css
npx gscan .            # Ghost theme validation
node --check assets/built/main.js   # main.js is hand-authored source — syntax check
```

**Expected:** `✓ Your theme is compatible with Ghost 6.x`, no errors/warnings;
`main.js OK` (no output from node --check = pass).

Then boot local Ghost and upload routes:

```bash
# Ghost running at http://localhost:2368
# Ghost Admin → Settings → Labs → Routes → upload routes.yaml
# (restart Ghost after adding new .hbs files — templates map is cached)
```

---

## 1. Modular demo content (`dummy-content/`)

**What changed:** root `import.json` / `courses-import.json` / `creator-import.json`
were deleted and replaced by one importable Ghost file per module in
`dummy-content/`.

**How to check:**
1. `ls dummy-content/` → 12 JSON files + `README.md`.
2. Each file is valid JSON: `for f in dummy-content/*.json; do python3 -c "import json,sys; json.load(open('$f'))" && echo "OK $f"; done`
3. In Ghost Admin → **Settings → Import/Export → Import**, import
   `navigation.json`, then `course.json` **and** `lesson.json` together, then any
   others you want (`video.json`, `docs.json`, …).

**Good:** import reports no errors; after importing course + lesson, open a course
at `/courses/<slug>/` and confirm its lessons appear and each lesson page resolves
under `/courses/<course>/<lesson>/`. Nav menu (from `navigation.json`) shows the
primary + secondary items.

---

## 2. `/docs` documentation module

**What changed:** new `#docs` content type, `dummy-content/docs.json`, `/docs/`
route, `docs.hbs`, `partials/post/doc.hbs`, sidebar partials, dispatcher + nav icon.

**How to check (after importing `docs.json`):**
1. Visit `/docs/` → header + a grid of 5 section cards + (desktop) a sticky
   left sidebar.
2. Click any doc → single-doc page: left grouped sidebar (current page
   highlighted), center content, right "On this page" TOC (populates from the
   doc's headings), and Prev/Next at the bottom that walk the whole doc set.
3. On mobile: sidebar collapses into an "All documentation" dropdown.
4. "Docs" appears in the nav with a book icon (once `navigation.json` is imported).

**Good:** sections are grouped correctly, active page is highlighted, TOC links
scroll to headings, Prev/Next never leave the docs.

---

## 3. First-load preloader removed

**What changed:** the Netflix-"tudum" intro overlay is gone.

**How to check:**
1. Open a fresh session (new private window) and load the homepage.
2. **Good:** the site paints immediately — no full-screen title-card overlay, no
   "tudum" sound, no fade-in lock. Navbar + hero are visible on first paint.
3. Regression check: theme-switch **sounds still work** — cycle theme modes
   (the mode toggle) and confirm the per-mode ticks/pops still play (the audio
   helpers were intentionally kept).
4. `grep -rn "intro-playing\|components/intro" *.hbs partials assets/css` → no hits.

---

## 4. Lazy-loading + skeleton placeholders

**What changed:** `main.js` gives every content image a shimmer placeholder and
`loading="lazy"`; below-the-fold homepage sections use `content-visibility:auto`.

**How to check:**
1. Homepage / any collection: throttle the network (DevTools → Network → Slow 3G)
   and reload. **Good:** image slots show a shimmering grey placeholder, then the
   photo fades in when it decodes.
2. Inspect a card image → it has `loading="lazy"`, `decoding="async"`, and class
   `img-skel` (plus `is-loaded` once loaded).
3. Chrome images (logo/nav/footer brand) and tiny icons are **not** shimmered.
4. Reduced motion: enable "Reduce motion" in the OS → shimmer animation stops
   (placeholder still shows, just static).

---

## 5. 404 page

**What changed:** fixed dead `bg-dots` backdrop, added cursor parallax +
searchlight, randomized headline, more excuses.

**How to check:** visit any non-existent URL, e.g. `/this-page-does-not-exist/`.
**Good:** dotted backdrop with corner fade; moving the mouse tilts the illustration
+ moves a soft accent "searchlight"; the excuse line rotates every few seconds; the
headline varies per load. Touch / reduced-motion: no parallax, page still fine.

---

## 6. Hero grid corner-fade

**What changed:** hero background grid now uses `fade-mask-corners`.

**How to check:** homepage hero. **Good:** grid lines are densest in the center and
gradient away toward all four corners (not just the top-right as before).

---

## 7. Subscribe / notification (bell) panel

**What changed:** the bell modal is wider and constrained to the viewport.

**How to check:** click the **bell icon** in the navbar (or footer/hero).
**Good:** the panel opens wider (`max-w-3xl`), is vertically centered, and never
runs off-screen — if content is tall, the panel itself scrolls. Test on a short
window and on mobile.

---

## 8. Final sign-off

- [ ] `npm run build` clean, `npx gscan .` compatible, `node --check` passes
- [ ] Demo modules import without errors; courses↔lessons link up
- [ ] `/docs/` and a single doc page render with working sidebar/TOC/prev-next
- [ ] No preloader on first load; theme-switch sounds still work
- [ ] Images shimmer-then-load; homepage scrolls smoothly
- [ ] 404, hero grid, and bell modal all look right
