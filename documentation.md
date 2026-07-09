# Swarnil Theme — Documentation

How everything works: collections, tags, pages, homepage, navigation, theme
modes, members, ads, and the dev workflow. Written for future-you.

---

## 1. The big idea

Everything on this site is a **Ghost post**. What *kind* of thing a post is —
a video, a project, a lesson, a travel story — is decided entirely by its
**internal tags** (tags starting with `#`). Ghost's `routes.yaml` splits those
tagged posts into separate **collections**, each with its own URL space and
template, and `post.hbs` dispatches every single post to the right layout by
checking its tags.

```
post + #video   → lives at /videos/{slug}/    → rendered by partials/post/video.hbs
post + #project → lives at /projects/{slug}/  → rendered by partials/post/project.hbs
…and so on
```

Two rules to remember:

1. **The internal tag decides the type.** One type tag per post (`#video`,
   `#blog`, `#project` …).
2. **Container relationships use the primary (first) PUBLIC tag.** A lesson's
   first tag must be its course's public tag; an episode's first tag is its
   series tag; a travel story's first tag is its trip tag.

Upload `routes.yaml` in **Ghost Admin → Settings → Labs → Routes** whenever it
changes, and restart Ghost after adding new template files (Ghost caches the
template map at activation).

---

## 2. Collections, one by one

### Videos — `#video` → `/videos/{slug}/`
- **Index** `videos.hbs`: cinematic video-background hero (black overlay + TV
  lines), upload-schedule card, featured latest video, 16:9 card library.
- **Post** `partials/post/video.hbs`: full-width theater — player 70% left,
  chapters 30% right. The **first YouTube embed/link in the post body** is
  hoisted into the player automatically.
- **Chapters**: add a table anywhere in the post whose first column is
  timestamps (`0:00`, `1:24`, `1:02:10`). It becomes the clickable chapter
  list — clicking seeks the player (YouTube IFrame API), the active chapter
  highlights, and Clip JSON-LD is emitted.
- Gear section pulls `#product + #course-gear` posts.

### Blog — `#blog` → `/blog/{slug}/`
Standard articles via `partials/post/article.hbs` (TOC, share, related, ads).

### Projects — `#project` → `/projects/{slug}/`
- GitHub-style cards: repo strip image (or generated tile), description, meta.
- **Derived links**: repo = `github.com/imswarnil/{slug}`, live site derived
  from the slug (see `cards/project.hbs`).
- **Skill chips**: add internal `#skill-*` tags (e.g. `#skill-Tailwind`) — they
  render as language-dot chips and power the skill **filter** in the homepage
  portfolio section.

### Courses — `#course` → `/courses/{slug}/` + Lessons — `#lesson` → `/courses/{tag}/{slug}/`
The learning system:
- The **course post** is the container. Give it a **public primary tag**
  (e.g. `Course Name — 1` → slug `course-1`).
- Every **lesson post** gets `#lesson` and that course tag as its **FIRST**
  tag. Lesson URLs nest under the course:
  `/courses/course-1/lesson-2/`.
- Course page (`post/course.hbs`): Udemy-style — blurred-poster hero with
  inline stats, and a **sticky enrolment card** (preview of lesson 1, price/
  access, includes-list, share) riding the right rail for the whole page.
  Left column: about, curriculum rows (lesson thumbnails, durations, done
  badges, preview pills), teaching principles, instructor, FAQ, gear
  (`#course-gear`), prev/next course, related, discussion. Lesson lookups
  resolve the course's **first PUBLIC tag** (never `primary_tag`, which is
  null when an internal tag sits first).
- Lesson page (`post/lesson.hbs`): app mode. On desktop the page locks to the
  viewport — course rail left (line-divided, no boxes), lesson pane right; a
  course-player top bar replaces the navbar (logo + course, position-based
  progress, prev/next, theme switch, ✕ back to course). Mobile gets a
  hamburger that opens the course navigation as a panel modal.
- **Progress bar is position-based** (lesson 2 of 4 → 50%); completion ticks
  live in `localStorage` per course (`swarnil-progress-{tag}`) — auto at 60%
  scrolled, or via the manual "Mark complete" toggle. **The last lesson swaps
  "next" for a Complete-course button**: confetti, mark done, back to the
  course page. Prev/next come from the rail (never leave the course; no
  "previous" on lesson 1).

