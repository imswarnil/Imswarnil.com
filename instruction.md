# instruction.md — Port ANY Ghost theme into the Swarnil site structure

> **What this is:** the complete, theme-agnostic blueprint of imswarnil.com.
> If you download any Ghost theme (Casper, Source, Aspect, a paid one…) and
> want to keep **its CSS/look** but organize it into **this site's structure**
> (collections, nested courses/webseries, ads, JSON-LD, theme modes), follow
> this end to end. Everything specific to look-and-feel is yours to restyle;
> everything below is the contract the site depends on.

---

## 0. The mental model

A Ghost theme is just Handlebars templates + CSS + a tiny bit of JS.
The **site structure lives in 3 places** and is portable between themes:

1. `routes.yaml` — URL map (collections, nested permalinks, custom pages)
2. **Internal tags** on posts (`#video`, `#course`…) — decide what a post *is*
3. `package.json → config.custom` — theme settings shown in Ghost Admin

The new theme's CSS is a skin over that skeleton. Porting = copying the
skeleton in, then re-expressing each template using the new theme's CSS
classes and card markup.

---

## 1. Requirements checklist (what this site must have)

### 1.1 Top-level route templates (one `.hbs` each, root of theme)

| Template | URL | Purpose |
|---|---|---|
| `home.hbs` | `/` | hero + now + section per collection |
| `blog.hbs` | `/blog/` | only `#blog` posts |
| `videos.hbs` | `/videos/` | video hub: schedule, subscribe CTA |
| `courses.hbs` | `/courses/` | featured spotlight, free/paid filter |
| `lessons.hbs` | (index rarely seen) | lessons grouped by course |
| `webseries.hbs` | `/webseries/` | cinematic hero, poster rows |
| `episodes.hbs` | (index rarely seen) | episodes grouped by series |
| `projects.hbs` | `/projects/` | GitHub-style repo cards |
| `products.hbs` | `/products/` | grouped shelves (`#group-*`) |
| `timeline.hbs` | `/timeline/` | animated year timeline |
| `changelog.hbs` | `/changelog/` | version log |
| `newsletters.hbs` | `/newsletters/` | mac-window email cards |
| `shop.hbs` | `/shop/` | digital downloads |
| `archive.hbs` | `/archive/` | everything, lazy load |
| `tag.hbs`, `author.hbs`, `index.hbs`, `page.hbs`, `post.hbs` | Ghost standard |
| `signin.hbs`, `signup.hbs` | `/signin/`, `/signup/` | members magic-link |
| `sitemap-visual.hbs` | `/sitemap-visual/` | collection tree |
| `error-404.hbs`, `error.hbs`, `offline.hbs` | errors/PWA |
| `sw.hbs`, `manifest.hbs` | `/sw/`, `/manifest/` | PWA (see §7 gotchas) |
| `page-resume.hbs`, `page-sponsor.hbs`, `page-contact.hbs` | slug-bound pages |

### 1.2 The post dispatcher (`post.hbs`)

Single most important file. It routes a post to a layout by internal tag:

```handlebars
{{#post}}
  {{#has tag="#video"}}      {{> "post/video"}}
  {{else has tag="#course"}} {{> "post/course"}}
  {{else has tag="#webseries"}} {{> "post/series"}}
  {{else has tag="#lesson"}} {{> "post/lesson"}}
  {{else has tag="#episode"}} {{> "post/episode"}}
  {{else has tag="#project"}} {{> "post/project"}}
  {{else has tag="#product"}} {{> "post/product"}}
  {{else has tag="#newsletter"}} {{> "post/newsletter"}}
  {{else has tag="#changelog"}} {{> "post/changelog"}}
  {{else has tag="#shop"}}   {{> "post/shop"}}
  {{else}}                   {{> "post/article"}}
  {{/has}}
{{/post}}
```

So you need `partials/post/{article,video,course,lesson,series,episode,
project,product,newsletter,changelog,shop}.hbs` — each is "one detail page
design" you re-skin with the new theme's CSS.

### 1.3 Cards (`partials/cards/*.hbs`)

