import { useEffect, useRef, useState } from 'react';
import { WORDMARK } from './Wordmark';

// The hero field: thin periwinkle rings that fuse where they cross, like cell
// membranes, drawn live by ghosts (ghosts.fyi's embed runtime). The rings are an
// SVG handed to ghosts as its "logo" source; ghosts runs light along them, and a
// greyscale plus a periwinkle colour matrix keeps them in the site's palette.
// Screen-blended over the page's near-black, so they can only lift it.
// Mockup and tuning: ghosts-playground/site/embed/portfolio/membrane-brand.html.

const GHOSTS = process.env.REACT_APP_GHOSTS_ORIGIN || 'https://ghosts.fyi';

// Rings laid out on a 1440×900 desktop frame and a 390×844 phone frame, then
// scaled to the real one: [x, y, r]. Triple joints sit up and to the right of
// the copy, which is set low and left.
const LAYOUTS = {
  desk: {
    w: 1440,
    h: 900,
    stroke: 5,
    blur: 4,
    node: 9,
    rings: [
      [300, 120, 300],
      [824, 146, 320],
      [400, 560, 290],
      [1270, 300, 380],
      [770, 668, 262],
      [1010, 30, 190],
    ],
  },
  phone: {
    w: 390,
    h: 844,
    stroke: 4.5,
    blur: 3,
    node: 7,
    rings: [
      [-10, 236, 170],
      [400, 276, 150],
      [196, 336, 140],
      [56, 478, 132],
      [322, 506, 138],
    ],
  },
};

// The margin the SVG carries past the frame, so the drift never shows a ring's
// clipped end. The logo source fits the image to 86% of the element's width.
const MARGIN = 40;
const FIT = 0.86;

const layoutFor = (width) => (width <= 640 ? LAYOUTS.phone : LAYOUTS.desk);

const ringsFor = (width, height) => {
  const L = layoutFor(width);
  const sx = width / L.w;
  const sy = height / L.h;
  return { ...L, k: sx, rings: L.rings.map(([x, y, r]) => [x * sx, y * sy, r * sx]) };
};

// Every pairwise circle crossing; a small filled disc there makes the joint swell.
const crossings = (rings) => {
  const points = [];
  for (let i = 0; i < rings.length; i++) {
    for (let j = i + 1; j < rings.length; j++) {
      const [x0, y0, r0] = rings[i];
      const [x1, y1, r1] = rings[j];
      const dx = x1 - x0;
      const dy = y1 - y0;
      const d = Math.hypot(dx, dy);
      if (d > r0 + r1 || d < Math.abs(r0 - r1) || d === 0) continue;
      const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
      const h = Math.sqrt(Math.max(0, r0 * r0 - a * a));
      const mx = x0 + (a * dx) / d;
      const my = y0 + (a * dy) / d;
      points.push([mx - (h * dy) / d, my + (h * dx) / d], [mx + (h * dy) / d, my - (h * dx) / d]);
    }
  }
  return points;
};

