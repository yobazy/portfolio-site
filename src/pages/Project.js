import { useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import HeroField from '../components/HeroField';
import { getProjectBySlug } from '../data/projects';
import { TransitionLink, useArrival } from '../lib/pageTransition';

const Project = () => {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const reduce = useReducedMotion();
  // Arriving through a page transition already animated the page in.
  const arrived = useArrival();
  const still = reduce || arrived;

  if (!project || !project.hasCaseStudy) {
    return (
      <div className="case-study">
        <div className="case-study-inner">
          <p className="case-study-missing">Project not found.</p>
          <TransitionLink to="/projects" className="post-back">
            Back to development
          </TransitionLink>
        </div>
      </div>
    );
  }

  if (project.kind === 'playground') {
    return (
      <motion.article
        className="case-study playground-page"
        initial={still ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="playground-stage">
          <HeroField reduce={Boolean(reduce)} />
        </div>

        <div className="case-study-inner">
          <TransitionLink to="/projects" className="post-back">
            Back to development
          </TransitionLink>

          <header className="case-study-header">
            <span className="case-study-org">In progress</span>
            <h1 className="page-title">{project.title}</h1>
            <p className="playground-lede">{project.description}</p>
            {project.url && (
              <a
                className="btn-primary playground-cta"
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Try it live at ghosts.fyi
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </header>

          <div className="case-study-body">
            <section>
              <h2>The room</h2>
              <p>{project.caseStudy.problem}</p>
            </section>
            <section>
              <h2>Live and studio</h2>
              <p>{project.caseStudy.built}</p>
            </section>
          </div>

          {project.skills?.length > 0 && (
            <ul className="case-study-stack">
              {project.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          )}
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      className="case-study"
      initial={still ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="case-study-inner">
        <TransitionLink to="/projects" className="post-back">
          Back to development
        </TransitionLink>

        <header className="case-study-header">
          {project.org && <span className="case-study-org">{project.org}</span>}
          <h1 className="page-title">{project.title}</h1>
        </header>

        <div className="case-study-body">
          <section>
            <h2>The problem</h2>
            <p>{project.caseStudy.problem}</p>
          </section>
          <section>
            <h2>What I built</h2>
            <p>{project.caseStudy.built}</p>
          </section>
          {project.caseStudy.outcome && (
            <section>
              <h2>Result</h2>
              <p>{project.caseStudy.outcome}</p>
            </section>
          )}
        </div>

        {project.skills?.length > 0 && (
          <ul className="case-study-stack">
            {project.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
};

export default Project;