One card per collection, deliberately distinct: `blog`, `video` (thumb +
duration pill), `course` (instructors + access badge), `episode` (Netflix
number), `project` (GitHub repo card), `product` (shelf item), `shop`,
`timeline-item`, `changelog-item`. When porting, find the new theme's
"post card" partial and fork it per collection.

### 1.4 Shared components (`partials/components/*.hbs`)

`navbar` (island-on-scroll + theme switcher + mega panel), `footer`,
`adsense` (parameterized slot/format), `pagination`, `collection-header`,
`json-ld` (site-wide Person/WebSite), `logo`.

---

## 2. routes.yaml (copy verbatim, upload in Admin → Settings → Labs)

The current file at theme root is canonical. Key rules learned the hard way:

- Collections match **in order, first win** — lessons/episodes MUST come
  before their parent course/webseries collections.
- Nested URLs: `permalink: /courses/{primary_tag}/{slug}/` — a lesson's
  **first PUBLIC tag** must equal the course's public primary tag.
- `/archive/` is the ONLY filterless collection and must be LAST.
- **No dots in route paths** (`/sw.js/`, `/ads.txt/` 404 on our Ghost) —
  use `/sw/`, `/manifest/`; serve ads.txt via `redirects.yaml` 301.
- Every route needs a trailing slash.

---

## 3. Tag taxonomy (the data model — never changes between themes)

| Tag pattern | Meaning | Used by |
|---|---|---|
| `#blog #video #project #course #lesson #webseries #episode #product #timeline #changelog #newsletter #shop` | collection membership (pick one) | routes + dispatcher |
| `#now` | show in homepage "Now" section | home |
| `#duration-1h-30m` | duration badge + JSON-LD `PT1H30M` | courses, videos, episodes |
| `#skill-analytics`, `#skill-ui/ux` | skill badges | projects |
| `#event-company-change / -milestone / -relocation / -education / -award` | timeline icon | timeline, resume |
| `#group-services / -my-setup / -skin-care / -travel` | product shelf grouping | products |
| `#course-gear` | shown on /courses "products I use" | courses |
| public primary tag (e.g. `ghost-mastery`) | binds lessons↔course, episodes↔series | nested routes |

Content conventions inside post bodies:
- **Videos**: first YouTube embed = the player; a `Time | Chapter` table
  becomes seekable chapters + Clip JSON-LD.
- **Courses**: `## What you'll learn` and `## Prerequisites` headings get
  styled callouts; product/bookmark cards render as testimonials.
- **Webseries**: `## Cast` heading + list becomes avatar chips.
- **Products/Shop**: FIRST link in body = affiliate/download CTA (pinned to sidebar).
- **Projects**: slug drives links — repo `github.com/imswarnil/<slug>`, live
  `https://<slug-without-dashes>.imswarnil.com`.
- **Hero**: post with slug `hero` overrides the homepage hero.

---

## 4. Cross-cutting features every detail layout must include

1. **Comments**: `{{#if @site.comments_enabled}}{{comments}}{{/if}}`
   (projects use an "Issues & feedback" header).
2. **Related content, cross-collection**: `{{#get "posts"
   filter="tags:{primary_tag.slug}+id:-{id}" limit="6"}}` with a type badge
   per result (video/course/project/article) — travel blog shows travel course.
3. **Ads**: `{{> "components/adsense" slot="…" format="…"}}` — publisher
   `ca-pub-1291242080282540`, gated by `@custom.enable_adsense`.
   Slots: in-article `6501428979`, horizontal `8939839370`, vertical
   `3487917390`, square `7663977887`, in-feed `9130894804`
   (`layoutKey="-6t+ed+2i-1n-4w"`), multiplex `6808134701`/`3375031396`.
4. **JSON-LD** inline per type: VideoObject+Clips, Course, TVSeries/TVEpisode,
   SoftwareSourceCode, Product, plus site-wide Person/WebSite.
5. **TOC**: `#toc` + `#toc-list` contract, scrollspy in main.js; mobile TOC
   collapses right after the post header.
