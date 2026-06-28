# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A customized fork of the **Aspect** Ghost theme (v2.1.1) by Priority Vision — a magazine-style Ghost theme with grid layout, functional sidebar, and extensive custom settings. The base theme docs live at https://www.priority.vision/docs/aspect/introduction/

Ghost version requirement: `>=5.0.0`

## Commands

```bash
# Development (watch mode with live reload)
npm run dev

# Production build
npm run build

# Build + translate + zip for distribution
npm run build:prod

# Theme validation against Ghost spec
npm run test       # runs build first via pretest hook
npm run test:ci    # fatal mode for CI

# Generate/update translation files
npm run translate
```

The `pretest` hook runs `npm run build` automatically before `gscan` validates the theme.

## Build System

**Rollup** bundles JS and CSS (via `rollup.config.mjs`). The entry points are configured in a `buildConfig` object near the top of that file — edit there to add/remove bundle entries.

**JS pipeline:** Rollup → `@rollup/plugin-node-resolve` + `@rollup/plugin-commonjs` → `rollup-plugin-esbuild` (target: es2020, minified in production, source maps in dev)

**CSS pipeline:** `postcss-import` → `postcss-mixins` → `@lehoczky/postcss-fluid` (fluid typography, breakpoints 380px–1500px) → `postcss-nested` → `postcss-preset-env` (custom-properties disabled). Output lands in `assets/built/`.

**Vendor assets** are copied from `node_modules` to `assets/vendors/` on production build. The optional `pvs` package (`github:priority-vision/pvs#v2.3.4`) supplies `pvs.min.css`, `pvs.min.js`, `pvs-footer.min.js`, and some partials.

## Architecture

### Templates

Root-level `.hbs` files are Ghost Handlebars templates:

- `default.hbs` / `default-simple.hbs` — layout wrappers
- `index.hbs` / `home.hbs` — homepage variants
- `post.hbs`, `page.hbs`, `tag.hbs`, `author.hbs`, `archive.hbs` — standard Ghost templates
- `custom-post-classic.hbs`, `custom-post-image.hbs`, `custom-split.hbs`, `custom-split-subscription.hbs` — per-post layout overrides selectable in Ghost admin
- `custom-narrow.hbs`, `page-authors.hbs`, `page-membership.hbs`, `page-recommendations.hbs`, `page-tags.hbs` — custom page templates
- `signup.hbs`, `signin.hbs`, `error.hbs` — utility templates

Routes are defined in `routes.yaml`: `/signup/` and `/signin/` map to their templates; `/` uses `index.hbs`; `/archive/` uses `archive.hbs`; both use `/{slug}/` permalinks.

### Partials

`partials/` is the main component library, organized by concern:

| Directory | Purpose |
|---|---|
| `partials/components/` | Reusable UI: cards (`card-post.hbs`, `card-author.hbs`), carousels, avatars, logo, nav links, social links, color-scheme/search toggles, author tooltips |
| `partials/sections/` | Page sections: `featured-carousel.hbs`, `featured-slider.hbs`, `featured-grid.hbs`, `featured-grid-list.hbs`, `hero.hbs`, `home-hero.hbs`, `posts.hbs`, `subscription.hbs` |
| `partials/post/` | Post-level components: `content.hbs`, `toc.hbs`, `sidebar.hbs`, `tags.hbs`, `comments.hbs`, `social-share.hbs`, `read-next.hbs` |
| `partials/layout/` | Footer variants (`footer.hbs`, `footer-sidebar.hbs`, `footer-copyright.hbs`), `split.hbs` |
| `partials/navigation/` | Navigation sub-components: `custom.hbs`, `expandable.hbs`, `section.hbs`, `separator.hbs`, `toggle.hbs` |
| `partials/settings/` | Ghost Design setting partials: `home-hero.hbs`, `post-card.hbs` |
| `partials/icons/` | Inline SVG icons (arrow, chevron, search, share, sun/moon for color scheme, etc.) |
| `partials/icons-social/` | Social platform icons (Twitter/X, Facebook, Instagram, YouTube, LinkedIn, Mastodon, Bluesky, Threads, TikTok, Pinterest) |
| `partials/icons-menu/` | Navigation menu icons |

Top-level partials include `navigation.hbs`, `pagination.hbs`, `form-subscribe.hbs`, `with-sidebar.hbs`, `without-sidebar.hbs`, `color-scheme-head-script.hbs`, and `theme-head-script.hbs`.

### CSS

Source CSS lives in `assets/css/`, organized as:
- `vars.css` — CSS custom properties (colors, spacing, typography scale)
- `_mixins/` — PostCSS mixins for color-scheme, gradient-overlay, heading, sidebar-collapsed
- `base/` — reset, typography, forms, view transitions
- `components/` — all UI component styles (cards, navigation, dropdowns, tooltips, TOC, etc.)
- `ghost/` — styles for Ghost editor card blocks (audio, video, code, blockquote, galleries, etc.)
- `layout/` — sidebar, navbar, footer, container, popup
- `pages/` — per-template page styles
- `sections/` — section-level styles
- `section-featured/` — carousel/slider/grid featured section styles
- `swiper/` — Swiper carousel overrides
- `templates/` — error and split template styles

`assets/custom.css` is for site-specific overrides and is not processed by the build pipeline.

### JavaScript

Source JS in `assets/js/index.js` is the main bundle entry; it imports feature modules:
- Sidebar, search, navigation dropdown, dropdowns, card interactions, tooltips, TOC, button animations, posts infinite scroll
- `assets/js/init-pvs.js` — Priority Vision system initialization
- `assets/js/section-featured/carousel.js` and `slider.js` — featured section interactivity
- `assets/js/slider-tags.js`, `slider-cards.js` — tag/card Swiper sliders
- `assets/js/announcement-bar.js` — separate bundle for announcement bar

`assets/custom.js` is for site-specific JS, not processed by the build.

### Ghost Custom Settings

Configured in `package.json` under `config.custom`. Key settings:
- `color_scheme` — Light / Dark / System (default: System)
- `sidebar_collapsed` — boolean
- `post_card_style` — Classic, Classic Simple, Overlay, Overlay Simple, List, List Simple
- `featured_section_style` — Disabled, Carousel, Slider, Grid, Grid List (homepage group)
- `feature_image_aspect_ratio` — auto, 1/1, 4/3, 3/2, 2/3, 16/9, 21/9 (default), 9/16
- `show_sidebar` — boolean (post group)
- Various text settings for subscription form copy, footer copyright, and tag list counts

## Localization

Translation files live in `locales/` (e.g., `en.json`). Run `npm run translate` (uses `gtl`) to update them.
