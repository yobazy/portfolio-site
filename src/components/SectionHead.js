import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { sectionFor } from '../data/sections';

export const sectionHeadingId = (to) => `home-${sectionFor(to).label.toLowerCase()}`;

// Home section heading, drawn in the same wiring language as the hero:
// index and note, the title, then a wire running out to the section link.
const SectionHead = ({ to, linkLabel }) => {
  const reduce = useReducedMotion();
  const section = sectionFor(to);

  return (
    <motion.header
      className="wire-head"
      initial={reduce ? false : 'off'}
      whileInView="on"
      viewport={{ once: true, amount: 0.6 }}
    >
      <span className="wire-head-index">
        {section.number}
        <span aria-hidden="true"> · </span>
        {section.note}
      </span>
      <div className="wire-head-row">
        <h2 id={sectionHeadingId(to)}>{section.label}</h2>
        <motion.span
          className="wire-head-wire"
          aria-hidden="true"
          variants={{ off: { scaleX: 0 }, on: { scaleX: 1 } }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        <Link to={to} className="wire-head-link" aria-label={linkLabel}>
          <span className="wire-head-link-text">{linkLabel}</span>
          <span className="wire-head-link-arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </motion.header>
  );
};

export default SectionHead;
