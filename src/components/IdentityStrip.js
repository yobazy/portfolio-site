import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import MembraneField, { PRESETS, SHAPES, lookFor } from './MembraneField';
import FieldEditor from './FieldEditor';
import Arrow from './Arrow';
import HeroHeading from './HeroHeading';
import { TransitionLink } from '../lib/pageTransition';
import { projects } from '../data/projects';

const CITY = 'Toronto';
const ZONE = 'America/Toronto';

// The field as the visitor left it: kept for the visit (this tab), so going to
// another page and back finds the same preset and edits.
const FIELD_STORE = 'hero-field';

const loadField = () => {
  const fresh = { preset: 0, look: lookFor(PRESETS[0]), edited: false };
  try {
    const kept = JSON.parse(sessionStorage.getItem(FIELD_STORE));
    if (!kept || !PRESETS[kept.preset] || !kept.look) return fresh;
    const look = { ...lookFor(PRESETS[kept.preset]), ...kept.look };
    if (!SHAPES.some(([name]) => name === look.shape)) look.shape = 'rings';
    return { preset: kept.preset, look, edited: Boolean(kept.edited) };
  } catch {
    return fresh;
  }
};

// The ghosts mark: a strobe ghost with its two coloured afterimages.
const GhostsMark = () => (
  <svg className="hero-credit-mark" width="18" height="18" viewBox="0 0 64 64" aria-hidden="true">
    <g transform="translate(32 33) scale(.8) translate(-32 -32.5)">
      <path d="M8 58V30a24 24 0 0 1 48 0v28l-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6z" fill="#5d1119" transform="translate(-5 3)" />
      <path d="M8 58V30a24 24 0 0 1 48 0v28l-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6z" fill="#2b606c" transform="translate(5 -2)" />
      <path d="M8 58V30a24 24 0 0 1 48 0v28l-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6z" fill="#e4e3e2" />
      <circle cx="19" cy="25" r="4.5" fill="#030406" />
      <circle cx="45" cy="34" r="2.6" fill="#030406" />
    </g>
  </svg>
);

const localTime = () =>
  new Intl.DateTimeFormat('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ZONE })
    .format(new Date())
    .replace(/^24/, '00');

// The hero: a living field (ghosts membranes) with the name set in it. The copy sits low
// and left like a caption on a photograph; the field is the picture.
const IdentityStrip = () => {
  const reduce = useReducedMotion();
  const [time, setTime] = useState(localTime);
  const [touched, setTouched] = useState(false);
  // The preset in play, the look on screen (a preset until it's edited), and
  // whether the edit panel is open.
  const [kept] = useState(loadField);
  const [preset, setPreset] = useState(kept.preset);
  const [look, setLook] = useState(kept.look);
  const [edited, setEdited] = useState(kept.edited);
  const [editing, setEditing] = useState(false);
  // The arrival: the name first, then the field develops behind it, then the
  // rest. If ghosts is slow the rest comes anyway.
  const [lit, setLit] = useState(Boolean(reduce));
  useEffect(() => {
    const late = window.setTimeout(() => setLit(true), 3500);
    return () => window.clearTimeout(late);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(FIELD_STORE, JSON.stringify({ preset, look, edited }));
    } catch {}
  }, [preset, look, edited]);
  const pick = (index) => {
    setPreset(index);
    setEdited(false);
    // A preset brings its own layers and filters; shape and colour carry over.
    setLook((now) => ({ ...lookFor(PRESETS[index]), shape: now.shape, word: now.word, colour: now.colour, hue: now.hue }));
  };
  const step = (by) => pick((preset + by + PRESETS.length) % PRESETS.length);
  const edit = (next) => {
    setLook(next);
    setEdited(true);
  };
  const reset = () => {
    setLook(lookFor(PRESETS[preset]));
    setEdited(false);
  };
  const building = projects.filter((project) => project.status === 'In progress' && project.lead);

  useEffect(() => {
    const tick = window.setInterval(() => setTime(localTime()), 30000);
    return () => window.clearInterval(tick);
  }, []);

  // Held back (`gate` false) until the field has arrived.
  const rise = (delay, gate = true) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: gate ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: 0.9, delay: gate ? delay : 0, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section
      className={`hero ${reduce ? 'is-still' : ''}`}
      onPointerMove={() => !touched && setTouched(true)}
    >
      <MembraneField
        reduce={Boolean(reduce)}
        look={look}
        scene={PRESETS[preset].id}
        onReady={() => setLit(true)}
        className="hero-field"
      />
      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-body">
        <div className="hero-copy">
          <motion.div {...rise(0.15)}>
            <HeroHeading reduce={Boolean(reduce)} />
          </motion.div>
          <motion.p className="hero-sub" {...rise(0.9, lit)}>
            Software + visuals.
          </motion.p>
          <motion.div className="hero-actions" {...rise(1.05, lit)}>
            <TransitionLink to="/projects" className="hero-cta">
              <span>What I&rsquo;m building now</span>
              <Arrow />
            </TransitionLink>
          </motion.div>
        </div>

        <motion.div className="hero-foot" {...rise(1.3, lit)}>
          <p className="hero-status">
            <span className="hero-status-time">
              {CITY} {time}
            </span>
            {building.length > 0 && (
              <span className="hero-status-now">
                Building {building.map((project, i) => (
                  <span key={project.slug}>
                    {i > 0 && (i === building.length - 1 ? ' and ' : ', ')}
                    {project.title}
                  </span>
                ))}
              </span>
            )}
          </p>
          <div className="hero-foot-right">
            {!reduce && (
              <span className={`hero-hint ${touched ? 'is-done' : ''}`} aria-hidden="true">
                move to stir the field
              </span>
            )}
            <div className="hero-presets" role="group" aria-label="Field preset">
              <span className="hero-credit-label">
                {edited ? 'Edited' : `Preset ${String(preset + 1).padStart(2, '0')}/${String(PRESETS.length).padStart(2, '0')}`}
              </span>
              <div className="hero-presets-row">
                <button type="button" className="hero-presets-step" onClick={() => step(-1)} aria-label="Previous preset">
                  <Arrow dir="left" size={12} />
                </button>
                <button type="button" className="hero-presets-name" onClick={() => step(1)} aria-live="polite">
                  {edited ? 'Custom' : PRESETS[preset].label}
                </button>
                <button type="button" className="hero-presets-step" onClick={() => step(1)} aria-label="Next preset">
                  <Arrow size={12} />
                </button>
                <button
                  type="button"
                  className={`hero-presets-edit ${editing ? 'is-on' : ''}`}
                  onClick={() => setEditing((open) => !open)}
                  aria-expanded={editing}
                >
                  Edit
                </button>
              </div>
            </div>
            <TransitionLink to="/projects/ghosts-playground" className="hero-credit">
              <span className="hero-credit-title">
                Made with ghosts
                <GhostsMark />
              </span>
            </TransitionLink>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {editing && <FieldEditor look={look} onChange={edit} onReset={reset} onClose={() => setEditing(false)} />}
      </AnimatePresence>
    </section>
  );
};

export default IdentityStrip;
