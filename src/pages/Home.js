import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import IdentityStrip from '../components/IdentityStrip';
import SectionHead, { sectionHeadingId } from '../components/SectionHead';
import ShowcaseTile from '../components/ShowcaseTile';
import ProjectSheet from '../components/ProjectSheet';
import { getProjectBySlug } from '../data/projects';
import { featuredMedia } from '../data/mediaItems';
import { posts } from '../data/posts';

const LEAD = ['nebula-desktop', 'playground-visuals', 'mixvault'];
const AT_WORK = ['360-ops', 'cn-integration', 'urbaneyes'];

const pick = (slugs) => slugs.map(getProjectBySlug).filter(Boolean);

function Home() {
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

  return (
    <div className="home-page">
      <IdentityStrip />

      <section className="home-section" aria-labelledby={sectionHeadingId('/projects')}>
        <SectionHead to="/projects" linkLabel="All development" />

        <div className="home-lead">
          {lead.map((project, i) => (
            <ShowcaseTile
              key={project.slug}
              title={project.title}
              subtitle={project.tag}
              line={project.line}
              img={project.img}
              fit={project.imgFit}
              size={i === 0 ? 'large' : 'default'}
              onClick={() => open(project)}
            />
          ))}
        </div>

        <div className="home-work">
          <span className="home-work-label">At work</span>
          <ul className="home-work-list">
            {atWork.map((project) => (
              <li key={project.slug}>
                <button
                  type="button"
                  className="home-work-row"
                  onClick={() => open(project)}
                >
                  <span className="home-work-title">{project.title}</span>
                  <span className="home-work-line">{project.line}</span>
                  <span className="home-work-org">{project.org}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section" aria-labelledby={sectionHeadingId('/media')}>
        <SectionHead to="/media" linkLabel="All media" />
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
        <div className="home-work">
          <span className="home-work-label">Latest</span>
          <ul className="home-work-list">
            {latest.map((post) => (
              <li key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="home-work-row home-post">
                  <span className="home-work-title">{post.title}</span>
                  <span className="home-work-line">{post.excerpt}</span>
                  <span className="home-post-meta">
                    {post.date} · {post.readTime}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section home-about" aria-labelledby={sectionHeadingId('/about')}>
        <SectionHead to="/about" linkLabel="Read more" />
        <div className="home-about-body">
          <p className="home-about-statement">
            The system doesn't care which layer the problem is on.
          </p>
          <p className="home-about-text">
            I did a Bachelor's and Master's in civil engineering at the University of
            Alberta, then moved into software. Most recently I was a senior developer at
            Metrolinx, working on Azure infrastructure and CN integrations. Before that, two years
            of middleware for ONxpress on a $1.6B rail project, and a port to Next.js
            for a startup in Berkeley. I also shoot photos and video.
          </p>
        </div>
      </section>

      {active && <ProjectSheet project={active} onClose={close} />}
    </div>
  );
}

export default Home;