// The cut: white rings through a goo filter, so the strokes fuse at the joints.
const ringsSvg = (width, height) => {
  const R = ringsFor(width, height);
  const circles = R.rings
    .map(([x, y, r]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"/>`)
    .join('');
  const nodes = crossings(R.rings)
    .map(
      ([x, y]) =>
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(R.node * R.k).toFixed(2)}" fill="#fff" stroke="none"/>`
    )
    .join('');
  const w = width + 2 * MARGIN;
  const h = height + 2 * MARGIN;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-MARGIN} ${-MARGIN} ${w} ${h}" width="${w}" height="${h}">` +
    `<defs><filter id="goo" x="-10%" y="-10%" width="120%" height="120%">` +
    `<feGaussianBlur stdDeviation="${(R.blur * R.k).toFixed(2)}"/>` +
    `<feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 14 -5"/></filter></defs>` +
    `<g filter="url(#goo)" fill="none" stroke="#fff" stroke-width="${(R.stroke * R.k).toFixed(2)}">${circles}${nodes}</g></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// Presets a visitor can step through: tide's mask, fill and waves, plus a few
// of ghosts' own layers and filters. Whatever ghosts draws, the tint below
// brings it back to periwinkle, so every preset stays in the palette.
export const PRESETS = [
  { id: 'glow', label: 'Glow', layers: ['aura', 'bloom'] },
  { id: 'dither', label: 'Dither', filters: ['dither'] },
  { id: 'vortex', label: 'Vortex', layers: ['rim', 'energy'], filters: ['swirl'] },
  { id: 'signal', label: 'Signal', layers: ['aura', 'bloom'], filters: ['lcd'] },
  { id: 'halo', label: 'Halo', layers: ['rim', 'energy'] },
  { id: 'tunnel', label: 'Tunnel', layers: ['aura', 'bloom'], filters: ['tunnel'] },
  { id: 'terminal', label: 'Terminal', layers: ['aura', 'bloom'], filters: ['ascii'] },
  { id: 'kaleido', label: 'Kaleido', filters: ['kaleido'] },
];

// What the edit panel offers: a curated slice of ghosts, the pieces that read
// on thin rings. Names are ghosts' own layer and filter names.
export const LAYER_CHOICES = [
  ['aura', 'Aura'],
  ['bloom', 'Bloom'],
  ['fog', 'Fog'],
  ['dust', 'Dust'],
  ['rim', 'Rim'],
  ['energy', 'Energy'],
  ['sparks', 'Sparks'],
  ['stars', 'Stars'],
  ['lightning', 'Lightning'],
  ['caustics', 'Caustics'],
];

export const FILTER_CHOICES = [
  ['dither', 'Dither'],
  ['swirl', 'Swirl'],
  ['tunnel', 'Tunnel'],
  ['lcd', 'LCD'],
  ['ascii', 'ASCII'],
  ['kaleido', 'Kaleido'],
  ['glass', 'Glass'],
  ['ripple', 'Ripple'],
  ['pixel', 'Pixel'],
  ['crt', 'CRT'],
  ['stipple', 'Stipple'],
  ['wire', 'Wire'],
  ['mirror', 'Mirror'],
  ['fisheye', 'Fisheye'],
];

// The shape ghosts cuts the picture around. Most are pictures drawn here at the
// frame's size; the comet follows the pointer, and `word` is typed in.
export const SHAPES = [
  ['rings', 'Rings'],
  ['wordmark', 'baz.'],
  ['ghost', 'Ghost'],
  ['ripples', 'Ripples'],
  ['waves', 'Waves'],
  ['dots', 'Dots'],
  ['comet', 'Comet'],
  ['word', 'Your word'],
];

// Everything the panel can change, in one plain object. `energy` scales the
// weather, `strength` every filter; `colour` 'tint' keeps the site palette and
// 'full' lets ghosts' own colour through, turned to `hue`.
export const lookFor = (preset) => ({
  layers: preset.layers || [],
  filters: preset.filters || [],
  energy: 1,
  strength: 1,
  shape: 'rings',
  word: 'hello',
  colour: 'tint',
  hue: 0.8,
});

// tide (look 031) with only mask, fill and waves on (no rainbow rim, no ghosts),
// plus the look's layers and filters. The pointer blends between a calmer and
// a livelier weather.
const looksFrom = (tide, look = lookFor(PRESETS[0])) => {
  const layers = ['mask', 'fill', 'waves', ...look.layers];
  const clamp = (v) => Math.max(0.2, Math.min(1.6, v));
  const strengths = Object.fromEntries(look.filters.map((name) => [name, look.strength]));
  const make = (weather) => ({
    ...tide,
    version: 1,
    layers: Object.fromEntries(Object.keys(tide.layers).map((k) => [k, layers.includes(k)])),
    filters: Object.fromEntries(Object.keys(tide.filters).map((k) => [k, look.filters.includes(k)])),
    params: {
      ...tide.params,
      ...strengths,
      hue: look.colour === 'full' ? look.hue : 0.16,
      hold: 1,
      weather: clamp(weather * look.energy),
    },
  });
  return [make(0.85), make(1.2)];
};

// A white-on-clear picture the size of the frame plus its margin, laid out
// the way ringsSvg is, for ghosts' logo source.
const frameSvg = (width, height, body) => {
  const w = width + 2 * MARGIN;
  const h = height + 2 * MARGIN;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-MARGIN} ${-MARGIN} ${w} ${h}" width="${w}" height="${h}">` +
    `${body}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// Where a single motif sits: up and right of the copy on a desk, high on a phone.
const focusOf = (width, height) => (width <= 640 ? [width * 0.5, height * 0.34] : [width * 0.66, height * 0.42]);

const GHOST = 'M8 58V30a24 24 0 0 1 48 0v28l-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6z';

const ART = {
  rings: ringsSvg,
  wordmark: (width, height) => {
    const [fx, fy] = focusOf(width, height);
    const { box, d, rosette } = WORDMARK;
    const k = (width <= 640 ? width * 0.78 : width * 0.4) / box.w;
    return frameSvg(
      width,
      height,
      `<g fill="#fff" transform="translate(${fx} ${fy}) scale(${k.toFixed(3)}) translate(${-(box.x + box.w / 2)} ${-(box.y + box.h / 2)})">` +
        `<path d="${d}"/><path transform="${rosette.transform}" d="${rosette.d}"/></g>`
    );
  },
  ghost: (width, height) => {
    const [fx, fy] = focusOf(width, height);
    const k = (Math.min(width, height) * 0.62) / 64;
    return frameSvg(
      width,
      height,
      `<g transform="translate(${fx} ${fy}) scale(${k.toFixed(3)}) translate(-32 -33)">` +
        `<path d="${GHOST}" fill="#fff"/><circle cx="19" cy="25" r="4.5" fill="#000"/><circle cx="45" cy="34" r="2.6" fill="#000"/></g>`
    );
  },
  ripples: (width, height) => {
    const [fx, fy] = focusOf(width, height);
    const k = Math.min(width, height) / 900;
    const step = Math.min(width, height) * 0.075;
    const rings = Array.from({ length: 12 }, (_, i) => `<circle cx="${fx}" cy="${fy}" r="${(step * (i + 1)).toFixed(1)}"/>`);
    return frameSvg(width, height, `<g fill="none" stroke="#fff" stroke-width="${(5 * k).toFixed(2)}">${rings.join('')}</g>`);
  },
  waves: (width, height) => {
    const k = Math.min(width, height) / 900;
    const lines = Array.from({ length: 11 }, (_, i) => {
      const y = (height * (i + 0.5)) / 11;
      const points = [];
      for (let x = -MARGIN; x <= width + MARGIN; x += 16) {
        points.push(`${x},${(y + 22 * k * Math.sin((x / (300 * k)) * Math.PI * 2 + i * 0.7)).toFixed(1)}`);
      }
      return `<polyline points="${points.join(' ')}"/>`;
    });
    return frameSvg(width, height, `<g fill="none" stroke="#fff" stroke-width="${(5 * k).toFixed(2)}">${lines.join('')}</g>`);
  },
  dots: (width, height) => {
    const k = Math.min(width, height) / 900;
    const gap = 52 * k;
    const dots = [];
    for (let y = gap / 2; y < height; y += gap) {
      for (let x = gap / 2; x < width; x += gap) dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(6 * k).toFixed(2)}"/>`);
    }
    return frameSvg(width, height, `<g fill="#fff">${dots.join('')}</g>`);
  },
};

