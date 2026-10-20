# Brand and design direction

The world the site lives in, so every change starts from the same place. Written
October 2026 for the `next-level` redesign. Baz's own taste notes are in his
vault (`Coding/Personal Projects/Portfolio Site/Taste & Direction.md`); the
brand idea itself is the vault's Snow Leopard note.

## The idea

Snow leopard: quiet, patient, precise. Moves only when it counts, and when it
moves, it lands. The site should feel like that. Nothing shouts. One accent.
Large, calm type. Motion that behaves like a material (fluid, weight, settle),
never like a slideshow.

The old line ("The system doesn't care which layer the problem is on") is
retired; Baz never liked it as copy. There is no replacement slogan yet. The
site shows the range instead of stating it: a live visual on the surface,
systems underneath.

## Audience and use

A recruiter or founder who wants someone cutting-edge and forward-thinking.
Baz also hands his phone to people at networking events, so the phone view is a
first-class surface, and `/now` is a pitch deck: swipe through what he is
building right now, tap to open the live thing, scan a QR to take the site with
you.

## Palette ("midnight leopard")

| Token | Value | Use |
| --- | --- | --- |
| `--bg-base` | `#07080E` | page |
| `--bg-surface` | `#0C0E17` | footer, sheets |
| `--bg-elevated` | `#121526` | tiles, frames |
| `--ink` | `#181A3E` | midnight indigo wash, hero depth |
| `--accent` | `#C4CDFF` | the one glint: links, nodes, italic word |
| `--accent-deep` | `#7C8CFF` | pressed states, packets, focus rings |
| `--text-primary` | `#EEF0FA` | headings |
| `--text-secondary` | `#9AA0BC` | body |
| `--text-muted` | `#7C829E` | meta (4.5:1 on base) |

Rosettes (the leopard print) appear only tone on tone: a shade of indigo on
indigo, inside the hero field, never as a loud pattern or on text.

## Type

- **Instrument Sans** for everything: headings at 600 with tight tracking,
  body at 400. (Castoro with an italic accent word was tried on October 17 and
  dropped the same day: it read as AI-made.)
- **IBM Plex Mono** for labels, numbers and the status line. Same mono as
  Observatory's terminal.

## Logo

The wordmark is `baz.`: lowercase, Instrument Sans at 650, tracked in, with a
leopard rosette for its full stop, in the periwinkle glint (`--accent`). The
rosette replaced a round dot on October 20 2026, chosen in the client brand's
Brand Lab (`client-branding-strategy/brand/`, which uses the same wordmark with
an ice-blue rosette). It's drawn about 1.5x a full stop so it still reads as a
rosette. It stands alone; the full name lives in page titles, the
footer line and About. It is outlined to paths in `src/components/Wordmark.js`,
so it needs no font to render. On hover the glint swells.

Small sizes keep `b.` with a plain round dot, since the rosette blurs into a
blob below about 32px: the b and the glint, white on a midnight indigo tile
(`#23265A` to `#0F1130`). That covers `favicon.svg`, `favicon.ico` (16, 32,
48), `apple-touch-icon.png`, `logo192.png`, `logo512.png` and the maskable
icon. Chosen October 19 2026 over a rosette, a membrane mark, a BK monogram and
others; the old `BAZIL ✻ KHAN` wordmark and the amber favicon are retired.

## Motion

Fluid first. The hero is a touchable field: the pointer displaces it, a tap
drops a ripple. Everything else settles with the premium ease
(`cubic-bezier(0.16, 1, 0.3, 1)`) and springs for sheets. No scroll-jacking,
no custom cursor, no sound. Every effect has a reduced-motion version that
still carries the information.

## Copy

Casual and plain (see `WRITING_STYLE.md`). Name the decision and the number.
No "not X, but Y", no mottos as headings, no self-deprecation.

## References Baz gave

Apple's fluid interfaces. Ivy Lab, Dusky, Fred again.. for mood. Virgil Abloh,
Kanye West and Lupe Fiasco for the posture: editorial, deliberate, the work
speaks.
