import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { TransitionLink } from '../lib/pageTransition';
import XrayGallery, { GALLERY } from './XrayGallery';
import Arrow from './Arrow';
import { EMAIL, LINKS, useCopy } from './Footer';
import { getProjectBySlug, projectPage } from '../data/projects';
import { NOW_UPDATED, NOW_URL, nowItems } from '../data/now';
import { demos } from '../demos';

const ORDER = GALLERY.map((card) => card.slug);
const factsFor = (slug) => nowItems.find((item) => item.slug === slug)?.facts || getProjectBySlug(slug)?.facts || [];

// A clip plays only while its panel is open.
const Clip = ({ src, poster, alt }) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.play().catch(() => {});
  }, []);
  return <video ref={ref} src={src} poster={poster} aria-label={alt} muted loop playsInline preload="metadata" />;
};

const Media = ({ project, reduce }) => {
  const Demo = project.interactive && demos[project.interactive];
  if (Demo) {
    return (
      <Suspense fallback={null}>
        <Demo />
      </Suspense>
    );
  }
  const clip = project.media?.find((item) => item.type === 'video');
  if (clip && !reduce) return <Clip {...clip} />;
  return <img src={project.img} alt="" />;
};

// What Baz is building, laid over the hero's field and never leaving it. The
// projects float as an x-ray gallery; tap one and its picture grows into a
// panel with the demo, the line, three facts and the live link. Close it and
// the picture goes back to its frame. Arrow keys step between projects.
const Deck = ({ onClose }) => {
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const selected = params.get('p');
  const [copied, copy] = useCopy(EMAIL);
  const [shared, setShared] = useState(null);

  const select = (slug) => {
    const next = new URLSearchParams(params);
    if (slug) next.set('p', slug);
    else next.delete('p');
    setParams(next);
  };
  const step = (by) => {
    const at = ORDER.indexOf(selected);
    if (at < 0) return;
    select(ORDER[(at + by + ORDER.length) % ORDER.length]);
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === 'Escape') (selected ? select(null) : onClose());
      if (selected && event.key === 'ArrowRight') step(1);
      if (selected && event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, onClose]);

  useEffect(() => {
    const previous = document.title;
    document.title = 'What Baz is building now';
    return () => {
      document.title = previous;
    };
  }, []);

  const share = async () => {
    const data = { title: 'What Baz is building now', url: NOW_URL };
    if (navigator.share) {
      try {
        await navigator.share(data);
        setShared('Shared');
      } catch {
        return;
      }
    } else {
      await navigator.clipboard?.writeText(NOW_URL);
      setShared('Link copied');
    }
    window.setTimeout(() => setShared(null), 2000);
  };

  const ease = [0.16, 1, 0.3, 1];
  const project = selected && selected !== 'contact' ? getProjectBySlug(selected) : null;
  const page = project && projectPage(project);
  const live =
    project &&
    (project.demo ||
      (project.url
        ? {
            href: project.url,
            label: project.url.includes('github.com')
              ? 'View on GitHub'
              : `Open ${project.url.replace(/^https?:\/\//, '')}`,
          }
        : null));

  return (
    <motion.div
      className="deck"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.4, ease }}
    >
      <motion.header
        className="deck-bar"
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.05 }}
      >
        <span className="deck-title">What I&rsquo;m building · {NOW_UPDATED}</span>
        <span className="deck-hint" aria-hidden="true">
          {selected ? '← → between projects · esc back' : 'drag the frames · tap one to open'}
        </span>
        <button type="button" className="now-chip deck-contact" onClick={() => select(selected === 'contact' ? null : 'contact')}>
          Get in touch
        </button>
      </motion.header>

      <LayoutGroup>
        <div className="deck-stage">
          <XrayGallery selected={selected} onSelect={select} dim={Boolean(selected)} />

          <AnimatePresence>
            {project && (
              <motion.section
                key={project.slug}
                className="deck-panel"
                aria-label={project.title}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.35, ease }}
              >
                <button type="button" className="deck-panel-scrim" aria-label="Back to the gallery" onClick={() => select(null)} />
                <div className="deck-panel-inner">
                  <motion.div
                    layoutId={`pic-${project.slug}`}
                    className={`now-media frame${project.imgFit === 'contain' ? ' is-contain' : ''}${project.interactive ? ' is-demo' : ''}`}
                    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  >
                    <Media project={project} reduce={Boolean(reduce)} />
                  </motion.div>
                  <motion.div
                    className="now-copy"
                    initial={reduce ? false : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.15 }}
                  >
                    <p className="now-status">{[project.status, project.org, project.tag].filter(Boolean).join(' · ')}</p>
                    <h2>
                      {page ? (
                        <TransitionLink to={page} className="now-title">
                          {project.title}
                          <Arrow size={18} />
                        </TransitionLink>
                      ) : (
                        <span className="now-title">{project.title}</span>
                      )}
                    </h2>
                    <p className="now-line">{project.line}</p>
                    <p className="now-why">{project.description}</p>
                    <ul className="now-facts">
                      {factsFor(project.slug).map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                    <div className="deck-panel-actions">
                      {live && (
                        <a className="now-cta" href={live.href} target="_blank" rel="noopener noreferrer">
                          <span>{live.label}</span>
                          <Arrow dir="up-right" />
                        </a>
                      )}
                      <span className="deck-panel-nav">
                        <button type="button" className="now-arrow" onClick={() => step(-1)} aria-label="Previous project">
                          <Arrow dir="left" />
                        </button>
                        <button type="button" className="now-arrow" onClick={() => step(1)} aria-label="Next project">
                          <Arrow />
                        </button>
                        <button type="button" className="now-close" onClick={() => select(null)}>
                          Back
                        </button>
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.section>
            )}

            {selected === 'contact' && (
              <motion.section
                key="contact"
                className="deck-panel is-contact"
                aria-label="Get in touch"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.35, ease }}
              >
                <button type="button" className="deck-panel-scrim" aria-label="Back to the gallery" onClick={() => select(null)} />
                <motion.div
                  className="now-end-inner"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease }}
                >
                  <div className="now-end-copy">
                    <h2>Get in touch</h2>
                    <div className="now-end-actions">
                      <a href={`mailto:${EMAIL}`} className="now-end-email">
                        {EMAIL}
                      </a>
                      <button type="button" className="now-chip" onClick={copy}>
                        {copied ? 'Copied' : 'Copy email'}
                      </button>
                      <button type="button" className="now-chip" onClick={share}>
                        {shared || 'Share this'}
                      </button>
                    </div>
                    <ul className="now-end-links">
                      {LINKS.map((link) => (
                        <li key={link.href}>
                          <a href={link.href} target="_blank" rel="noopener noreferrer">
                            {link.label}
                            <Arrow dir="up-right" size={11} />
                          </a>
                        </li>
                      ))}
                    </ul>
                    <button type="button" className="now-close" onClick={() => select(null)}>
                      Back
                    </button>
                  </div>
                  <figure className="now-qr">
                    <img src="/qr-now.svg" alt={`QR code for ${NOW_URL}`} width="200" height="200" />
                    <figcaption>heyitsbaz.com/now</figcaption>
                  </figure>
                </motion.div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </motion.div>
  );
};

export default Deck;
