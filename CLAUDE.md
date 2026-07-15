# Swarnil theme — working notes for Claude

Tailwind-based Ghost theme. Tag-driven collections (routes.yaml), demo content in
the `dummy-content/` folder (one Ghost-import file per module + navigation.json +
docs.json + guide.json; see dummy-content/README.md), build via `npm run build`, validate via `npx gscan .`,
release via `npm run zip`. Local Ghost runs at localhost:2368 (templates map is
cached — new .hbs files need a Ghost restart).

## Theme settings — hard rule
Ghost allows a maximum of **20 custom settings**. As of 2026-07-15 the theme
ships exactly **one**: `color_scheme`. Everything else (job title, workplace,
social URLs, sponsor email, AdSense publisher, hero media) is **hardcoded in the
templates on purpose** — do not reintroduce a custom setting without asking.
Identity values in use: Salesforce Engineer · EF Education First
(https://www.ef.com) · Budapest, Hungary · from India.

## Widths
`--w-site` (71rem) and `--gutter` in `tailwind.css` `:root` are the single source
of truth for horizontal rhythm. `.container-site` and `.nav-shell` both derive
from them so the nav island's edges line up with the content column. Don't
hardcode a max-width in either.

## Master backlog (from Swarnil, 2026-07-06) — DO NOT DROP ITEMS
Track progress in THEME-UPDATE.md. Items below are the source of truth.

### Navigation / chrome
- [ ] Navbar sleeker: reduce height, smaller buttons, icons on menu items.
- [ ] Default admin nav ("Home / Getting started") looks wrong — theme ships its own proper iconified menu.
- [ ] Contextual navbar: on lesson pages navbar becomes course-player chrome (progress bar, ✕ close course). On webseries episodes navbar has player controls.
- [ ] Logo: new SVG mark that shows personal style, subtle morph/slideshow animation (lottie-ish, not distracting). Favicon derived from logo.
- [ ] Theme switcher: replace dropdown with a cycle switch (click cycles 6 modes, shows mode logo) + sounds per mode: light=tick, dark=cockroach skitter, salesforce=Teams-style notification, youtube=pop, netflix=tudum-ish, claude=keyboard typing. (Synthesized WebAudio — no copyrighted samples.)

### Homepage
- [ ] "Top 10" → rename to "Most recent on swarnil"; Netflix-style cards belong on /videos collection instead.
- [ ] Top-10 carousel sometimes traps vertical scroll — fix touch behavior.
- [ ] Portfolio section for recruiters: details, skills, experience, CTA to resume.
- [ ] Separate cinematic webseries section (video/photo background with text overlay).
- [ ] Keep guestbook section (liked).

### Collections & layouts
- [ ] /videos: Netflix-style cards.
- [ ] Projects cards: include image/logo.
- [ ] Products-I-use: smaller cards + fixed sidebar panel filtering by #group-* tags.
- [ ] Webseries layout liked, but add video/photo w/ text overlay (can't currently see media).
- [ ] Episode page: full width, episode list on the RIGHT side.
- [ ] Course layout: NO curriculum in sidebar — sticky ads + "products I used to make this course" instead; curriculum in main column.
- [ ] Lesson layout: look/feel like a real course player incl. pagination; responsive on mobile.
- [ ] Timeline: more animated — illustrations, background line fill-on-scroll effect.
- [ ] Travel system: /travel page; #trip = container (like course/webseries); #travel posts link via primary tag; also #country-* and #travel-category-* tags surfaced properly on /travel; full-width background video at top with a quote + illustrations. Trip post like course overview.
- [ ] /tags page: tile-pile of all public tags; tag/{slug} layout with AdSense + rail ads both sides if viable.
- [ ] Headers: when content is left-aligned, allow 728×90 leaderboard ad on the right — only if it doesn't hurt UX.
- [ ] All collections + single posts: JSON-LD and table of contents.

### Pages
- [ ] Complete resume page — much more detail; opens like folded paper unfolding.
- [ ] Amazing about page.
- [ ] Contact page: real form.
- [ ] 404: humorous, sarcastic, illustration-based animation.

### Hero
- [ ] Typewriter: when "frame" is typed, a 16:9 frame wraps the text with video playing inside, then fades out.
- [ ] Right side: autoplay YouTube video (https://www.youtube.com/watch?v=ecOkmTD7KhU) as the main frame.
- [ ] "take 47" frame → photo with text, video behind.
- [ ] b-roll frame → dummy IG-reel UI.

### Motion / transitions
- [ ] Micro-animations + page transitions everywhere (efficient).
- [ ] Collection-flavored page transitions: videos/youtube=old TV static; projects=VS Code run+enter; travel=flight take-off/landing; individual trips=paper plane with title as tail; shop=cart ready; courses=study setup (pen/table); timeline=years passing motion-blur slides; guestbook=multi-font scribbles; webseries=Netflix tudum; sponsor=cash machine withdrawal / money rain; resume=paper unfold; newsletter=envelope open/close.
- [ ] Random funny quotes shown during transitions.
- [ ] Theme modes should follow each brand's full design system (type, radii, components) — not just colors. (Claude/YouTube/Salesforce currently barely differ.)

### Content / data
- [x] Rewrite import.json with generic realistic names: "Project Name — 1", "Course Name — 1", "Episode 1", "Trip — 1", "X-Skill" etc. All video embeds use https://www.youtube.com/watch?v=ecOkmTD7KhU. Include travel demo content.
- [x] theme-update.md: running log of done/left.

### Performance / SEO (Lighthouse: perf 64 — fix, don't skip)
- [ ] Render-blocking CSS (~760ms): screen.css (320ms) + Ghost's public/cards.min.css (490ms) — defer/inline strategy.
- [ ] Document request latency (~180ms), efficient cache lifetimes (677KiB) — server/CDN config; document what to set.
- [ ] Improve image delivery (635KiB): explicit width/height on imgs, responsive sizes.
- [ ] Reduce unused CSS (18KiB) / unused JS (472KiB — mostly third-party ads/OneSignal).
- [ ] Forced reflow + 8 long main-thread tasks + non-composited animation — audit JS/animations.
- [x] Console errors: (1) OneSignal "Can only be used on https://imswarnil.com" — site code-injection config, fix domain; (2) BigBuckBunny.mp4 403 — replace fallback hero video URL; (3) adsbygoogle.push() double-push TagError — push guard needed.
- [ ] llms.txt fails agentic-browsing audit: needs H1 + links. Ghost routes reject dotted paths → serve /llms/ + redirect llms.txt (like ads.txt).
- [ ] Overall: fast, reusable components, keep SEO 100.