### Webseries — `#webseries` → `/webseries/{slug}/` + Episodes — `#episode` → `/webseries/{tag}/{slug}/`
Same container pattern as courses:
- Series post = container with public primary tag; episodes carry `#episode` +
  that tag first. Episode 1 = oldest published (`order: published_at asc`).
- Series page: the global navbar is replaced by **Netflix chrome** (← browse,
  title, episodes jump, subscribe, theme, ✕). Backdrop: series poster → first
  episode poster, and **if the series content opens with a YouTube video it
  plays as the hero background** (muted loop; ambient reel as final fallback).
  Cast chips auto-style from a "Cast" list; TVSeries JSON-LD built client-side.
- Episode page: TRUE full-width theater (first embed hoisted), queue on the
  right with "Now playing" highlight, player chrome replaces the navbar (✕,
  prev/next from the QUEUE — never crosses collections — fullscreen).
  "Episode N of T" and JSON-LD episodeNumber fill client-side.
- **Critical rule: never wrap a whole post template in `{{#get}}`** — inside a
  get block the post context breaks and `{{content}}` renders "undefined".
  Use small scoped gets per lookup instead.

### Travel — `#trip` → `/travel/{slug}/` + Stories — `#travel` → `/travel/{tag}/{slug}/`
- **Trip post** (`#trip`) = the container (like a course). Public primary tag,
  e.g. `Trip Name — 1` → `trip-1`.
- **Travel stories** (`#travel`) carry the trip tag first and render as
  full-bleed photo pages with prev/next "stops".
- **Metadata tags** (internal, ride along on trips *and* stories):
  - `#country-hungary`, `#country-india` … → country pills with a map pin
  - `#travel-category-beach`, `#travel-category-city` … → category pills
- `/travel/` index: full-width background video + quote, trip cards with
  country/category chips, and a client-side filter bar built from those tags.
- Trip page: cinematic header, day-by-day itinerary of its stories, travel
  kit (`#product + #group-travel`), TouristTrip JSON-LD.

### Products — `#product` → `/products/{slug}/`
"Things I use" reviews. Grouping via internal tags:
- `#group-services`, `#group-my-setup`, `#group-skin-care`, `#group-travel`
- `#course-gear` marks items shown on course/video pages as "made with".
- `/products/` has a fixed filter rail driven by those groups.

### Shop — `#shop` → `/shop/{slug}/`
Digital downloads. Add the **public `Themes` tag** to theme products — they
get a "Theme" badge and float into the homepage shop section.

### Timeline — `#timeline` → `/timeline/{slug}/`
Life events. Sub-type with **event tags** (these also feed the resume):
- `#event-company-change` → Experience (resume + recruiter widget)
- `#event-education` → Education
- `#event-award` → Awards
- `#event-milestone` → Talks & milestones
`/timeline/` renders a center-spine timeline with year markers, a scroll-fill
spine, year nav rail, and deep links (`#tl-{slug}`, `#tl-year-2026`).
**Feature (star) a timeline post** to prioritise it on the homepage strip.

### Changelog — `#changelog`, Newsletters — `#newsletter`
Site release notes and past issues; straightforward collections.

### Now — `#now` / `#now-completed` (not a collection — a homepage signal)
Tag any post `#now` and it appears in the homepage "Now" fan as an
*in-progress* card (pulsing amber). Swap the tag to `#now-completed` when done
(green ✓). Cards wear their type's costume automatically: project → VS Code
window, video → camcorder, webseries → episode, travel → map, newsletter →
envelope, everything else → notepad.

### Archive — `/archive/`
Catch-all listing of everything, lazy-loaded.

---

## 3. Helper tags (internal)

| Tag pattern | What it does |
|---|---|
| `#duration-1h-30m`, `#duration-45m` | Human duration badges on videos/courses/episodes + ISO durations in JSON-LD |
| `#skill-*` | Project skill chips + portfolio filter |
| `#group-*` | Product shelf grouping |
| `#course-gear` | "Made with this gear" on courses & videos |
| `#event-*` | Timeline sub-types → resume sections |
| `#country-*`, `#travel-category-*` | Travel pills & filters |
| `#now`, `#now-completed` | Homepage Now fan status |

