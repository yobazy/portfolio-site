import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import HeroField from './HeroField';
import Arrow from './Arrow';
import { TransitionLink } from '../lib/pageTransition';
import { projects } from '../data/projects';

const CITY = 'Toronto';
const ZONE = 'America/Toronto';

const localTime = () =>
  new Intl.DateTimeFormat('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ZONE })
    .format(new Date())
    .replace(/^24/, '00');

// The hero: a field you can touch, with the name set in it. The copy sits low
// and left like a caption on a photograph; the field is the picture.
const IdentityStrip = () => {
  const reduce = useReducedMotion();
  const [time, setTime] = useState(localTime);
  const [touched, setTouched] = useState(false);
  const [lit, setLit] = useState(false);
  const litTimer = useRef(null);
  const building = projects.filter((project) => project.status === 'In progress' && project.lead);

  useEffect(() => {
    const tick = window.setInterval(() => setTime(localTime()), 30000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => () => window.clearTimeout(litTimer.current), []);

  // A ripple in the field also lights the name for a moment.
  const onRipple = () => {
    setTouched(true);
    setLit(true);
    window.clearTimeout(litTimer.current);
    litTimer.current = window.setTimeout(() => setLit(false), 900);
  };

  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section
      className={`hero ${reduce ? 'is-still' : ''} ${lit ? 'is-lit' : ''}`}
      onPointerMove={() => !touched && setTouched(true)}
    >
      <HeroField reduce={Boolean(reduce)} touchable onRipple={onRipple} className="hero-field" />
      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-body">
        <motion.div className="hero-copy" {...rise(0.1)}>
          <h1 className="hero-heading">
            Hey, it&rsquo;s <em>Baz</em>.
          </h1>
          <p className="hero-sub">
            Software engineer in {CITY}. I build the systems underneath and the visuals on top,
            and the system doesn&rsquo;t care which layer the problem is on.
          </p>
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
                drag the field · tap for a ripple
              </span>
            )}
            <TransitionLink to="/projects/ghosts-playground" className="hero-credit">
              <span className="hero-credit-label">Field</span>
              <span className="hero-credit-title">ghosts-playground, live</span>
            </TransitionLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IdentityStrip;
