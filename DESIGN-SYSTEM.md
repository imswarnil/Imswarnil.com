# The design system lives in its own repo now

This theme is **built from** the Creator Design System, which used to sit in
`assets/design-system/` and is now a standalone, MIT-licensed project.

- **Repo:** `~/Projects/Creator-Design-System` (not yet pushed)
- **Docs:** run `npm run dev` in that repo → <http://localhost:8080>
- **Package:** `creator-design-system`

## How the theme consumes it

`package.json` depends on it by path, so edits to the system show up here
immediately — no publish step while developing:

```json
"creator-design-system": "file:../../../../Projects/Creator-Design-System"
```

The five bridge files under `assets/css/` import the layers and add nothing
but theme-level tokens:

| File | Imports |
| --- | --- |
| `0-foundation/tokens.css` | `creator-design-system/src/1-foundation/index.css` + the site's chrome/reading/rhythm tokens |
| `1-element/index.css` | `src/2-elements/index.css` |
| `2-components/index.css` | `src/3-components/index.css` |
| `3-sections/index.css` | `src/5-sections/index.css` |
| `4-utilities/index.css` | `src/6-utilities/index.css` |

`tailwind.css` pulls those five in, then Tailwind's utilities. Rebuild with
`npm run build:css`.

> **Note:** the imports use real file paths (`.../src/1-foundation/index.css`)
> rather than the package's export names (`creator-design-system/foundation`),
> because postcss-import does not read a package's `exports` map.

## Changing the system

Edit it in its own repo, not here. Anything the theme needs that the system
lacks is a gap in the system — add it there, document it on its docs site, and
the theme picks it up on the next build.

## Switching to the published package

Once it is on npm, swap the `file:` dependency for a version range:

```bash
npm i creator-design-system@^0.1.0
```

Nothing else changes.
