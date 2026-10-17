import { motion, useReducedMotion } from 'framer-motion';
import Arrow from './Arrow';
import { sectionFor } from '../data/sections';
import { TransitionLink } from '../lib/pageTransition';

export const sectionHeadingId = (to) => `home-${sectionFor(to).label.toLowerCase()}`;

// Home section heading: the title, a hairline that draws out to the section
// link, and the link itself. `aside` is an optional line under the title.
const SectionHead = ({ to, linkLabel, aside }) => {
  const reduce = useReducedMotion();
  const section = sectionFor(to);

  return (
    <motion.header
      className="wire-head"
      initial={reduce ? false : 'off'}
      whileInView="on"
      viewport={{ once: true, amount: 0.6 }}
    >
      <div className="wire-head-row">
        <h2 id={sectionHeadingId(to)}>{section.label}</h2>
        <motion.span
          className="wire-head-wire"
          aria-hidden="true"
          variants={{ off: { scaleX: 0 }, on: { scaleX: 1 } }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        <TransitionLink
          to={to}
          className="wire-head-link"
          aria-label={linkLabel}
          morph={(link) => link.closest('.wire-head-row')?.querySelector('h2')}
        >
          <span className="wire-head-link-text">{linkLabel}</span>
          <Arrow />
        </TransitionLink>
      </div>
      {aside && <p className="wire-head-aside">{aside}</p>}
    </motion.header>
  );
};

export default SectionHead;
