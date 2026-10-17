import { motion, useReducedMotion } from 'framer-motion';
import portrait from '../assets/img/about.JPG';
import Arrow from './Arrow';
import { TransitionLink, useArrival } from '../lib/pageTransition';
import { getProjectBySlug } from '../data/projects';

// Career facts live here; the home page and the deck quote them, never the
// other way round.
export const experience = [
  {
    role: 'Senior Software Developer',
    company: 'Metrolinx',
    period: 'Sept 2025 – May 2026',
    desc: 'Enterprise cloud architecture and the CN–Metrolinx integration. Azure Container Apps, React, Node.js, MongoDB.',
  },
  {
    role: 'Senior DevOps Engineer & Backend Developer',
    company: 'ONxpress Transportation Partners',
    period: 'July 2023 – June 2025',
    desc: 'Azure middleware infrastructure for a $1.6B rail project. C#/.NET, CI/CD pipelines, promoted from Developer.',
  },
  {
    role: 'Full Stack Developer',
    company: 'UrbanEyes Real Estate Technologies',
    period: 'Nov 2022 – July 2023',
    desc: 'Ported the app to Next.js, built map features, deployed to Vercel.',
  },
];

// The layers Baz has shipped at, bottom to top, each with real work from
// projects.js.
const layers = [
  { name: 'Ground', what: 'Civil engineering, rail as the domain', work: [['Short Turn', 'short-turn'], ['Azure Data Pipelines', 'azure-pipelines']] },
  { name: 'Infrastructure', what: 'Azure, containers, queues, CI/CD', work: [['CN-Metrolinx Integration', 'cn-integration'], ['Azure Data Pipelines', 'azure-pipelines']] },
  { name: 'Data', what: 'Pipelines, models, retrieval', work: [['Short Turn', 'short-turn'], ['Obsidian RAG', 'obsidian-rag'], ['Data Ingestion Pipeline', 'fabric-pipeline']] },
  { name: 'Services', what: 'APIs, daemons, agents and the tools around them', work: [['Observatory', 'observatory'], ['Ableton Helper', 'ableton-helper'], ['BarberBot', 'barberbot']] },
  { name: 'Interface', what: 'Web, desktop and phone apps people live in', work: [['Link', 'link'], ['MixVault', 'mixvault'], ['FrontLeft', 'frontleft'], ['360 Internal Operations', '360-ops']] },
  { name: 'Light', what: 'Shaders, live visuals, photographs', work: [['ghosts-playground', 'ghosts-playground']] },
];

const stack = ['React', 'Node.js', 'C#', 'Azure', 'MongoDB', 'SQL', 'Next.js', 'Python', 'Docker', 'Rust', 'WebGL'];

export const About = () => {
  const reduce = useReducedMotion();
  // Arriving through a page transition already animated the page in.
  const arrived = useArrival();
  const still = reduce || arrived;
  const rise = (delay) => ({
    initial: still ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section className="about about-page">
      <div className="about-page-inner">
        <div className="about-intro">
          <motion.figure {...rise(0)} className="about-portrait frame">
            <img src={portrait} alt="Bazil Khan sitting on a sandstone boulder in a canyon alcove" />
          </motion.figure>

          <motion.div {...rise(0.08)} className="about-content">
            <h1 className="page-title">About</h1>
            <div className="about-text">
              <p>
                I'm Bazil, a senior software developer. Most recently I was at Metrolinx, building
                cloud architecture and CN integrations for Ontario's railway operations. Azure
                Container Apps, React, Node.js, the whole stack. I got into software after a civil
                engineering degree (Bachelor's and Master's) at the University of Alberta. Systems
                thinking from that carried over.
              </p>
              <p>
                Most of my recent work is backend-heavy: Azure infrastructure, API design, C#, and
                Node.js. Before Metrolinx I spent two years at ONxpress building middleware for a
                $1.6B rail project, and before that was at a real estate startup in Berkeley porting
                their app to Next.js. I also shoot photography and video, and I care about how the
                work looks, not just how it runs.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.section {...rise(0.12)} className="about-layers" aria-labelledby="about-layers-title">
          <h2 id="about-layers-title">Layers</h2>
          <p className="about-layers-lede">The layers, top to bottom, and the work at each one.</p>
          <ol className="layer-stack">
            {[...layers].reverse().map((layer, i) => (
              <li key={layer.name} className="layer" style={{ '--i': i }}>
                <span className="layer-name">{layer.name}</span>
                <span className="layer-what">{layer.what}</span>
                <span className="layer-work">
                  {layer.work
                    .filter(([, slug]) => getProjectBySlug(slug))
                    .map(([title, slug], j) => (
                      <span key={slug}>
                        {j > 0 && <span aria-hidden="true"> · </span>}
                        <TransitionLink to={`/projects?q=${encodeURIComponent(title)}`}>{title}</TransitionLink>
                      </span>
                    ))}
                </span>
              </li>
            ))}
          </ol>
        </motion.section>

        <motion.section {...rise(0.14)} className="about-experience" aria-labelledby="about-experience-title">
          <h2 id="about-experience-title">Experience</h2>
          <ol className="experience-list">
            {experience.map((item) => (
              <li className="experience-item" key={`${item.company}-${item.role}`}>
                <span className="experience-period">{item.period}</span>
                <span className="experience-main">
                  <span className="experience-role">{item.role}</span>
                  <span className="experience-company">{item.company}</span>
                </span>
                <span className="experience-desc">{item.desc}</span>
              </li>
            ))}
          </ol>
        </motion.section>

        <section className="about-stack" aria-labelledby="about-stack-title">
          <h2 id="about-stack-title">Stack</h2>
          <ul>
            {stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <TransitionLink to="/now" className="about-now">
            <span>What I&rsquo;m building now</span>
            <Arrow />
          </TransitionLink>
        </section>
      </div>
    </section>
  );
};
