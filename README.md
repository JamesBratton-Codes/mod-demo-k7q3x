# Splash Page Template

Zero build steps, zero dependencies. Pure HTML + CSS + vanilla JS.

## Make a new site in 3 steps

1. **Duplicate** this folder and rename it (e.g. `my-new-site/`).
2. **Edit `config.js`** — brand, headline, tagline, CTA label/link, social URLs, SEO meta tags, hero-card numbers. No HTML editing needed.
3. **Upload** the folder to any static host (Netlify, GitHub Pages, S3, shared hosting) — or just open `index.html` in a browser.

## Optional tweaks

- **Colors / fonts:** CSS variables at the top of `assets/css/style.css` (`--accent`, `--accent-2`, `--bg`, `--font`).
- **Logo:** replace `assets/icons/logo.svg` (or point `logo` in `config.js` elsewhere).
- **Social icons:** drop an SVG in `assets/icons/` (use white fill) and add an entry to `socials` in `config.js`.
- **Hide the secondary button:** set `secondaryCta: null`.

## Notes

- Meta tags (title, Open Graph, Twitter, canonical) are injected by `main.js`. Google runs JS, but social scrapers (Facebook, X, Slack) usually don't — for rich link previews, also copy your title/description/og tags into the `<head>` of `index.html`.
- Local preview: `python -m http.server` in this folder, then open http://localhost:8000.
