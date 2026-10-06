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
| Hero portrait photo | `public/me/pranav.webp` (≈1600px tall, phones) and `public/me/pranav-full.webp` (full res 2156×3232, desktop/retina). Source: `~/Downloads/_STU2635.jpg` |
| Hero Campaign screenshots | `public/hero-campaign/hero-N.webp` (full res 2150px), `hero-N-sm.webp` (1100px, phones), `photo-N.webp` (photo cropped from the screenshot: left 1147×1311 px), `photo-N-sm.webp` (640px, marquee/About). Sources: `~/Desktop/Hero Campaign/*.png` |
| Heroes case study (Brief / What I did / Result) | `src/data.ts` → `HERO_CASE` |
| Skills & Tools chips | `src/data.ts` → `SKILLS` (only list skills Pranav has confirmed) |
| Download CV (About section only) | `public/cv/Pranav_Raj_Singh_CV.pdf` (source: `~/Documents/CV:Cover Letter/Final CV/Pranav CV(1).pdf`, shown in Finder as "CV/Cover Letter"). The block is absolutely positioned in the About section's bottom padding so the section height never changes. Replace that file to update the CV; `PROFILE.cv` in `src/data.ts` points at it (empty = hidden) |
| Google Analytics | `ANALYTICS_ID` in `src/data.ts` (G-XXXXXXXXXX). Empty = no analytics, no cookie banner. Logic in `src/analytics.ts`, banner in `src/components/ConsentBanner.tsx` |
| Sitemap / robots | `public/sitemap.xml` (update `lastmod` on big changes), `public/robots.txt` |
| Link-preview image (LinkedIn/WhatsApp card) | `public/og-image-v2.jpg` (1200×630, stays JPG for social crawlers). Regenerate with `scripts/og-image.swift`; bump the file name (v3…) and update `index.html` so LinkedIn refetches |
| Page title, share-preview text | `index.html` |
| Talking AI avatar = hero centrepiece | `src/components/IntroAvatar.tsx` (rendered by `HeroSection.tsx`; the portrait photo was removed from the hero on Pranav's request, files kept in `public/me/`; restore from git history if wanted). Video/poster/script/caption timings in `src/data.ts` → `INTRO`; files `public/intro/pranav-intro.mp4` (720×720 crop of `~/Desktop/A2.mp4`; A2's "Welcome in." is mouthed but silent) + poster. Behaviour: starts on the visitor's first mouse move/scroll/wheel/key/click; browsers refuse sound without a click/tap/key, so it then plays muted with captions + a 'Click anywhere for sound' hint and restarts with sound on the first click/tap/key. The avatar does NOT follow the cursor (no Magnet). No 'AI avatar' label (removed on request); instead the original '▶ Meet Pranav' pill sits beside the chin and switches to Stop / Replay. Clicking the avatar also replays. Once per visit (sessionStorage). Testing: Puppeteer marks pages as already user-activated, so simulate the sound rule by tracking real click/key/touch events (see session notes) |
| Layout/styling of a section | `src/components/<Section>.tsx` |

Section order is in `src/App.tsx`: Hero → Marquee → About → Experience → Hero Campaign → Published Work → Contact.

## Rules to keep

- **Asset paths:** always use `asset('path')` / the helpers in `src/data.ts`, never a leading `/`. The site lives under `/Portfolio/` (`base` in `vite.config.ts`); root paths break on the live site.
- **New images:** WebP only (except the og image). Add a full-res file plus a smaller phone copy and use `srcSet` (see `HeroSection.tsx` / `HeroCampaignSection.tsx`). Convert with `scripts/to-webp.mjs`; `sips` (macOS) can resize/crop but cannot write WebP.
- **Analytics consent:** Google scripts must only load after the visitor clicks Accept (`src/analytics.ts`). Track new key actions with `track('event_name', {...})`.
- **Dock-style hover magnify:** `src/components/Magnify.tsx` (`MagnifyGroup` + `MagnifyItem`). Used on the Heroes Brief/What I did/Result cards, the Experience job rows and the Skills & Tools chips, but deliberately NOT on Education or Certifications. Mouse/trackpad only; tune with `max` (peak scale) and `range` (px). Don't add `will-change` (blurs text).
- **Accessibility:** animated text must keep a screen-reader copy (see `AnimatedText.tsx`: `sr-only` text + `aria-hidden` letters).
- **Phone layout:** phones get swipe rows for films/reels, stacked experience rows, and hidden About corner photos. Anything new must be checked at 390px wide with no sideways scrolling.
- Style: dark `#0C0C0C`, font Kanit, gradient headings use the `.hero-heading` class, buttons are `ContactButton` / `LiveProjectButton`.
