import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import HeroField from './HeroField';
import { sections } from '../data/sections';

// Each wire runs from the heading up to its nav link; the endpoints are
// measured from the live nav, so routes must match the NavBar hrefs.
const ROUTES = sections;

const CORNER = 10;
const NOTE_PX = 0.62 * 16;
const NOTE_TRACKING = 0.12 * NOTE_PX;

let noteContext;
function noteLength(text) {
  noteContext = noteContext || document.createElement('canvas').getContext('2d');
  noteContext.font = `400 ${NOTE_PX}px 'IBM Plex Mono', monospace`;
  return noteContext.measureText(text.toUpperCase()).width + text.length * NOTE_TRACKING;
}

// Matches the NavBar breakpoint where links collapse into the menu toggle.
const INLINE_NAV = '(min-width: 769px)';

function navLink(to) {
  return document.querySelector(`.navbar .nav-links a[href="${to}"]`);
}

// Branch: from the junction along the bus, rounding up into the link.
// The stem meets the bus in a square T; only outer corners are rounded.
function branchPath(x, bus, target) {
  const dx = target.x - x;
  if (Math.abs(dx) < CORNER) {
    return `M ${x} ${bus} H ${target.x} V ${target.y}`;
  }
  const dir = Math.sign(dx);
  return [
    `M ${x} ${bus}`,
    `H ${target.x - dir * CORNER}`,
    `Q ${target.x} ${bus} ${target.x} ${bus - CORNER}`,
    `V ${target.y}`,
  ].join(' ');
}

