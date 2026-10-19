import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import MembraneField, { PRESETS, lookFor } from './MembraneField';
import FieldEditor from './FieldEditor';
import Arrow from './Arrow';
import HeroHeading from './HeroHeading';
import { TransitionLink } from '../lib/pageTransition';
import { projects } from '../data/projects';

const CITY = 'Toronto';
const ZONE = 'America/Toronto';

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
  const [preset, setPreset] = useState(0);
  const [look, setLook] = useState(() => lookFor(PRESETS[0]));
  const [edited, setEdited] = useState(false);
  const [editing, setEditing] = useState(false);
  const pick = (index) => {
    setPreset(index);
    setEdited(false);
    // A preset brings its own layers and filters; shape and colour carry over.
    setLook((now) => ({ ...lookFor(PRESETS[index]), shape: now.shape, colour: now.colour, hue: now.hue }));
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

  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section
      className={`hero ${reduce ? 'is-still' : ''}`}
      onPointerMove={() => !touched && setTouched(true)}
    >
      <MembraneField reduce={Boolean(reduce)} look={look} scene={PRESETS[preset].id} className="hero-field" />
      <div className="hero-scrim" aria-hidden="true" />

      <motion.div className="hero-body" {...rise(0)}>
        <motion.div className="hero-copy" {...rise(0.1)}>
          <HeroHeading reduce={Boolean(reduce)} />
          <p className="hero-sub">Software + visuals.</p>
          <div className="hero-actions">
            <TransitionLink to="/projects" className="hero-cta">
              <span>What I&rsquo;m building now</span>
              <Arrow />
            </TransitionLink>
          </div>
        </motion.div>

        <motion.div className="hero-foot" {...rise(0.5)}>
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
              <span className="hero-credit-label">Field</span>
              <span className="hero-credit-title">ghosts-playground, live</span>
            </TransitionLink>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {editing && <FieldEditor look={look} onChange={edit} onReset={reset} onClose={() => setEditing(false)} />}
      </AnimatePresence>
    </section>
  );
};

export default IdentityStrip;
