# Theme update log

Running record of what's done and what's left. Master backlog lives in CLAUDE.md.

## 2026-07-28 — course and lesson, on the system's course collection

### The course page (`partials/post/course.hbs`)
Hero over the feature image (lessons · level · last updated), then the course's
own words, then **the curriculum in the main column** — never the rail, which
the backlog is explicit about. The rail carries the ask: start lesson one, who
teaches it, and the gear the course was made with. A certificate band closes
the page.

### The lesson page (`partials/post/lesson.hbs`)
A real player. Video stage left, **playlist on the right**, a stage bar under
the video with previous / next / mark-complete, and the lesson itself below in
two tabs — Overview and Notes. A tab strip with one tab would be a costume, so
there are exactly two real panels.

Behaviour is the system's `collection.js` (vendored by `npm run build:js`):
`M` marks complete, `N`/`P` move, the progress bar and every module count
redraw from the ticked rows. Nothing is stored — Ghost has no per-member lesson
progress, and localStorage would be a persistence trick pretending to be a
feature. Verified: mark complete → "Completed", 1 of 50, 2%.

### `dummy-content/course-lesson.json` — with the helper tags
2 courses, 16 lessons, 13 tags. Courses **and** their lessons in one file, so
there is no cross-file import order to remember.

| Helper | What it does |
| --- | --- |
| `#module-01` … `#module-04` | groups lessons; the **description** carries the name ("Foundations"), because a slug that sorts beats a slug that reads and Handlebars cannot slice a string |
| `#level-beginner` / `-intermediate` / `-advanced` | the hero's level cell (the existing Java demo already used this one) |
| `#free` | a lesson that is a free preview — shows a Free chip in the curriculum |
| `#track-craft` | the family a course belongs to; the description names it |

Both layouts **degrade**: no `#module-*` tags means one flat list, which is why
the existing 50-lesson Java course still renders correctly.

### Ghost things worth remembering
- **`@root.post` resolves at any depth** — `../` counts a different number of
  levels per branch, and inside three nested `{{#get}}` blocks that is
  unmaintainable. Measured: `../` reaches the get's own context, `../../` the
  post.
- **…but gscan rejects `@root` as a helper *argument*.** It is fine inside a
  filter string, and an error inside `{{#match id @root.post.id}}`. So marking
  the current row in the playlist moved to main.js, which compares paths — and
  runs before collection.js, which reads the same `aria-current`.
- `{{#get}}` renders its block even with zero results, so `{{#if}}` inside it
  is the way to branch.

### One bug in the system
`.col-hero__art` assumed drawn art, which is dark by construction. Over an
uploaded photograph the headline was legible only on whichever half of the
picture happened to be dark. There is a scrim now — and it sits at `z-index: 0`
rather than `-1`, because two negative children paint in DOM order and the art
comes second, so a scrim at `-1` would have been a scrim *under* the picture.

## 2026-07-28 — real travel demo data, and a homepage that breathes

### `dummy-content/travel.json` — Vienna, Austria, central Europe
Rewritten from "Trip Name — 1" to somewhere that exists. 4 trips, 12 stories,
23 tags:

- **Trips**: Vienna in Winter · Austria by Rail · Three Capitals · Goa, Off Season
- **Regions** `#region-europe`, `#region-asia` — a level this theme did not
  have before
- **Countries** `#country-austria`, `-czechia`, `-hungary`, `-india`
- **Cities** `#city-vienna`, `-salzburg`, `-hallstatt`, `-prague`, `-budapest`,
  `-goa` — also new
- **Kinds** `#travel-category-city`, `-food`, `-mountains`, `-museum`, `-beach`

Every story's primary tag is its trip's public tag, so the permalinks come out
as `/travel/vienna-in-winter/kaffeehaus-rules/`. Validated before shipping: no
orphan `posts_tags`, no duplicate ids or slugs, every primary tag public, every
mobiledoc parses.

**Importing**: Ghost Admin → Settings → Import. The old demo trips
(`trip-name-1`…) have different slugs and will survive the import — delete them
first if you want only the new set.

### /travel now has all three levels
- The top row is **regions** when `#region-*` tags exist and **countries** when
  they do not, so the page works before and after the import without a second
  template.
- A **Cities** row appears the moment `#city-*` tags do. Each chip belongs to
  the trip that went there, which is both its link and — for the filters — its
  parent. No tags, no section: absent rather than empty.

### Homepage
- **The headline was 112px** and ran to six lines in a half-width column; the
  eye had to re-find the left edge on every one of them. A split hero now takes
  the next step down the scale with a measure in `ch`: **60px, three lines**,
  and the whole hero fits above the fold (627px → 471px).
- **Two sections together produced a 192px hole** — 96px of bottom padding
  meeting 96px of top. Neighbouring sections now drop the leading padding, so
  the rhythm between them is one section's worth rather than two. The page went
  from 3510px to 2827px without losing anything. `.section-standalone` puts the
  padding back for a section that paints its own surface.

Both fixes are in the design system, so every page gets them: /travel tightened
up the same way.

## 2026-07-28 — /travel rebuilt on the system's travel collection

`travel.hbs` was a page header and a generic list. It is now the design
system's travel collection (Creator-Design-System → `collection/travel`),
wired to this site's tags.

### How the system's vocabulary maps onto Ghost
| system | here | tag |
| --- | --- | --- |
| group (region) | country | `#country-*` |
| place (country) | **trip** | a post tagged `#trip` |
| facet | kind of trip, or country | `#travel-category-*`, `#country-*` |
| post | travel story | `#travel` |

The system's third level — cities — has no tag in this theme, so that row is
left out rather than filled with invented data.

### Done
- **The hero**: the globe turning, the flight line drawing itself, the palm
  leaning in (`partials/util/travel-art.hbs`, decoration only — aria-hidden and
  dead under `prefers-reduced-motion`), over the counts, the search and a jump
  to the latest trip. Search opens Ghost's own search (`data-ghost-search`)
  rather than pretending to be a second index.
- **Filtering that actually narrows**: pick a country and the trips and the
  stories both follow; tick a kind of trip and everything narrows again. It is
  `assets/js/collection.js` from the system, vendored by `npm run build:js`,
  reading `data-group` / `data-of` / `data-region` / `data-tags`. With JS
  blocked every list shows in full — the right fallback for a page whose job is
  listing places.
- **Trips, latest trip and every story** as the system's `col-place`,
  `col-series` and `col-post-row`, with real feature images (and the system's
  placeholder where a post has none).
- **CSS**: `collection.css` + `travel.css` imported into `2-components`.

### Ghost things worth remembering
- **`{{#foreach}}` skips internal tags** unless you say `visibility="all"`.
  Every country and category tag here is internal, so the lists rendered empty
  until that was added — silently, with no error.
- **`{{#get "tags"}}` needs `visibility="all"` too**, or it returns nothing
  while `pagination.total` still reports a number.
- **`count.posts:>0` is not a usable filter** on tags. Not needed either: Ghost
  already omits a tag no post carries — which is why the hero counts read
  `{{countries.length}}` rather than `pagination.total`, or it would claim a
  country I have never posted from.
- **Handlebars cannot slice a string**, so `#country-hungary` is trimmed to
  "Hungary" in main.js via `data-trim`. Worst case the script never runs and
  the raw tag shows — ugly, still true.

### Two bugs fixed in the system
- **`.col-place__media > *` stretched the corner chip** to the full size of the
  card, since the chip is absolutely positioned and got `width/height: 100%`.
  Now `:not(.col-place__tag)`.
- **The filter crumb printed raw facet ids** ("hash-travel-category-beach").
  `collection.js` now reads the label back off the checkbox, so it says
  "India → Beach". It also accepts a **list** in `data-of` / `data-region` — a
  trip can cross a border, and here a post carries all its internal tags at
  once.

## 2026-07-27 (phase 5d) — nothing at the top

At rest the default bar is now **fully transparent, full width**: no surface,
no blur, no hairline, no progress line — just the links sitting over the page.
Everything the island is made of (background, blur, border, radius, shadow and
the progress ring) fades in together over `--dur-4` as the page moves, so the
island assembles itself rather than a divider appearing first.

Verified at rest: shell and bar backgrounds `rgba(0,0,0,0)`, border width 0,
progress ring `opacity: 0`.

## 2026-07-27 (phase 5c) — flat means flat

- **No border in the full-width states.** The island earns its outline by
  floating; a bar that fills the window does not, and a full-bleed hairline is
  just a seam across the page. `.nav-shell-full` now carries `border: 0`, and
  the morph bar has no hairline at rest either. The background does the
  separating.
- **The progress border follows suit.** A masked ring makes sense around an
  island, but across a flat bar it would draw a rectangle over the whole window
  — a border where the design asked for none. Flat, the same gradient collapses
  to one line along the bottom edge: still the border, still the progress, no
  box.
- **The island's own width is untouched** — 1200px, contents at x=189, exactly
  where the full-width bar puts them. Measured in both states.

## 2026-07-27 (phase 5b) — the island moves, the logo doesn't

The first cut of the morph slid the wordmark and the controls inwards by ~21px
as the bar contracted, which reads as the whole bar shuffling rather than an
island forming.

The alignment padding now lives on the **shell**, which gives up exactly one
gutter on scroll, while the **bar** takes the same gutter back. The sum is
constant at every frame of the transition, so the contents hold one x and only
the island — its surface, its edges, its shadow — animates. At rest the shell
is the surface (full-bleed, blurred); once scrolled the surface hands over to
the bar as a pill. Both are addressed through `:is(… > .nav-bar, … > .nav-stack
> .nav-bar)` so the rules survive the second row.

## 2026-07-27 (phase 5) — the bar picks its own behaviour

### Done
- **The submenu row is gone.** On a lesson it was rendering as a broken strip
  above the page ("← CourseLesson Java ✕") outside the island. `nav/context.hbs`
  and `nav/context-pick.hbs` are deleted and the call is out of `nav/bar.hbs`;
  the bar now holds exactly two rows, the menu and the panel.
- **Four behaviours, one setting.** Ghost Admin → Design → Site-wide → **Navbar
  style**:
  - *Full width, island on scroll* (**default**) — a plain bar across the page
    at rest that draws itself into the island once you move
  - *Full width* — sticky, always the same
  - *Full width, hides on scroll down* — leaves going down, returns going up
  - *Island* — the floating pill from the first pixel
- **A post or page overrides it** with `#navbar-normal`, `#navbar-island`,
  `#navbar-morph`, `#navbar-reveal` or `#navbar-fixed`. The tag always wins;
  `partials/nav/chosen.hbs` holds the site-wide choice so navbar.hbs doesn't
  repeat it on both branches.
- **`navbar_style` is the theme's second custom setting** (of Ghost's 20). The
  first is `color_scheme`.

### Four bugs in the system, all found by wiring this up
- **`.nav-progress` re-declared `position: relative` on the shell**, which
  overrode `.nav-shell`'s `sticky` — the navbar scrolled away with the page on
  every variant. The shell is always positioned already; the declaration is
  deleted.
- **Everything addressed as `> .nav-bar` had stopped matching**: the bar moved
  inside `.nav-stack` when the island grew a second row, so the morph variant
  and the progress border were both silently half-applied. Those rules now use
  `:is(… > .nav-bar, … > .nav-stack > .nav-bar)`.
- **"Full width" was constraining the whole bar**, so its hairline stopped
  1200px in and it read as an island with square corners. The surface now goes
  edge to edge and only the contents are pulled in, with
  `padding-inline: max(var(--gutter), calc((100% - var(--w-site)) / 2))`.
- **`.nav-shell-auto` is `fixed`**, which takes the bar out of the flow and
  hides the first screenful underneath it. Added **`.nav-shell-reveal`**: the
  same hide-on-the-way-down behaviour, sticky, so no spacer is needed. That is
  what the "hides on scroll down" setting uses.

## 2026-07-27 (phase 4) — one way into everything

### Done
- **The last two dropdowns are gone.** `partials/navigation.hbs` still had
  `{{> nav/submenu}}` calls for Web series and Projects; both are deleted, so
  every bar link is now a plain link with no exceptions. Ghost had also cached
  the already-deleted partial — a `ghost restart` was needed before the change
  showed. Verified in the browser: 0 carets, 0 submenu nodes.
- **The burger sits at the end of the menu, at every width**, and it opens the
  full panel. The nine-dot app-grid button is deleted — two controls for one
  menu was one too many. New system class: `.nav-collapse .nav-burger-pinned`
  keeps it visible where the collapse rules would otherwise hide it.
- **The panel can no longer run off the screen.** `.nav-panel__in` is capped at
  `calc(100dvh - var(--nav-h) - var(--space-10))` and scrolls inside itself
  with `overscroll-behavior: contain`. Measured open: island bottom 744px in a
  771px viewport.
- **Two columns of links** (`.nav-panel__links-split`, ≥48rem) so all fourteen
  destinations are on screen at once instead of behind a scroll.
- **Subscribe lives in the panel**, in a sunken aside next to the latest post:
  a line about what the email is, an input and the button (`.nav-panel__aside`,
  `.nav-panel__cta`).

