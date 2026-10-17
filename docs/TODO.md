# Site to-do

From the October 2026 site review. Fixes first, then the ideas that make the
site memorable.

## Fixes

- [x] **Media grid holes.** Mixed landscape/portrait spans leave black gaps at
      row ends. Use justified rows so every row fills edge to edge.
- [x] **Blog post layout.** The reading column hugs the left edge with a 16px
      gutter (site gutter is 40px). Center it; add an amber reading-progress
      line under the nav.
- [x] **Low-contrast text.** `--text-muted` (#3A3A38 on #080808, ~1.8:1) is used
      for back links, dates and the copyright. Bring it to at least 4.5:1.
- [x] **Contact.** Email with copy-to-clipboard in the footer.
- [ ] **Resume and availability.** A resume download and a status line
      ("Open to senior roles · …") in the footer. On hold.

## Pending on project work

- [x] **MixVault screenshot and copy.** Retaken 2026-10-17 from a fresh build
      with `scripts/screenshots/mixvault.js`; copy covers Soulseek, the
      Rekordbox bridge file and the Library.
- [x] **Observatory screenshot.** Now the 0.6.1 release cover
      (`nebula-desktop/docs/release/cover.jpg`). Retake when the app changes.
- [ ] **House Rules and Afterglow.** Both repos are active (House Rules: 13
      games, 80 commits; Afterglow: a JUCE audio visualizer at 0.2). Left off
      the site on the October 15 decision; revisit.
- [ ] **Link screenshots.** `link-app/docs/screenshots` has the Sage look
      (Oct 15). The site still shows the earlier card. Retake when build 31
      is out.

## Redesign, October 17 2026 (branch `next-level`)

- [x] **Midnight leopard palette and type.** Cold near-black, indigo wash,
      one periwinkle glint. Castoro + Instrument Sans + IBM Plex Mono. See
      `docs/BRAND.md`.
- [x] **Touchable hero field.** Pointer pushes the silk, tap drops a ripple
      and lights the name; rosettes printed tone on tone; renders only on
      screen.
- [x] **Phone dock** replaces the hamburger; **bottom sheet** with a pull
      handle replaces the side sheet on phones.
- [x] **/now pitch deck** for networking events: one slide a project, QR
      code, email, share.
- [x] **About layer stack** (Ground to Light) with real work per layer.
- [x] **Project audit.** Copy and screenshots for Observatory, ghosts,
      MixVault, Link, Life Systems, Interview Prep, Short Turn; three facts
      per project for the sheet and the deck.
- [ ] **Per-page OG image** in the new palette, and an OG image for `/now`.
- [ ] **Ripple from the field up into the nav** (the packet idea) if the
      wires ever come back; the field alone carries the hero now.

## Next level

- [ ] **Living architecture diagrams.** Draw each professional system as an SVG
      in the hero's wire language, with amber packets flowing along the wires
      on scroll. Shows systems thinking without confidential screenshots.
- [ ] **Hover video previews.** Short muted loops on project tiles (play in view
      on touch). ghosts-playground's tile could run its live shader.
- [ ] **⌘K command palette.** Jump to any project, post or page; copy email.
- [ ] **Next project →** at the end of each case study, using the swipe
      transition, so case studies stop being dead ends.
- [ ] **Photo details.** Camera, lens and settings in the lightbox; a location
      line per series.
- [ ] **Link previews.** Per-page Open Graph images in the site's dark and amber
      style for LinkedIn and Slack shares.

## Also discussed

- [ ] **Group Development by kind of work** (AI & agents, Data &
      infrastructure, Products, Visuals) instead of personal/professional, with
      a "Personal" marker on side-project tiles. Earlier (Demos) stays separate.
- [ ] **Animate browser Back/Forward** with the same swipe transitions.

## Skipped on purpose

Custom cursors, scroll-jacking and sound: trend-chasing that costs usability.
