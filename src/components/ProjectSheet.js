import { useEffect, useRef, useState } from 'react';
import { motion, useDragControls, useReducedMotion } from 'framer-motion';
import Arrow from './Arrow';

const linkLabel = (url) => {
  if (!url) return null;
  if (url.includes('github.com')) return 'View on GitHub';
  return 'Open';
};

const PHONE = '(max-width: 768px)';

const usePhone = () => {
  const [phone, setPhone] = useState(() => window.matchMedia(PHONE).matches);
  useEffect(() => {
    const query = window.matchMedia(PHONE);
    const onChange = () => setPhone(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return phone;
};

// A project's details. On a laptop it slides in from the right; on a phone it
// rises as a bottom sheet with a handle you can pull down to dismiss.
const ProjectSheet = ({ project, onClose }) => {
  const closeRef = useRef(null);
  const panelRef = useRef(null);
  const phone = usePhone();
  const reduce = useReducedMotion();
  const controls = useDragControls();
  const [closing, setClosing] = useState(false);

  const dismiss = () => {
    if (reduce) onClose();
    else setClosing(true);
  };

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') {
        dismiss();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll('a[href], button:not([disabled])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kicker = [project.status, project.org, project.tag].filter(Boolean).join(' · ');
  const label = linkLabel(project.url);

  const offscreen = phone ? { y: '100%' } : { x: '100%' };
  const spring = { type: 'spring', stiffness: 300, damping: 34, mass: 0.9 };

  return (
    <div className={`project-sheet-root ${phone ? 'is-phone' : ''}`}>
      <motion.button
        type="button"
        className="project-sheet-scrim"
        aria-label="Dismiss"
        onClick={dismiss}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: 0.35 }}
      />
      <motion.aside
        ref={panelRef}
        className="project-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-sheet-title"
        initial={reduce ? false : offscreen}
        animate={closing ? offscreen : { x: 0, y: 0 }}
        transition={reduce ? { duration: 0 } : spring}
        onAnimationComplete={() => closing && onClose()}
        drag={phone && !reduce ? 'y' : false}
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(event, info) => {
          if (info.offset.y > 110 || info.velocity.y > 700) setClosing(true);
        }}
      >
        <div
          className="project-sheet-bar"
          onPointerDown={phone ? (event) => controls.start(event) : undefined}
          style={phone ? { touchAction: 'none' } : undefined}
        >
          {phone && <span className="project-sheet-handle" aria-hidden="true" />}
          <button ref={closeRef} type="button" className="project-sheet-close" onClick={dismiss}>
            Close
          </button>
        </div>

        {project.img && (
          <div className={`project-sheet-media frame${project.imgFit === 'contain' ? ' is-contain' : ''}`}>
            <img src={project.img} alt="" />
          </div>
        )}

        <div className="project-sheet-body">
          {kicker && <p className="project-sheet-kicker">{kicker}</p>}
          <h2 id="project-sheet-title">{project.title}</h2>
          {project.description && <p className="project-sheet-lede">{project.description}</p>}

          {(project.demo || project.url) && (
            <div className="project-sheet-links">
              {project.demo && (
                <a className="btn-primary" href={project.demo.href} target="_blank" rel="noopener noreferrer">
                  <span>{project.demo.label}</span>
                  <Arrow dir="up-right" />
                </a>
              )}
              {project.url && (
                <a className="btn-secondary" href={project.url} target="_blank" rel="noopener noreferrer">
                  <span>{label}</span>
                  <Arrow dir="up-right" />
                </a>
              )}
            </div>
          )}

          {project.facts?.length > 0 && (
            <ul className="project-sheet-facts">
              {project.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          )}

          {project.gallery?.length > 0 && (
            <div className="project-sheet-gallery">
              {project.gallery.map((shot) => (
                <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" />
              ))}
            </div>
          )}

          {project.caseStudy && (
            <div className="case-study-body">
              <section>
                <h3>The problem</h3>
                <p>{project.caseStudy.problem}</p>
              </section>
              <section>
                <h3>What I built</h3>
                <p>{project.caseStudy.built}</p>
              </section>
              {project.caseStudy.outcome && (
                <section>
                  <h3>Result</h3>
                  <p>{project.caseStudy.outcome}</p>
                </section>
              )}
            </div>
          )}

          {project.skills?.length > 0 && (
            <ul className="case-study-stack">
              {project.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          )}
        </div>
      </motion.aside>
    </div>
  );
};

export default ProjectSheet;
