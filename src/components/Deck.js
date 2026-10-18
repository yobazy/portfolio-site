import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TransitionLink } from '../lib/pageTransition';
import HeroField from './HeroField';
import Arrow from './Arrow';
import { EMAIL, LINKS, useCopy } from './Footer';
import { getProjectBySlug, projectPage } from '../data/projects';
import { NOW_UPDATED, NOW_URL, nowItems } from '../data/now';
import { demos } from '../demos';

const slides = [
  ...nowItems
    .map((item) => ({ kind: 'project', ...item, project: getProjectBySlug(item.slug) }))
    .filter((item) => item.project),
  { kind: 'end' },
];

// A clip plays only while its slide is on screen.
const Clip = ({ src, poster, alt, active }) => {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (active) video.play().catch(() => {});
    else video.pause();
  }, [active]);
  return <video ref={ref} src={src} poster={poster} aria-label={alt} muted loop playsInline preload="metadata" />;
};

const Media = ({ slide, active, reduce }) => {
  const { project } = slide;
  const Demo = project.interactive && demos[project.interactive];
  if (Demo) {
    return (
      <Suspense fallback={null}>
        <Demo />
      </Suspense>
    );
  }
  const clip = project.media?.find((item) => item.type === 'video');
  if (clip && !reduce) return <Clip {...clip} active={active} />;
  if (project.img) return <img src={project.img} alt="" />;
  return <HeroField reduce={reduce} intensity={1.1} dprCap={1} className="now-field" />;
};

// The pitch deck, laid over the hero's field: one project per slide, swiped
// sideways, meant to be handed over on a phone. Arrow keys work too. The last
// slide hands the site over. Nothing leaves the page.
const Deck = ({ onClose }) => {
  const reduce = useReducedMotion();
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  const [copied, copy] = useCopy(EMAIL);
  const [shared, setShared] = useState(null);
  const count = slides.length;

  const go = useCallback(
    (to) => {
      const node = track.current;
      if (!node) return;
      const next = Math.max(0, Math.min(count - 1, to));
      node.scrollTo({ left: next * node.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    },
    [count, reduce]
  );

  useEffect(() => {
    const node = track.current;
    if (!node) return undefined;
    let frame = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setIndex(Math.round(node.scrollLeft / node.clientWidth));
      });
    };
    node.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      node.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === 'ArrowRight') go(index + 1);
      if (event.key === 'ArrowLeft') go(index - 1);
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, onClose]);

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
          swipe · esc to close
        </span>
      </motion.header>

      <motion.div
        className="now-track"
        ref={track}
        aria-roledescription="carousel"
        aria-label="What I'm building now"
        initial={reduce ? false : { opacity: 0, x: 48 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.08 }}
      >
        {slides.map((slide, i) => {
          const active = i === index;
          if (slide.kind === 'end') {
            return (
              <section key="end" className="now-slide now-end" aria-label="Get in touch" aria-hidden={!active}>
                <div className="now-end-inner">
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
                        {shared || 'Share this deck'}
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
                  </div>
                  <figure className="now-qr">
                    <img src="/qr-now.svg" alt={`QR code for ${NOW_URL}`} width="200" height="200" />
                    <figcaption>heyitsbaz.com/now</figcaption>
                  </figure>
                </div>
              </section>
            );
          }
          const { project } = slide;
          const page = projectPage(project);
          const live =
            project.demo ||
            (project.url
              ? {
                  href: project.url,
                  label: project.url.includes('github.com')
                    ? 'View on GitHub'
                    : `Open ${project.url.replace(/^https?:\/\//, '')}`,
                }
              : null);
          const titleProps = page
            ? { as: TransitionLink, to: page }
            : live
              ? { as: 'a', href: live.href, target: '_blank', rel: 'noopener noreferrer' }
              : { as: 'span' };
          const { as: Title, ...titleRest } = titleProps;
          return (
            <section key={project.slug} className="now-slide now-project" aria-label={project.title} aria-hidden={!active}>
              <div className="now-project-inner">
                <div
                  className={`now-media frame${project.imgFit === 'contain' ? ' is-contain' : ''}${
                    project.interactive ? ' is-demo' : ''
                  }`}
                >
                  <Media slide={slide} active={active} reduce={Boolean(reduce)} />
                </div>
                <div className="now-copy">
                  <p className="now-status">{[project.status, project.org, project.tag].filter(Boolean).join(' · ')}</p>
                  <h2>
                    <Title className="now-title" {...titleRest}>
                      {project.title}
                      {Title !== 'span' && <Arrow dir={page ? 'right' : 'up-right'} size={18} />}
                    </Title>
                  </h2>
                  <p className="now-line">{project.line}</p>
                  <p className="now-why">{project.description}</p>
                  <ul className="now-facts">
                    {slide.facts.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                  {live && (
                    <a className="now-cta" href={live.href} target="_blank" rel="noopener noreferrer">
                      <span>{live.label}</span>
                      <Arrow dir="up-right" />
                    </a>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </motion.div>

      <motion.footer
        className="now-controls"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.15 }}
      >
        <button type="button" className="now-arrow" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous">
          <Arrow dir="left" />
        </button>
        <ol className="now-dots" aria-label="Slides">
          {slides.map((slide, i) => (
            <li key={slide.slug || slide.kind}>
              <button
                type="button"
                className={i === index ? 'is-current' : ''}
                aria-label={`Slide ${i + 1} of ${count}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => go(i)}
              />
            </li>
          ))}
        </ol>
        <span className="now-count" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <button type="button" className="now-arrow" onClick={() => go(index + 1)} disabled={index === count - 1} aria-label="Next">
          <Arrow />
        </button>
      </motion.footer>
    </motion.div>
  );
};

export default Deck;
