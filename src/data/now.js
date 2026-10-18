// The pitch deck at /now: what Baz is building right now, one slide each, for
// showing on a phone. `why` is the one sentence he'd say out loud; `facts`
// are three true things from the repo. Everything else comes from projects.js.
export const NOW_UPDATED = 'October 2026';
export const SITE_URL = 'https://www.heyitsbaz.com';
export const NOW_URL = `${SITE_URL}/now`;

export const nowItems = [
  {
    slug: 'observatory',
    why: 'Running five coding agents at once meant babysitting terminals. Observatory puts every session in every project in one window and tells me which one is waiting on me.',
    facts: ['Tauri, Rust and React', 'Runs Claude Code and Codex', 'v0.6.1, signed DMG, updates itself'],
  },
  {
    slug: 'ghosts-playground',
    why: 'A dark-room piece for DJ nights. Your silhouette is the mask, the visuals are already running, and strangers get it in two seconds. The field on this site’s home page is one of its modes.',
    facts: ['Plain JavaScript and WebGL2, no build step', '50+ filters, sound-reactive', 'Live at ghosts.fyi'],
  },
  {
    slug: 'mixvault',
    why: 'Getting a playlist into Rekordbox meant hunting tracks one by one and ending up with duplicates. MixVault turns links into a clean crate and tells Rekordbox about it.',
    facts: ['Electron and React', 'SoundCloud, YouTube and Spotify in, Rekordbox out', 'Every change can be undone'],
  },
  {
    slug: 'link',
    why: 'Small plans die in the group chat. Link sends a plan, friends tap to join, and silence counts as a no.',
    facts: ['Expo, React Native and Supabase', 'TestFlight build 32', 'Live at anychills.app'],
  },
  {
    slug: 'short-turn',
    why: 'The TTC map says where a streetcar is, not how far to trust it. Short Turn records the live feeds around the clock and grades every route.',
    facts: ['Python, GTFS-Realtime, LightGBM', 'Positions are 60 to 76 s old by the time you see them', 'Dashboard, API and an MCP server for Claude'],
  },
];
