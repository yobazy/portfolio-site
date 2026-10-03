import { motion, useReducedMotion } from 'framer-motion';
import portrait from '../assets/img/about.JPG';
import { useArrival } from '../lib/pageTransition';

export const About = () => {
  const reduce = useReducedMotion();
  // Arriving through a page transition already animated the page in.
  const arrived = useArrival();
  const still = reduce || arrived;

  const desc =
    "I'm Bazil, a senior software developer. Most recently I was at Metrolinx, building cloud architecture and CN integrations for Ontario's railway operations. Azure Container Apps, React, Node.js, the whole stack. I got into software after a civil engineering degree (Bachelor's and Master's) at the University of Alberta. Systems thinking from that carried over.";
  const desc2 =
    "Most of my recent work is backend-heavy: Azure infrastructure, API design, C#, and Node.js. Before Metrolinx I spent two years at ONxpress building middleware for a $1.6B rail project, and before that was at a real estate startup in Berkeley porting their app to Next.js. I also shoot photography and video, and I care about how the work looks, not just how it runs.";

  const experience = [
    {
      role: 'Senior Software Developer',
      company: 'Metrolinx',
      period: 'Sept 2025 - May 2026',
      desc: 'Enterprise cloud architecture and CN-Metrolinx integrations. Azure Container Apps, React, Node.js, MongoDB.',
    },
    {
      role: 'Senior DevOps Engineer & Backend Developer',
      company: 'ONxpress Transportation Partners',
      period: 'July 2023 - June 2025',
      desc: 'Azure middleware infrastructure for a $1.6B rail project. C#/.NET, CI/CD pipelines, promoted from Developer.',
    },
    {
      role: 'Full Stack Developer',
      company: 'UrbanEyes Real Estate Technologies',
      period: 'Nov 2022 - July 2023',
      desc: 'Ported the app to Next.js, built map features, deployed to Vercel.',
    },
  ];

  const stack = [
    'React',
    'Node.js',
    'C#',
    'Azure',
    'MongoDB',
    'SQL',
    'Next.js',
    'Python',
    'Docker',
  ];

  return (
    <section className="about about-page">
      <div className="about-page-inner">
        <div className="about-intro">
          <motion.figure
            initial={still ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="about-portrait"
          >
            <img
              src={portrait}
              alt="Bazil Khan sitting on a sandstone boulder in a canyon alcove"
            />
          </motion.figure>

          <motion.div
            initial={still ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="about-content"
          >
            <h1 className="page-title">About</h1>
            <div className="about-text">
              <p>{desc}</p>
              <p>{desc2}</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={still ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="about-experience"
        >
          <h3>Experience</h3>
          <div className="experience-list">
            {experience.map((item) => (
              <div className="experience-item" key={`${item.company}-${item.role}`}>
                <div className="experience-header">
                  <span className="experience-role">{item.role}</span>
                  <span className="experience-period">{item.period}</span>
                </div>
                <div className="experience-company">{item.company}</div>
                <div className="experience-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="about-stack">
          <h3>Stack</h3>
          <ul>
            {stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
