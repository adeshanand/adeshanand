# PROJECT_BRIEF.md — Adesh Anand Portfolio

> **Purpose of this file:** the single source of truth for this project's architecture, decisions,
> invariants, and current state. A new Claude Code session (or developer) should read this file
> top-to-bottom to gain end-to-end understanding without re-analyzing the codebase.
> **Keep this file updated after every meaningful change.**
>
> Last updated: **2026-07-20** (mobile animation/layout fix round — see §14).

---

## 1. What this is

A **fully static, single-page portfolio** for Adesh Anand — Senior Software Engineer &
Composable Commerce Specialist (Bengaluru, India). Design language is Lusion/Linear-inspired:
editorial oversized typography, a hand-rolled WebGL2 hero, strict performance and accessibility
budgets, and a hard Content-Security-Policy.

- **Live site:** https://adeshanand.netlify.app (Netlify is the primary deploy target)
- **Secondary deploy target:** Vercel (fully configured, see §9)
- **No routing, no backend, no fetches, no forms.** One page, eight sections.
- ~3,300 lines of source. Biggest file: `src/gl/field.js` (893 lines, the WebGL engine).

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Build | Vite 6 (`vite.config.js`) | 3 plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`, custom `injectCsp` |
| UI | React 18.3 (`StrictMode`) | Client-rendered SPA — **must never become SSR/SSG** (breaks contact privacy, §8) |
| Styling | Tailwind CSS v4 | **CSS-first config** — no `tailwind.config.js`; tokens live in `src/index.css` |
| Motion | framer-motion 12 (installed 12.42.2) | plus pure-CSS keyframes for ambient loops |
| 3D/GL | **None (hand-rolled)** | raw WebGL2 in `src/gl/field.js`, zero libraries |
| Icons | lucide-react | |
| Fonts | `@fontsource-variable/inter` (body) + `@fontsource-variable/sora` (display) | self-hosted — CSP forbids external font hosts |

Scripts: `npm run dev` / `npm run build` / `npm run preview`. Build output: `dist/`
(~339 KB main JS, ~19.4 KB lazy HeroField chunk, ~39.6 KB CSS, subsetted woff2 fonts).

## 3. Repository map

```
index.html            SEO/OG/meta + blocking /theme-init.js; CSP meta injected at BUILD time only
vite.config.js        plugins + injectCsp (CSP meta, build-only, head-prepend)
vercel.json           Vercel headers (CSP + security headers)
public/
  _headers            Netlify headers (CSP + security headers) — must mirror vercel.json
  theme-init.js       pre-paint theme script (external file BECAUSE CSP bans inline scripts)
  404.html, 404.css   self-contained static 404 (noindex, reuses theme-init.js, hand-copied palette)
  robots.txt          allows all EXCEPT /Adesh-Anand-Resume.pdf
  favicon.svg         'A' on cyan #22D3EE / ink #071018 (hardcoded hexes — rebrand touchpoint)
  avatar.png          nav avatar (⚠ 929 KB, eager-loaded at 36px — known perf item, §13)
  og-image.png        social card (⚠ has BAKED-IN title/years — regenerate if copy changes)
  Adesh-Anand-Resume.pdf, badges/*.png (AWS cert badge art)
assets-src/art/       21 webp parallax layers (7 companies × bg/mid/fg) — DELIBERATELY UNSHIPPED (§12)
src/
  main.jsx            mounts <App/>; the ONLY place fonts + index.css are imported
  App.jsx             skip-link → Nav → <main>: section composition (order in §4)
  index.css           the entire design-token system + custom animation CSS (§5)
  data/profile.js     ALL site copy (§7) — but NEVER contact details
  lib/contact.js      email/phone as fragment arrays (§8) — the only place contact data lives
  hooks/useTheme.js         theme store (useSyncExternalStore over <html data-theme>)
  hooks/useRevealedContact.js  post-mount contact reveal
  hooks/useHireContact.js      tel: vs mailto: routing (UA-sniffed /Mobi/)
  gl/field.js         the WebGL2 engine (§6) — policy-free by contract
  components/effects/HeroField.jsx  React ↔ GL bridge (§6)
  components/sections/  Nav, Hero, AwsSpotlight, Impact, Experience, Skills,
                        Credentials, Testimonials, Contact (footer lives inside Contact)
  components/ui/        Button, Badge, Container, SectionHeading, Reveal, SpotlightCard,
                        Marquee, ThemeToggle, ParallaxArt (⚠ intentionally unused, §12)
```

## 4. Page architecture & data flow

**Section order** (`src/App.jsx`): `Nav` (fixed) → `<main id="main">`:
`Hero (id="top")` → `AwsSpotlight (id="aws")` → `Impact (no id, no nav entry)` →
`Experience (id="experience")` → `Skills (id="skills")` → `Credentials (id="credentials")` →
`Testimonials (id="testimonials")` → `Contact (id="contact", contains the footer)`.

- All copy flows **one way** from `src/data/profile.js` via direct ES imports. No props between
  sections, no global state, no context providers.
- Nav (`Nav.jsx`): 6 hash links with hardcoded mono numerals **01–06**
  (aws/experience/skills/credentials/testimonials/contact). Scroll-spy via IntersectionObserver
  with `rootMargin '-45% 0px -50% 0px'` (middle-band); also observes hero `id="top"` so scrolling
  up clears the highlight. Scroll-progress bar: `useScroll` + `useSpring` (raw value under
  reduced motion). Blur/border appears after 12 px scroll. Mobile menu: Escape-close + focus
  restore. Anchor smoothness is pure CSS (`scroll-behavior: smooth` gated on
  `prefers-reduced-motion: no-preference`, `scroll-padding-top: 5.5rem` for the fixed header).
- **⚠ Numbering constellation:** Nav's 01–06, each section's `index` prop on SectionHeading, and
  Contact's inline `06` label are three separate hardcoded lists — adding/reordering sections
  requires syncing all three.

## 5. Design system (`src/index.css`, 243 lines pre-fix)

Two-layer token architecture:

1. **Raw palette as CSS variables**: `:root` = light theme (**the default**),
   `:root[data-theme='dark']` = dark overrides. Tokens: `--c-paper/cloud/card` (surfaces),
   `--c-ink/muted` (text), a cyan accent family (`--c-accent` = `#0c657e` light / `#22d3ee` dark,
   plus `-deep/-soft/-strong/-strong-hover`, `--c-on-accent`), and effect tokens
   (`--grid-line`, `--hero-wash`, `--aurora-*`, `--spot-color`, `--shadow-card`, `--btn-glow`,
   `--accent-glow`, `--grad-accent-from/to`). Each block sets `color-scheme`.
2. **Tailwind mapping** via `@theme inline` (`--color-paper: var(--c-paper)` …). The **`inline`
   keyword is load-bearing**: it makes opacity modifiers (`border-ink/8`, `bg-paper/80`) resolve
   through `color-mix` at point-of-use so they theme correctly. Converting to plain `@theme`
   bakes light values in and silently breaks dark mode.
   A separate `@theme` block defines `--font-display` (Sora Variable) / `--font-body` (Inter Variable).

Custom CSS blocks (each gated behind `prefers-reduced-motion: reduce`):
- **View-Transition theme reveal**: circular `clip-path` expanding from the toggle button
  (`--vt-x/--vt-y`), 0.55 s; `html.vt-active` suspends the body's 0.35 s color-transition fallback.
- **Hero aurora**: 3 drifting radial-gradient blobs, transform-only (deliberately no `filter: blur`).
- **Spotlight card**: `.spotlight-card::before` radial glow at `--spot-x/--spot-y`, hover-capable
  media query only.
- **Marquee**: track duplicated exactly twice, `translateX(-50%)` 30 s linear loop, edge-fade
  mask; pauses on hover, `:focus-within`, and `[data-paused='true']` (WCAG 2.2.2).

**Typography scale:** section headings `text-4xl md:text-6xl` via `SectionHeading` (overridable
per-section via its `size` prop — added 2026-07-20); hero and contact headlines use `clamp()`.

## 6. The WebGL hero (the showpiece)

### Engine — `src/gl/field.js` (893 lines, dependency-free WebGL2)

Factory `createField(canvas, { particleCount = 220, onContextLost })` → imperative handle
`{ start, stop, resize, setTextBounds, setPointer, setColors, destroy }`. Returns `null` when
WebGL2 is unavailable. Context: `alpha:true, antialias:false, depth:false, stencil:false,
powerPreference:'low-power'`.

**Three-pass frame pipeline** (5 shader programs):
1. **Paint** — pointer velocity splatted into a **quarter-res** RGBA8 ping-pong buffer
   (values packed around 0.5; neutral clear `0.5,0.5,0,1`), Gaussian splat radius 0.11,
   dissipation 0.965/frame. RG = packed velocity, B = energy.
2. **Scene** — into a full-res offscreen RT with premultiplied-over blending
   (`ONE, ONE_MINUS_SRC_ALPHA`):
   - *Constellation*: 220 CPU particles (~28% accent-colored/larger), drift from two
     incommensurate sine fields, pointer repulsion (aspect-corrected, d²<0.14), damping 0.986,
     toroidal wrap ±1.05. Neighbour links: brute-force n² scan, `LINK_DIST 0.16`, `MAX_LINKS 480`.
   - *Monogram*: instanced fake-lit spheres ("matcap on a budget" fragment shader) that
     spring-assemble into three certification wordmarks — `MONO_ROWS`: **AWS #ff9900,
     SFCC #00a1e0, "Gen" grey + "AI" #2979ff**. Targets come from rasterizing the words in
     Sora (wght 650, 7% letterspacing) on a 2D canvas and grid-sampling alpha with a 3×3
     coverage test (≥3/9), adaptive step ×1.3 to stay ≤240 balls/row (`MONO_MAX_BALLS 720`).
     Physics: spring 0.05, damping 0.9, pointer repulsion radius 110 px sets reveal energy;
     balls rest **63% washed toward the theme paper color** (`MONO_WASH 0.63`) and show true
     brand color when disturbed, draining over 120 frames. O(n²) pairwise separation (heaviest
     CPU cost, ~259 k pair checks at max). Placement: right of the measured `h1` (needs ≥230 px)
     or the band above it; **skipped entirely below 640 CSS px width or 24 px font** — phones
     get particles only. Ball positions carry over across resizes (letters re-flow, not re-drop).
3. **Composite** — scene texture drawn to canvas, UVs warped by the paint gradient
   (`DISTORT_STRENGTH 0.055`) + accent glow `paint.b² × 0.22`; blending disabled — output is
   already premultiplied (matches canvas default).

**Budgets:** DPR ≤ 1.5 **and** total-pixel cap 2560×1440; paint buffer quarter-res; dt normalized
to 60 fps units, clamped max 3, **deliberately no lower clamp** (240 Hz-correct).

**Pointer smoothing:** `SecondOrder` class — critically-damped second-order dynamics
(f=1.6, ζ=0.7, r=1.4) with a k2 stability clamp; smoothed pointer drives repulsion, raw
frame-delta (×0.9) drives the paint splat.

### Contracts & invariants (do not violate)

- **field.js is policy-free** (header comment): it never reads `prefers-reduced-motion`,
  visibility, or WebGL support. Hero.jsx and HeroField.jsx own all policy.
- **`destroy()` must NEVER call `loseContext()`** (comment at ~line 876): a canvas gets exactly
  one WebGL2 context ever; losing it bricks StrictMode/HMR remounts. This is intentional.
- **Premultiplied alpha end-to-end**: shaders output `col*a`, scene blend is premultiplied-over,
  composite writes premultiplied with blending off. Changing any one stage double-applies alpha.
- **Paint packing**: signed velocity packed around 0.5 in RGBA8; the neutral clear color and the
  `-0.5` unpack in PAINT_FS/COMPOSITE_FS must change together.
- **Ball instance stride = 28 bytes (7 floats)** shared across 5 code sites (allocation,
  3× vertexAttribPointer, packing loop, array sizing) — change together.
- `setTextBounds()` only flags a rebuild (`monoW = -1`); the actual monogram rebuild happens on
  the **next `resize()`** — callers must pair them (HeroField always does).
- `bufferSubData` uses WebGL2 srcOffset/length overloads — not WebGL1-portable.
- Default colors in field.js are wrong-looking lime placeholders — correct only because
  `syncColors()` always overwrites them immediately after `createField`.

### Bridge — `src/components/effects/HeroField.jsx`

Props: only `onReady` / `onLost` (held in refs; the mount effect never re-runs). Flow:
`Promise.race([document.fonts.ready, 1200 ms])` (monogram rasterizes Sora) → `createField` →
`syncColors()` → `measureText()` → `resize()` → `onReady`. Details:
- `measureText()` queries **`#top h1`**, uses `Range.getClientRects()` for the true text right
  edge, treats `h1.previousElementSibling` as the badge — **DOM-coupled to Hero's markup**;
  restructuring Hero silently degrades to "no monogram" (not a crash). A 1600 ms `settleTimer`
  re-measures after the hero's ~1.3 s entrance (update it if entrance timing changes).
- IntersectionObserver **starts/stops the rAF loop and pointer listeners** when the hero
  enters/leaves the viewport. Pointer only on `(hover: hover)` devices (touch = no interaction,
  by design). `window blur` / `document pointerleave` reset the pointer.
- ResizeObserver → re-measure + resize; a re-arming `matchMedia('(resolution: Ndppx)')` watcher
  catches zoom/monitor DPR changes.
- Theme: `useTheme()` effect → `syncColors()` reads `--c-accent/--c-muted/--c-paper` via
  `getComputedStyle(html)` → `field.setColors({ …, alpha: dark ? 1 : 0.85 })`. **No
  MutationObserver backstop** — a `data-theme` write outside setTheme repaints CSS but not the canvas.
- `webglcontextlost` → `onLost` → Hero restores the CSS aurora.

### Owner — `src/components/sections/Hero.jsx`

- HeroField is `React.lazy` (separate chunk), armed via `requestIdleCallback` (timeout 2000 ms;
  350 ms `setTimeout` fallback), **never mounted under reduced motion**, unmounted if the
  preference flips mid-session. CSS aurora is the first paint and the permanent fallback;
  cross-fades out over 1 s on `onReady`.
- Hero entrance: mount-time stagger (`initial/animate`, delay 0.12·i,
  ease `[0.21,0.47,0.32,0.98]`) — not `whileInView`.
- `hero.headline` is an **array of exactly 2 strings**; gradient is applied to `headline[1]` only.
- ⚠ Stale comments at `Hero.jsx:~52` and `HeroField.jsx:~26` still say "AA monogram" — the code
  renders AWS/SFCC/GenAI **wordmarks**, not initials. Trust the code, not those comments.

## 7. Content architecture — `src/data/profile.js` (~356 lines)

Named exports (all copy lives here; **contact details must never be added here**):

| Export | Shape | Consumed by |
|---|---|---|
| `identity` | `{name, role, location, linkedin, resumeFile}` | Nav, Hero, Contact |
| `hero` | `{headline: [line1, line2], sub, chips: [3], brands: [5]}` | Hero |
| `impact` | 4× `{value:number, suffix?, label, context}` (renderer supports unused `prefix`) | Impact |
| `experience` | 5 roles `{company, meta?, role, period, location, projects:[{name, blurb, points?, stack[]}]}` | Experience |
| `skills` | 4 groups `{title, icon: 'server'\|'layout'\|'sparkles'\|'wrench', items[]}` — icon key MUST be in Skills.jsx's ICONS map or render crashes | Skills |
| `awsCertifications` | 2× `{name, short, level, badge, tagline, date?, credentialId?, verifyUrl}` | AwsSpotlight |
| `certifications` | 5× `{name, issuer, date?, expires?, credentialId?, logo?, verifyUrl}` | Credentials |
| `recognitions` | 1× `{name, body, logo?, url}` | Credentials |
| `education` | 2× `{degree, school, period, score, logo?}` | Credentials |
| `testimonials` | 7 verbatim LinkedIn recommendations `{name, role, relation, date, url, initials, quote}` | Testimonials |

Documented intentional split (profile.js ~210): AWS certs get the spotlight section + hero chip;
everything else goes to Credentials. **Do not merge the arrays.**
Credentials entries carry optional `logo` paths into `/public/logos/` (official issuer favicons /
brand marks, verified against the issuers' own sites, ≤25KB each); `CredentialMark` in
Credentials.jsx renders them on a white tile (`bg-logo-tile`, backed by the theme-independent
`--c-logo-tile` token — logos are drawn for white backgrounds, so it deliberately stays white in
both themes) and falls back to the old token-colored lucide icon chip when `logo` is absent.
Newest-first order: Claude Certified Architect — Foundations (Anthropic, Aug 2026, expires Aug 2027,
verified via Credly badge 9cd9ec12-b4d9-4d58-9b2c-db78dbf30881; logo is anthropic.com's own
180×180 apple-touch-icon) heads the list, followed by Sanity Certified Content Operator (Jul 2026,
verify URL sanity.io/learn/profile/gt0XGk6qI — confirmed live against Sanity's Learn API).
`expires` is optional and only set on time-limited certs; it renders as a "Valid through …" line
above the credential ID.
Testimonial avatars are **initials** on purpose: LinkedIn photo URLs are tokenized/expiring AND
would be blocked by `img-src 'self'`.

## 8. Contact privacy scheme (critical — do not weaken)

Two deterrent layers (anti-scraper, not encryption):
1. **Source level** (`src/lib/contact.js`): email and phone exist ONLY as fragment arrays
   (`EMAIL_PARTS`, `PHONE_PARTS`), joined at runtime; even scheme prefixes are split
   (`['mail','to:'].join('')`, `['te','l:'].join('')`) so no greppable `mailto:`/`tel:`/address
   literal exists in the repo, bundle, or static HTML.
2. **DOM level** (`useRevealedContact`): initial state is `null` text + `#contact` hrefs; real
   values swap in only in a **post-mount useEffect**. Static crawlers see nothing; Contact
   renders "available on request" fallbacks.

`useHireContact` adds routing: `/Mobi/i` UA test (deliberately NOT viewport width — a breakpoint
would misroute landscape phones and narrow desktops) → `tel:` on handsets, `mailto:` elsewhere.
Consumers: Contact (direct reveal), Hero + Nav (via useHireContact).

**Rules:** never write the assembled email/phone anywhere in the repo (including this file);
never add them to profile.js; never prerender/SSG the site (the initial DOM must stay
contact-free). Changing the address = edit the fragment arrays only.
Verified 2026-07-20: `dist/` contains zero `mailto:`/`tel:` literals.

## 9. Security: CSP & headers

Policy: `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:;
font-src 'self'; connect-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none';
object-src 'none'; upgrade-insecure-requests` (+ `frame-ancestors 'none'` in the header copies).

**Lives in THREE places that must stay in lockstep:**
1. `vite.config.js` `injectCsp` plugin — meta tag injected **at build only** (dev keeps HMR alive);
   omits `frame-ancestors` (invalid in meta).
2. `vercel.json` (Vercel headers)
3. `public/_headers` (Netlify headers)

Both header files also ship: `X-Content-Type-Options nosniff`, `X-Frame-Options DENY`,
`Referrer-Policy strict-origin-when-cross-origin`, Permissions-Policy (camera/mic/geo/payment/usb
denied), COOP `same-origin`, CORP `same-origin`, HSTS 1y includeSubDomains.

Implications:
- **No inline `<script>` or `<style>` ever** — that's why `theme-init.js` is an external blocking
  file. Runtime styling via CSSOM (framer-motion, `--spot-x/y`, `--vt-x/y`) is NOT governed by
  style-src and is fine.
- Any analytics/CDN/external font/iframe/form endpoint requires editing **all three copies**.
- `form-action 'none'` → a real `<form>` POST cannot work today.
- WebGL/canvas/`getImageData` are same-origin and outside CSP scope. **Same-origin file-based Web
  Workers ARE allowed** (worker-src falls back to script-src 'self'); blocked: blob:/data: workers
  (i.e. Vite's default inline-worker bundling) and WASM (no 'wasm-unsafe-eval').
- Dev server has NO CSP — violations only surface on a production build. Test builds before deploy.

## 10. Motion & accessibility contract (site-wide, mandatory for new work)

Every animated feature has an explicit reduced-motion branch. **New motion must follow suit.**
- CSS gates: smooth-scroll, aurora, marquee, view-transition reveal.
- `useReducedMotion` gates: Reveal (static div), SectionHeading (bare title, no bar), Button
  (magnetism + hover/tap scales off), Experience hairline, Nav progress spring (raw value),
  Impact count-up (snaps to target), Hero entrance, and the entire WebGL field (never mounts;
  torn down on mid-session flip).
- Known ungated (accepted): hover/discrete micro-transitions (avatar/badge hover scale, arrow
  nudges, spotlight fade, body theme cross-fade).

**Animation engineering rules (learned 2026-07-20 — see §14):**
1. Animate only compositor-eligible values. In framer-motion 12.42.2, WAAPI acceleration covers
   exactly `opacity`, `clipPath`, `filter`, `transform` (the **transform string** — the `x`/`y`
   shorthands run on the JS frameloop). Never animate layout properties (`left/top/width/height`).
2. `whileInView`'s `viewport.margin` becomes an IntersectionObserver `rootMargin` applied to
   **all four sides**, and the observer watches **the motion element itself** (transforms
   included in its rect). A skinny or pre-translated element near the container gutter never
   intersects on narrow viewports → the animation deadlocks at its initial frame. **Viewport
   triggers must sit on full-width, in-flow elements**; animate offset/decorative pieces as
   variant children of that trigger.
3. Sitewide viewport convention: `viewport={{ once: true, margin: '-80px' }}` (Reveal,
   SectionHeading, Experience hairline).

Other a11y invariants: skip-link; one `h1`; `main` has `tabIndex={-1}`; Contact's `<footer>`
carries `role="contentinfo"` (restores the landmark lost inside `section/main`); Marquee's
duplicate track stays `aria-hidden` with its 3 pause affordances; focus-visible styles on links.

## 11. Performance strategy

- WebGL chunk lazy + idle-deferred; rAF + pointer listeners stopped offscreen (IO);
  DPR/pixel caps; quarter-res paint; low-power context; monogram rebuild throttled (>48 px
  deltas), fonts awaited ≤1200 ms.
- Fonts: self-hosted subsetted variable woff2 with unicode-range.
- Badges lazy + `decoding=async`.
- No manualChunks / build overrides (defaults are fine at this size).
- ⚠ Known heavy item: `public/avatar.png` 929 KB eager at 36 px (see §13).

## 12. Deliberate decisions — DO NOT "fix" without asking the user

| Decision | Where recorded |
|---|---|
| **Light is the default theme; OS `prefers-color-scheme` is deliberately ignored** | index.css header, useTheme.js, theme-init.js |
| `destroy()` never calls `loseContext()` | field.js ~876 |
| `/Mobi/` UA sniff over viewport width for Hire-Me routing | useHireContact.js comment |
| Monogram/pointer interaction skipped on touch + <640 px — phones get particles only | field.js constants |
| Testimonial avatars are initials (CSP + expiring LinkedIn URLs) | Testimonials.jsx |
| `ParallaxArt.jsx` + `assets-src/art/*.webp` are **intentionally retained dead code** — the parallax-art feature was removed from Experience on user request; restore recipe in `assets-src/art/README.txt` (move webps to `public/art`, re-add art fields to profile.js, re-add render in Experience) | assets-src/art/README.txt |
| Resume PDF disallowed in robots.txt | public/robots.txt |
| No `filter: blur()` on aurora (perf) | index.css comment |
| field.js stays policy-free (no reduced-motion/visibility checks inside it) | field.js header |
| **User's standing rule: ask before any change that degrades an existing feature** | user memory |

## 13. Known issues / staleness backlog (verified, not yet fixed)

1. **`public/avatar.png` is 929 KB**, eager-loaded for a 36 px nav avatar — biggest easy perf win
   (compress/resize; safe).
2. **`og:image` is a relative URL** (`index.html` TODO) — crawlers ignore relative og:image;
   needs the absolute https URL post-deploy. og-image.png also has baked-in title/years —
   regenerate if those change.
3. **README.md is stale**: says "7+ years" (site copy says 8 everywhere), claims theme is
   "OS-aware" (it is not, by design), architecture tree lists a nonexistent `Footer` and omits
   AwsSpotlight/Testimonials.
4. **Stale "AA monogram" comments** in Hero.jsx (~52) and HeroField.jsx (~26) — code renders
   AWS/SFCC/GenAI wordmarks.
5. **Theme/palette hexes duplicated in ~6 places** (rebrand checklist): `theme-init.js`,
   `useTheme.js`, `index.html` theme-color meta, `index.css` (light+dark `--c-paper`),
   `public/404.css`, `public/favicon.svg`.
6. `theme-init.js` has two stale comments (mentions "media-scoped metas" that don't exist;
   catch-comment mentions system-preference fallback that isn't implemented).
7. `Impact` renders an optional `stat.prefix` no datum uses; `ProjectCard`'s `wide` prop is
   vestigial (parent grid is `xl:grid-cols-1`).
8. `404.css` references font-family 'Inter' but no font loads on that page → renders system-ui.
9. No canonical URL and no JSON-LD in index.html.
10. Cosmetic: at 320 px viewports the nowrap footer tagline bleeds ~16 px into each px-6 gutter
    (no scroll/clipping; quality gate targets 375 px+).
11. Footer copyright + tagline need ≥640 px to share one row (below that they stack — intended).

## 14. Work log

### 2026-07-20 — Mobile bug-fix round (verified, **uncommitted at time of writing**)

User reported on iPhone 17 Chrome: (1) section-heading scanline line frozen at the left of every
heading; (2) wanted the Experience title as a 4-line stack on mobile; (3) footer tagline wrapped.

**Root cause of (1) — geometric, affects ALL narrow viewports in ALL browsers:** the old accent
bar was its own `whileInView` element animating CSS `left` 0%→100%. Framer observes the bar
itself, and `margin: '-80px'` shrinks the IO root on **all four sides** — a 2 px bar ~24 px from
the viewport's left edge sits entirely inside the excluded band, so `isIntersecting` never fires
below ~1250 px viewport width. Bar frozen forever; title still revealed (its full-width span
intersects fine). Additionally the `left` tween was main-thread (not WAAPI).

**Changes:**
- `src/components/ui/SectionHeading.jsx` — rebuilt: a full-width in-flow `motion.span` wrapper
  now owns `initial="hidden" whileInView="shown" viewport={{once:true, margin:'-80px'}}`; the
  title (clipPath variant) and a full-width absolute carrier (transform-string variant,
  `translateX(-100%)→0`, bar anchored `right-0`, opacity fade delay 0.72 s) animate as variant
  children. All values WAAPI-accelerated; identical visual trajectory; reduced-motion branch
  unchanged. Also added a `size` prop (default `'text-4xl md:text-6xl'`).
- `src/components/sections/Experience.jsx` — title passed as JSX with `<br className="md:hidden">`
  after "Eight years," / "five teams," / "one throughline:", plus
  `size="text-[clamp(1.625rem,8.2vw,2.25rem)] md:text-6xl"` (fixed 36 px overflowed:
  "platforms that scale." measures 358.5 px @36 px Sora 600 tracking-tight vs 327/354 px
  available at 375/402 px viewports).
- `src/components/sections/Contact.jsx` — footer tagline:
  `whitespace-nowrap font-mono text-[10px] tracking-[0.14em] md:text-xs md:tracking-[0.18em]`
  (md, not sm, so the 640–707 px row still fits both items single-line).

**Verification (multi-agent, adversarial):** framer-motion 12.42.2 source traced in node_modules
(observer target, variant propagation, WAAPI eligibility all confirmed); headless-Chrome
pixel-measurement with the project's real woff2 confirmed exactly 4 heading lines at
320/360/375/390/402/414/430/500 px with 10–31 px margin, desktop 768 px+ pixel-identical to
pre-change (≤0.02 px), footer single-row from 640 px; `npm run build` green; zero contact
literals in dist; accessible heading name intact.

### Earlier history (git)
- `a179f1e`, `cb6df61` — portfolio changes; `f618163` — rebuilt as static Vite+React site;
  before that the repo was a GitHub profile README.

## 15. Quality gate (from CLAUDE.md — run before calling anything "done")

Correct at 375/768/1440 px, no horizontal scroll, tap targets ≥44 px; all links/buttons work;
real copy; title/meta/OG/favicon/404 present; images compressed + lazy; Lighthouse Perf & A11y
≥90; semantic headings/alt/focus/`prefers-reduced-motion`; this file + README current.
Always `npm run build` (CSP only exists in builds) before judging a change safe.

## 16. How to work on this repo (session checklist)

1. Read this file. 2. `npm run dev` for local work; `npm run build` before any deploy judgment.
3. Respect §8 (contact), §9 (CSP ×3), §10 (motion rules), §12 (deliberate decisions).
4. Update **§14 work log + any changed sections here** after meaningful changes.
5. Commit/push only when the user asks; Netlify serves the live site.
