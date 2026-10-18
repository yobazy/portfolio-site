import { useEffect, useRef } from 'react';
import { Leva, button, folder, useControls } from 'leva';
import { fieldLook } from '../lib/fieldLook';

// A live panel for the feel decisions: colors, the hero field, hero type.
// Loaded only in development or with ?tweak in the URL (see App.js), so it
// never ships in the main bundle. Values survive a reload until Reset; "Copy
// changes" puts only what moved on the clipboard, ready to paste into a
// message or into App.css / src/lib/fieldLook.js.

const STORE = 'tweaks';

const COLOR_TOKENS = [
  '--bg-base',
  '--bg-surface',
  '--bg-elevated',
  '--ink',
  '--accent',
  '--accent-deep',
  '--text-primary',
  '--text-secondary',
  '--text-muted',
];

const toHex = (rgb) =>
  '#' + rgb.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const round = (n) => Math.round(n * 1000) / 1000;

// Read before anything is overridden, so App.css stays the source of truth.
const root = document.documentElement;
const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();
const px = (name) => parseFloat(css(name)) || 0;

const DEFAULTS = {
  ...Object.fromEntries(COLOR_TOKENS.map((t) => [t, css(t).toUpperCase()])),
  '--card-radius': px('--card-radius'),
  '--card-radius-lg': px('--card-radius-lg'),
  'hero scale': 1,
  'hero tracking': -0.04,
  'hero scrim': 1,
  speed: fieldLook.speed,
  intensity: fieldLook.intensity,
  push: fieldLook.push,
  'pointer glow': fieldLook.pointerGlow,
  bloom: fieldLook.bloom,
  deep: toHex(fieldLook.deep),
  'field ink': toHex(fieldLook.ink),
  'ink deep': toHex(fieldLook.inkDeep),
  glint: toHex(fieldLook.glint),
};

const load = () => {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORE) || '{}') };
  } catch {
    return DEFAULTS;
  }
};

// Tokens elsewhere in :root that are spelled out from these, kept in step.
const derived = (v) => {
  const [r, g, b] = toRgb(v['--accent']).map((c) => Math.round(c * 255));
  const rgb = `${r}, ${g}, ${b}`;
  return {
    '--accent-rgb': rgb,
    '--accent-dim': `rgba(${rgb}, 0.10)`,
    '--accent-border': `rgba(${rgb}, 0.28)`,
    '--glass-border-accent': `rgba(${rgb}, 0.28)`,
    '--glass-glow': `0 0 40px rgba(${rgb}, 0.08)`,
    '--glass-glow-hover': `0 0 60px rgba(${rgb}, 0.15)`,
    '--text-accent': v['--accent'],
    '--accent-color': v['--accent'],
    '--bs-body-bg': v['--bg-base'],
    '--primary-color': v['--bg-base'],
    '--secondary-color': v['--bg-elevated'],
    '--bs-body-color': v['--text-primary'],
    '--text-color': v['--text-primary'],
  };
};

const apply = (v) => {
  COLOR_TOKENS.forEach((t) => root.style.setProperty(t, v[t]));
  Object.entries(derived(v)).forEach(([t, value]) => root.style.setProperty(t, value));
  root.style.setProperty('--card-radius', `${v['--card-radius']}px`);
  root.style.setProperty('--card-radius-lg', `${v['--card-radius-lg']}px`);
  root.style.setProperty('--hero-heading-scale', v['hero scale']);
  root.style.setProperty('--hero-heading-tracking', `${v['hero tracking']}em`);
  root.style.setProperty('--hero-scrim', v['hero scrim']);

  fieldLook.speed = v.speed;
  fieldLook.intensity = v.intensity;
  fieldLook.push = v.push;
  fieldLook.pointerGlow = v['pointer glow'];
  fieldLook.bloom = v.bloom;
  fieldLook.deep = toRgb(v.deep);
  fieldLook.ink = toRgb(v['field ink']);
  fieldLook.inkDeep = toRgb(v['ink deep']);
  fieldLook.glint = toRgb(v.glint);
};

