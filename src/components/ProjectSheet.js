import { useEffect, useRef } from 'react';

const linkLabel = (url) => {
  if (!url) return null;
  if (url.includes('github.com')) return 'View on GitHub';
  return 'Open';
};

const ProjectSheet = ({ project, onClose }) => {
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const settle = window.setTimeout(() => {
      if (panelRef.current) panelRef.current.style.animation = 'none';
    }, 500);

    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled])'
      );
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
      window.clearTimeout(settle);
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const kicker = project.status || project.org || project.tag;
  const label = linkLabel(project.url);

  return (
    <div className="project-sheet-root">
      <button
        type="button"
        className="project-sheet-scrim"
        aria-label="Dismiss"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        className="project-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-sheet-title"
      >
        <div className="project-sheet-bar">
          <button ref={closeRef} type="button" className="project-sheet-close" onClick={onClose}>
            Close
          </button>
        </div>

        {project.img && (
          <div className={`project-sheet-media${project.imgFit === 'contain' ? ' is-contain' : ''}`}>
            <img src={project.img} alt="" />
          </div>
        )}

        <div className="project-sheet-body">
          {kicker && <span className="case-study-org">{kicker}</span>}
          <h2 id="project-sheet-title">{project.title}</h2>
          {project.description && <p className="project-sheet-lede">{project.description}</p>}

          {project.url && (
            <a
              className="btn-secondary project-sheet-link"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
              <span aria-hidden="true">↗</span>
            </a>
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
      </aside>
    </div>
  );
};

export default ProjectSheet;
