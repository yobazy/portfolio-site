import { TransitionLink } from '../lib/pageTransition';
import { motion } from 'framer-motion';

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
  // A few technologies, shown as a quiet line under the description.
  tags,
  // Extra framer-motion props for the wrapper, e.g. layout animation on a filtered grid.
  animation,
}) => {
  const kicker = subtitle && subtitle !== title ? subtitle : null;
  const isVisual = Boolean(img) || Boolean(field);
  const tagLine = tags?.length ? <span className="showcase-tile-tags">{tags.join(' · ')}</span> : null;
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
        {field || <img src={img} alt="" />}
      </div>
      <div className="showcase-tile-caption">
        <span className="showcase-tile-title">{title}</span>
        {line && <span className="showcase-tile-line">{line}</span>}
        {tagLine}
        {kicker && <span className="showcase-tile-kicker">{kicker}</span>}
      </div>
    </>
  ) : (
    <div className="showcase-tile-type">
      <div className="showcase-tile-copy">
        <span className="showcase-tile-title">{title}</span>
        {line && <span className="showcase-tile-line">{line}</span>}
        {tagLine}
      </div>
      {kicker && <span className="showcase-tile-kicker">{kicker}</span>}
    </div>
  );


  const wrap = (node) => (
    <motion.div className={className} {...animation}>
      {node}
    </motion.div>
  );

  if (href) {
    const isInternal = href.startsWith('/');
    if (isInternal) {
      return wrap(
        <TransitionLink to={href} className="showcase-tile-hit">
          {inner}
        </TransitionLink>
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
