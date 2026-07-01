# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

This is the **custom Ghost theme for Imswarnil.com**, forked from **Aspect** (a premium magazine theme by Priority Vision — see `package.json` `name: "aspect"`, README, and the `pvs` optional dependency). It is the primary development target of the surrounding self-hosted Ghost install. For Ghost-CLI operations, routing-as-deployed, and the install layout, see the **parent** `../../../CLAUDE.md`.

> ⚠️ HEAD (`49954ea revert`) rolled back a large body of bespoke work — résumé page, a post-type dispatcher, topbar nav, monetization/AdSense, home-section modules, and a prior CLAUDE.md. **The current tree is close to stock Aspect.** Do not assume reverted features exist; verify against the files. Earlier commits (e.g. `e4a8c08`, `bba6e9b`) contain that work if it needs reviving.

## Build & Develop

Templates are Handlebars (`.hbs`) and served as-is, but **CSS and JS must be built** before Ghost serves them.

```bash
npm install        # REQUIRED first — node_modules is absent and assets/built is gitignored
npm run dev        # Rollup watch + livereload (development build, sourcemaps)
npm run build      # production build → assets/built/ (minified, runs the vendor copy step)
npm run test       # gscan theme validation (pretest runs `build` first)
npm run test:ci    # gscan --fatal --verbose (use to gate strict)
npm run translate  # ghost-theme-locales (gtl) — regenerate locales/*.json from {{t}} strings
```

After building, run `ghost restart` from the **install root** (`../../../`) so Ghost picks up the new `assets/built/` files. There is no test runner beyond gscan; "tests" means theme-spec validation, not unit tests.

**Lint/format** — configured but **not wired into npm scripts**; run via `npx`:
```bash
npx eslint assets/js              # @vercel/style-guide browser + prettier + simple-import-sort
npx stylelint "assets/css/**/*.css"  # stylelint-config-standard + enforced property order (.stylelintrc.js)
npx prettier --check .            # @vercel/style-guide preset, useTabs:true — this repo indents with TABS
```
`.stylelintrc.js` enforces a specific CSS **property order** (position → box → spacing → border → background → color → typography → transform) — match it when editing CSS or stylelint will fail.

**Critical:** `assets/built/` and `node_modules/` are gitignored (`.gitignore`). A fresh clone has no built assets and no vendored libs — you must `npm install && npm run build` before the theme renders, and the live install needs its own built copy.

## Build Pipeline (rollup.config.mjs)

A single `buildConfig` object at the top of `rollup.config.mjs` is the source of truth — **add new JS/CSS entry points there**, not by convention. Rollup emits multiple IIFE bundles, not one:

- **JS entries** (`buildConfig.js`): `assets/js/index.js` (the main bundle, also triggers CSS extraction), `announcement-bar.js`, `slider-tags.js`, `slider-cards.js`, and the two `section-featured/*` bundles. The first entry is "main"; only it runs PostCSS + the copy/livereload steps. Output mirrors the input subdir under `assets/built/`.
- **CSS**: `assets/css/index.css` is the single import manifest (`@import` chains for base → components → card-post → ghost → layout → templates → sections → pages → swiper). The `section-featured/*.css` files build to separate stylesheets so the homepage can load only the active featured style.
- **PostCSS chain**: `postcss-mixins` → `@lehoczky/postcss-fluid` (fluid clamp between 380px and 1500px — this is why sizes use the fluid mixin) → `postcss-nested` → `postcss-import` → `postcss-preset-env` (custom-properties passthrough disabled).
- **Vendor copy** (production only): copies `pvs`, `ivent`, `@popperjs`, `tippy.js`, `swiper`, `motion`, and the Geist variable font from `node_modules` into `assets/vendors/`, and pulls **PVS partials into `partials/`**. Those vendored files are loaded directly in `default.hbs` (not bundled).

## Architecture

### Layout & the contentFor block system
`default.hbs` is the master shell for every page (navbar, collapsible sidebar with nav + tags, content slot, footers, popup nav, all vendor scripts). Page templates start with `{{!< default}}` and inject content via Handlebars **block helpers**:
- `{{{body}}}` receives the page template's body.
- Named blocks let a page push into `<head>`/`<body>`: `body-class`, `featured-section-styles`, `featured-section-scripts`, `title`. A page declares `{{#contentFor "..."}}` and `default.hbs` emits `{{block "..."}}`. This is how `home.hbs` conditionally loads only the active featured-section CSS/JS.

`default-simple.hbs` is a stripped alternate shell (used by signup/signin-style pages).