const IdentityStrip = () => {
  const reduce = useReducedMotion();
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const [wires, setWires] = useState(null);
  const [active, setActive] = useState(null);

  const measure = useCallback(() => {
    const hero = heroRef.current;
    const heading = headingRef.current;
    if (!hero || !heading) return;

    const heroBox = hero.getBoundingClientRect();
    const links = ROUTES.map((route) => navLink(route.to));

    // Keep the SVG mounted when hiding so the draw-in never replays.
    const hide = () => setWires((prev) => (prev ? { ...prev, visible: false } : null));

    if (!window.matchMedia(INLINE_NAV).matches || links.some((link) => !link)) {
      hide();
      return;
    }

    // Layout offsets, not rects: the entrance animation transforms the intro.
    const intro = heading.offsetParent;
    const root = {
      x: intro.offsetLeft + heading.offsetLeft + heading.offsetWidth / 2,
      y: intro.offsetTop + heading.offsetTop - 2,
    };
    // The nav is fixed, so place its links where they sit at scroll 0.
    const heroRestTop = heroBox.top + window.scrollY;
    const targets = links.map((link) => {
      const box = link.getBoundingClientRect();
      return {
        x: box.left + box.width / 2 - heroBox.left,
        y: box.bottom - heroRestTop + 10,
      };
    });
    const top = Math.max(...targets.map((target) => target.y));
    const bus = top + (root.y - top) * 0.7;

    if (root.y - top < 80) {
      hide();
      return;
    }

    // Labels hang from each endpoint; show all four or none.
    const notes = ROUTES.every(
      (route, i) => noteLength(route.note) <= bus - targets[i].y - 30
    );
    const stem = `M ${root.x} ${root.y} V ${bus}`;

    setWires({
      visible: true,
      notes,
      width: heroBox.width,
      height: heroBox.height,
      bus,
      x: root.x,
      stem,
      routes: ROUTES.map((route, i) => {
        const branch = branchPath(root.x, bus, targets[i]);
        return {
          ...route,
          branch,
          d: `${stem} ${branch.replace(/^M/, 'L')}`,
          x: targets[i].x,
          top: targets[i].y,
        };
      }),
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (heroRef.current) observer.observe(heroRef.current);
    const navLinks = document.querySelector('.navbar .nav-links');
    if (navLinks) observer.observe(navLinks);
    const inline = window.matchMedia(INLINE_NAV);
    inline.addEventListener('change', measure);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => {
      observer.disconnect();
      inline.removeEventListener('change', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  // Light a wire while its nav link is hovered or focused. Delegated from
  // the navbar so it survives NavBar re-rendering its links.
  useEffect(() => {
    const nav = document.querySelector('.navbar');
    if (!nav) return undefined;
    const routeOf = (node) => {
      const link = node instanceof Element ? node.closest('.nav-links a[href]') : null;
      const to = link?.getAttribute('href');
      return ROUTES.some((route) => route.to === to) ? { link, to } : null;
    };
    const on = (event) => {
      const hit = routeOf(event.target);
      if (hit) setActive(hit.to);
    };
    const off = (event) => {
      const hit = routeOf(event.target);
      if (!hit || routeOf(event.relatedTarget)?.to === hit.to) return;
      const focused = routeOf(document.activeElement);
      const keep = event.type === 'pointerout' && focused ? focused.to : null;
      setActive((current) => (current === hit.to ? keep : current));
    };
    nav.addEventListener('pointerover', on);
    nav.addEventListener('pointerout', off);
    nav.addEventListener('focusin', on);
    nav.addEventListener('focusout', off);
    return () => {
      nav.removeEventListener('pointerover', on);
      nav.removeEventListener('pointerout', off);
      nav.removeEventListener('focusin', on);
      nav.removeEventListener('focusout', off);
    };
  }, []);

  // Wires belong to the resting page; let them go as soon as it scrolls.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    let frame = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const fade = Math.max(0, 1 - window.scrollY / 140);
        hero.style.setProperty('--wire-fade', fade.toFixed(3));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className={`hero-visual ${reduce ? 'is-still' : ''} ${active ? 'has-active' : ''}`}
    >
      <HeroField reduce={Boolean(reduce)} />
      <div className="hero-visual-scrim" aria-hidden="true" />

      {wires && (
        <svg
          className={`hero-wires ${wires.visible ? '' : 'is-hidden'}`}
          width={wires.width}
          height={wires.height}
          viewBox={`0 0 ${wires.width} ${wires.height}`}
          aria-hidden="true"
        >
          <path className="hero-wire-line hero-wire-stem" d={wires.stem} pathLength="1" />
          <circle className="hero-wire-node" cx={wires.x} cy={wires.bus} r="3" />
          {wires.routes.map((route, i) => (
            <g
              key={route.to}
              className={`hero-wire ${active === route.to ? 'is-active' : ''}`}
              style={{ '--i': i }}
            >
              <path className="hero-wire-line" d={route.branch} pathLength="1" />
              <circle className="hero-wire-end" cx={route.x} cy={route.top} r="2.5" />
              {wires.notes && (
                <text
                  className="hero-wire-note"
                  textAnchor="end"
                  transform={`translate(${route.x + 9} ${route.top + 16}) rotate(-90)`}
                >
                  {route.note}
                </text>
              )}
              {wires.visible && !reduce && (
                <circle className="hero-wire-pulse" r="2.5" opacity="0">
                  <animateMotion
                    path={route.d}
                    dur="6s"
                    begin={`${2.4 + i * 1.5}s`}
                    repeatCount="indefinite"
                    calcMode="linear"
                    keyPoints="0;1;1"
                    keyTimes="0;0.22;1"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0;0"
                    keyTimes="0;0.03;0.2;0.25;1"
                    dur="6s"
                    begin={`${2.4 + i * 1.5}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          ))}
        </svg>
      )}

      <motion.div
        className="hero-visual-intro"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 ref={headingRef} className="hero-visual-heading">Hey, it's Baz.</h1>
        <p className="hero-visual-sub">
          Software engineer. I build systems for Ontario rail, and I make photographs.
        </p>

        <nav className="hero-index" aria-label="Sections">
          {ROUTES.map((route) => (
            <Link key={route.to} to={route.to} className="hero-index-link">
              <span className="hero-index-label">{route.label}</span>
              <span className="hero-index-note">{route.note}</span>
            </Link>
          ))}
        </nav>
      </motion.div>

      <motion.div
        className="hero-visual-credit"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to="/projects/playground-visuals" className="hero-visual-caption">
          <span className="hero-visual-kicker">visuals</span>
          <span className="hero-visual-title">portal waves</span>
        </Link>
      </motion.div>
    </section>
  );
};

export default IdentityStrip;
