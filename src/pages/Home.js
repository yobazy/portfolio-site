import { useCallback, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { TransitionLink } from '../lib/pageTransition';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import IdentityStrip from '../components/IdentityStrip';
import HeroField from '../components/HeroField';
import SectionHead, { sectionHeadingId } from '../components/SectionHead';
import ShowcaseTile from '../components/ShowcaseTile';
import ProjectSheet from '../components/ProjectSheet';
import Arrow from '../components/Arrow';
import { getProjectBySlug, projectPage } from '../data/projects';
import { featuredMedia } from '../data/mediaItems';
import { posts } from '../data/posts';

const LEAD = ['observatory', 'ghosts-playground', 'mixvault'];
const AT_WORK = ['cn-integration', '360-ops', 'azure-pipelines', 'urbaneyes'];

const pick = (slugs) => slugs.map(getProjectBySlug).filter(Boolean);

function Home() {
  const reduce = useReducedMotion();
  const lead = pick(LEAD);
  const atWork = pick(AT_WORK);
  const photos = featuredMedia.slice(0, 3);
  const latest = posts.slice(0, 3);
  const [active, setActive] = useState(null);
  const [photo, setPhoto] = useState(-1);
  const opener = useRef(null);

  const open = (project) => {
    opener.current = document.activeElement;
    setActive(project);
  };

  const close = useCallback(() => {
    setActive(null);
    requestAnimationFrame(() => opener.current?.focus?.());
  }, []);

  // ghosts-playground's tile runs a small live field instead of a screenshot.
  const liveTile = (project) =>
    project.slug === 'ghosts-playground' ? (
      <HeroField reduce={Boolean(reduce)} intensity={1.1} rosette={0} dprCap={1} className="tile-field" />
    ) : undefined;

  return (
    <div className="home-page">
      <IdentityStrip />

      <section className="home-section" aria-labelledby={sectionHeadingId('/projects')}>
        <SectionHead
          to="/projects"
          linkLabel="All development"
          aside="Three things I'm building on my own right now, and the systems I shipped at work."
        />

        <div className="home-lead">
          {lead.map((project, i) => (
            <ShowcaseTile
              key={project.slug}
              title={project.title}
              subtitle={[project.status, project.tag].filter(Boolean).join(' · ')}
              line={project.line}
              img={project.img}
              field={liveTile(project)}
              fit={project.imgFit}
              size={i === 0 ? 'large' : 'default'}
              href={projectPage(project)}
              onClick={() => open(project)}
            />
          ))}
        </div>

        <div className="home-work">
          <h3 className="home-work-label">At work</h3>
          <ul className="home-work-list">
            {atWork.map((project) => (
              <li key={project.slug}>
                <button type="button" className="home-work-row" onClick={() => open(project)}>
                  <span className="home-work-title">{project.title}</span>
                  <span className="home-work-line">{project.line}</span>
                  <span className="home-work-facts">
                    {(project.facts || project.skills.slice(0, 3)).join(' · ')}
                  </span>
                  <span className="home-work-org">{project.org}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section" aria-labelledby={sectionHeadingId('/media')}>
        <SectionHead to="/media" linkLabel="All media" aside="Ricoh GR IIIx, mostly in canyons." />
        <div className="home-photos">
          {photos.map((item, i) => (
            <ShowcaseTile
              key={item.id}
              title={item.title}
              subtitle={item.location}
              img={item.src}
              onClick={() => setPhoto(i)}
            />
          ))}
        </div>
        <Lightbox
          open={photo >= 0}
          index={photo}
          close={() => setPhoto(-1)}
          slides={photos.map((item) => ({ src: item.src, alt: item.title }))}
        />
      </section>

      <section className="home-section" aria-labelledby={sectionHeadingId('/blog')}>
        <SectionHead to="/blog" linkLabel="All notes" />
        <ul className="home-posts">
          {latest.map((post) => (
            <li key={post.slug}>
              <TransitionLink to={`/blog/${post.slug}`} className="home-post">
                <span className="home-post-meta">
                  {post.date} · {post.readTime}
                </span>
                <span className="home-post-title">{post.title}</span>
                <span className="home-post-excerpt">{post.excerpt}</span>
                <span className="home-post-go" aria-hidden="true">
                  <Arrow />
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section home-about" aria-labelledby={sectionHeadingId('/about')}>
        <SectionHead to="/about" linkLabel="Read more" />
        <div className="home-about-body">
          <p className="home-about-statement">
            The system doesn&rsquo;t care which <em>layer</em> the problem is on.
          </p>
          <div className="home-about-text">
            <p>
              I did a Bachelor&rsquo;s and Master&rsquo;s in civil engineering at the University of
              Alberta, then moved into software. Most recently I was a senior developer at
              Metrolinx, working on Azure infrastructure and the CN integration. Before that, two
              years of middleware for ONxpress on a $1.6B rail project, and a port to Next.js for a
              startup in Berkeley.
            </p>
            <p>
              Outside work I build tools for the things I care about: coding agents, DJing, live
              visuals, plans with friends. I also shoot photos and video.
            </p>
          </div>
        </div>
      </section>

      {active && <ProjectSheet project={active} onClose={close} />}
    </div>
  );
}

export default Home;