---

## 4. Pages

| Page (slug) | Template | Notes |
|---|---|---|
| `/about/` | `page-about.hbs` | Title card, live stats, three acts, hobbies, FAQ, Person JSON-LD |
| `/contact/` | `page-contact.hbs` | Cards + a real form (formsubmit.co → sponsor email; first submission needs one-time activation) |
| `/guestbook/` | `page-guestbook.hbs` | Two-column wall of love: pinned hero left (floating note illustrations + what/how/why explainer), scrolling comments wall right |
| `/resume/` | `page-resume.hbs` | Custom document bar replaces the navbar (← Home, PDF = print, Hire me). Pulls experience/education/awards from `#event-*` timeline posts |
| `/sponsor/`, `/welcome/` | existing pages | — |
| `/tags/` | `tags.hbs` (route) | Tile pile of all public tags |
| `/llms/` | `llms.hbs` (route) | llms.txt content; `redirects.yaml` maps `/llms.txt` here |

The **hero post** (slug `hero`) is optional legacy; the current hero reads
site settings + featured/latest posts directly.

---

## 5. Homepage anatomy (`home.hbs`)

Order and data source of every section (all partials in `partials/home/`):

1. **hero** — framed shell, morphing aspect-ratio word frame, HUD (REC + live
   ratio), square media frame (featured post image, muted YouTube cover
   video), collection badge pills, live stat tiles, tag marquee (public tags,
   pauses on hover).
2. **latest** — ranked #video row, numbers 70% outside the cards.
3. **now** — the 3D fan (see §2 Now).
4. **webseries** — stacked deck carousel; front card auto-plays the series'
   first embed.
5. **blog** — bento grid (first post 2×2 hero tile).
6. **portfolio** — "Dear recruiter": skills / career summary / dashed career
   timeline widgets (`#event-company-change`), resume + hire-me CTAs,
   skill-filterable project cards.
7. **courses** — why-I-teach column + course cards with meta and hover lesson
   peek.
8. **shop** — digital downloads & themes.
9. **products** — grouped shelves: recent purchases, tools I love (services),
   products I use (setup), recommendations (rest).
10. **timeline** — classic spine strip, featured-first, giant year watermark.
11. **guestbook** — teaser.
12. **newsletter** — the finale: full-width video band (lazy-loaded iframe),
    black overlay + grid lines, quote, big Subscribe button (opens the pitch
    modal) + inline email form.

Ad slots sit between sections. Homepage JSON-LD declares a WebPage with
`hasPart` entries for every section.

---

## 6. Navigation & chrome

- **Menu = Ghost Admin → Settings → Navigation**, rendered natively through
  `partials/navigation.hbs` (icons matched by slug: home, videos→play,
  blog→pencil, about→user, contact→card, etc.; unknown slugs get a letter
  badge). **Nesting convention**: label `- Child` nests under the item above;
  `-- Grandchild` goes one deeper (folded into dropdowns/flyouts by a small
  script in `navbar.hbs`).
- The **9-dot button** at the end of the nav opens the mega panel (site map +
  newsletter one-liner with a "?" that opens the subscribe pitch).
- **Navbar border = reading progress**: a hairline accent stroke draws around
  the shell (bottom-left → around) as you scroll.
