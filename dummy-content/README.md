# Demo content — modular Ghost imports

The old single `import.json` (plus `courses-import.json` / `creator-import.json`)
has been split into one **self-contained, independently importable** Ghost file
per module. Import only the modules you want from
**Ghost Admin → Settings → Import/Export → Import**.

Each file is a standard Ghost export (`db[0].data` with `posts`, `tags`,
`posts_tags`). Shared internal `#hash-*` tags are deduped by slug on import, so
you can import files in any order without duplicating tags.

## Files

| File | What it seeds | Size |
|------|---------------|------|
| `navigation.json` | Primary + secondary nav menus (settings only, no posts) | — |
| `course.json` | Course landing pages (`#course`) | full |
| `lesson.json` | All lessons (`#lesson`) — Java + SQL university courses | full |
| `post.json` | Blog posts (`#blog`) | sample |
| `video.json` | Videos, reels, shorts (`#video`) | sample |
| `webseries.json` | Web series + episodes (`#webseries` / `#episode`) | sample |
| `project.json` | Projects + build-log steps (`#project` / `#project-detail`) | sample |
| `product.json` | Product recommendations + shop (`#product` / `#shop`) | sample |
| `travel.json` | Trips + travel posts (`#trip` / `#travel`) | sample |
| `timeline.json` | Timeline / resume events (`#timeline`) | sample |
| `misc.json` | Changelog, newsletters, snippets, prompts, experiences, bucketlist | sample |
| `docs.json` | Theme documentation (`#docs`) — powers `/docs/` | full |

## Import order / dependencies

- **Lessons live inside courses.** A lesson's primary tag is its course's public
  tag, but the course *landing post* is in `course.json`. Import **`course.json`
  and `lesson.json` together** so lessons resolve to a real course page.
- Every other module (projects, web series, travel) keeps its container **and**
  its children in the same file — no cross-file dependency.
- `navigation.json` only writes the two nav menus. Import it once; it does not
  create posts.

## Editing

These files are now the source of truth for the demo dataset (they replace the
old root-level `import.json` / `courses-import.json` / `creator-import.json`).
Edit them directly — each is a normal Ghost export you can re-import at any time.
