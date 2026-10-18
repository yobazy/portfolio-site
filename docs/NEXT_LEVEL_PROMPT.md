# Next level: make the portfolio behave like a system

You're redesigning parts of my portfolio site (this repo) so a visitor on a laptop or a phone thinks "this person knows exactly what they're doing" within the first few seconds, and keeps finding things the longer they stay. It's tasteful and well built now. Past the hero it's static: heading, rule, grid, repeat. Your job is to make it interactive without making it gimmicky.

Mockups of every concept below are in the "Portfolio Next Level" artifact. Treat them as direction, not pixel specs. Your build should be better than them.

## Before you write any code

1. Read these, in this order: `CLAUDE.md` if present, `docs/TODO.md`, `docs/WRITING_STYLE.md`, `src/App.css` (the design system, ~4,400 lines), `src/components/IdentityStrip.js`, `src/components/HeroField.js`, `src/pages/Home.js`, `src/data/projects.js`, `src/data/sections.js`, `src/lib/pageTransition*`, `src/lib/motion*`.
2. Load these skills and use them as your bar: `impeccable` (craft, motion, interaction, responsive), `redesign-existing-projects` (audit-first, don't break what works), `design-taste-frontend` (anti-slop), `web-perf` (budgets below), `web-design-guidelines` (accessibility review at the end). Use `webapp-testing` or the Playwright tools to look at your own work.
3. Run the site (`npm start`, port 3000) and screenshot the home page at 1440×900 and 390×844 before changing anything. Keep these as your baseline.
4. Create a branch off `master` named `next-level`. Commit after each numbered item below, with a plain message. Don't push or open a PR unless I ask.

## What must not change

- The design system: `#080808` base, single amber accent `#E8A400` used sparingly, Bricolage Grotesque + IBM Plex Mono, film grain, the existing tokens in `App.css`. Add tokens if you need them; don't introduce a second accent hue, except one cool neutral (around `#9DB4C0`) allowed only inside architecture diagrams to tell two organizations apart.
- The stack: Create React App, React 18, framer-motion, react-router. No GSAP, no three.js, no new animation library. Raw WebGL, Canvas 2D, SVG and CSS 3D are enough. Any new dependency needs a reason in the commit message.
- Things I've ruled out on purpose: custom cursors, scroll-jacking (never take over the scroll position or pin sections for long stretches), sound.
- Facts. Every claim, number and job detail comes from `src/data/*` or `src/components/About.js`. Don't invent metrics, clients, roles or dates. If you need a fact that isn't there, leave a `TODO(baz):` comment and use neutral copy.
- Copy voice: casual and plain, per `docs/WRITING_STYLE.md`. No self-deprecation, no marketing words, no "not X, but Y" constructions.

## The idea that ties it together

The hero already has the site's signature: SVG wires running from "Hey, it's Baz." up to each nav link, with amber packets travelling along them. The brand line is "The system doesn't care which layer the problem is on." So the site itself should behave like a system: things are connected by visible wires, signals travel along them, and you can take the parts apart. Every item below is an application of that one idea. If something you're tempted to add doesn't fit it, leave it out.

## Build, in priority order

### 1. A hero field you can touch
Extend `HeroField.js`.
- Add a `uPointer` uniform (eased toward the pointer each frame, so it trails smoothly) that pushes the wave crests away from the cursor and brightens them nearby.
- Add `uRipples[4]` (x, y, start time): click or tap drops a ripple ring that travels outward and fades over ~1.5s.
- When a ripple fires, send a packet from the ripple point up the nearest wire in `IdentityStrip.js` and briefly light that nav link's underline. This is the moment that should make someone smile.
- Phone: drag moves the pointer uniform, tap ripples. Use `touch-action: pan-y` on the canvas so vertical scrolling still works; only treat a touch as a field interaction if it's a tap or a mostly-horizontal drag.
- Pause the render loop when the hero is off screen (IntersectionObserver) or the tab is hidden. Keep the existing DPR cap. Reduced motion: a single still frame, ripples off.

### 2. Living architecture diagrams for the professional work
This is the most important item. It's the strongest evidence for the brand line and right now it's three text rows under "At work".
- Each "At work" row on Home (and each professional project page) expands in place into an SVG diagram drawn in the hero's wire language: thin wires, rounded corners, small nodes, mono labels.
- Packets travel along the wires at a pace that reflects the real system. CN-Metrolinx: two directions, CN → ingest → RabbitMQ → deliver → Metrolinx and back, "updates every 10–30 s", "20 queues · 10 consumers", "no shared database". The existing `src/assets/img/cn-integration-diagram.svg` has the topology. Do 360 Ops and the Azure reporting pipelines from their case-study text in `projects.js`.
- Hovering or focusing a node dims everything not on its routes. A small "Flow / Isolation" toggle on the CN diagram colours each organization's traffic separately (amber vs the cool neutral) to show the isolation story.
- Put the diagram definitions (nodes, edges, labels, cadence) in data next to each project, and write one `<SystemDiagram>` component that renders any of them. No hand-written path strings per diagram; compute paths from node positions with the same rounded-corner logic as `branchPath` in `IdentityStrip.js`.
- Phone: the diagram lays out vertically (top to bottom) rather than shrinking a wide one. Tap a node to focus it; tap again to clear.
- Reduced motion: no packets; show static arrowheads on the wires instead.

### 3. The About layer stack
Replace the plain brand-statement block with an exploded stack of six layers, bottom to top: Ground (civil engineering, rail as the domain), Infrastructure, Data, Services, Interface, Light (shaders and photography). Each layer lists two or three real pieces of work at that layer, pulled from `projects.js` and `About.js`, each linking to its project.
- CSS 3D transforms only (`perspective`, `preserve-3d`, `translateZ`). The layers sit close together at rest and spread apart as the section scrolls into view (scroll-linked via framer-motion `useScroll`, not pinned).
- Hover or focus a layer: it lifts out and the side panel shows its work. Arrow keys move between layers.
- Phone: stack on top, a row of layer chips underneath, panel below that. Tap a chip and its layer lifts.
- Reduced motion: no spreading, layers shown already spread.

### 4. Phone-native home
Most visitors arrive from a LinkedIn link on a phone. Right now mobile is the desktop page in one column.
- A bottom dock (Development, Media, Blog, About, and a ⌘ search button) that appears once the hero scrolls away. Glass surface, 44px targets, `env(safe-area-inset-bottom)` padding, current section highlighted. It replaces the hamburger on phones.
- A short status line under the hero heading with true information only: city and local time, and the latest post or project from data. Confirm the city with me via a `TODO(baz):` if it isn't in the data.
- Featured projects become a horizontally swipeable deck (CSS scroll-snap, with pointer drag for the card motion), with a page indicator. Tap opens the existing `ProjectSheet` as a bottom sheet with a drag-to-dismiss handle.
- Photos become a full-bleed viewfinder: swipe between frames, a thin HUD with title, location, frame count and EXIF. Extract EXIF at build time (a small Node script that writes it into `mediaItems.js`; the files are Ricoh GR IIIx, 26mm, f/5.6, so this is real data), not in the browser. Show the same EXIF line in the desktop lightbox.
- Check every interaction with a real touch emulation pass at 390×844 and 360×740.

### 5. ⌘K command palette
- ⌘K / Ctrl+K anywhere, or the ⌘ button in the phone dock. Lists projects, posts, pages, and actions (copy email, open GitHub).
- Fuzzy matching over title, line and a few keywords, written by hand (no library). Arrow keys, Enter, Escape. Grouped results when the query is empty.
- Proper dialog semantics: focus trap, `aria-activedescendant`, focus returns to where it was on close. Selecting a page navigates with the existing swipe transition.

### 6. Smaller pieces, if the above are done and solid
- **The spine:** continue the hero's bus as a hairline down the left gutter on desktop, with a node per section and a packet that tracks scroll position. On phones, a 2px progress rail instead.
- **Living tiles:** ghosts-playground's tile renders a cheap version of its shader; Observatory and MixVault play short muted loops on hover (in view on phones). Lazy-load all of it.
- **Next project →** at the end of every case study, with swipe-to-advance on phones.
- **Animated Back/Forward** using the same transitions (View Transitions API where supported, current behaviour as fallback).
- **Blog outline:** post headings become nodes on the reading-progress line; click to jump.

## Quality bar

Performance (measure with Lighthouse mobile on a production build, before and after; report both):
- LCP under 2.0s, CLS under 0.05, INP under 200ms, no long tasks over 50ms during idle animation.
- Only one WebGL context on screen at a time. All animation loops stop when off screen or the tab is hidden.
- Nothing new in the initial JS bundle that the first screen doesn't need; lazy-load the diagram, palette and stack code.

Accessibility:
- Every interactive piece works with keyboard alone and has a visible focus state.
- Every motion piece has a `prefers-reduced-motion` version that still communicates the same information.
- Decorative canvases are `aria-hidden`; diagrams have a text alternative (a short description plus the node list).
- Text contrast stays at 4.5:1 or better.

Layout:
- No horizontal page scroll at any width from 320px up. Check 320, 390, 768, 1024, 1440, 1920.
- Nothing appears blank in a screenshot because it's waiting for `whileInView`; content must be readable at rest.

## How to work

- One item at a time. For each: build it, run the site, screenshot it at 1440 and 390 (and interact with it via Playwright: hover, click, tap, keyboard), fix what you see, then commit.
- After items 1–3, stop and show me screenshots and a short summary before continuing. I want to react to the direction before you build the rest.
- If something in this brief conflicts with what you find in the code, trust the code and tell me.
- When you finish, update `docs/TODO.md`: tick what's done, add anything you found but didn't do.

## What I want back at the end

A short report: what you built, before/after screenshots at 1440 and 390, Lighthouse numbers before and after, anything you skipped or couldn't verify, and every `TODO(baz):` you left.
