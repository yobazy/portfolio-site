import { useEffect, useRef } from 'react';

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

// tide (look 031) with only mask, fill and waves on (no rainbow rim, no ghosts),
// plus the preset's layers and filters. weather 0.85 and 1.2 are the two ends
// the pointer blends between.
const looksFrom = (tide, preset = PRESETS[0]) => {
  const layers = ['mask', 'fill', 'waves', ...(preset.layers || [])];
  const filters = preset.filters || [];
  const make = (weather) => ({
    ...tide,
    version: 1,
    layers: Object.fromEntries(Object.keys(tide.layers).map((k) => [k, layers.includes(k)])),
    filters: Object.fromEntries(Object.keys(tide.filters).map((k) => [k, filters.includes(k)])),
    params: { ...tide.params, hue: 0.16, hold: 1, weather },
  });
  return [make(0.85), make(1.2)];
};

const MembraneField = ({ reduce = false, preset = PRESETS[0], className = '' }) => {
  const wrapRef = useRef(null);
  const mountRef = useRef(null);
  const stillRef = useRef(null);
  const ghostRef = useRef(null);
  const tideRef = useRef(null);
  const presetRef = useRef(preset);
  presetRef.current = preset;

  // A new preset: dip the field, swap the looks, bring it back up.
  useEffect(() => {
    const ghost = ghostRef.current;
    const tide = tideRef.current;
    const wrap = wrapRef.current;
    if (!ghost || !tide || !wrap) return undefined;
    let live = true;
    wrap.classList.add('is-swapping');
    const swap = window.setTimeout(async () => {
      await ghost.setLooks(looksFrom(tide, preset));
      if (live) wrap.classList.remove('is-swapping');
    }, 180);
    return () => {
      live = false;
      window.clearTimeout(swap);
      wrap.classList.remove('is-swapping');
    };
  }, [preset]);

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

    // The still rings show until ghosts has drawn, so the hero is never blank.
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
      ghost?.setSource({ type: 'logo', src: ringsSvg(next.width, next.height), size: 3 });
    };
    const observer = new ResizeObserver(resize);

    (async () => {
      try {
        const [{ mount }, tide] = await Promise.all([
          import(/* webpackIgnore: true */ `${GHOSTS}/embed/hero.js`),
          fetch(`${GHOSTS}/sketches/031-tide/look.json`).then((r) => r.json()),
        ]);
        if (disposed) return;
        const { width, height } = frameSize();
        ghost = await mount(host, {
          looks: looksFrom(tide, presetRef.current),
          source: { type: 'logo', src: ringsSvg(width, height), size: 3 },
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
        // Two frames in, ghosts has drawn; hand over from the still.
        requestAnimationFrame(() => requestAnimationFrame(() => still.classList.add('is-gone')));
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
        console.warn('membrane field:', error);
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      surface?.removeEventListener('pointermove', onMove);
      surface?.removeEventListener('pointerleave', onLeave);
      ghost?.destroy();
      ghostRef.current = null;
    };
  }, [reduce]);

  return (
    <div className={`membrane ${className}`} aria-hidden="true">
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