const changes = (v) => {
  const moved = (k) => String(v[k]).toUpperCase() !== String(DEFAULTS[k]).toUpperCase();
  const lines = [];

  const tokens = [...COLOR_TOKENS, '--card-radius', '--card-radius-lg'].filter(moved);
  if (tokens.length) {
    lines.push('/* App.css :root */');
    tokens.forEach((t) => lines.push(`${t}: ${t.includes('radius') ? `${v[t]}px` : v[t]};`));
  }

  const hero = [
    ['hero scale', 'heading size ×', (n) => n],
    ['hero tracking', 'heading letter-spacing', (n) => `${n}em`],
    ['hero scrim', 'scrim opacity', (n) => n],
  ].filter(([k]) => moved(k));
  if (hero.length) {
    lines.push('', '/* Hero (App.css .hero-heading / .hero-scrim) */');
    hero.forEach(([k, label, fmt]) => lines.push(`${label}: ${fmt(round(v[k]))}`));
  }

  const field = [
    ['speed', 'speed'],
    ['intensity', 'intensity'],
    ['push', 'push'],
    ['pointer glow', 'pointerGlow'],
    ['bloom', 'bloom'],
    ['deep', 'deep'],
    ['field ink', 'ink'],
    ['ink deep', 'inkDeep'],
    ['glint', 'glint'],
  ].filter(([k]) => moved(k));
  if (field.length) {
    lines.push('', '// src/lib/fieldLook.js');
    field.forEach(([k, key]) => {
      const value = typeof v[k] === 'string' ? `[${toRgb(v[k]).map(round).join(', ')}]` : round(v[k]);
      lines.push(`${key}: ${value},`);
    });
  }

  return lines.length ? lines.join('\n') : 'No changes from the defaults.';
};

const Tweaks = () => {
  const initial = useRef(load()).current;
  const latest = useRef(initial);

  const color = (k) => ({ value: initial[k] });
  const [values, set] = useControls(() => ({
    'Copy changes': button(() => {
      const text = changes(latest.current);
      console.log(text);
      navigator.clipboard?.writeText(text).catch(() => {});
    }),
    Reset: button(() => {
      try {
        localStorage.removeItem(STORE);
      } catch {}
      set(DEFAULTS);
    }),
    Colors: folder(Object.fromEntries(COLOR_TOKENS.map((t) => [t, color(t)])), { collapsed: true }),
    Shape: folder({
      '--card-radius': { value: initial['--card-radius'], min: 0, max: 32, step: 1 },
      '--card-radius-lg': { value: initial['--card-radius-lg'], min: 0, max: 48, step: 1 },
    }, { collapsed: true }),
    Hero: folder({
      'hero scale': { value: initial['hero scale'], min: 0.6, max: 1.6, step: 0.01 },
      'hero tracking': { value: initial['hero tracking'], min: -0.1, max: 0.05, step: 0.005 },
      'hero scrim': { value: initial['hero scrim'], min: 0, max: 1.5, step: 0.01 },
    }),
    Field: folder({
      speed: { value: initial.speed, min: 0, max: 0.6, step: 0.005 },
      intensity: { value: initial.intensity, min: 0, max: 2.5, step: 0.01 },
      push: { value: initial.push, min: 0, max: 0.5, step: 0.005 },
      'pointer glow': { value: initial['pointer glow'], min: 0, max: 1, step: 0.01 },
      bloom: { value: initial.bloom, min: 0, max: 1.5, step: 0.01 },
      deep: color('deep'),
      'field ink': color('field ink'),
      'ink deep': color('ink deep'),
      glint: color('glint'),
    }),
  }));

  useEffect(() => {
    latest.current = values;
    apply(values);
    try {
      localStorage.setItem(STORE, JSON.stringify(values));
    } catch {}
  }, [values]);

  // Its own layer, under the nav bar and above everything (the project sheet
  // sits at 10020), so the nav never swallows a click on it.
  return (
    <div
      style={{
        position: 'fixed',
        top: 76,
        right: 16,
        width: 'min(300px, calc(100vw - 32px))',
        maxHeight: 'calc(100vh - 92px)',
        overflowY: 'auto',
        zIndex: 10030,
      }}
    >
      <Leva
        fill
        collapsed
        titleBar={{ title: 'Tweaks', drag: false }}
        theme={{ colors: { accent1: '#7C8CFF', accent2: '#C4CDFF', accent3: '#C4CDFF' } }}
      />
    </div>
  );
};

export default Tweaks;