### Theme settings (`package.json` → `config.custom`)
Editor-facing settings live in `config.custom` and are read in templates as `@custom.<key>` (e.g. `@custom.color_scheme`, `@custom.featured_section_style`, `@custom.post_card_style`, `@custom.sidebar_collapsed`). Adding a setting = adding a key here; some are grouped (`group: "homepage" | "post"`). `image_sizes` and `posts_per_page: 12` also live in this block. Color/scheme overrides are injected as inline CSS vars in `default.hbs`.

### Page-data-driven sections
The homepage hero is **content-driven, not hardcoded**: `partials/settings/home-hero.hbs` does `{{#get "pages" slug="home-hero"}}` to pull a Ghost page (slug `home-hero`) and falls back through custom excerpt → excerpt → site description, hiding itself if the page title is `(Untitled)`. `partials/sections/home-hero.hbs` renders it. This "create a hidden Ghost page to populate a section" pattern is the intended way to make homepage modules editable.

### Template set
- **Collection/core**: `index.hbs`, `home.hbs`, `post.hbs`, `page.hbs`, `tag.hbs`, `author.hbs`, `archive.hbs`, `error.hbs`.
- **`custom-*.hbs`** are Ghost **per-post/page selectable templates** (chosen in the editor): `custom-narrow`, `custom-post-classic`, `custom-post-image`, `custom-split`, `custom-split-subscription`. Each `{{!< default}}` and re-lays-out the same post data.
- **`page-*.hbs`** are slug-matched page templates via Ghost's hierarchy (`page-authors`, `page-tags`, `page-membership`, `page-recommendations`).
- **`signin.hbs` / `signup.hbs`** are referenced explicitly by the theme `routes.yaml`.

### Partials
Grouped by role under `partials/`: `components/` (cards, avatar, logo, carousels, toggles), `sections/` (hero, posts, tags, subscription, the four `featured-*` styles), `post/` (content, media, toc, share, comments, read-next, sidebar), `layout/`, `navigation/`, `settings/`, and three icon sets (`icons/`, `icons-menu/`, `icons-social/`). **Data-fetch wrappers** `get-posts.hbs` and `get-tags.hbs` centralize `{{#get}}` queries and pagination — reuse them rather than inlining `{{#get}}`. Note: some partials in `partials/` are **copied in from the `pvs` package at build time** — check `rollup.config.mjs` `copy` targets before assuming a partial is hand-authored here.

### JS runtime
`assets/js/index.js` imports the CSS manifest + featured-section CSS, then small behavior modules (dropdown, sidebar, toc, tooltip, card-*, search, navigation-dropdown). `init-pvs.js` wires up the **PVS framework** (`window.pvs`, loaded from the vendored `pvs.min.js`): dark mode, popups, lightbox, collapse, pagination, TOC, featured-video, pricing. Much site behavior comes from PVS, not local code — look there before reimplementing.

### i18n
All user-facing strings go through the `{{t "..."}}` helper; `npm run translate` extracts them into `locales/en.json`. Some `{{t}}` calls double as config (e.g. `{{t "/authors/"}}` returning `"false"` hides a link) — preserve that idiom.

## Deployment (CI)
`.github/workflows/deploy-theme.yml` makes this repo **auto-deploy on push**: any push to `main` or `master` (or manual `workflow_dispatch`) runs `npm install` → `npm run build:prod` → `TryGhost/action-deploy-theme` against a **remote production Ghost** (`GHOST_ADMIN_API_URL` / `GHOST_ADMIN_API_KEY` secrets). Implications:
- Pushing here ships to production — there is a live Ghost beyond the local `ghost-local` install the parent CLAUDE.md describes. Treat `main` as deployable.
- `build:prod` = `build && translate && zippie aspect.zip` (full production build + locale extraction + theme zip), heavier than `npm run build`.
- CI runs **Node 18**, but `.ghost-cli` pins the local install to **Node 22** — keep builds compatible with both.

## Routing caveat
The theme's `routes.yaml` here is the **stock Aspect** routing (signup/signin + a flat `/` collection + archive). The parent CLAUDE.md describes a richer course/lesson/webseries/episode routing that lives only in the live `content/settings/routes.yaml`. **The two are drifted.** The theme copy is the version-controlled canonical one; if you change routing, update both and re-upload via Ghost Admin (Settings → Labs → Routes) or copy to `content/settings/routes.yaml` + `ghost restart`. See the parent CLAUDE.md for the collection-via-`#tag` architecture.
