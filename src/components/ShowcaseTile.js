import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const ShowcaseTile = ({
  title,
  subtitle,
  line,
  img,
  field,
  href,
  onClick,
  size = 'default',
  orientation,
  fit,
  as = 'auto',
}) => {
  const reduce = useReducedMotion();
  const kicker = subtitle && subtitle !== title ? subtitle : null;
  const isVisual = Boolean(img) || Boolean(field);
  const className = [
    'showcase-tile',
    isVisual ? 'is-photo' : 'is-type',
    field ? 'is-field' : '',
    size === 'large' ? 'is-large' : '',
    orientation === 'portrait' ? 'is-portrait' : '',
    orientation === 'landscape' ? 'is-landscape' : '',
    fit === 'contain' ? 'is-contain' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inner = isVisual ? (
    <>
      <div className="showcase-tile-media">
        {field || <img src={img} alt={title} />}
      </div>
      <div className="showcase-tile-caption">
        {kicker && <span className="showcase-tile-kicker">{kicker}</span>}
        <span className="showcase-tile-title">{title}</span>
        {line && <span className="showcase-tile-line">{line}</span>}
      </div>
    </>
  ) : (
    <div className="showcase-tile-type">
      {kicker && <span className="showcase-tile-kicker">{kicker}</span>}
      <div className="showcase-tile-copy">
        <span className="showcase-tile-title">{title}</span>
        {line && <span className="showcase-tile-line">{line}</span>}
      </div>
    </div>
  );

  const motionProps = reduce ? {} : {};

  const wrap = (node) => (
    <motion.div className={className} {...motionProps}>
      {node}
    </motion.div>
  );

  if (href) {
    const isInternal = href.startsWith('/');
    if (isInternal) {
      return wrap(
        <Link to={href} className="showcase-tile-hit">
          {inner}
        </Link>
      );
    }
    return wrap(
      <a
        href={href}
        className="showcase-tile-hit"
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  if (onClick || as === 'button') {
    return wrap(
      <button type="button" className="showcase-tile-hit" onClick={onClick}>
        {inner}
      </button>
    );
  }

  return wrap(<div className="showcase-tile-hit">{inner}</div>);
};

export default ShowcaseTile;
