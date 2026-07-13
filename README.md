# Swarnil — a personal OS for Ghost

A monochrome, pattern-rich personal-site theme for **Ghost**. Light-first with a
full dark mode and six extra brand modes, built with **Tailwind CSS** and the
**Geist** typeface. One codebase turns a single Ghost site into videos, a blog,
projects, courses, a webseries, a travel log, a shop, timeline, changelog,
newsletters, code snippets, prompts, a resume and sponsorship — all driven by
internal tags, no code required from the publisher.

- **Compatibility:** Ghost 5.0+ (validated against Ghost 6.x with GScan — 0 errors, 0 warnings)
- **Responsive:** mobile-first; tested on the latest 2 versions of Chrome, Firefox, Safari and Edge
- **Accessible:** semantic HTML, image alt text, visible keyboard focus rings, respects `prefers-reduced-motion`
- **PWA-ready:** offline fallback + optional web-push, installable
- **SEO:** hand-rolled JSON-LD per content type, clean semantic markup, full internal linking

## Quick start

```bash
npm install
npm run build     # tailwind → assets/built/screen.css (minified)
npm run test      # gscan validation
npm run zip       # dist/swarnil.zip, ready to upload
```

Then in Ghost Admin:

1. **Settings → Theme** — upload `dist/swarnil.zip` and activate.
2. **Settings → Labs → Beta features → Routes** — upload `routes.yaml` (required; it powers every collection and the PWA endpoints).
3. **Settings → Labs → Redirects** — upload `redirects.yaml` (optional; `ads.txt` / `llms.txt` redirects).
4. **Settings → Import/Export → Import** — import the demo content from the `dummy-content/` folder. It's split into one file per module (`course.json`, `lesson.json`, `video.json`, `docs.json`, …) plus `navigation.json`; import the modules you want (see `dummy-content/README.md`). All video embeds point at a single YouTube URL.
5. Restart Ghost after the first deploy so new templates are discovered.

## How content routing works

Every item on the site is a **Ghost post**. Its **internal tag** (a tag whose
slug starts with `#`) decides which collection it belongs to, its URL and its
layout:

| Tag | URL | Layout |
| --- | --- | --- |
| `#video` | `/videos/{slug}/` | Cinema page + "Up next" rail |
| `#blog` | `/blog/{slug}/` | Article + table of contents |
| `#project` | `/projects/{slug}/` | Case study + build-log steps |
| `#course` | `/courses/{slug}/` | Course overview + syllabus |
| `#lesson` | `/courses/{course}/{slug}/` | Lesson player + pagination |
| `#webseries` | `/webseries/{slug}/` | Series page + episode list |
| `#episode` | `/webseries/{series}/{slug}/` | Episode player |
| `#trip` | `/travel/{slug}/` | Trip overview |
| `#travel` | `/travel/{trip}/{slug}/` | Travel story |
| `#product` | `/products/{slug}/` | Review (listing groups by `#group-*` tag) |
| `#shop` | `/shop/{slug}/` | Product card |
| `#snippet` | `/snippets/{slug}/` | Code snippet |
| `#prompt` | `/prompts/{slug}/` | Chat-styled prompt |
| `#experience` | `/experiences/{slug}/` | Photo + story moment |
| `#timeline` | `/timeline/{slug}/` | Timeline entry |
| `#changelog` | `/changelog/{slug}/` | Ship-log entry |
| `#newsletter` | `/newsletters/{slug}/` | Issue archive |
| *(none of the above)* | `/blog/{slug}/` | Article (catch-all) |

**Container relationships** (courses↔lessons, webseries↔episodes, trips↔travel
posts, projects↔build-logs) use the **first public tag**: give each lesson a
public tag equal to the course's public tag and the syllabus assembles itself.
The same pattern wires episodes to a series and travel posts to a trip.

**Standalone pages:** create Ghost pages with slugs `resume`, `about`,
`contact`, `collab`, `sponsor`, `guestbook`, `bucketlist` and `welcome` to
activate the matching `page-*.hbs` layouts. `/tags/`, `/sitemap-visual/` and
`/archive/` are always available.

## Homepage

The homepage is assembled from independent partials in `partials/home/` and
listed in `home.hbs` — reorder or remove any section by editing that one file.
Sections driven by posts hide themselves automatically when empty, so a brand
new site never shows a broken or empty block.

## Theme modes

A built-in switcher cycles eight modes: **Light, Dark, Salesforce, YouTube,
Netflix, Claude, Twilio and Neubrutal**. Each is a full design system (colours,
radii, shadows, type) rather than a recolour. Set the default in **Design →
color scheme**; visitors can switch and their choice persists.

## Theme settings (Ghost Admin → Design)

Site-wide: color-scheme default, AdSense on/off + publisher/slot IDs (styled
placeholders render until set), YouTube channel URL, Topmate link, job title,
workplace + URL, GitHub repo (for the star button), hero image/video, sponsor
email, OneSignal app ID (web push).
Homepage group: newsletter title, footer tagline, `webseries_intro` story,
`blog_quote` epigraph.

## Custom fonts

The theme consumes Ghost's Brand → font settings via the `--gh-font-heading`
and `--gh-font-body` CSS variables, falling back to Geist. Pick fonts in
**Design → Brand** and they apply to headings and body across the site.

## PWA

`/manifest/` and `/sw/` are served through `routes.yaml` (Ghost rejects dotted
route paths, so these are extension-less). The service worker caches assets
cache-first, pages network-first, and falls back to `/offline/`. The site icon
in Ghost settings becomes the app icon. Web push is optional — set a OneSignal
app ID to enable it.

> Root service-worker scope needs a `Service-Worker-Allowed: /` header on the
> `/sw/` response, set at your proxy/CDN. Until then the site works normally;
> only offline caching is inactive.

## SEO

`{{ghost_head}}` plus hand-rolled JSON-LD: `WebSite` + `Person` on the home
page, and `Article` / `VideoObject` / `Course` / `Review` / `TVSeries` /
`TVEpisode` per post type, with `BreadcrumbList` on nested pages. Every
collection and tag is reachable through the navigation, footer and the visual
sitemap at `/sitemap-visual/`.

## Development

- `npm run dev` — Tailwind watch + BrowserSync proxy of a local Ghost at `localhost:2368`.
- `npm run build` — minified production CSS.
- `npm run test` / `npm run test:fatal` — GScan validation.
- `npm run zip` — builds, validates, and packages `dist/swarnil.zip`.

Tailwind sources live in `assets/css/` (`tailwind.css` + `components/*.css`);
never edit `assets/built/screen.css` by hand — it is generated.

## Support & documentation

- In-depth docs: `documentation.md` (content model, collections, homepage, modes, dev workflow).
- Running change log: `THEME-UPDATE.md`.
- Questions / issues: open an issue on the GitHub repository or email
  [swarnilsinghaicse@gmail.com](mailto:swarnilsinghaicse@gmail.com).

## License

Released under the [MIT License](LICENSE). Built by
[Swarnil Singhai](https://imswarnil.com).
