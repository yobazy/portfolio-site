import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import HeroField from './HeroField';

const IdentityStrip = () => {
  const reduce = useReducedMotion();

  return (
    <section className="hero-visual">
      <h1 className="hero-visual-heading">Hey, it's Baz.</h1>
      <HeroField reduce={Boolean(reduce)} />
      <div className="hero-visual-scrim" aria-hidden="true" />
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
