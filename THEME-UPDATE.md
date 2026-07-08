# Theme update log

Running record of what's done and what's left. Master backlog lives in CLAUDE.md.

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
