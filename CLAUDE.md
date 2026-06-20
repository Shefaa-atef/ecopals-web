# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Vite build + post-process: copies index.html to /policies/, /delete-account/, and 404.html
npm run preview    # Preview the production build locally
npm run lint       # ESLint check
```

No test suite is configured. Visual verification via browser is the primary testing method.

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via `.github/workflows/deploy.yml`. The `build` script's post-step ([scripts/create-route-pages.mjs](scripts/create-route-pages.mjs)) handles SPA routing by duplicating `index.html` into each route directory — required because GitHub Pages doesn't support client-side routing natively.

## Architecture Overview

This is a single-page React 19 + Vite app for the **EcoPals** eco-gamification mobile app marketing site. It uses a custom client-side router (no React Router), scroll-driven animations, and a persistent 3D phone model.

### Routing

`App.jsx` implements routing manually with `window.history.pushState` and `popstate`/`hashchange` listeners. Routes: `/`, `/policies`, `/delete-account`. Hash fragments (`#game`, `#community`, `#challenges`, `#recycle-portal`) navigate to sections within the homepage. `src/utils/routing.js` contains the helpers.

### The Phone Scene System

The most architecturally complex part of the codebase. A **single** `<PhoneScrollStage>` (positioned `fixed`) renders one persistent Three.js phone model that smoothly travels across all homepage sections as the user scrolls.

- **Anchor pattern**: Any element with `className="phone-scene-anchor"` and `data-phone-*` attributes declares where the phone should be and what it should show at that scroll position.
- **`usePhoneRoute`** ([src/pages/phoneRoute.js](src/pages/phoneRoute.js)): Reads all `.phone-scene-anchor` elements on every scroll/resize event, interpolates between the two nearest anchors using smoothstep, and returns a `pose` object with `x`, `y`, `width`, `height`, `content`, `cssRotate`, and `model` sub-properties.
- **`HeroPhoneScene`** ([src/pages/HeroPhoneScene.jsx](src/pages/HeroPhoneScene.jsx)): Three.js canvas rendering the GLB phone model (`low_poly_android_phone.glb`). The screen mesh renders either a `THREE.VideoTexture` (the Earthie video), a static JPEG (community/challenges previews), or a solid color (recycle portal). All animation runs in `useFrame` via refs to avoid React re-renders.
- To add a new phone "stop", place a `.phone-scene-anchor` div with `data-phone-content`, `data-phone-orientation`, `data-phone-scale`, etc.

### Scroll Animations

- **GSAP + ScrollTrigger**: Used for all section scroll effects (`useHomeScrollAnimations.js`). Key behaviors: sticky pin of the "About Earthie" section, challenges section pin with card-to-coin animation, and `document.body` background-color scrubbing between pastel values as the user scrolls through sections.
- **Recycle Portal**: `RecyclePortalSection.jsx` drives a separate GSAP ScrollTrigger that animates trash items flying into the phone's portal. It defers its ScrollTrigger creation by one `requestAnimationFrame` to run after the challenges pin spacer is in the DOM (ordering matters for correct pixel positions).
- **`useExactSectionScroll`**: Implements gentle snap-to-top for the community and challenges sections — snaps only when the section top is nearly aligned with the viewport top, respects `prefers-reduced-motion`.

### Language / i18n

`LanguageContext` (EN/AR toggle) is stored in `localStorage` under key `eco-lang`. All components read `isAr` from `useLang()`. Arabic uses font `JF Flat`; English uses `Boogie Boys`. RTL layout is applied via `dir="rtl"` and `--ar` CSS modifier classes (not a CSS logical-properties approach). The phone screen content keys include language variants (`community-ar`, `community-en`, etc.).

### Audio

All UI sounds are synthesized at runtime via the Web Audio API — no audio files. `src/utils/menuAudio.js` exposes `playMenuSound(type)` with named sound types (`'hover'`, `'open'`, `'close'`, `'coin'`, `'rp-throw'`, etc.). The hero video on the phone has its own mute toggle tracked via module-level state in `src/pages/heroState.js`.

### Vendor Chunk Strategy

Vite splits output into named chunks (`vendor-react`, `vendor-three`, `vendor-gsap`, `vendor-framer`, `vendor-rive`, `vendor-misc`) for optimal caching. Pages are lazy-loaded via `React.lazy`.

### CSS Conventions

- Global design tokens are CSS custom properties on `:root` in `src/index.css` (colors named `--forest-green`, `--ocean-blue`, etc., plus semantic aliases like `--challenge-plants`).
- Each component has a co-located `.css` file.
- Arabic variants use `--ar` suffix CSS class modifiers (e.g. `.menu-tile-label--ar`).
- Body background color is controlled exclusively by GSAP ScrollTrigger tweens — do not set `background-color` on `body` in CSS.

### Key Files

| File | Purpose |
|------|---------|
| [src/pages/phoneRoute.js](src/pages/phoneRoute.js) | Phone pose interpolation system |
| [src/pages/HeroPhoneScene.jsx](src/pages/HeroPhoneScene.jsx) | Three.js phone canvas + texture management |
| [src/pages/PhoneScrollStage.jsx](src/pages/PhoneScrollStage.jsx) | Fixed phone wrapper, sound flash UI, content switching |
| [src/pages/home/useHomeScrollAnimations.js](src/pages/home/useHomeScrollAnimations.js) | All GSAP ScrollTrigger effects for the homepage |
| [src/components/RecyclePortalSection.jsx](src/components/RecyclePortalSection.jsx) | Recycle & Earn scroll animation + portal effect |
| [src/pages/recyclePortalRefs.js](src/pages/recyclePortalRefs.js) | Shared refs between PhoneScrollStage and RecyclePortalSection |
| [src/context/LanguageContext.jsx](src/context/LanguageContext.jsx) | EN/AR language toggle context |
| [src/utils/menuAudio.js](src/utils/menuAudio.js) | Web Audio API sound synthesis |
| [src/constants/nav.js](src/constants/nav.js) | Navigation items with paths, hashes, icons, colors |
| [scripts/create-route-pages.mjs](scripts/create-route-pages.mjs) | Post-build script for GitHub Pages SPA routing |
