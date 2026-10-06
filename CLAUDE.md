# Pranav's portfolio: how to update it

Personal portfolio site for Pranav Raj Singh.

- **Live site:** https://pranav-analytics-uk.github.io/Portfolio/
- **Code:** https://github.com/pranav-analytics-uk/Portfolio (public; GitHub Pages)
- **Owner GitHub account:** pranav-analytics-uk

## How publishing works

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. Live in ~1–2 minutes. There is no other hosting.

## Tools (no system install needed)

Node.js and the GitHub CLI are bundled, portable, in `.tools/` (git-ignored):

```bash
export PATH="$PWD/.tools/node/bin:$PWD/.tools/gh/bin:$PATH"
```

Run that first in every shell from this folder. `gh` is already signed in to the owner's account (`gh auth status` to check; if it has expired, run `gh auth login --web` and let the owner approve the one-time code in their browser).

## Update workflow

1. `export PATH=...` (above), then `npm install` if `node_modules/` is missing.
2. Make the change (see map below).
3. `npm run dev` to preview at http://localhost:5173/Portfolio/ and check it at **desktop and phone width (390px)**.
4. `npm run build` must pass.
5. `git add -A && git commit -m "..." && git push` → wait for the deploy: `gh run watch --exit-status`.
6. Open the live site and confirm the change.

## Where things live

| To change… | Edit |
|---|---|
| Name, tagline, about text, email, phone, LinkedIn, availability | `src/data.ts` → `PROFILE` |
| Stats under About | `src/data.ts` → `STATS` |
| Jobs, education, certifications | `src/data.ts` → `EXPERIENCE`, `EDUCATION`, `CERTIFICATIONS` |
| Hero Campaign posts (title, likes, date, **Instagram link** `url`) | `src/data.ts` → `HERO_POSTS` |
| YouTube films (video id + title) | `src/data.ts` → `FILMS` |
| Instagram reels (post URL + title) | `src/data.ts` → `REELS` |
| Hero portrait photo | `public/me/pranav.jpg` (≈1600px tall, phones) and `public/me/pranav-full.jpg` (full res, desktop/retina) |
| Hero Campaign screenshots | `public/hero-campaign/hero-N.jpg` (full res), `hero-N-sm.jpg` (≈1100px, phones), `photo-N.jpg` (photo cropped from the screenshot: left 1147×1311 px) |
| Link-preview image (LinkedIn/WhatsApp card) | `public/og-image-v2.jpg` (1200×630) |
| Page title, share-preview text | `index.html` |
| Layout/styling of a section | `src/components/<Section>.tsx` |

Section order is in `src/App.tsx`: Hero → Marquee → About → Experience → Hero Campaign → Published Work → Contact.

## Rules to keep

- **Asset paths:** always use `asset('path')` / the helpers in `src/data.ts`, never a leading `/`. The site lives under `/Portfolio/` (`base` in `vite.config.ts`); root paths break on the live site.
- **New images:** add a full-res file plus a smaller phone copy and use `srcSet` (see `HeroSection.tsx` / `HeroCampaignSection.tsx`). Convert with `sips` (built into macOS).
- **Phone layout:** phones get swipe rows for films/reels, stacked experience rows, and hidden About corner photos. Anything new must be checked at 390px wide with no sideways scrolling.
- **Hero Campaign links:** each `HERO_POSTS[i].url` is empty until the owner supplies the Instagram post link; empty cards fall back to the @tecnomobileindia profile.
- Style: dark `#0C0C0C`, font Kanit, gradient headings use the `.hero-heading` class, buttons are `ContactButton` / `LiveProjectButton`.