const sourceFor = (look, width, height) => {
  if (look.shape === 'comet') return { type: 'cursor' };
  if (look.shape === 'word') {
    return { type: 'text', text: look.word.trim() || 'hello', size: 0.42, font: '"Instrument Sans", sans-serif' };
  }
  const art = ART[look.shape] || ringsSvg;
  return { type: 'logo', src: art(width, height), size: 3 };
};

// `look` is what to draw; `scene` changes only when a preset is picked, and
// that alone dips the field. Edits from the panel land straight away.
// `onReady` fires once ghosts has drawn its first frame, when the field
// develops in; the hero holds its copy back until then.
const MembraneField = ({ reduce = false, look = lookFor(PRESETS[0]), scene = '', onReady, className = '' }) => {
  const wrapRef = useRef(null);
  const mountRef = useRef(null);
  const stillRef = useRef(null);
  const ghostRef = useRef(null);
  const tideRef = useRef(null);
  const lookRef = useRef(look);
  lookRef.current = look;
  const sceneRef = useRef(scene);
  const shapeRef = useRef(null);
  const shapeKey = `${look.shape}:${look.shape === 'word' ? look.word : ''}`;
  const [ready, setReady] = useState(false);
  const [lit, setLit] = useState(false);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const ghost = ghostRef.current;
    const tide = tideRef.current;
    const wrap = wrapRef.current;
    if (!ready || !ghost || !tide || !wrap) return undefined;
    if (sceneRef.current === scene) {
      ghost.setLooks(looksFrom(tide, look));
      return undefined;
    }
    sceneRef.current = scene;
    let live = true;
    wrap.classList.add('is-swapping');
    const swap = window.setTimeout(async () => {
      await ghost.setLooks(looksFrom(tide, look));
      if (live) wrap.classList.remove('is-swapping');
    }, 180);
    return () => {
      live = false;
      window.clearTimeout(swap);
      wrap.classList.remove('is-swapping');
    };
  }, [look, scene, ready]);

  useEffect(() => {
    const ghost = ghostRef.current;
    const wrap = wrapRef.current;
    if (!ready || !ghost || !wrap || shapeRef.current === shapeKey) return;
    shapeRef.current = shapeKey;
    ghost.setSource(sourceFor(lookRef.current, wrap.clientWidth, wrap.clientHeight));
  }, [shapeKey, ready]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const host = mountRef.current;
    const still = stillRef.current;
    if (!wrap || !host || !still) return undefined;

    let ghost = null;
    let disposed = false;
    let frame = 0;
    const frameSize = () => ({ width: wrap.clientWidth, height: wrap.clientHeight });

    // The element ghosts draws into is larger than the frame, so the rings map
    // 1:1 onto it and bleed off every edge.
    const sizeHost = ({ width, height }) => {
      const hw = (width + 2 * MARGIN) / FIT;
      const hh = (height + 2 * MARGIN) / FIT;
      Object.assign(host.style, {
        width: `${hw}px`,
        height: `${hh}px`,
        left: `${(width - hw) / 2}px`,
        top: `${(height - hh) / 2}px`,
      });
    };

    // The still rings stand in only if ghosts is slow or can't run at all.
    const drawStill = ({ width, height }) => {
      const R = ringsFor(width, height);
      still.setAttribute('viewBox', `0 0 ${width} ${height}`);
      still.innerHTML = R.rings
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#7C8CFF" stroke-width="2"/>`)
        .join('');
    };

    const size = frameSize();
    sizeHost(size);
    drawStill(size);

    // Pointer: distance from the centre drives the blend, and the rings drift
    // against the cursor. Eased, so it settles rather than snaps.
    const target = { x: 0, y: 0, d: 0 };
    const now = { x: 0, y: 0, d: 0 };
    const onMove = (event) => {
      if (event.pointerType === 'touch') return;
      const box = wrap.getBoundingClientRect();
      const nx = ((event.clientX - box.left) / box.width) * 2 - 1;
      const ny = ((event.clientY - box.top) / box.height) * 2 - 1;
      target.x = -nx * 14;
      target.y = -ny * 14;
      target.d = Math.min(1, Math.hypot(nx, ny) / Math.SQRT2);
      // The comet listens on ghosts' own element, which sits under the copy.
      if (lookRef.current.shape === 'comet') {
        host.dispatchEvent(new PointerEvent('pointermove', { clientX: event.clientX, clientY: event.clientY }));
      }
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      target.d = 0;
    };
    const surface = wrap.parentElement;
    const tick = () => {
      now.x += (target.x - now.x) * 0.08;
      now.y += (target.y - now.y) * 0.08;
      now.d += (target.d - now.d) * 0.08;
      ghost?.setBlend(now.d);
      wrap.style.transform = `translate3d(${now.x.toFixed(2)}px, ${now.y.toFixed(2)}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    let lastKey = `${size.width}x${size.height}`;
    const resize = () => {
      const next = frameSize();
      const key = `${next.width}x${next.height}`;
      if (key === lastKey) return;
      lastKey = key;
      sizeHost(next);
      drawStill(next);
      // Pictures are drawn at the frame's size, so they're redrawn for the new one.
      if (ART[lookRef.current.shape]) ghost?.setSource(sourceFor(lookRef.current, next.width, next.height));
    };
    const observer = new ResizeObserver(resize);

    const slow = window.setTimeout(() => still.classList.add('is-shown'), 4000);

    (async () => {
      try {
        const [{ mount }, tide] = await Promise.all([
          import(/* webpackIgnore: true */ `${GHOSTS}/embed/hero.js`),
          fetch(`${GHOSTS}/sketches/031-tide/look.json`).then((r) => r.json()),
        ]);
        if (disposed) return;
        const { width, height } = frameSize();
        ghost = await mount(host, {
          looks: looksFrom(tide, lookRef.current),
          source: sourceFor(lookRef.current, width, height),
          speed: 0.5,
          dim: 0,
          badge: false,
          base: GHOSTS,
        });
        if (disposed) {
          ghost.destroy();
          return;
        }
        ghostRef.current = ghost;
        tideRef.current = tide;
        const now = lookRef.current;
        shapeRef.current = `${now.shape}:${now.shape === 'word' ? now.word : ''}`;
        setReady(true);
        // Two frames in, ghosts has drawn: the field develops in.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (disposed) return;
            window.clearTimeout(slow);
            still.classList.remove('is-shown');
            setLit(true);
            readyRef.current?.();
          })
        );
        observer.observe(wrap);
        if (reduce) {
          // One finished still: the logo image decodes after the first frame.
          [300, 900, 1800].forEach((t) => setTimeout(() => ghost?.setBlend(0.2), t));
        } else {
          surface?.addEventListener('pointermove', onMove, { passive: true });
          surface?.addEventListener('pointerleave', onLeave);
          frame = requestAnimationFrame(tick);
        }
      } catch (error) {
        // No WebGL or no network: the still rings stay.
        window.clearTimeout(slow);
        still.classList.add('is-shown');
        readyRef.current?.();
        console.warn('membrane field:', error);
      }
    })();

    return () => {
      disposed = true;
      window.clearTimeout(slow);
      cancelAnimationFrame(frame);
      observer.disconnect();
      surface?.removeEventListener('pointermove', onMove);
      surface?.removeEventListener('pointerleave', onLeave);
      ghost?.destroy();
      ghostRef.current = null;
      setReady(false);
    };
  }, [reduce]);

  return (
    <div
      className={`membrane ${lit ? 'is-lit' : ''} ${look.colour === 'full' ? 'is-full-colour' : ''} ${className}`}
      aria-hidden="true"
    >
      <div className="membrane-field" ref={wrapRef}>
        <div className="membrane-host" ref={mountRef} />
      </div>
      <svg className="membrane-still" ref={stillRef} />
      <svg width="0" height="0" className="membrane-defs">
        {/* Grey in, periwinkle out: white maps to the #C4CDFF glint, mid greys to a saturated periwinkle. */}
        <filter id="membrane-tint" colorInterpolationFilters="sRGB">
          <feColorMatrix values="0.88 0 0 0 -0.11  0.92 0 0 0 -0.12  1.25 0 0 0 0  0 0 0 1 0" />
        </filter>
      </svg>
    </div>
  );
};

export default MembraneField;