### Two more bugs in the system
- **The panel would not open at all.** `nav.js` set `data-open` on the nearest
  `.nav-shell`, but the CSS only reacted to `.nav-shell[data-open] > .nav-panel`
  — and in a multi-row island the panel is a row of the **stack**, not the
  shell, so the child combinator could never match. `nav.js` now targets
  `.nav-stack` first and falls back to the shell; the CSS lists both parents
  explicitly (a descendant selector would let an outer island open an inner
  one's panel).
- **Panel labels drifted to the far right.** `.nav-panel__link` is
  `space-between` — it expects label-left, meta-right — so leading with an icon
  pushed the text away from it. Icon and label are now wrapped together in
  `.nav-panel__name`, which also gives the active row a coloured icon.

## 2026-07-27 (phase 3) — the theme now uses the SYSTEM's navbar module

The design system's Navbar page had moved well past what the theme was doing.
The theme was rebuilt against it rather than the other way round.

### Done
- **Collection dropdowns are gone.** A dropdown listing six posts is a partial
  feed pretending to be navigation. Every bar link is now a plain link; where
  you are *inside* something is the submenu row's job, and everything the site
  publishes is the panel's job.
- **`.nav-stack`** — one island holding up to three rows: the site menu
  (always), the submenu row (only inside a container), and the in-place panel.
  **The site menu is never swapped out any more**, so the way out is always
  where the reader left it.
- **The submenu row** (`nav/context.hbs`) is one design with knobs, not a class
  per collection: `data-tone` (paper · ink), `data-density`, `--pos-prefix`
  ('DAY ', 'EP.'), `--value`. `nav/context-pick.hbs` chooses it with the same
  most-specific-first order as post.hbs.
- **Behaviour is the system's `nav.js`**, vendored to `assets/js/nav.js` by a
  new `npm run build:js` and loaded before main.js. Scroll state, hover intent,
  the panel and the row's hide/show are all its job; main.js keeps only the
  Ghost-shaped parts (active-link prefix matching, the six-item overflow,
  reading progress).
- **The border IS the progress bar** — `.nav-progress` on the shell, painted
  from `--progress`. No second strip under the bar.
- **`.nav-panel`** is the mobile/app-grid menu: the island grows in place and
  nothing covers the page. The centred modal and the full-screen sheet are
  deleted.
- **`.nav-burger-rec`** — the record light unfolding into a play head.
- **Variants are now four positions**, not ten skins: island (default) ·
  `#navbar-fixed` · `#navbar-morph` · `#navbar-auto`. Shape and alignment are
  decided once in `nav/bar.hbs`.

### Two bugs found — one mine, one in the system
- **Mine:** I had earlier added a `.nav-progress` that was an absolutely
  positioned *child element*; the system later defined `.nav-progress` as a
  *shell modifier*. Both were in the same file, mine last — so the shell
  collapsed to 2px and **the entire navbar vanished**. My version is deleted;
  the documented one stands.
- **In the system:** `.nav-panel { grid-template-rows: 0fr }` leaves the
  track's *minimum* at `auto`, and `min-height: 0` only zeroes the content
  box — so the panel's own 40px of padding stayed on screen while closed.
  Now `minmax(0, 0fr)` / `minmax(0, 1fr)`, and it collapses to nothing.
- Also fixed: `{{#post}}` nested inside `{{#post}}` made Handlebars silently
  discard the submenu row. The partial is called unwrapped — on non-post pages
  its tag tests simply never match.

## 2026-07-27 (phase 2e) — the bar, arranged

### Done
- **Links are centred**, mark left, controls right (`.nav-bar-center`, a
  3-column grid whose side columns can shrink to zero).
- **Six items max, and it now actually fits.** `main.js` caps the bar at six
  and then keeps stowing from the end until the row fits, so a long menu
  becomes "More" instead of wrapping the Subscribe button onto a second line.
- **Real submenus, only where they mean something.** Courses · Web series ·
  Projects · Travel list what is *inside* them, fetched live via
  `partials/nav/submenu.hbs`. **Videos and Blog do not** — they are flat
  collections, so a dropdown of six posts is a partial feed; those labels
  link straight to the collection.
- **Secondary navigation went back to the footer**, where it belongs. Using
  it as the bar's "More" was wrong.
- **App-grid launcher** before the theme switcher — nine dots, the middle one
  the record light — opening the full menu.
- **One menu modal for both jobs**: the app grid on desktop and the burger on
  mobile open the same centred `<dialog>` with the whole site in **five
  columns** (Watch · Learn · Read · Build · Road), full-screen below 40rem.
  The old full-screen sheet is deleted.
- **The bar's bottom edge is the reading progress rail** — invisible until
  something sets `--value`, so it never shows on a page with nothing to
  measure.
- **The wordmark stays "Swarnil" at every width** in the bar; the abbreviated
  marks remain for places with genuinely no room.

### Three bugs made and fixed inside this pass
- Wrapping every nav item in `<details>` made the browser render its default
  **"Details"** label on every item without a `<summary>`, and hid the link.
  Only the caret and panel live in the disclosure now.
- The overflow test measured `.nav-links`, which sits in a grid column that
  sizes to its own content — so it never reported an overflow and never
  trimmed. It measures the **bar**.
- Closed dropdown panels painted as pale ghost boxes beside the carets: an
  absolutely positioned child escapes the `content-visibility` a closed
  `<details>` applies. Now hidden explicitly.

## 2026-07-27 (phase 2d) — nav icons back, submenu, logo & cover

### Done
- **Icons are back in the nav — and they can't leave holes.** They vanished
  when the menu moved to `{{navigation}}`, because I'd dropped them: an icon
  keyed blindly to a user-defined slug leaves a gap beside every item we did
  not anticipate. New `partials/nav/icon.hbs` maps **31 slugs** a creator site
  actually uses onto the sprite via `{{#match}}` and renders *nothing* for
  anything else. Audited theme-wide afterwards: 16 symbols, 16 referenced,
  **zero missing, zero unused** (`i-heart` and `i-bag` were added; `products`
  and `shop` now use the bag).
- **Submenu.** Ghost's menus are flat, so the *secondary* menu becomes the
  submenu: a `.nav-menu` dropdown labelled "More" in the bar, and its own
  section in the mobile sheet. Anything you put in Settings → Navigation
  (secondary) lands there instead of crowding the bar.
- **The `*` beside GitHub is gone.** It was a `★` placeholder waiting on a
  star count that a user profile can't supply, so it never became a number.
  The chip is icon-only and square now, and the dead fetch is out of main.js.
- **Active state, when a link has an icon.** The dot plus an icon were two
  marks competing for one job — the icon now *is* the marker (accent, full
  opacity) and the dot stands down via `:has()`. Icon-less bars keep the dot.
- **`assets/logo/`** — `logo.svg` (wordmark) and `logo-mark.svg` (the S with
  the tittle on its shoulder), both flipping ink with `prefers-color-scheme`
  while the record light stays vermilion, plus a README. `partials/logo.hbs`
  now prefers **Ghost's publication logo** when set and falls back to the
  markup mark.
- **The hero uses the publication cover.** `home.hbs` takes
  `{{@site.cover_image}}` first (the owner's own choice), then the newest
  post's image, then the grid pattern — so the frame never collapses.
  Note: `logo`, `cover_image` and `icon` are all empty in your Ghost right
  now, so the fallbacks are what render until you set them under
  Settings → Publication → Brand.

## 2026-07-27 (phase 2c) — four real bugs, found and fixed

### 1 · Tailwind's `.container` was overriding the system's
**This was the navbar-width bug.** Tailwind ships its own `.container`, and
`@tailwind components` loads *after* the design system — so content sat in
Tailwind's 1280px breakpoint container while the nav sat in the system's
1200px one. The bar looked 40px inset on every page. Fixed by disabling the
core plugin (`corePlugins: { container: false }`): the system owns container
widths, Tailwind is utilities only. Measured after: bar and page header both
start at 188px and are both 1136px wide.

### 2 · Two play icons
`.play__disc::before` already draws the triangle in CSS, and the markup added
an `<svg><use href="#i-play">` inside it — so every player showed two. The
SVG is gone from `util/player.hbs` and `post/reel.hbs`; the component draws
its own glyph.

### 3 · Dark mode was dead
The theme-toggle script used to live inside the old `partials/navbar.hbs`,
which phase 2 replaced with a dispatcher — so the button rendered but nothing
listened. Moved into `assets/js/main.js`, where it belongs; verified the
attribute flips and persists to localStorage.

### 4 · The navigation was never hardcoded
Checked Ghost's own database rather than guessing:
`settings.navigation` = Blog · Videos · Courses · Projects · Travel · Topics —
exactly what the site was rendering. The labels happened to match the
fallback, which is why it read as hardcoded. **The fallback is now deleted
from `nav/bar.hbs` and `nav/sheet.hbs`**: the bar renders `{{navigation}}` and
nothing else, so whatever appears is unambiguously Ghost's. Change it in
Settings → Navigation and the bar changes.

### Also
- **`navbar_style` custom setting removed** from package.json — the theme is
  back to **zero** custom settings. Bar style is chosen only by an internal
  tag (`#navbar-ghost`, `#navbar-inverse`, …), defaulting to the island.

## 2026-07-27 (phase 2b) — navigation actually works, and it is one bar

### The bug, finally understood
`{{#foreach navigation}}` **only works inside `./partials/navigation.hbs`**.
Ghost documents this explicitly: "A navigation loop will not work in other
partial templates or theme files." Every loop I had written lived in
`partials/nav/site.hbs`, so it silently rendered nothing — and the hardcoded
fallback took over. Ghost's navigation had been set correctly the whole time.

### Done
- **`partials/navigation.hbs` is the real template now** — the only place the
  loop belongs. It handles both menus via `isSecondary`, and gives every item a
  `nav-{{slug}}` class so a single item can be targeted from CSS. Callers use
  `{{navigation}}` and `{{navigation type="secondary"}}`. The fallback is
  guarded by `{{#if @site.navigation}}`, the global Ghost exposes everywhere.
- **One unified bar.** The 12 per-collection bars are deleted; `partials/nav/`
  is now just `bar.hbs` + `sheet.hbs`. A single bar, one skin at a time.
- **Ten variants** in the system (`33-navbar.css`): island · flush · full ·
  wide · centered · stacked · inverse · ghost · bordered · compact. `nav-s-*`
  on the shell owns position and width, `nav-v-*` on the bar owns the skin —
  the markup never restructures between them.
- **Selectable two ways**: Ghost Admin → Design → **Navbar style**
  (a new `navbar_style` select in package.json — the theme's 2nd custom
  setting of 20), overridden per post/page by an internal tag
  `#navbar-island … #navbar-compact`. The tag wins.
- **A proper GitHub mark** — `i-github` added to the sprite and used by
  `.nav-gh`, which now has an inverse twin for the ink bars.
- Ghost restarted so the new partials and the setting register.

### Needs owner action
- Point the GitHub link in `partials/nav/bar.hbs` at your real profile.
- Pick a default in Ghost Admin → Design → Navbar style (defaults to island).

## 2026-07-27 (phase 2) — the navigation module, wired

### Done
- **`partials/navbar.hbs` is a dispatcher**, mirroring post.hbs: inside a
  container module the site bar is *replaced* by that module's chrome. Same
  most-specific-first order, for the same reason.
- **12 contextual bars in `partials/nav/`** — lesson · course · episode ·
  series · guide · guide-step · travel · trip · project · project-step · docs ·
  video. Each closes back to its own container (a lesson closes to its course,
  not to the site), and the players carry prev/next plus a progress rail.
- **`nav/site.hbs`** — Ghost navigation first, the theme's iconified menu only
  when the admin setting is empty, plus theme toggle, **GitHub chip**, member
  button and the burger.
- **`nav/sheet.hbs`** — the full-screen mobile menu as a real `<dialog>`:
  iris open, scanline, rows racking into focus, Escape and focus trap free.
- **Active state finally works.** Ghost's `current` only matches exact URLs, so
  `/courses/java/lesson-1/` left "Courses" unlit. `main.js` now marks the
  **longest matching path prefix** — and defers entirely when Ghost already
  marked something.
- **`.nav-gh`** added to the system (33-navbar.css) with an inverse twin for
  the ink bars.
- **Reading progress**: `[data-nav-progress]` measures `.content` and fills the
  rail, so lessons and build-log steps show position with nothing stored
  server-side.
- **`dummy-content/navigation.json` rewritten** to match the real routes —
  primary: Blog · Videos · Courses · Projects · Travel · Topics; secondary:
  Web series · Guides · Docs · Products · Timeline · Changelog · Newsletters ·
  Archive.

### Two bugs found while building it
- The generated bars printed their own Handlebars comments as page text:
  Python's `str.format()` collapsed `{{!-- --}}` into `{!-- --}`, which
  Handlebars treats as literal text, not a comment.
- Switching to Ghost-only navigation emptied the menu, because the admin
  setting was never imported. The fallback is back, and it is now documented
  in the partial that importing `navigation.json` replaces it.

### Needs owner action
- **Import `dummy-content/navigation.json`** (or set Settings → Navigation) to
  replace the fallback with your own menu.
- Point the GitHub chip in `partials/nav/site.hbs` at your real profile/repo.

## 2026-07-27 — the design system left home

`assets/design-system/` is **gone from this repo**. It is now a standalone
open-source project at `~/Projects/Creator-Design-System` (git initialised,
one commit, **not pushed**), and this theme consumes it as a package.
See `DESIGN-SYSTEM.md` for the contract.

### The new project
- `src/` six layers + `index.css` entry · `icons/` 27 SVGs · `dist/` bundles
- **npm package**: per-layer `exports`, `files`, `style`/`main`, CDN-ready via
  jsDelivr/unpkg, `prepublishOnly` build.
- **GitHub Pages**: `docs/` is the site root; `build.py` mirrors `src/`,
  `icons/` and `dist/` into it so every path is web-root relative and works
  identically locally and deployed. Workflow builds and deploys on push.
- **Open source**: MIT, CONTRIBUTING (the six rules a change must keep),
  CODE_OF_CONDUCT, CHANGELOG, issue forms (bug / component request), PR
  template with a principles checklist, FUNDING.yml, CI that lints, builds and
  **fails if the docs are stale**.
- **New pages**: a real marketing **landing page** (animated viewfinder SVG,
  feature grid with icons, npm/CDN/download install tabs, live GitHub star
  count, sponsor CTA, footer) · **Components explorer** · **Showcase** ·
  **Templates** · **Sponsor**. The docs Introduction moved to
  `/introduction.html` so `/` is the landing page.
- **Showcase & Templates are contribution-driven**: both pages are generated
  from `showcase/*.json` and `templates/*.json`, so a merged pull request is a
  published entry — no code change needed.
- **Preview ⇄ Code on every demo**: each `.demo-tile` gained a toggle that
  prints its own rendered markup, tidied and copyable — so the docs can never
  drift from what is actually on screen.

### The theme side
- Five bridge files now import `creator-design-system/src/<layer>/index.css`;
  everything else is unchanged and the site renders identically.
- **Gotcha found and documented**: postcss-import does **not** read a
  package's `exports` map, so `creator-design-system/foundation` failed to
  resolve — the imports use real file paths instead.
- `npm i file:~/Projects/Creator-Design-System` links it, so edits to the
  system appear here with no publish step.
- gscan ✓ Ghost 6.x; home, blog, post, course, lesson and tags all verified.

## 2026-07-27 (phase 1c) — one Navbar page, documented properly

- **Merged "Navbar system" into "Navbar" and deleted the extra page.** Adding a
  second page for the same component was the wrong call: a navbar is one
  component with many shapes, and splitting it is how someone misses the shape
  they needed. 123 pages now, one entry in the sidebar.
- **Rewritten as a usage document**, not a variant gallery — ten numbered
  sections, each with a live demo, a **copyable markup block**, and a class
  reference table:
  1 Anatomy (the three slots + full skeleton) · 2 Alignment (which to pick and
  why) · 3 The active link (incl. the Ghost `{{#foreach navigation}}` snippet
  and the longest-prefix JS for fallback menus) · 4 Dropdown · 5 Mega panel ·
  6 Hamburger · 7 Mobile sheet (markup + the `showModal()` / `close` wiring so
  the burger always returns to bars) · 8 Responsive collapse · 9 Contextual
  bars per collection · 10 Do / Don't.
- Source lives in its own `content_navbar.py` so the page stays editable
  without hunting through `content_extra.py`.

## 2026-07-27 (phase 1b) — docs search, sidebar contrast, hamburger

### Done
- **Search across the whole system.** `build.py` now emits
  `preview/docs/search-index.json` (52KB) covering every page title, group,
  heading, **class name** (mined from the `.spec` strips and reference
  tables) and the spec prose — so `.btn`, `kg-bookmark`, `curric` and
  `iris` all find their page. Sidebar field with `/` to focus, ↑/↓ to move,
  Enter to open, Esc to clear; matches are highlighted.
  - Fixed a race while building it: every keystroke kicked off its own
    `fetch`, and the first one resolved last, rendering the results for a
    one-character query. Now all keystrokes await one shared promise and the
    query is re-read when it resolves.
  - Fixed double-escaping: headings were stored already-escaped and escaped
    again in JS, so "Hamburger & responsive" rendered as "&amp;amp;".
- **Sidebar is legible now.** Group headings were `--fg-faint` at `2xs` — too
  light to scan. They are `--fg-default`, `text-xs`, semibold, and the open
  group takes a hairline so the eye can find the block it is in. Page links
  moved `--fg-subtle` → `--fg-muted`; section links stay quiet beneath them.
- **Hamburger** (`.nav-burger`) — three bars → X from one element and two
  pseudo-elements, driven by `aria-expanded`. Variants: default, `-squeeze`,
  `-aperture` (rotates as one, pairs with the sheet's iris), `-bare`,
  `-labelled`. Plus **`.nav-collapse`**: links above 48rem, burger below, no
  duplicate markup and no JS. All demoed live on the Navbar system page.

## 2026-07-27 (phase 1) — the navbar SYSTEM, in the design system only

Design-system work only. **No theme templates were touched** — phase 2 wires it.

### Done — `3-components/33-navbar.css` + docs page "Navbar system"
- **Alignment, made explicit.** Measured first: the island's border already
  meets the content column edge (both derive from `--w-site` + `--gutter`);
  what reads as "16px wrong" is the island's *inner padding*, so its links sit
  inset from the page text. Rather than pick silently there are now three
  honest options — `.nav-shell` (border-aligned, default), `.nav-shell-flush`
  (content-aligned, wordmark directly above the page title),
  `.nav-shell-full` (full-bleed bar). Plus `[data-scrolled]` for the tightened
  scrolled state.
- **Active styles**: the dot stays default; `.nav-links-rule` (2px accent
  underline, for dense/doc bars) and `.nav-links-soft` (sunken wash) added.
- **`.nav-menu`** — one-level dropdown on a native `<details>`.
- **`.nav-mega`** — full-width sheet under the island: auto-fit link columns
  plus one featured cell (a mega menu that is only links is a dropdown in a
  costume).
- **`dialog.nav-sheet`** — the mobile menu, and it behaves like a lens:
  the panel **irises open** from the button corner, a **scanline sweeps** once,
  and rows **rack into focus** in sequence (blur → sharp, staggered). Real
  `<dialog>`, so focus trap + ESC are free; every animation is off under
  `prefers-reduced-motion`.
- **Contextual bars** — one base `.nav-context` with four slots (close ·
  where-you-are · actions · progress rail) and per-collection skins:
  `.nav-lesson` · `.nav-course` · `.nav-guide` · `.nav-episode` (always ink —
  it is cinema) · `.nav-video` · `.nav-trip` (day counter prefixes itself) ·
  `.nav-docs` · `.nav-shop`. Geometry is identical across skins so cutting
  between them never moves the chrome.
- **The active-state bug is diagnosed and documented**: the theme's fallback
  menu is a hardcoded list, and a hardcoded list has no Ghost `current`
  property — so nothing ever received `aria-current` and the dot never
  appeared. Ghost's own `{{#foreach navigation}}` does expose `current`;
  phase 2 uses Ghost navigation and matches the path in JS for the fallback.

### Phase 2 (not started)
Wire the theme to it: Ghost navigation as the source, `aria-current` on load,
the mobile sheet in `partials/navbar.hbs`, mega panel content, and each post
layout swapping in its contextual bar.

## 2026-07-27 (later) — post dispatcher + per-collection layouts + partial library

### Done
- **`post.hbs` is a dispatcher again.** Every post enters one file and its
  INTERNAL tag picks the layout. Order is deliberate and documented in the
  file: the most specific tag wins, because a lesson also carries its course's
  public tag and a reel is also a video. Unknown/plain posts fall through to
  `post/article`.
- **21 layouts in `partials/post/`** — article · video · reel · course ·
  lesson · series · episode · guide · guide-step · trip · travel · project ·
  project-step · product · prompt · snippet · experience · doc · newsletter ·
  changelog · shop. Each is built from system components only; the backlog's
  layout contracts hold (course keeps its curriculum in the MAIN column,
  episode keeps its list on the RIGHT, lesson/guide-step/project-step put the
  route rail on the LEFT).
- **10 shared pieces in `partials/util/`** — meta, feature-image, tags, share,
  pager, related, breadcrumb, cta, empty, player. Layouts compose these
  instead of repeating markup.
- **New system component `32-editorial.css`** (four real gaps found while
  building the layouts): `.rail` (the sticky sidebar, self-scrolling, unsticks
  on small screens), `.chat` (prompt conversations — the human turn is
  accent-washed and right-aligned), `.release` (changelog version + date +
  body), `.share` (the quiet share row).
- **Bug fixed in the system: `.grid-rail-left` silently stacked.** It set only
  `grid-template-columns` and not `display:grid`, so used on its own — as
  every one of the new left-rail layouts did — it produced one column. Now
  standalone, carrying its own base properties.
- **`util/feature-image` bleeds only on request.** `bleed=true` is for prose
  columns; inside a grid cell a bleeding figure escaped its track (visible on
  the lesson page). Prose layouts opt in; grid layouts don't.
- **`assets/js/main.js`** (small, new): copy-link, lazy-image defaults, and a
  real video facade — the play button moves the post's OWN first embed into
  the poster frame, so nothing is fetched from YouTube until a reader asks and
  no video id is hardcoded anywhere.
- **routes.yaml trimmed** to the shipping set: the internal `/design/` route
  is gone (and `design.hbs` deleted with it). The docs are still served
  directly from `/assets/design-system/preview/docs/`.
- gscan ✓ Ghost 6.x, zero warnings (`limit="all"` → bounded limits across the
  new partials). All 30 routes + one 404 verified; course, lesson, prompt,
  blog layouts verified visually.

## 2026-07-27 — the site now RUNS on the Creator Design System

The long-standing "nothing is imported by tailwind.css" item is **closed**. The
whole theme is built from the system; there is no other CSS.

### Done
- **All six layers wired** into `assets/css/tailwind.css` via thin bridge files:
  `0-foundation` (L1 + the site-only chrome/reading/rhythm tokens) ·
  `1-element` (L2) · `2-components` (L3) · **new `3-sections` (L5)** ·
  **new `4-utilities` (L6)**. Tailwind is now utilities-only.
- **NEW component — `31-content.css`** (the real gap): Ghost's `{{content}}`
  had *no* styling at all. One `.content` wrapper now styles headings, body,
  links, lists, quotes (incl. `.kg-blockquote-alt`), rules, inline + block
  code, media, tables, and every Koenig card — bookmark, callout, toggle,
  button, header, gallery, embed, audio, file, product, signup, plus the
  `kg-width-wide/full` break-outs.
- **Named `.content`, not `.prose`, and that was a real bug fix**:
  `@tailwindcss/typography` owns `.prose` and loads later, so its
  `--tw-prose-*` colours silently won — headings computed to `#111827`
  (Tailwind grey-900) on the dark theme, i.e. near-invisible. Renamed the
  component and **removed the typography plugin** (the system owns long-form
  now). Built CSS 199KB → 188KB.
- **New in the system while migrating**: `.hero-sm` (announcement-sized hero,
  used by sign-in/sign-up/404/error) and the `u-ratio-*` utilities (square,
  video, wide, portrait, poster, story) so media reserves its box.
- **Templates rebuilt against the system.** `page-header` → `.page-head`,
  `footer` → `.footer` (5-column sitemap + "still rolling" sign-off), `home`
  → `.hero-split` (latest post framed on the stage) + `.sec-head-row` +
  `.list-group` + `.cta-newsletter`, `post` → `.content` + `.pager` +
  related deck, 404/error/signin/signup → `.hero-statement.hero-sm`.
  The 23 collection indexes were **generated from one spec** (kicker, title,
  real description) rather than hand-repeated.
- **Inline styles are gone** from every template except two deliberate
  one-offs — the rule "a template that needs an appearance gets a component,
  not a style attribute" now actually holds.
- **routes.yaml**: all 27 collections/routes verified rendering 200; the
  `/design/` entry now documents that the site is *built from* the system and
  forwards to its docs.
- Docs gained a **Long-form content** page (Elements group) documenting
  `.content`, its card coverage, and why it isn't called `.prose`.
- gscan: ✓ compatible with Ghost 6.x, zero warnings (the old `limit="all"`
  warning in tags.hbs fixed too). Verified light + dark on home, blog index,
  post, 404.

### Left / needs owner action
- **Upload `routes.yaml`** in Ghost Admin → Settings → Labs → Routes —
  `/design/` 404s locally until then (Ghost reads routes from its own
  settings, not the theme folder). Every other route already works.
- Splitting the design system into its own repo/npm package —
  see `assets/design-system/instruction.md`.

## 2026-07-26 (fourth pass) — richer Start, Getting started section, group icons (122 pages)

- **Introduction rewritten**: What this is · Why I built it (first person,
  practical) · Who it's for — and what you can do (four iconed capability
  cards) · **The four magic values** (Twilio-style house values, creator-cut:
  1 Press record · 2 Cut the noise · 3 Show the b-roll · 4 One more take) ·
  the three devices · a Why/How/For-whom table.
- **New "Getting started" group** after Start: **Installation** (files, layer
  links, fonts, first render) and **Setup & theming** (token override block,
  dark-mode wiring, mark swap, launch checklist).
- **SVG icons on every sidebar group summary** (GROUP_ICONS in build.py).
  Cache `?v=cds6`.

## 2026-07-26 (third pass) — reorganised for creators: 120 pages, icons library, cutouts, animated home

### Done
- **Sidebar**: groups are now collapsible `<details>` (chevron summaries), only
  the active section ships open; the nested TOC keeps its active link scrolled
  into view (`scrollIntoView` on scrollspy).
- **New order**: Start (Introduction · Why this system · Principles · Usage) →
  Foundation (Logo, Color, Typography, Spacing & radius, Elevation, Patterns,
  **Breakpoints**, Accessibility w/ a plain-language intro) → Elements →
  **Icons** (Guidelines + Icon set) → **Shape & Cutout** → **Grid & Layout**
  (Containers, Grid, Columns, Composition, Z-index) → Forms → Components
  (now incl. **Devices** and **Frames**) → Composites → Sections → Layouts →
  **Animation & Motion** (basics, text effects, annotations, micro-interactions,
  section presets, **Logo sting**, **Page transitions**) → Broadcast →
  **Helpers & Utilities**. "Layout primitives" is gone (renamed Composition
  under Grid & Layout).
- **Home**: no more "Frame & Signal" headline — "Made by a creator, for
  creators" with an **animated SVG viewfinder illustration** (scan line, orbit,
  typing title bar, blinking REC), reduced-motion safe.
- **Principles rewritten**: eight illustrated rules (SVG icons), each tied to
  its enforcement mechanism; new **Why this system** ideology page.
- **Color page rebuilt**: Primary — signal, Secondary — amber, Neutral — ink,
  then the semantic variant families; status/notification ramps removed.
- **Icons are real files now**: `assets/design-system/icons/{ui,creator,media,
  social}/*.svg` — 27 icons, 24×24, 1.5px stroke, currentColor (auto dark/light),
  including the creator-only set (rec, viewfinder, slate, take, sting, course,
  buildlog, trip). Icon set page renders them from the folder.
- **Cutouts** (`1-foundation/13-cutout.css`): the neo-brutal register —
  sticker (+accent, pressable), ticket, corner-cut, tab, tape, punch, speech;
  sizes `.cut-sm/-lg` via `--cut-off`/`--cut-bw`; inverse twins.
- **Animation pages**: `data-replay*` chips work again (generic restart in
  preview.js) and demos loop (`body.loop-demos`).
- **Logo**: tittle smaller (0.15em) and seated tighter; favicon mark redrawn
  edge-to-edge so it reads at 16px.
- Ghost had stopped mid-session — restarted (`ghost start` in ~/Imswarnil.com).
  Cache version bumped to `?v=cds5`.

### Left
- Wire the live theme to the system (via the package split — instruction.md).

## 2026-07-26 (later) — Creator Design System is THE system: legacy previews absorbed, 116 pages

### Done
- **The old overview pages are gone.** `preview/index.html`, `elements.html`,
  `components.html`, `sections.html`, `layouts.html`, `youtube.html`,
  `social.html` deleted; `preview/` now holds only `docs/`, `preview.css`,
  `preview.js`. `/design/` (design.hbs) is a redirect to the docs home.
- **Their content wasn't rewritten — it was extracted.** New
  `_build/extract.py` split every legacy page's `<section id>` blocks into
  `_build/fragments/`; build.py assembles them into individual pages
  (strips the legacy numbered heading, mines its intro as the page lead).
  116 pages total.
- **New sections in the sidebar**: Start (Introduction with the Frame & Signal
  manifesto verbatim · Principles — the rules-of-one, tokens-before-templates,
  ARIA-state, platform-first, honest-motion, thumbnail-scale · Usage — how
  plain CSS, SCSS and Tailwind users all build the same UI off the token
  contract, with a Tailwind theme mapping) · Foundation (Logo, Color,
  Typefaces, Spacing & radius, **Elevation**, Layout primitives, Patterns,
  Icons, Shape, Devices, Frames, Accessibility — each its own page) ·
  **Motion** (basics, **Text effects**, **Annotations**, **Micro-interactions**,
  **Section presets**, Stings — split out of the old mega-section) ·
  **Layouts** (an Overview page linking six category pages: Core / Watch /
  Learn / Build / Road / Pages) · **Broadcast · YouTube** (13 pages, dark
  default + working Guides toggle) · **Broadcast · Social** (6 pages).
  Plus Text elements (Content) and Collection cards (Components) rescued from
  the old elements/components pages.
- **Sidebar upgrades**: the per-page TOC now **nests under the active page
  item** (heading ids injected at build, scrollspy highlights); the sidebar
  **collapses** («, floating ☰ restores, persisted in localStorage); Guides
  toggle appears only on broadcast pages.
- `assets/design-system/instruction.md` — how to lift the folder into a
  standalone repo/npm package/GitHub Pages, with the names checked free on npm
  (`creator-design-system`, `frame-signal`) and the theme-as-consumer wiring.
- Verified in Chrome: home (manifesto band), f-logo, m-annotations, yt-thumbs
  (dark + guides), layouts overview, collapse/reopen, cache-bust `?v=cds4`.

### Left
- Wire the live theme to the system (now via the future package — see
  instruction.md); routes.yaml re-upload still pending for /design/.

## 2026-07-26 — Creator Design System: one page per component, Bootstrap-style docs

### Done
- **The system is now the "Creator Design System"** and the previews are a
  generated docs site — **68 pages, one per topic**, at
  `preview/docs/` (`/assets/design-system/preview/docs/index.html`). Grouped
  sidebar (Start · Layout · Content · Forms · Components · Composites ·
  Sections · Utilities · More), prev/next **pagination on every page**, theme
  toggle, favicon, scrollspy. Nothing is mixed — Buttons, Badge, Modal,
  Syllabus, Marquee etc. each own a page showing every variant.
- **Generator, not hand-written pages**: `preview/docs/_build/build.py` +
  `content_*.py` modules. The NAV tree drives sidebar, ordering and pager;
  adding a page = one content entry + one NAV line. Re-run with
  `python3 …/_build/build.py`.
- **New components** (`3-components/28-disclosure.css`, `29-overlay.css`,
  `30-form-plus.css`): close button, collapse + accordion (native details,
  exclusive via `name=`), dropdown menus, list group, **carousel** (scroll-snap,
  scroll-trap-proof), **marquee** (aria-hidden twin, hover-pause,
  reduced-motion fallback), **modal** + **offcanvas** (real `<dialog>`,
  data-dialog openers in preview.js), **popover** (Popover API), **range**,
  **floating labels**, input-group affix text.
- **Syntax highlighting + copy code** (`2-elements/15-syntax.css`): `.codebox`
  with lang header, line numbers, line highlight, five token roles (dark +
  light twins), `[data-copy]` buttons ("Copied" feedback in preview.js), and
  `.copy-line` for one-liners.
- **Utilities layer** (`6-utilities/index.css`): `u-`-prefixed (no Tailwind
  collisions) — display, visibility (+sr-only), flex, float, position,
  z-ladder, overflow, sizing/measures, margin/padding/gap off the 4px ladder,
  text, vertical-align, semantic colors/backgrounds, borders/radii, shadows,
  interactions, responsive display pairs. Each documented on its own page.
- **All navbar modes documented** on Components → Navbar: default island,
  collection context (aria-current dot), course player chrome (progress rail),
  and the always-ink series bar.
- **Favicon fixed and improved**: `assets/favicon.svg` didn't match the
  identity — now the `.logo-s` mark (S + vermilion tittle on the shoulder),
  ink flips with `prefers-color-scheme`. Linked from every preview page and
  default.hbs (already referenced it).
- Old overview pages retitled Creator Design System and link to the docs;
  shared preview assets are version-queried (`?v=cds2`) so updates bust cache.
- Verified in Chrome: docs home, buttons (all variants incl. icon buttons),
  navbar modes, code+copy, modal open/close, marquee, utilities. gscan clean.

### Left
- Still nothing imported by `assets/css/tailwind.css` — wiring the live theme
  to the system remains the next deliberate step.

## 2026-07-25 — design system, pass 6: sidebar nav, layer 5 sections, composites, layouts map

### Done
- **Live-site navigation fixed.** Ghost Admin's navigation was empty, so the
  navbar rendered no items. `partials/navbar.hbs` now falls back to the theme's
  own iconified menu (Blog · Videos · Projects · Courses · Travel · Topics)
  whenever admin nav is empty; admin items still win when set. Eight new icons
  in `partials/icons.hbs` (pen, camera, code, book, plane, clock, tag…).
- **Preview navigation moved to a left sidebar.** The top bar had run out of
  room. New fixed `.doc-side` chrome in `preview.css`: pages grouped
  (System: Foundation / Elements / Components / Sections / Layouts ·
  Broadcast: YouTube / Social), then this page's section links with a
  scrollspy (new shared `preview.js`), theme/guides toggles pinned at the
  bottom. Below 64rem it's a drawer behind a ☰ button in a slim top bar.
  Applied to all six pages incl. `design.hbs`.
- **Layer 5 — sections** (`5-sections/`, the pending work): `30-header`
  (.page-head + .sec-head-row), `31-hero` (statement / split / band incl.
  media billboard), `32-stats` (hairline stat grid + bare + inverse),
  `33-cta` (band, newsletter form, polite sponsor strip), `34-footer`
  (grid + sign-off "still rolling" + inverse twin). Demoed on the new
  `preview/sections.html`.
- **Composites** (`3-components/27-composite.css`): `.curriculum` (native
  `<details>` modules, `.lesson-row` with tick / `[data-done]` /
  `aria-current` ring / free label, progress in the head), `.ep-panel`
  (header + self-scrolling `.episode` list), `.buildlog` (▸ start, numbered
  middles, ✓ ship on a walked rail), `.itinerary` (day chips + stop badges).
  New section 08 on the Components page; also shown in place on Sections.
- **Layouts page** (`preview/layouts.html`): every template in routes.yaml as
  a wireframe — Core / Watch / Learn / Build / Road / Pages, ~26 tiles with
  the `.wire` mini-language (grey content, accent organ, hatched media, ink
  inverse) and a one-line contract per layout (e.g. course = curriculum in
  the MAIN column, episode list on the RIGHT).
- Verified in Chrome, light + dark, sidebar drawer + scrollspy working;
  gscan clean (one pre-existing tags.hbs warning).

### Left
- Still nothing imported by `assets/css/tailwind.css` — wiring the live theme
  to the system is the next deliberate step.
- `/design/` 404s locally until routes.yaml is re-uploaded (Ghost Admin →
  Settings → Labs → Routes); static previews serve fine from
  `/assets/design-system/preview/`.

## 2026-07-25 — design system, pass 5: the tittle, annotations, stings

### Done
- **The logo section moved to the front** of the foundation page — it's the
  first thing the system is, so it's now section 01 and everything renumbered
  behind it.
- **The tittle is dead centre over the ı at every size** (`--logo-nudge: 0`),
  and every wordmark in the system now uses the real mark: the site nav, the
  broadcast `.yt-mark`, the banner lockup, thumbnails, IG posts, stings. The
  old "wordmark + separate dot" hack is gone everywhere.
- **No more "Sı".** A lone dotless ı is a stick and reads as an l, so the
  compact mark is `.logo-s` — capital S with the tittle moved to its top-right
  shoulder. Same dot, relocated. Ladder is now Swarnıl → Sıl → S• → •.
- **`.logo-rec`** — the recorder mark: a bare square with the dot in the
  top-right corner, no brackets and no box, exactly where a camera puts its REC
  light. Replaces the old bracketed app icon. `.mark-rec` is its broadcast twin.
- **`.logo-responsive`** — markup carries full / abbr / mark, CSS picks by
  width. No JS, no layout shift, accessible name unchanged.
- **Shape maths, 2D.** Ratio and angle tokens (φ, √2, δ, 16:9, 21:9, 30°, 60°,
  108°), optical-area corrections, and nine clip-path polygons derived on the
  unit circle — triangle, rhombus, pentagon, hexagon (flat and pointy), octagon,
  star, arrow, plus — with conic-gradient progress rings and donuts.
- **Viewfinder**: the centre focus square is gone. Corners and the rec bug only
  — a box in the middle fights whatever the frame is showing.
- **`.book`** — spine gradient plus a striped page edge, which is the whole
  trick that makes a flat rectangle read as something you can finish. Courses,
  guides, the resume. `.book-shelf` tilts alternate covers.
- **Annotations — the hand-drawn layer.** `.an-circle`, `.an-circle-2`,
  `.an-underline`, `.an-strike`, `.an-box`, `.an-arrow`: an SVG stroke with
  `pathLength="100"` and an animating dashoffset, so the mark is *drawn* rather
  than faded and reads as a gesture. The marker `.tx-highlight` was rebuilt with
  soft ends and a tilt.
- **Eight micro-interactions** — swipe, wipe, sheen, press, magnet, trace,
  reveal, swap. All pointer-gated, all one property, none over 200ms.
- **Five section presets** — cascade, curtain, split, focus, lift; add
  `.sec-on-scroll` and they fire natively on scroll with no observer.
- **Five stings** — the *tudum* problem solved five ways: drop (the dot falls,
  lands, and hands over to the wordmark's own tittle), static, shutter, type,
  sweep. Every one ends on the identical last frame, which is the entire point
  of an ident.
- **Accessibility rewritten** as ten real, demonstrated points: focus, skip
  link, screen-reader text, a measured contrast table for both themes, target
  size, colour-is-never-alone, reduced motion + forced colours, form errors
  wired with `aria-invalid`/`aria-describedby`, state-lives-in-ARIA, and print.

### Left
- Still nothing imported by `assets/css/tailwind.css`.
- Layer 4 — sections (hero, stat grid, CTA, empty, lower-third, footer).

## 2026-07-24 — design system, pass 4: identity, expansion, social

### Done — foundation (layer 1 now 13 files)
- **The tittle.** `09-logo.css`: the dot over a lowercase i is a *tittle*, and
  the identity is that the tittle IS the record light. The i is set with the
  dotless ı (U+0131) and the tittle is drawn as an element, so it can be any
  colour and can pulse. Sizes, lockups (stacked / inline / badge), degradation
  ladder (Swarnıl → Sıl → Sı → dot), favicon sizes 16→512, clear space, and a
  documented misuse set. The mark now replaces the old dot-hack everywhere in
  the previews.
- **`10-icon.css`** — 24×24 grid, 1.5px stroke, 4 variants (line/solid/duo/
  ghost), containers, badged icons, and a 12-glyph inline sprite in the page.
- **`11-shape.css`** — nested-radius maths (inner = outer − padding), 12 shape
  primitives, 4 dividers, clip/mask helpers.
- **`12-frame.css`** — window chrome: macOS, VS Code (tabs + gutter + 5 syntax
  roles), terminal with blinking cursor, browser, phone, camera shutter (6
  blades), the full viewfinder (thirds, focus box, rec bug), polaroid, filmstrip.
- **`05-motion.css`** — now 13 animations (added flip, swing, pop, draw, mask
  wipe, zoom) **plus 12 text effects** (type, chars, words, wave, shine,
  underline, highlight, gradient, glitch, blur-in, mask-up, flip-chars, and a
  CSS counter roll). All degrade to a fade under reduced-motion.
- **`07-pattern.css`** — 28 patterns. Size modifiers now change the LINE WEIGHT
  as well as the scale; scanline has fine/default/coarse; added iso, plus,
  stripes, checker, topo, circuit, equaliser, sprocket, matrix, spotlight,
  ruler, corners, plus the IG and live conic rings.
- **`01-color.css`** — the maths written down: L* ladder, verified contrast
  pairs for both themes, the split-complementary hue relationships, the alpha
  ladder, and elevation-by-light percentages.
- **`02-typography.css`** — the typeface section: why each face, what its
  numerals do, fallback policy, numeric styles, optical corrections.
- **`06-layout.css`** — gap ladder, `.flow` owl, `.grid-2/3/4/6`, `.grid-rail`,
  `.grid-editorial` (text · wide · full bleed), column-fill, placement helpers.
- Foundation preview split into its own sections: **Logo · Colour · Type ·
  Spacing · Radius · Elevation · Motion · Text effects · Layout · Patterns ·
  Devices · Icons · Shape · Frames · A11y.**

### Done — broadcast (layer 3 now 8 files)
- **Three layouts × eight categories** instead of twenty hand-drawn thumbnails:
  `thumb-l-split` / `thumb-l-center` (centre image + centred copy) /
  `thumb-l-band`, crossed with generic · build · travel · qna · series · vlog ·
  live · scheduled. Plus the **line effect** (`.thumb-rules`, three weights).
- New skins: **daily vlog** (date stamp), **scheduled stream** (blue, outlined,
  dated), **replay** (grey, honest label) — so the three live states never look
  alike in a grid.
- **Five live scenes** with real capture-source slots: standby, share-right,
  share-left, duo, focus (camera full + PiP), all sharing a fixed-height header
  strip so cutting between them doesn't make the topic jump.
- **Five title scenes** and **five end screens** (classic, centred, list,
  newsletter, minimal), all keeping YouTube's element geometry.
- **Five subscribe styles** (pill, bar, counter, corner bug, card) and **three
  engagement styles** (bar, vertical stack for Shorts, tiles).
- **`27-instagram.css`** — 4:5 feed posts with caption-safe insets, five-slide
  carousel with fixed roles (hook → point ×3 → ask), stories with the platform
  UI blocked out, profile-grid preview, follow card, handles row, share sheet.
- **Light twins for every backdrop and frame** (`.yt-light`), plus density
  modifiers, because a bright feed and a dark grid want opposite artwork.

### Done — previews
- Four pages now: **Foundation · Elements · YouTube · Social**, sharing one
  chrome stylesheet and a layer switcher.
- The YouTube and Social pages carry three toggles: **Theme** (page chrome),
  **Canvas** (flips every export surface to its light twin) and **Guides**
  (overlays the safe areas — preview only, never exported).

### Left
- Still nothing imported by `assets/css/tailwind.css`; the live theme is
  untouched.
- Layer 4 — sections (hero, stat grid, CTA, empty, lower-third, footer).
- Routes for `elements.html` / `youtube.html` / `social.html` (served as theme
  assets today).

## 2026-07-24 — design system, pass 3: broadcast / YouTube (proposal, not yet wired)

### Done
- **`assets/design-system/3-broadcast/` — 8 files.** Export assets for the
  channel, built from the same tokens as the site. Canvases are CSS containers
  sized in `cqw`, so one element is correct at 120px and at 2560px — there is no
  separate "export version" to keep in sync.
- **`20-canvas`** export surfaces (thumb/banner/avatar/scene/short), safe-area
  overlays, cqw type roles, channel mark, `.yt-export` scaffolding.
- **`21-thumbnail`** the thumbnail *grammar* (title bottom-left, one accent word,
  kicker, mark, subject right ~36%, 5.5% safe) plus the five styles — generic,
  build, travel, Q&A, live. Documented "never" list: no duration, no category
  chips, no view counts, no second accent, one device only.
- **`22-series`** five-episode web-series art: fixed wordmark / numeral / title
  baseline across the set, ghost numeral or chip variant, season ticks, 2:3
  playlist poster.
- **`23-scene`** intro opener, title card, points, quote, section break, lower
  third, end screen (with real YouTube element holes), live stream screen,
  ticker, BRB.
- **`24-social`** four subscribe styles (pill / bar / counter / corner bug),
  engagement row, comment prompt, live chat with host-mod-member roles and
  pinned rows, website promo strip + card.
- **`25-brand`** 2560×1440 banner with the 1546×423 safe box and desktop-crop
  rulers, four avatar marks, player watermark.
- **`26-backdrop`** 12 backdrops + 9 frames/borders re-cut at broadcast scale
  (layer 1's web patterns vanish on a 1280px canvas).
- **Preview at `preview/youtube.html`** with a Guides toggle that overlays every
  safe area, and a "P1 test" row rendering all five thumbnails at 120px wide.

### Left
- Still nothing imported by `assets/css/tailwind.css`.
- Layer 4 — sections (hero, stat grid, CTA, empty, lower-third, footer).
- No Ghost route for `elements.html` / `youtube.html` yet; both are served as
  theme assets.

## 2026-07-24 — design system, pass 2: elements (proposal, not yet wired)

### Done
- **`assets/design-system/2-elements/` — 8 files, ~55KB of CSS, no JS.**
  `10-button` (6 intents · 3 sizes · icon/pill/block · `[data-loading]` ·
  `.btn-live` · segmented `.btn-group`) · `11-badge` (badge tones, `.badge-live`,
  eyebrow, chip w/ counts, avatar + stack, kbd, timecode) · `12-form` (field,
  label, hint, error-text, input, textarea, select, search, inline group,
  check/radio/switch, fieldset, form-row) · `13-card` (media/body/title/meta/
  excerpt/footer, whole-card link, featured/inverse/row/compact/poster/bare,
  `.deck`) · `14-navigation` (nav island + series/course contexts w/ progress
  rail, tabs, breadcrumb, pagination, lesson pager, TOC) · `15-table` (table,
  definition list, rule list, numbered steps) · `16-feedback` (alerts, toast,
  progress, 5 loading treatments, empty state, CSS tooltip) · `17-media`
  (player chrome, play disc, poster, episode row, pullquote, figure, code block).
- **Every value is a `var()`** — no raw hex, no magic numbers anywhere in layer 2.
  Active states are driven by `aria-current` / `aria-selected` / `aria-pressed`,
  so the styling and the accessibility tree can't disagree.
- **Preview split into two pages** sharing one chrome stylesheet
  (`preview/preview.css`): `preview/index.html` (foundation, generated from
  `design.hbs`) and `preview/elements.html` (elements), with a layer switcher
  in the header. Verified in light and dark.

### Left
- Still nothing imported by `assets/css/tailwind.css` — the live theme is
  untouched.
- Layer 3 — sections: hero, stat grid, CTA/newsletter, empty, lower-third, footer.
- `elements.html` has no Ghost route yet (it's served as a theme asset). Worth a
  `/design/elements/` route when layer 3 lands.

## 2026-07-24 — design system, pass 1: foundation (proposal, not yet wired)

### Done
- **`assets/design-system/` created.** New home for the token-first system that
  the theme will be rebuilt against. Named **"Frame & Signal"**: near-monochrome
  ink, one rationed accent that means *live*, and three signature devices — the
  signal dot, the viewfinder frame, the mono "slate" label voice. Inspired by
  `Design.pdf`, not copied from it: different faces (Space Grotesk / Inter /
  IBM Plex Mono), a different accent (vermilion `signal`, not the PDF's red),
  amber instead of gold, and a two-tier token contract.
- **`1-foundation/` — 10 files, ~1.3k lines of CSS, zero components:**
  `00-reset` · `01-color` (ink 14 / signal 11 / amber 9 / status ramps, plus the
  semantic alias layer + light, dark and `[data-surface="inverse"]` themes) ·
  `02-typography` (3 faces, fluid clamp scale, text *roles* not size utilities) ·
  `03-space` (4px base, spacing/radius/size/z ladders, container widths, ratios) ·
  `04-elevation` (5 shadows + surface recipes; dark mode swaps shadow for a lit
  top edge) · `05-motion` (4-step duration ladder, 14 `fx-*` behaviours, native
  scroll-driven reveal, full reduced-motion degrade) · `06-layout` (containers,
  12-col grid, φ split, stack/cluster, canvases with safe areas, the frame
  device) · `07-pattern` (16 CSS-only backgrounds, no images) · `08-a11y`
  (focus, skip link, forced-colours, print).
- **Preview at `/design/`** — `design.hbs` (standalone template, `noindex`) plus
  a route in `routes.yaml`. It links the foundation CSS **directly**, not
  through the Tailwind build, so the system is shown unmixed with the current
  theme. A generated static copy lives at
  `assets/design-system/preview/index.html` for viewing without a Ghost restart.
- gscan clean (Ghost 6.x compatible) after the additions.

### Left
- Nothing in the foundation is imported by `assets/css/tailwind.css` yet — the
  live theme is untouched by design. Wiring it up is a deliberate next step.
- `2-components` (buttons, badges, cards, tabs, tables, nav skeletons, forms,
  loading treatments) and `3-sections` (hero, stat grid, CTA, empty, lower-third).
- Then: rewrite the `.hbs` templates against the system, and work the master
  backlog in CLAUDE.md on top of it.

## 2026-07-17 — hero finished (title card) · Chrome hang fixed · perf 0.97→1.0 · JSON-LD everywhere · llms

### Done
- **Chrome "hang" root-caused and fixed — three compounding causes:**
  1. `hero.hbs` still ran a `pointermove` handler writing `--hx-mx/--hx-my`
     on the hero shell, but nothing consumed those vars any more. Every
     mouse move invalidated style for the whole hero subtree — the tab froze
     while the cursor crossed the hero. Handler removed.
  2. The homepage rendered all ~20 sections / 2.5k nodes up front. Home
     sections (`#home-*`) now carry `content-visibility: auto` +
     `contain-intrinsic-size: auto 44rem` — offscreen sections are skipped
     entirely. Local Lighthouse main-thread work: **4.2s → 0.9s**
     (Rendering 710→114ms, Style & Layout 647→175ms); perf score
     **0.97 → 1.00**, LCP 1.1s → 0.5s.
  3. `vfBleed` animated `filter:` on the hero video screen infinitely while
     rolling — a full re-rasterize every frame for a 1.5° hue wobble. Now a
     static `saturate(1.1) contrast(1.03)`. (The one-shot `vfTear` stays.)
- **Hero fold math was double-counting the navbar.** The `.nav-spacer` div
  already clears the fixed navbar (the hero starts at y=72), but `.hx` padded
  another `4.25rem` for it AND budgeted `100dvh` from y=0 — a 140px dead band
  above the eyebrow and the tag strip landing 9px *below* the fold, which is
  why it "never rendered". Now: `padding-top: .75rem`, `min-height:
  min(calc(100dvh - 8rem), 64rem)` (spacer 4.5rem + strip 3.5rem). Strip sits
  on the fold at 1440×900, animates (its `hxMarquee` keyframes live in
  tailwind.css now, not the never-emitted Tailwind `marquee` utility).
- **Headline no longer re-wraps while the frame morphs.** `.hx-card` was
  capped at 52rem, so "frame the [X] — and cut the noise." broke to a third
  line on the wide ratios and the whole hero jumped every 2.2s. Card cap is
  64rem (reading-measure caps stay on the manifesto); headline is a stable
  two lines at desktop.
- **Mobile eyebrow kept the wrong span.** `nth-of-type(n+2)` counted the name
  span, hiding the role tail it was meant to keep. Now `> span:nth-of-type(n+3)`
  — name + role show, geography drops.
- **JSON-LD on every page type.** Custom collection indexes (/blog/, /videos/,
  /projects/, …) and custom routes matched none of home/post/page/tag/author
  and emitted no schema. `json-ld.hbs` now has an inverse branch emitting
  `CollectionPage` (name/description/isPartOf/publisher). Verified valid JSON
  on /blog/, /videos/, /tags/.
- **llms**: `/llms/` (H1 + link list, text/plain) now also lists the 20 most
  recent posts (unescaped titles — no `&amp;` in the markdown). `llms.txt →
  /llms/` redirect already in redirects.yaml; **upload routes.yaml +
  redirects.yaml in Ghost Admin for it to work live**.
- gscan: compatible with Ghost 6.x, no warnings surfaced.

### Later same day — hero back to two columns
- **Layout**: copy left / screen right at `lg+` (`.hx-grid`, copy gets the
  1.05fr half); below `lg` it stays the centered stacked title card.
- **Information rendering**: identity eyebrow → three explicit headline lines
  (the frame owns line 2, so ratio morphs can never re-wrap the headline) →
  manifesto → CTAs (socials drop to their own row in the column; the divider
  hides at `lg`) → **"What I make"**: hairline, mono label on its own line,
  then the six collections as quiet iconified links. Still static — the links
  are the information, no `{{#get}}` counts.
- **Cascade gotcha, now documented in the file**: the `lg` override block must
  sit AFTER every `.hx-*` base rule — media queries add no specificity, and the
  first attempt was silently swallowed by base rules later in the file.
- Stage caps: side-by-side `min(52dvh, 26rem)`, short-laptop compact block
  splits by width (34dvh stacked / 46dvh two-col). Strip verified on the fold
  at 1440×900 (828–868px), clean at 1024×768 and 390×844.

### Later — site-wide modules pass (toc · rails · kicker · video · guide · projects · CSS folders)
- **CSS reorganised**: `assets/css/{components,modules,pages}/` —
  components (buttons/media/sections), modules (toc/rail/guide/stage/showcase),
  pages (home/collections). Imports in tailwind.css are grouped and commented.
- **One TOC module** (`components/toc.hbs` + `modules/toc.css`): replaces four
  divergent TOC markups (post/toc.hbs, doc.hbs, lesson.hbs, guide-step's
  #toc-wrap — which used ids main.js never targeted, so guide TOCs never
  populated at all). Scrollspy keeps the active link centred in a scrolling
  list. Sticky comes from the rail it sits in.
- **One sticky rail** (`modules/rail.css` `.rail-sticky`): replaces the ad-hoc
  `sticky top-20/24/28 space-y-6/8` wrappers in article, changelog, trip,
  episode, project, project-step, archive, timeline, products. Equal 1.5rem
  gaps between widgets, self-scrolls when taller than the viewport.
- **Kicker labels inline everywhere**: `.kicker` is now inline-flex, so the
  icon sits on the same line as the text ("Products I use to make videos" et
  al used to stack icon-above-text wherever a template forgot to bolt flex on).
- **Video page**: chapters rail on mobile is a capped (max-h-72) scrollable
  list under the player with a sticky header — it used to unhide unbounded,
  shoving the title a screen down. Desktop unchanged; inline `.vd-ts`
  timestamp buttons still cover list/paragraph-format timestamps.
- **Guide step pages are player chrome now**: site navbar + spacer hidden
  (rule kept OUTSIDE @layer — `tag-hash-guide-content` only exists at runtime,
  inside the layer Tailwind purges it), guide bar at top with home link and a
  Ghost-style progress hairline that fills with the route. Rails slimmed
  17/20rem → 13.5/17rem; the step column takes the difference. FIXED a dead
  stepper: `active=../slug` (and any hash param read inside `{{#get}}`) never
  resolved, so data-active was empty and every guide showed 0% — now
  `active=slug` + `{{../active}}` inside the block; verified "step 1 of 8 ·
  13%", current node ringed, bar fills.
- **Projects**: sidebar rides `.rail-sticky`; repo cards were already
  GitHub-styled (social strip, mono slug, language dots, meta row) — kept.
- Hero polish: larger headline/manifesto at lg (clamp 3vw/3rem), tighter
  eyebrow; strip still on the fold (828–868 @ 1440×900). gscan clean.

### Hero redesigned — bento, not a stacked column
- The tall left column (badge → headline → manifesto → CTA → form → stats, six
  bordered blocks) read as a crowded list. Restructured into two zones:
  **TOP** = statement (availability badge → morphing headline → Watch/Resume +
  socials) beside the film screen; **BAND** = a 3-up bento of cards —
  *Currently* (Salesforce Engineer @ EF · Budapest · from India), *What I make*
  (the four stats), *Newsletter* (the subscribe form). Information spreads
  sideways into cards instead of piling up. Stacks to one column on mobile.
- **Screen**: the long quote that collided with the play button is gone; the
  poster is now a clean still + one glassy centred play control (three welcome
  pulses, then rests) + a lower-third caption clear of the button.
- **Real player controls**: the film bar now has play/pause AND a working
  unmute/mute toggle (new `icons/volume`,`volume-x`; the tap is the user
  gesture browsers require for sound). Verified 1:1→16:9 morph + both controls
  appear on play.
- Staged load animation: badge → headline → actions → cards rise in on their
  own beats; screen scales in. Strip still on the fold (828–868 @ 1440×900).

### Left (from the master backlog)
- Render-blocking CSS (Ghost's cards.min.css) — needs a defer/inline strategy.
- Live-site third-party weight (ads/OneSignal 472KiB unused JS) — the remaining
  gap between local perf 1.0 and the live 64 score is code-injection config,
  not theme code.
- Image delivery (responsive sizes on content imgs), cache lifetimes (server).

## 2026-07-16 — hero rebuilt (square → film) · homepage un-crashed · guide full-width

### Done
- **The homepage was crashing — this is why.** The hero had grown to **11
  `{{#get}}` calls**: seven in `home/hero-do` (one per collection, purely to
  print a post count), three in the showcase (project/series/trip) and one for
  tags. Eleven API round-trips to paint a hero. Now **2**: one for the film, one
  for the tags. `hero-do` is static markup — the links were the point, the
  counts were not worth a request each.
- **Hero, final shape.** Left: who I am, the "Cut the chaos" subtitle (blurred
  until read, then sharpens word by word), CTAs, and What I do. Right: a
  **square 1:1 frame** — dummy still (`assets/images/hero-square.svg`, 1000×1000),
  an icon, and the quote *"Life looks better when you make something people love
  — because what you make is who you are"*, revealed word by word. **"Watch my
  story"** below it reshapes the frame **1:1 → 16:9** and plays the film in the
  same frame. The film is the featured `#trip`, else the newest, else the
  theme's own fallback still.
- **Nothing is fetched from YouTube until you press play**, and playback has
  real play/pause (iframe API) plus pause-on-scroll-away.
- **Grid**: reverted to centre-lit, dissolving to nothing before the corners
  (`.fade-mask-bloom`), on hairline rules at 82px cells (`.bg-pat-grid-wide`).
  The earlier "corners lit" reading was wrong — the grid was simply invisible
  because `-z-10` had it behind `<body>`'s background.
- **Tag marquee**: full-width looping strip, tag icon when the tag has a
  `feature_image`, else `#`, with post counts and "View all tags". It renders
  *after* the hero and the hero reserves `3.5rem` for it — a 100dvh hero puts
  anything following it exactly one pixel under the fold, which is why it was
  invisible no matter where it sat in the DOM.
- **Guide**: full-width three-column step page — contents/ads/widgets left, step
  centre, route right, sticky, with the route in a panel on phones. The stepper
  now fills **positionally**: on step 5, steps 1–4 are ticked and 5 is current,
  for everyone. It used to key off `localStorage`, so the rail was empty until
  you'd personally walked it.
- **Deleted**: `hero-chat.hbs` + its CSS (the chat-hero experiment),
  `hero-proof.hbs`, `crt.css`, `icons/ef.hbs`, `icons/tag-cloud.hbs`, and the
  spec-sheet / work-personal-toggle / tag-cloud / marquee-toggle CSS.

### Gotchas found the hard way — don't undo these
- `{{#if film}}` is **truthy for an empty `{{#get}}` result**. Test
  `{{#if film.length}}` or the `{{else}}` never fires and the block ships empty.
- **Never pass `link=url` to a partial.** `{{url}}` is a helper, not a property;
  a hash param can't call it, it throws, and a throwing partial makes Handlebars
  **discard the whole enclosing block silently**. Call partials inside
  `{{#foreach}}` and let them read the context.
- **Don't nest `{{#get}}` inside another `{{#get}}`'s `{{else}}`** — the async
  helper can't resolve it and renders nothing.
- **Don't declare `{{#*inline}}` inside a `{{#get}}`** — it breaks its own
  registration and the block renders nothing.
- `{{#get "tags"}}` applies `limit` **before** internal `#hash` tags are dropped
  (and `{{#foreach}}` drops them), so always `filter="visibility:public"`.
  Never `count.posts:>0` — NQL can't filter that aggregate and returns nothing.
- A class with `display:flex` **out-specifies the `[hidden]` UA rule** — always
  pair it with `.thing[hidden] { display: none }`.
- Media-query overrides of same-specificity base rules **must come after them**.

### Left
- `/guide/` and `/docs/` 404 locally until `routes.yaml` is re-uploaded; the
  guide layout is therefore **unverified in a browser**.
- Narrow-viewport screenshots were unreliable (headless ignored the meta
  viewport); responsive rules are reasoned, not visually confirmed.

## 2026-07-15 — settings purged to 1 · hero CRT/VHS + spec sheet · /guide module · width unified · ad opt-out

### Done
- **Custom settings cut from 17 → 1.** Only `color_scheme` survives, freeing 19
  of Ghost's 20 slots. Every other setting's value is now hardcoded in the
  templates (~100 references across 20 files):
  `job_title` → *Salesforce Engineer*, `workplace` → *EF Education First*
  (`https://www.ef.com`), plus the YouTube/Topmate/GitHub/sponsor-email/
  newsletter/footer/webseries values at their previous defaults.
  `{{#if @custom.x}}` wrappers were **removed, not just re-pointed** — left in
  place they'd have silently gone false and hidden their content.
- **Web push dropped from the theme**: `onesignal_app_id` setting, the
  `default.hbs` init and the `sw.hbs` importScripts/`{{#unless}}` split are gone.
  The generic VAPID push handlers stay. Wire push via code injection instead —
  this also clears the OneSignal wrong-domain console error in the backlog.
- **Ads always on + honest opt-out.** `enable_adsense`/`adsense_publisher_id`
  are gone; publisher `ca-pub-1291242080282540` is hardcoded and the loader only
  ships for logged-out visitors (`{{#unless @member}}`). Every unit now carries
  a quiet **"Remove this ad"** control (`components/ad-optout`) opening
  `components/ad-optout-modal` — the pitch is "this ad pays for the work; become
  a member to switch them off", with a Portal signup CTA. Units made responsive
  (`w-full max-w-full`, `display:block`).
- **Hero rebuilt.**
  - *Corner grid*: new `.fade-mask-edges` (inverse of `fade-mask-corners`) —
    texture in the four corners, dissolving toward the centre. The old
    `-z-10` on the pattern layer was dropping it **behind `<body>`'s background**,
    which is why no grid was visible at all; flow order handles it now.
  - *Identity*: the cramped badge row is gone. Role / Company / Based in / From /
    Also now live in a labelled `.hx-spec` sheet (camera-metadata style) with EF,
    Salesforce, 🇭🇺 and 🇮🇳 icons.
  - *Quote*: animated "Cut the chaos." — rule sweeps, words stagger up, full stop
    drops.
  - *Media*: the blinking REC HUD and crop-mark frame above the video are gone.
    In their place a **CRT set** (`components/crt.css`): powers on when scrolled
    into view (line → bloom → picture, flash, scanlines, mains flicker, power
    LED), camcorder OSD (STOP/▶ PLAY · SP · timecode · VHS), and a **play button**
    that runs a VHS tracking tear + chroma bleed before injecting the embed.
    All YouTube chrome disabled (`controls/disablekb/fs/rel/iv_load_policy=0/3`)
    and the iframe is `pointer-events:none`, so the set never breaks character.
    **Nothing is requested from YouTube until you press play** — the hero is off
    the critical path. 16:9 throughout; the fallback still (`assets/images/
    hero-fallback.svg`, 1280×720) is always painted underneath.
  - *Stats*: icons + arrow per stat, labels wrap instead of ellipsing
    ("shots fi…" told the reader nothing), 3-up only from `sm`.
  - *Ticker*: replaced the text-only tag marquee with `home/hero-ticker` —
    icon links to every destination; the duplicated loop copy is `aria-hidden`
    **and** `tabindex="-1"` so links aren't in the tab order twice.
- **Site + navbar widths unified.** New `--w-site` (71rem) / `--gutter`
  (1.25→2rem) tokens drive `.container-site`; the navbar now sits in a real
  `.container-site` (the `!px-0` override is gone) and `.nav-shell` fills it.
  The island no longer shrinks to `max-w-5xl` (64rem vs the column's 71rem —
  that mismatch was the misalignment); only its surface changes on scroll.
- **New `/guide` module** — container/child shape, mirroring course/lesson:
  `#guide` landing post + `#guide-content` steps taking the guide's public tag as
  their primary tag → `/guide/{guide-tag}/{step-slug}/`. Ships `guide.hbs`
  (index), `guide-steps.hbs`, `partials/post/guide.hbs`,
  `partials/post/guide-step.hbs` (**fixed vertical stepper**: sticky rail, nodes
  tick off, rail fills to your position, prev/next never leave the guide),
  `components/guide-stepper`, `components/guide.css`, dispatcher entries, a big
  `home/guide.hbs` homepage section styled alongside the lesson/course blocks,
  and `dummy-content/guide.json` — **the Bangalore Job Seeker's Guide**, 8 steps
  (runway → rent → documents → resume → channels → the loop → the offer → first
  30 days). Ads responsive throughout (in-article + square rail).

### Left / notes
- **`routes.yaml` must be re-uploaded** (Ghost Admin → Settings → Labs → Routes)
  before `/guide/` resolves — Ghost reads routes from its own settings, not the
  theme folder. `/docs/` is 404 locally for the same reason.
- **Restart Ghost** so the new `.hbs` files register (templates map is cached).
- Import `dummy-content/guide.json` to populate the guide.
- Untouched from the master backlog: navbar height/icons, contextual navbar,
  logo/favicon, theme-switch cycle + sounds, Top-10 rename, portfolio/webseries
  sections, per-collection layouts, page transitions, resume/about/contact/404,
  remaining Lighthouse items.

## 2026-07-13 — modular demo content · /docs module · preloader out · lazy skeletons · 404 + hero + subscribe polish

### Done
- **Demo content split into `dummy-content/`**: the single root `import.json`
  (plus `courses-import.json` + `creator-import.json`) is gone. Replaced by one
  self-contained, independently importable Ghost file per module —
  `navigation.json` (nav menus), `course.json` + `lesson.json` (full), and
  sampled `post/video/webseries/project/product/travel/timeline/misc.json`.
  Container integrity verified (children never orphaned; lessons' course tags all
  present in `course.json`). Folder excluded from the release zip; every doc
  reference (README, documentation, instruction, CLAUDE, package.json zip)
  repointed. See `dummy-content/README.md`.
- **New `/docs` module**: `#docs` internal type tag + `docs-*` section tags,
  `dummy-content/docs.json` (11 pages, 5 sections of real theme docs), a `/docs/`
  collection route, `docs.hbs` landing (sidebar + section cards),
  `partials/post/doc.hbs` single-doc layout (grouped sticky sidebar +
  on-this-page TOC + prev/next), dispatcher entry in `post.hbs`, and a `book`
  nav icon for the `docs` slug. Sidebar/section partials:
  `components/docs-sidebar`, `components/docs-nav-section`.
- **First-load preloader removed**: the Netflix-"tudum" intro overlay is gone —
  `components/intro.hbs` deleted, boot script + include removed from
  `default.hbs`, intro IIFE removed from `main.js` (audio helpers kept for the
  theme-switch sounds), and the whole intro CSS block dropped from `tailwind.css`.
- **Site-wide lazy-loading + skeletons**: `main.js` now tags every content image
  with a shimmer `.img-skel` placeholder (fades in on decode) and forces
  `loading="lazy"` + `decoding="async"` — no per-card markup. Below-the-fold
  homepage sections get `content-visibility:auto` (hero excluded for LCP). The
  duplicate `.skeleton` rule in `tailwind.css` was removed in favour of the
  `media.css` shimmer (single source of truth).
- **404 upgraded**: dead `bg-dots` swapped for `bg-pat-dots fade-mask-corners`,
  added cursor parallax + a searchlight that follows the pointer, randomized
  headline, more excuses.
- **Hero grid**: now `fade-mask-corners` — densest in the centre, gradients away
  toward all four corners.
- **Subscribe (bell) modal**: widened `max-w-2xl → max-w-3xl`, vertically
  centered and capped to the viewport with internal scroll so it's never clipped.
- **Housekeeping**: removed the orphaned `blog_quote` custom setting
  (package.json) that was failing gscan. Theme is gscan-clean.

## 2026-07-11 (later) — lesson scroll-hang fix · plain/simple visual pass · content width = navbar island

### Done
- **Lesson page scroll hang fixed**: removed "app mode" entirely (body
  `overflow:hidden` lock on lg+, viewport-height panes, pane-scroll JS in
  lesson.hbs). Lessons now scroll as a normal document; the course rail is
  `lg:sticky` with its own overflow. Rail auto-scroll + 60% auto-complete kept,
  now driven by window scroll only.
- **`.container-site` narrowed** from max-w-site (86rem) to **max-w-5xl** to match
  the navbar island width. Navbar itself untouched.
- **Patterns removed**: `.bg-grid`, `.bg-grid-lg`, `.bg-dots`, `.bg-cross`
  utilities deleted (classes in markup are now inert); fixed full-page grid
  backdrop removed from default.hbs; button hover-grid (`.btn::after`) removed;
  hero rule-of-thirds grid + pointer glow removed; on-air blobs/grid/scanlines,
  pub-sweep, TV scanlines removed.
- **Animations removed**: whole reveal-on-scroll system (+ `body.is-scrolling`
  pointer-events guard), first-load intro quote veil (partial deleted, include
  removed from default.hbs), homepage blog epigraph quote removed, tag-cloud
  blast/bob, floating product chips, portfolio slideshow (first scene shown
  statically), shimmer/pulse loops. Kept: logo (navbar untouched), hero word
  frame, hover transitions, functional skeleton shimmer, confetti.
- **Result**: built screen.css 157KB → 142KB; gscan clean. Site renders content
  immediately (no opacity-0 waiting on JS observers).

## 2026-07-11 — CSS diet: daisyUI removed, dead rules pruned (295KB → 157KB built)

### Done
- **daisyUI dropped entirely** (plugin + 8-theme config + npm dep). It shipped the
  bulk of screen.css; the theme only genuinely used 6 of its classes. Those are now
  ~100 lines of plain Tailwind in tailwind.css: `.tooltip`/`.tooltip-bottom`
  (data-tip), `.collapse`/`.collapse-title`/`.collapse-content`/`.collapse-arrow`
  (native details/summary), `.mockup-browser-toolbar` + `.input` URL pill,
  `.skeleton` (pulse), and `progress.progress` (styled native element). Template
  markup unchanged.
- **color-scheme per mode** re-added in base layer (daisyUI used to set it):
  light by default, dark for `.dark`/`[data-theme=dark|netflix]` — keeps native
  scrollbars/controls correct.
- **23 dead component classes deleted** from tailwind.css + sections.css
  (~180 source lines): float-win*, hx-me*, hx-pill, hero-line, series-deck/card/
  video, timeline-spine(-fill), sub-quote, reel-ui, pub-board/cell/tag, mobile-sub,
  mode-dot, nav-letter, player-bar-progress — all verified unreferenced in .hbs
  and main.js (incl. JS classList toggles) before removal.
- **Result**: built screen.css 295KB → 157KB (~26KB gzipped), gscan clean.
  Directly serves the Lighthouse "reduce unused CSS" + render-blocking items.

## 2026-07-09 — homepage overhaul: intro title card · Swarnil Originals · cinematic portfolio + resume peek · on-air board · tag-cloud blast · snippets/experiences/connect sections

### Done
- **Hero cleaned up**: the "Life looks better…" quote, the floating collection
  pills and the cycling word/ratio frame are gone. New static H1 with one 16:9
  viewfinder frame. The signature quote moved to a **first-load intro title
  card** (`components/intro.hbs`) — animated line-by-line with a 9:16 frame
  around "chaos", shows once per session (sessionStorage), reduced-motion safe,
  home page only.
- **Products section → promo band** (`home/products.hbs`): no more grouped
  listing; floating product thumbnails orbit a centered pitch with one big CTA
  to /products/ (+ shop link). Real `#product` post images feed the float chips.
- **Latest-videos rail**: scroll-snap, prev/next arrow paging, and a thin
  scroll-progress bar under the rail.
- **Webseries = "Swarnil Originals"** (`home/webseries.hbs`): a why-I-make-these
  story block first (editable via new `webseries_intro` custom setting), then a
  Netflix-style rail of **9:16 posters** — no rank numbers — with hover Watch-now
  pill and a trailing "All series" card. Replaces the stacked deck.
- **Portfolio went cinematic** (`home/portfolio.hbs`): tall band, display-size
  headline, fewer facts + more CTAs (resume, contact, experiences, timeline,
  LinkedIn), an auto-crossfading illustration slideshow (VS Code window →
  camcorder → dashboard bars), the filterable project receipts grid, and a
  **resume peek**: a half-visible resume sheet hiding behind two mountain
  layers; hover raises it, click goes to /resume/.
- **New home sections** (all partials, all self-hiding when empty):
  `home/experiences.hbs` (rail of #experience moments), `home/snippets.hbs`
  (VS Code-styled snippet cards on a dark editor band), `home/connect.hbs`
  (collab / sponsor / bucket-list tiles), `home/tags.hbs` (tag cloud that
  blasts outward on scroll then settles and gently floats).
- **On air rebuilt** (`home/publishing.hbs`): dark full-bleed control room with
  drifting gradient blobs + grid + scanlines; channels are big typographic rows
  that reveal on scroll — no content cards.
- **Blog section**: big serif epigraph quote above the bento grid (editable via
  new `blog_quote` custom setting).
- **Timeline**: intro column is now sticky while moments scroll; spine line
  fills with accent color as you scroll (4 nodes shown).
- **Finale video band**: much darker scrim (65→75%) + vignette and top/bottom
  fades so the quote stays readable over the video.
- **Project cards**: build status on the image — amber "in progress" while
  tagged `#now`, green "shipped" for `#now-completed`, neutral "done" otherwise.
- **Course cards (home)**: "Syllabus" button morphs the card — media collapses
  to a 90px strip with overlaid title, description/meta hide, and the full
  lesson list animates in with a Start-course CTA. Course page labels renamed
  Curriculum → **Syllabus** (anchor id stays `#curriculum` so old links work).
- **Footer**: every nav item now carries an icon; sitemap link points to the
  visual sitemap.
- **Visual sitemap**: added Travel, Prompts, Snippets, Experiences, Topics
  (tags) branches + archive link; JSON-LD extended to 15 nav elements.
- **/tags page**: mosaic tiles — biggest tag gets a 2×2 photo tile, images with
  gradient overlays, post counts, hover Explore CTA.
- **Custom settings**: `webseries_intro`, `blog_quote` (homepage group) — 19/20
  slots used.
- New CSS lives in `assets/css/components/home.css`; build + gscan clean
  (2 pre-existing warnings only: custom-fonts support, none fatal).

### Left / needs owner action
- [ ] Restart Ghost after deploy (new partials: intro, home/experiences,
  home/snippets, home/connect, home/tags).
- [ ] Portfolio slideshow uses CSS illustrations — swap in real illustrations/
  photos later if wanted.
- [ ] Tag cloud caps at 40 tags; /tags page at 100.

## 2026-07-08 — carousel scroll-trap fix · schedule-style timeline · prompts/snippets split · archive & tag upgrades

- **Scroll-time hover guard (2026-07-09)**: scrolling with the cursor over the
  video carousel still dropped frames — every card passed fired hover
  shadow/scale transitions and preview timers, and the non-passive wheel guard
  kept scroll on the main thread. main.js now toggles `body.is-scrolling`
  (cleared 150ms after the last scroll event) and CSS sets
  `pointer-events: none` on `<main>` while it's on, so mid-scroll wheel/hover
  bypass all of it and scrolling stays compositor-threaded.
- **Carousel vertical-scroll trap fixed everywhere**: the `[data-hscroll]` wheel
  guard now scrolls the window with the always-instant two-arg `scrollBy` (the
  options form could smooth-animate per tick and freeze the page) and honors
  Firefox line/page `deltaMode`; removed `scroll-smooth` from the home videos
  track (smooth+snap animated every wheel tick); `.reels-rail` gained
  `touch-action: pan-x pan-y` + `overscroll-behavior-x: contain` so vertical
  swipes keep panning the page on mobile. Also wired the previously dead
  prev/next arrows on the home videos rail (explicit per-click smooth scroll).
- **Per-card hover fixed globally**: reveal-on-scroll left
  `[data-reveal-stagger].is-visible > * { transform:none }` (outside the
  components layer) permanently overriding every card's hover lift and
  hijacking its transition. main.js now strips the reveal hooks after the
  entrance animation, so cards regain their own hover styles. Removed
  `!transform-none` from home course tiles — each tile lifts individually.
- **Timeline → animated schedule**: each entry now has a tear-off calendar
  leaf (red month bar, big day, year) that tilts on card hover, plus an analog
  SVG clock whose hands sweep to the publish time (JS sets rotation; CSS
  transition animates); the active entry's red second hand ticks (60-step
  keyframe). Reduced-motion disables all of it. Spine fill + year nav kept.
- **Prompts / snippets split**: routes.yaml now has `/prompts/` (#prompt) and
  `/snippets/` (#snippet, new snippets.hbs); each page cross-links the other's
  latest 3. Mega panel + mobile menu link both. **Re-upload routes.yaml.**
- **Archive rows**: feature-image thumbnail (16:10, fallback pattern),
  collection badge extended (build log, prompt, snippet, trip, travel,
  experience), public primary tag shown, hover arrow.
- **Tag page**: full hero — tag feature image (16:9 card, right column),
  description with fallback copy, post count chip, "All topics" link.
  /tags tiles now show the tag's feature image instead of the # monogram
  when one is set.

## 2026-07-08 — full PWA (offline + push) · medium navbar · static S-camcorder logo

- **Service worker re-enabled** (`sw.hbs` at `/sw/`): three versioned caches —
  network-first pages (+ navigation preload) with `/offline/` fallback and a
  50-page cap; stale-while-revalidate for `/assets/` + `/public/`; cache-first
  `/content/images/` with an 80-image cap. Ghost admin/members/media never
  intercepted. `SKIP_WAITING` message hook.
- **Registration** (`default.hbs`): registers `/sw/` at root scope, heals the
  legacy broken `/sw.js/` registration, and fails gracefully with a console.info
  until the `Service-Worker-Allowed: /` header is set at the proxy/CDN
  (theme-customize.txt §11 has nginx + Cloudflare recipes; impossible on
  Ghost(Pro) — site just works without offline there).
- **Push notifications**: new theme setting **OneSignal App ID**. When set, the
  OneSignal v16 SDK loads deferred and its push worker is `importScripts`-merged
  into our `/sw/` (custom-integration mode) — remove the old code-injection
  snippet and fix the dashboard site URL to the exact www domain. When empty,
  the worker ships generic VAPID `push`/`notificationclick` handlers instead.
- **Manifest**: added `id`, `lang`, `display_override`, `categories`;
  `orientation: any`. `apple-touch-icon` + status-bar meta in head.
- **Install prompt**: `beforeinstallprompt` handler in main.js reveals an
  "Install app" button in the mega-panel footer.
- **Navbar → medium**: shell `py-2.5 pl-4` (island `py-1.5`), nav links
  13.5px / roomier padding, icon buttons 36px, 9-dot 32px, logo mark 32px,
  spacer raised to 4.5rem/5rem.
- **Logo**: replaced the 6.5s stroke-drawing choreography with a static
  S-in-camcorder-viewfinder mark + pulsing red REC bubble (~100 lines of
  keyframe CSS deleted — also clears the "non-composited animations" audit).
  Tagline ("documenting …") now desktop-only; mobile shows just **Swarnil**.
- **Favicon**: transparent background, ink/paper auto-switch via
  `prefers-color-scheme`, red REC dot.
- **Perf docs**: theme-customize.txt §11 documents `Cache-Control: immutable`
  for `/assets|public/` (Lighthouse cache-lifetimes item) alongside the SW header.
- **Needs owner action**: set the `Service-Worker-Allowed` header + cache
  lifetimes at the CDN/proxy; create OneSignal app (Custom Code mode, exact
  www URL), paste App ID into theme settings, delete old code-injection snippet.

## 2026-07-08 — 3 new collections + dedicated project tags

- **Fixed shared-tag bug**: projects nested build-logs under `topic-1` (a site-wide
  tag). Each project now gets a **dedicated** public tag (`project-1/2/3`) that is the
  container's primary tag and is shared ONLY with its build-logs. Steps re-pointed
  from `topic-1` → `project-1`.
- **Prompts + snippets** (`/prompts`): chat-styled prompt pages (`post/prompt.hbs`
  splits the first code block into a "You" bubble + copy button, the rest into an
  "Assistant" bubble); `#snippet` code pages (`post/snippet.hbs`, editor chrome +
  copy). Cards + collection page. New generic `[data-copy]` handler in main.js.
- **Experiences** (`/experiences`): life "moments" — photo + story cards, story
  detail page. `#experience`.
- **Bucketlist** (`page-bucketlist.hbs`): quote header + two columns
  `#bucketlist-to-do` / `#bucketlist-done` with check styling.
- **Navigation**: added Prompts, Experiences, Bucketlist, Collab to the mega-panel
  (desktop + mobile).
- **CSS**: new `components/collections.css` (chat bubbles, snippet cards, experience
  cards, bucketlist).
- **import.json**: dedicated project tags + 2 prompts, 2 snippets, 3 experiences,
  4 to-do + 3 done bucketlist items, 1 members-only post.
- **Needs owner action**: re-upload `routes.yaml` (now has /prompts + /experiences),
  create Ghost Pages "bucketlist" & "collab", re-import `import.json`, restart Ghost.

## 2026-07-08 — projects build-logs; quote transition removed

- **Removed** the page-transition quote overlay (JS + `transition.css`). Kept the
  `<html>` paper-background fix that stops the white flash between navigations.
- **Projects → build-logs** (mirrors courses↔lessons):
  - `#project` = the project container; `#project-detail` = build-log steps that
    live inside it at `/projects/{project-tag}/{slug}/` (new `/project-steps-index`
    collection in routes.yaml, `project-details.hbs` index).
  - New `post/project-step.hbs`: the parent project's repo-style hero stays constant;
    only the body + rail change. Left rail is a vertical build-log timeline (start ▶,
    ship ✓, numbered middles, current highlighted), with prev/next within the project,
    "Step X of Y", day-N since kickoff, and a "back to project" action.
  - `post/project.hbs` overview gained a **Build log** section (same timeline + "N steps
    · D days start to ship") and a **#blog-project** companion-writing cross-link.
  - New `.buildlog*` styles in `components/sections.css`.
- **Needs owner action**: re-upload `routes.yaml` (Ghost Admin → Settings → Labs → Routes)
  and restart Ghost for the new `project-details` template + collection.

### Still queued (from the 4-part request)
- Prompts + #snippet collection (`/prompts`, LLM-chat styling + copy buttons).
- Experiences collection (life "moments" — photo + story cards).
- `/bucketlist` page (quote header, #bucketlist-to-do / #bucketlist-done columns).
- /projects page extra sections (learn-by-doing, process, resume, GitHub, #video cross-links).
- import.json content for all of the above + members-only / more courses·lessons·webseries.
- Nav (primary + secondary) entries for the new collections; restyle the home publishing board.

## 2026-07-08 — carousel lag + page transitions

- **Carousel lag fix**: hover-preview iframes no longer mount mid-scroll — a scroll
  guard suppresses previews for 250ms after any scroll and tears down active ones,
  killing the jank when scrolling while hovering a video card.
- **Page transitions**: `<html>` now paints the paper colour (not browser-white)
  between navigations, and a paper overlay with a rotating, non-repeating
  life/work-balance quote (20-quote shuffled queue, sessionStorage) sandwiches the
  flash. Reduced-motion skips it; video pages keep their own TV-off transition.
  New `components/transition.css`.

## 2026-07-08 — video system build-out

- **Video cards, real previews**: image-less `#video` cards now extract the post's
  OWN first YouTube id (via a `<template data-video-src>`), paint that thumbnail and
  hover-autoplay a muted reel (`main.js`). No more shared placeholder id.
- **Homepage ranked carousel** (`home/latest.hbs`): rank numbers now sit *behind* each
  frame and peek out on the left (absolute + frame padding), with real gaps. Vertical
  wheel over any carousel now scrolls the PAGE instead of being hijacked into horizontal
  scroll — `[data-hscroll]` handler in `main.js`; horizontal gesture still scrolls the row.
- **New homepage section** `home/publishing.hbs` — animated "how I publish" broadcast board
  (schedule / newsletter / live / IG live / shorts / collabs), live-pulse + sweep, with a
  newsletter pitch + subscribe. Inserted after the video row.
- **/videos**: in-feed AdSense after every 3rd card (`{{#has number="nth:3"}}`, full-row);
  a dedicated **Shorts & Reels 9:16 rail** for `#video` posts also tagged `#reel`/`#shorts`
  (new `cards/reel.hbs`, `.reels-rail`), excluded from the main grid; work-with-me CTA band.
- **Video detail** (`post/video.hbs`): mobile-friendly tappable timestamps (linkifies any
  timestamp text, not just the chapter table); cross-links — `#product`+`#product-video`,
  `#course`+`#course-video`, `#blog`+`#blog-video`; a "came from YouTube?" audience CTA
  (subscribe to site / YouTube / feedback); sponsor+collab band; JSON-LD thumbnail now
  falls back to the YouTube maxres/hq thumbnail.
- **New CTA partial** `components/collab-cta.hbs` (Put your brand in front of my audience →
  /sponsor, Let's collab → /collab). **New page** `page-collab.hbs` (create a Ghost Page
  "collab", like contact/sponsor — no route needed).
- **CSS**: new `components/sections.css` (publishing board, CTA band, reels rail) imported.
- **import.json**: added 5 tags (#reel #shorts #product-video #blog-video #course-video) and
  7 demo posts (image-less videos, a short + a reel, product-video, blog-video, course-video,
  and a chapters/timestamps demo) so all of the above is testable.

## 2026-07-08 — button system

- Extracted buttons out of `tailwind.css` into `assets/css/components/buttons.css`.
- **Height/padding fix**: icons ship with hardcoded 16–18px sizes, so icon buttons
  rendered taller than text-only ones. `.btn svg { width:1.15em }` + `leading-none`
  + a per-size `min-height` make every button of a size identical.
- **Size scale**: `btn-xs / btn-sm / (default) / btn-lg / btn-xl`, plus `btn-block`,
  `btn-square`, `btn-icon`. Variants set colour only, so any variant × any size composes.
- **Variants**: `primary, secondary, ghost, soft, subtle, outline, danger, link`, and
  on-dark `invert` / `glass`.
- Refactored the repeated `!bg-white !text-black` / glass override clusters in
  travel, videos, webseries, home/webseries, home/newsletter and post/series to
  `btn-invert` / `btn-glass`.
- Variants are **safelisted** in `tailwind.config.js` (Tailwind purges unused
  `@layer components` classes) so all are always shipped.
- Preview: see the button-system artifact (variants/sizes/states, light + dark).

## 2026-07-08 — media system + LCP rescue

### Done
- **Structured CSS**: started an `assets/css/components/` folder (postcss-import verified
  working through the Tailwind CLI). First partial `components/media.css` holds the cinematic
  video-hero, skeleton/shimmer, and video-card preview systems — extracted out of the
  per-template inline `style="…"` blocks. `@import` sits at the top of `tailwind.css`.
- **Lazy YouTube facades (LCP fix)**: `/videos`, `/webseries`, and the series detail hero no
  longer ship an autoplay `<iframe>` in the HTML. They paint a lightweight poster
  (YouTube thumbnail / feature image) and `main.js` mounts the muted reel after `load`+idle
  (IntersectionObserver, skipped under reduced-motion). Removes the heavy render-blocking
  player from first paint — the main driver of the 20.7 s LCP.
- **Series detail hero bug**: was washed to near-white in light mode (paper-tinted scrims +
  ink text) so the image "disappeared". Now a proper dark cinematic treatment
  (`.video-hero-scrim-b/-x`, white text) that reads in every theme mode; always shows a
  poster even with no feature image or under reduced-motion.
- **Video card fallback**: `#video` posts with no feature image now use the video thumbnail
  and hover-mount a muted reel (`[data-yt-preview]`), instead of the empty dotted box.
- **Skeletons**: lazy `<img data-skeleton>` fades in on decode over a shimmer placeholder.
- **Perf misc**: explicit `width`/`height` on new posters/cards (CLS), `fetchpriority=high`
  on hero LCP posters, `preconnect` to `i.ytimg.com`, `decoding=async`.
- Fixed a malformed `class="…aria-hidden="true""` attribute in `cards/video.hbs`.

### Notes for owner
- The image-less fallbacks use the site's canonical demo video id `ecOkmTD7KhU`. For real
  per-post thumbnails, store each video's id (custom field or first embed) — the facade
  markup already keys off `data-yt-bg` / `data-yt-preview` so it's a one-attribute swap.
- adsbygoogle double-push is already guarded in `main.js` (per-`ins`); the console error was
  a stale cached bundle. Hard-refresh after deploy.

## 2026-07-07 — "the big one" (v1.2)

### Done
- **Navbar**: much shorter (h-8 controls, py-1.5 shell), theme-defined iconified menu
  (admin default nav ignored on purpose), mobile menu iconified, mega panel updated
  with Travel/Topics/About/Guestbook.
- **Theme switcher**: dropdown → single cycle button (`#mode-cycle`) with per-mode glyph
  and synthesized sounds (light tick, dark cockroach skitter, salesforce Teams-ish ding,
  youtube pop, netflix tu-dum, claude keyboard). WebAudio only — no copyrighted samples.
- **Contextual navbars**: lesson pages get course-player chrome (✕ close, "lesson x of y",
  progress bar, prev/next); episodes get player controls (✕, prev/next ep, fullscreen).
  Global navbar hidden via `body.tag-hash-lesson` / `.tag-hash-episode`.
- **Logo**: new morphing SVG mark (frame corners + self-drawing S + rec dot), favicon matched.
- **Page transitions**: per-collection overlays (videos=TV static, projects=terminal run,
  travel=flight, trips=paper plane, shop=cart, courses=study pop, timeline=years blur,
  guestbook=scribbles, webseries=tudum+sound, sponsor=money rain, resume=unfold,
  newsletter=envelope) + rotating funny quotes. Honors reduced-motion.
- **Hero v3**: main frame = muted autoplaying YouTube (ecOkmTD7KhU) with camera chrome;
  IG-reel dummy b-roll frame; "take 47" photo card with video behind; typewriter word
  "cinematic" summons a 16:9 corner-bracket video frame around the text, fades on delete.
- **Home**: "Top 10" → "Most recent on swarnil"; carousel no longer traps vertical scroll
  (snap-proximity + touch-action); new portfolio/recruiter section w/ resume CTA; new
  cinematic webseries billboard section.
- **Videos**: library is a Netflix poster wall (2:3 cards, gradient, overlay meta).
- **Projects**: cards get a social-preview image strip / generated logo tile.
- **Products**: fixed filter rail (groups from #group-* tags), compact cards, count + empty state.
- **Course**: curriculum moved into main column; sidebar = "made with this gear"
  (#course-gear products) + two sticky ad units.
- **Timeline**: accent spine that fills as you scroll (existing year nav + active nodes kept).
- **Travel system**: routes for /travel/ (trips, #trip) + /travel/{trip}/{story} (#travel);
  /travel index has full-width bg video + quote + client-side country/category filters
  (#country-*, #travel-category-*); trip overview = itinerary layout; travel story =
  full-bleed photo header. TouristTrip/Article JSON-LD.
- **Pages**: /about (three acts + FAQ + Person JSON-LD), contact form (formsubmit.co),
  resume gained Selected projects, Talks & milestones, Daily tools, Languages;
  404 is now animated + sarcastic (glitch 404, floating detective, excuse reel).
- **Tags**: /tags tile pile (all public tags, post counts); tag pages get in-feed +
  bottom ads and 2xl side-rail ads.
- **Header leaderboard**: collection headers show a 728×90 unit on xl+ (only when
  AdSense enabled — no placeholder, so UX unaffected otherwise).
- **Perf/SEO**: adsbygoogle double-push fixed (single guarded push in main.js);
  preload for screen.css + preconnects (pagead2/youtube/coverr); width/height added to
  new imgs; llms.txt served via /llms/ route + redirect (H1 + links → passes audit).
- **import.json**: regenerated with generic names (Video Title — n, Project Name — n,
  Course Name — 1, Lesson — n, Episode — n, Trip Name — n, Travel Story — n, Product
  Name — n, Ghost Theme — 1…), all embeds = youtube.com/watch?v=ecOkmTD7KhU, travel
  content included. 56 posts, 45 tags.
- **Mode design systems**: youtube/salesforce/netflix/claude now adjust radii, shadows,
  weights and (claude) serif body — not just colors.

### Left / needs owner action
- [ ] **Upload routes.yaml** (new travel/tags/llms routes) in Ghost Admin → Settings → Labs.
- [ ] **Upload redirects.yaml** (llms.txt redirect) same place.
- [ ] **Restart Ghost** after deploying so new templates (travel, tags, llms, page-about,
  page-guestbook) are discovered.
- [ ] **OneSignal console error**: SDK is initialized for https://imswarnil.com but the site
  serves from https://www.imswarnil.com — fix the domain in the OneSignal dashboard/code
  injection (not a theme file).
- [ ] **BigBuckBunny.mp4 403**: comes from post content / code injection, not the theme —
  replace that URL in the offending post.
- [ ] **Cache lifetimes (677 KiB)**: set long-lived Cache-Control for /assets/* at the
  proxy/CDN (Ghost default is 1y for hashed assets; check the CDN override).
- [ ] Ghost's own /public/cards.min.css is render-blocking (490ms) — theme can't defer it;
  consider a CDN edge rule or accept it.
- [ ] Old demo data.json superseded by import.json — delete after confirming import works.
- [ ] Image delivery savings: mostly Unsplash/picsum demo images; real content should use
  Ghost image resizing (cards already request sized variants).
- [ ] Sounds/transitions: consider a user setting to disable (currently gated only by
  prefers-reduced-motion).