6. **Duration spans**: `<span data-duration-tags="{{#foreach tags
   visibility="internal"}}{{slug}} {{/foreach}}" hidden></span>` — main.js
   formats and unhides.

---

## 5. JS behaviors to port (all in `assets/built/main.js`, no bundler)

- Theme mode switcher (6 modes, `data-theme` + `.dark`, localStorage `swarnil-mode`)
- Navbar flat→island on scroll; mobile menu; mega panel; dropdowns
- Reveal-on-scroll (IntersectionObserver on `.reveal`)
- TOC build + scrollspy; duration formatter; copy/share links
- Page-local inline scripts live INSIDE their template (video seek,
  lesson progress in localStorage, project slug→URL, gallery lightbox,
  newsletter close animation) — they travel with the partial when you port.

## 6. Theme settings contract (`package.json → config.custom`)

`color_scheme` (System/Light/Dark/Salesforce/YouTube/Netflix/Claude),
`enable_adsense`, `adsense_publisher_id`, `job_title`, `workplace`,
`workplace_url`, `github_repo`, `hero_video_url`, `hero_image`,
`hero_image_alt`, `newsletter_title`, `footer_tagline`, `sponsor_email`,
`youtube_url`, `topmate_url`.
gscan FAILS the build if a defined setting is unused — keep them referenced.

---

## 7. Porting procedure (do these in order)

1. **Snapshot** the working theme: `git branch backup-current`.
2. Drop the new theme into `content/themes/<name>/`, run it once untouched
   to see its look. Identify: its CSS build (Tailwind? plain CSS? gulp?),
   its card partial, its `default.hbs`, its post template.
3. Copy the skeleton in from this theme: `routes.yaml`, `post.hbs`
   dispatcher, `partials/post/*`, `partials/cards/*`,
   `partials/components/{adsense,json-ld,pagination}.hbs`, the route
   templates from §1.1, `assets/built/main.js`, `package.json` custom
   settings block, `redirects.yaml`, `theme-customize.txt`.
4. **Re-skin one collection at a time** (order: blog → videos → projects →
   courses → webseries → the rest). For each: replace my card markup with
   the new theme's card classes; keep every `{{#get}}`, `{{#has}}`, data
   attribute, id (`toc`, `toc-list`), and inline script intact.
5. Keep the new theme's `default.hbs` head/foot but merge in: theme-mode
   boot script, AdSense loader (gated), manifest link `/manifest/`,
   `main.js` include, favicon.
6. **Validate constantly**: `npx gscan . --fatal` after every collection.
   No `limit="all"`. Page template must honor
   `@page.show_title_and_feature_image`.
7. Test with the demo pack: import `data.json` on a LOCAL Ghost
   (`ghost install local`), upload `routes.yaml`, click through every
   collection + one detail page each.
8. Deploy via the existing GitHub Action (push to main). Secrets:
   `GHOST_ADMIN_API_URL`, `GHOST_ADMIN_API_KEY`.
9. In Ghost Admin: re-upload `routes.yaml` + `redirects.yaml`, set
   navigation, enable comments/members, create pages `contact`, `resume`,
   `sponsor`, `guestbook`, optional `hero` post.

## 8. Production gotchas (cost us real debugging time)

- **Dot-routes 404**: Ghost rejects `/sw.js/`, `/manifest.json/`, `/ads.txt/`.
  Use extension-less routes; ads.txt via `redirects.yaml` → raw GitHub file.
- **Service workers outlive themes**: a cached SW serves OLD css/js to
  returning visitors → "works locally, broken in prod". Our default.hbs
  unregisters stale workers + clears caches. If a new theme registers its
  own SW, delete that code or keep the cleanup snippet.
- **Hard-refresh twice** after a deploy before judging brokenness (first
  load runs cleanup, second is clean). Also check in a private window.
- **CDN/Cloudflare** may cache HTML — purge after structural deploys.
- gscan errors that block deploy: unused custom setting, missing partial
  referenced by `post.hbs`, `limit="all"`, invalid Handlebars.
- Import `data.json` only on test sites — it's demo content (54 posts).