- **Glass navbar** on `/videos/`, `/webseries/`, `/travel/` index pages (set
  flash-free in `default.hbs`'s boot script).
- **Logo** (`components/logo.hbs`): S in a recording frame, blinking blue
  dot, "documenting life/chaos/trips/emotions/happiness" rotator.
- **Subscribe bell** opens the "algorithm doesn't owe us anything" modal:
  why-subscribe vs why-membership grid, magic-link form with animated success
  + spam-folder note. **Members browse ad-free** (`adsense.hbs` is wrapped in
  `{{#unless @member}}`).

---

## 7. Theme modes

Eight modes, cycled from the switcher (tap = light/dark toggle, **long-press =
full menu**), each with synthesized WebAudio sounds and per-brand design
tweaks (radii, shadows, type): `light`, `dark`, `salesforce`, `youtube`,
`netflix`, `claude`, `twilio`, `neubrutal`. Tokens live as CSS variables per
`[data-theme]` in `assets/css/tailwind.css`; the flash-free boot script is in
`default.hbs`. Ghost comments follow the active mode via
`components/comments.hbs` (rewrites the comments script's accent/scheme before
it boots).

---

## 8. Ads

`{{> "components/adsense" slot="…" format="…"}}` everywhere. Controlled by:
- theme setting **Enable AdSense** (off → dashed placeholders),
- **signed-in members never see ads**,
- pushes are centralized & guarded in `main.js` (fixes double-push TagError).
Collection headers add a 728×90 leaderboard on xl+ only when ads are enabled.

---

## 9. Demo content & data

- **`import.json`** — full demo dataset (56 posts, 45 tags) covering every
  collection with generic names (`Video Title — 1`, `Course Name — 1`,
  `Trip Name — 1`…). Import via Ghost Admin → Settings → Import.
- `data.json` — older dataset, superseded; both are excluded from the zip.

---

## 10. Development workflow

```bash
npm run dev        # tailwind watch + browser-sync proxy of localhost:2368
npm run build      # minified CSS → assets/built/screen.css
npm test           # gscan validation
npm run zip        # build + gscan --fatal + dist/swarnil.zip
```

- `assets/built/main.js` is hand-written (no bundler) and tracked in git.
- New `.hbs` templates require a **Ghost restart** to be discovered.
- `routes.yaml` / `redirects.yaml` must be uploaded in Ghost Admin (Labs).
- Icons: drop an SVG into `partials/icons/<name>.hbs` (follow the
  `stroke="currentColor"` + `class="{{class}}"` pattern), then use
  `{{> "icons/<name>"}}` or `{{> icon name="<name>"}}`.
- Deploy: push to `main` triggers `.github/workflows/deploy-theme.yml`
  (or `npm run release` and upload the zip manually).

## 11. Where to look when something breaks

| Symptom | Check |
|---|---|
| Curriculum/lessons empty | Lesson's FIRST tag must be the course's public tag; queries use `primary_tag.slug` |
| New template 404s / old layout shows | Restart Ghost (template map cached) |
| Nav icons missing / old menu | Same — restart; menu content comes from Admin → Navigation |
| Ads not showing | Enable AdSense setting; you're logged in as a member (ads off by design) |
| Members form no feedback | Portal must be enabled; states are mirrored by the observer in `main.js` |
| Video post has no player | Post body needs a YouTube embed or link |
| gscan warnings | `Missing support for custom fonts` is known/accepted |

---

## 12. Recent changes (2026-07-07, this session)

- **Container links fixed sitewide**: back/close/breadcrumb links from lessons,
  episodes and travel stories used `/collection/{tag-slug}/` which 404s when a
  container's post slug differs from its tag. Pages now render a hidden
  resolver (`#container-post`, found by tag) and JS rewrites every
  `[data-container-link]` to the real post URL.
- **Tag-order hardening**: every container lookup (home course cards,
  lessons/episodes/travel indexes, series deck, trip itineraries, course page)
  resolves the **first public tag** instead of `primary_tag`, surviving Ghost
  imports that put internal tags first.
- **"undefined" content bug**: series + episode templates were wrapped whole
  in `{{#get}}`, which breaks post context — content, comments and meta now
  render outside gets (see §2 rule).
- **Course page**: rebuilt Udemy-style (blurred hero, inline stats, sticky
  overlapping enrolment card, curriculum thumbnails, FAQ).
- **Lesson player**: line-divided columns (no boxes), position-based progress,
  rail-driven prev/next, confetti Complete-course finish, mark-complete
  toggle, breadcrumbs, in-lesson TOC.
- **Episode player**: full-width (no more 1600px cap/black gutters), calmer
  mobile bar (✕/title/next only), queue-driven pagination.
- **Series page**: Netflix chrome replaces navbar; hero always has a moving
  background (post's own opening video, else ambient reel); wider/taller hero.
- **Guestbook**: two-column — pinned hero with wall-of-love note illustrations
  and a what/how/why explainer; wall scrolls on the right; Ghost comments made
  fully fluid on phones.
- **Homepage**: "Framed" hero (rule-of-thirds shell, pointer glow, morphing
  aspect-ratio word frame, HUD, collection pills), videos-only ranked row with
  visible half-out numbers, 3D "Now" fan (typed cards + done/in-progress),
  stacked webseries deck with autoplay preview, bento blog, recruiter widgets
  (skills/summary/dashed career timeline) + filterable projects, dedicated
  courses section with hover lesson peek, grouped product shelves, timeline
  with giant year watermark, finale film band (lazy video, grid-line overlay,
  subscribe modal + inline form).
- **Subscribe system**: bell → pitch modal (why subscribe vs membership grid,
  magic-link form with animated success + spam note); members browse ad-free;
  panel/footer/mobile hooks into the same modal.
- **Navigation**: native `{{navigation}}` with slug→icon mapping and "- Child"
  nesting; icon-only theme switch (tap toggles, long-press = all 8 modes incl.
  Twilio + Neubrutal); navbar border doubles as reading progress.
- **Data**: import.json + data.json synced — generic names, chapters tables in
  video-type posts, `#level-*`, `#now-completed`, featured milestones.

---

## Update notes — 2026-07-09 (homepage overhaul)

What changed today, and where to customize it from Ghost Admin.

### Homepage structure (all partials — reorder in `home.hbs`)

`hero` → `latest` (video rail) → `now` → `webseries` → `blog` → `portfolio` →
`experiences` → `courses` → `snippets` → `shop` → `products` → `timeline` →
`publishing` (On air) → `connect` → `tags` (cloud) → `guestbook` → `newsletter`.
Every section is its own partial under `partials/home/`; sections driven by
posts (`experiences`, `snippets`, `webseries`, `tags`) hide themselves when no
matching posts exist.

### What we worked on

- **First-load intro** (`partials/components/intro.hbs`): the "Life looks
  better when you frame the chaos…" line is now an animated title card shown
  once per session on the homepage. The hero H1 is static (quote, floating
  pills and word-cycling removed).
- **Swarnil Originals**: webseries section opens with the why-I-make-these
  story, then a 9:16 Netflix-style poster rail (no numbers). Edit the story in
  **Admin → Design → Homepage → `webseries_intro`**.
- **Products I use** is a promo band with floating gear thumbnails and a single
  CTA to `/products/` — thumbnails come from your latest `#product` posts.
- **Portfolio**: cinematic recruiter pitch — big type, CSS illustration
  slideshow, CTA row, filterable `#project` receipts, and a half-visible resume
  sheet behind mountains linking to `/resume/`.
- **New sections**: Experiences rail (`#experience` posts), Snippets band
  (`#snippet` posts, VS Code cards), Connect tiles (collab/sponsor/bucketlist
  pages), Tag cloud (blasts in on scroll, then settles).
- **On air**: dark broadcast board, big typographic channel rows revealing on
  scroll, animated blob/scanline background.
- **Blog**: opens with an epigraph quote — edit in **Admin → Design →
  Homepage → `blog_quote`**.
- **Timeline**: left intro is sticky; the spine fills with accent color as you
  scroll.
- **Courses**: home cards morph on "Syllabus" click (media shrinks to a 90px
  strip, full lesson list animates in). Course pages say **Syllabus** now.
- **Projects**: status badge on the card image (`#now` = in progress,
  `#now-completed` = shipped, otherwise done).
- **Video rail**: scroll-snap + arrows + progress bar.
- **Finale video band**: darker scrim + vignette for readable text.
- **Footer**: icons on all nav items; sitemap → `/sitemap-visual/`.
- **/tags** page: photo-mosaic tiles; **visual sitemap** now covers travel,
  prompts, snippets, experiences and topics too.

### New custom settings (Admin → Design → Homepage)

| Setting | Drives |
| --- | --- |
| `webseries_intro` | Story shown above the Swarnil Originals shelf |
| `blog_quote` | Epigraph above the blog bento grid |

New styles live in `assets/css/components/home.css` (imported by
`tailwind.css`). Rebuild with `npm run build`; validate with `npx gscan .`.
