import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MembraneField from './MembraneField';
import Deck from './Deck';
import Arrow from './Arrow';
import { TransitionLink } from '../lib/pageTransition';
import { projects } from '../data/projects';

const CITY = 'Toronto';
const ZONE = 'America/Toronto';

const localTime = () =>
  new Intl.DateTimeFormat('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ZONE })
    .format(new Date())
    .replace(/^24/, '00');

// The hero: a living field (ghosts membranes) with the name set in it. The copy sits low
// and left like a caption on a photograph; the field is the picture. With
// `deck` on, the pitch deck comes in over the same field and the copy steps
// aside; the page never changes.
const IdentityStrip = ({ deck = false }) => {
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const [time, setTime] = useState(localTime);
  const [touched, setTouched] = useState(false);
  const building = projects.filter((project) => project.status === 'In progress' && project.lead);

  useEffect(() => {
    const tick = window.setInterval(() => setTime(localTime()), 30000);
    return () => window.clearInterval(tick);
  }, []);

  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? undefined : { opacity: 0, y: 10, transition: { duration: 0.25 } },
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section
      className={`hero ${reduce ? 'is-still' : ''} ${deck ? 'is-deck' : ''}`}
      onPointerMove={() => !touched && setTouched(true)}
    >
      <MembraneField reduce={Boolean(reduce)} className="hero-field" />
      <div className="hero-scrim" aria-hidden="true" />

      <AnimatePresence mode="wait" initial={false}>
        {deck ? (
          <Deck key="deck" onClose={() => navigate('/')} />
        ) : (
          <motion.div key="hero" className="hero-body" {...rise(0)}>
        <motion.div className="hero-copy" {...rise(0.1)}>
          <h1 className="hero-heading">
            Hey, it&rsquo;s <em>Baz</em>.
          </h1>
          <p className="hero-sub">Software + visuals.</p>
          <div className="hero-actions">
            <TransitionLink to="/now" className="hero-cta">
              <span>What I&rsquo;m building now</span>
              <Arrow />
            </TransitionLink>
            <TransitionLink to="/projects" className="hero-link">
              All development
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
            <TransitionLink to="/projects/ghosts-playground" className="hero-credit">
              <span className="hero-credit-label">Field</span>
              <span className="hero-credit-title">ghosts-playground, live</span>
            </TransitionLink>
          </div>
        </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default IdentityStrip;
