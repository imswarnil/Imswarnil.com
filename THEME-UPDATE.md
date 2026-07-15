# Theme update log

Running record of what's done and what's left. Master backlog lives in CLAUDE.md.

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
