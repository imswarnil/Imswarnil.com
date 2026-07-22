# Partials — folder map & conventions

Partials are grouped **by feature** (one folder per content type / collection),
with a small set of cross-cutting folders. Ghost requires page/collection
**templates** to stay at the theme root; only partials nest, so all structure
lives here. Include with the folder path, e.g. `{{> "video/card"}}`.

## Dispatchers (partials root)

Single entry points that branch on a post's internal (`#`) tag and delegate to
the right feature partial — so callers don't repeat the `{{#has tag}}` ladder:

| Partial | Use | Delegates to |
| --- | --- | --- |
| `card.hbs` | `{{#foreach posts}}{{> card}}{{/foreach}}` over **mixed** types | `<feature>/card.hbs` |
| `post-body.hbs` | called by `post.hbs` inside `{{#post}}…{{/post}}` | `<feature>/body.hbs` |
| `navigation.hbs` | Ghost's `{{navigation}}` menu-items override (slug → icon) | `icons/*` |

Single-type collection loops may still include a card directly
(`{{> "video/card"}}`) — same partial, just explicit.

## Feature folders

Each holds that collection's pieces. Convention inside a folder:
`card.hbs` = grid/list tile · `body.hbs` = single-post layout · other files
named by role.

| Folder | Files |
| --- | --- |
| `blog/` | `card` `body` |
| `video/` | `card` `body` `reel` `reel-card` `poster` |
| `course/` | `card` `body` `lesson` |
| `webseries/` | `body` `episode` `episode-card` |
| `project/` | `card` `body` `step` |
| `product/` | `card` `card-mini` `body` |
| `travel/` | `body` `trip` |
| `shop/` · `newsletter/` · `changelog/` · `prompt/` · `snippet/` · `experience/` | `card` and/or `body` |
| `timeline/` | `card` |
| `docs/` | `body` `sidebar` `nav-section` |
| `guide/` | `body` `step` `stepper` |

## Cross-cutting folders

| Folder | Holds | Examples |
| --- | --- | --- |
| `utility/` | Reusable, cross-feature components with no collection of their own. | `author-card` `share` `toc` `pagination` `json-ld` `section-head` `collection-header` `adsense` `rail-ads` `comments` `footer` `logo` `auth` `related` `collab-cta` `ad-optout*` `sitemap-branch` |
| `navigation/` | Site nav chrome. | `navbar` |
| `home/` | Homepage sections, one file per band. | `hero` `latest` `portfolio` `timeline` `guestbook` |
| `icons/` | Inline SVG icons (take a `class=` arg); `icons/companies/` for brand marks. | `arrow-right` `github` `companies/ef` |

## Conventions

- **`<feature>/card` = preview, `<feature>/body` = full page.** Same content
  type, two files (e.g. `video/card` tile vs `video/body` watch page).
- **`utility/` vs feature** — if a component belongs to one collection it lives
  in that feature folder; if it's shared everywhere it's a `utility`.
- **Naming** — kebab-case, named for role not tag (`course/lesson.hbs`).
- **Contextual navbar** is NOT a navbar variant: lesson pages render their own
  in-body player chrome (`course/lesson.hbs` → `.lesson-topbar`) and CSS hides
  the global navbar via `body.tag-hash-lesson`; episodes deliberately keep the
  normal navbar. Don't reintroduce navbar-swap partials.

## Wiring

`post.hbs` → `{{> post-body}}` → `<feature>/body.hbs` (picked by primary `#`tag).
Collection templates at root loop posts and include the matching card. Routes →
collections live in `../../routes.yaml` (tag-driven; see `CLAUDE.md`).
