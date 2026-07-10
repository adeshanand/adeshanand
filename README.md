# Adesh Anand — Portfolio

Personal portfolio for Adesh Anand, Senior Full-Stack Engineer & Composable Commerce Specialist. A hardened, fully static one-pager: Vite + React 18 + Tailwind CSS v4 + Framer Motion, with light + dark themes (OS-aware, user-switchable via the nav toggle, persisted in localStorage).

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

## Edit content

Everything a human would want to change lives in two files:

- `src/data/profile.js` — hero copy, impact stats, every role/project, skills, certifications, education
- `src/lib/contact.js` — email and phone (stored as fragments, assembled at runtime to deter scraper bots)

Colors and fonts are design tokens at the top of `src/index.css` — one light block and one dark block of CSS variables (a full rebrand is one edit). The theme mechanism itself is `public/theme-init.js` (pre-paint) + `src/hooks/useTheme.js` (the toggle). The downloadable resume is `public/Adesh-Anand-Resume.pdf` and the nav portrait is `public/avatar.png` (a square image, auto-cropped to a circle); replace either file, keep the name.

## Architecture

```
src/
  data/profile.js          ← all site content (single source of truth)
  lib/contact.js           ← obfuscated contact fragments
  hooks/useRevealedContact.js
  components/
    ui/                    ← Button, Badge, Container, SectionHeading, Reveal
    sections/              ← Nav, Hero, Impact, Experience, Skills, Credentials, Contact, Footer
```

One component per section; sections never hard-code content or colors.

## Security

- Strict Content-Security-Policy (`default-src 'none'`, self-only) — meta tag injected at build by `vite.config.js`, plus full HTTP headers in `vercel.json` (Vercel) and `public/_headers` (Netlify)
- No backend, forms, cookies, analytics, or runtime third-party requests; fonts self-hosted
- External links carry `rel="noopener noreferrer"`; no `dangerouslySetInnerHTML`

## Deploy

**Vercel:** `npx vercel` (headers ship via `vercel.json`).
**Netlify:** publish directory `dist`, build command `npm run build` (headers ship via `public/_headers`).

See `PROJECT_BRIEF.md` for design decisions and open TODOs.
