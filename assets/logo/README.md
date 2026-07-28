# Logo assets

Fallbacks, used only when Ghost has no publication logo set.

| File | Used for |
| --- | --- |
| `logo.svg` | the full wordmark — navbar and footer |
| `logo-mark.svg` | the compact mark — small screens, app icon |
| `../favicon.svg` | the browser tab |

**Ghost's own logo wins.** Set one in Ghost Admin → Settings → Publication
(Brand) and `{{@site.logo}}` replaces these everywhere. The inline wordmark in
`partials/logo.hbs` is used when neither exists, because markup scales and
recolours in a way an image cannot.

The record light is `#f04e2e` in both themes — only the ink flips, via
`prefers-color-scheme` inside each file.
