# Swarnil — a personal OS for Ghost

Monochrome (black / white / grey / silver), light-first with full dark mode, built with **Tailwind CSS** and the **Geist** typeface. Videos, blog, projects, courses, webseries, products, timeline, changelog, newsletters, resume and sponsorship — all driven by internal tags.

## Quick start

```bash
npm install
npm run build     # tailwind → assets/built/screen.css
npm run test      # gscan
npm run zip       # dist/swarnil.zip, ready to upload
```

Then in Ghost Admin:

1. **Settings → Theme** — upload `dist/swarnil.zip`.
2. **Settings → Labs → Routes** — upload `routes.yaml` (required; it powers every collection and the PWA endpoints).
3. **Labs → Import content** — import `data.json` for the demo content pack (46 posts across every module).

## How content routing works

A post's **internal tag** decides its collection, URL and layout:

| Tag | URL | Layout |
| --- | --- | --- |
| `#video` | `/videos/slug/` | Cinema page + "Up next" rail |
| `#blog` | `/blog/slug/` | Article + TOC sidebar |
| `#project` | `/projects/slug/` | Case study |
| `#course` | `/courses/slug/` | Course overview + syllabus |
| `#lesson` | `/lessons/slug/` | Lesson player + series rail |
| `#webseries` | `/webseries/slug/` | Series page + episode list |
| `#episode` | `/episodes/slug/` | Episode player |
| `#product` | `/products/slug/` | Article (listing groups by public tag) |
| `#timeline` | `/timeline/slug/` | Timeline entry |
| `#changelog` | `/changelog/slug/` | Ship-log entry |
| `#newsletter` | `/newsletters/slug/` | Issue archive |
| *(none of the above)* | `/blog/slug/` | Article (catch-all) |

**Courses ↔ lessons / webseries ↔ episodes:** give each lesson/episode a *public* tag equal to the course/series **slug** (e.g. course slug `ghost-mastery` → lessons tagged `#lesson` + `ghost-mastery`). The syllabus and episode lists assemble automatically.

**Pages:** create pages with slugs `resume` and `sponsor` to activate `page-resume.hbs` (two-column resume, print-to-PDF) and `page-sponsor.hbs`.

## Navigation

- **Primary navigation** → inline links in the floating island navbar.
- **Secondary navigation** → collapses into the "More" dropdown (desktop) and a grid (mobile).

## Theme settings (Design → Site-wide)

Job title, workplace + URL, GitHub repo for the star button, hero image/video, AdSense publisher/slot IDs (placeholders render until set), newsletter title, footer tagline, sponsor email, color scheme default.

## PWA

`/manifest.json/` and `/sw.js/` are served through `routes.yaml`. The service worker caches assets cache-first, pages network-first, and falls back to `/offline/`. Site icon in Ghost settings becomes the app icon.

## SEO

`{{ghost_head}}` plus hand-rolled JSON-LD: `WebSite` + `Person` on home, `Article` / `VideoObject` / `Course` / `Review` / `TVSeries` / `TVEpisode` per post type, and `BreadcrumbList`.
