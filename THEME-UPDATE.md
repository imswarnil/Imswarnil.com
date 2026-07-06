# Theme update log

Running record of what's done and what's left. Master backlog lives in CLAUDE.md.

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
