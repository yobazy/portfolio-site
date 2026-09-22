import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import IdentityStrip from '../components/IdentityStrip';
import HeroField from '../components/HeroField';
import ShowcaseGrid from '../components/ShowcaseGrid';
import ShowcaseTile from '../components/ShowcaseTile';
import { featuredProjects } from '../data/projects';
import { featuredMedia } from '../data/mediaItems';

function Home() {
  const reduce = useReducedMotion();
  const playground = featuredProjects.find((project) => project.kind === 'playground');
  const featuredDev = featuredProjects.filter((project) => project.kind !== 'playground');

  return (
    <div className="home-page">
      <IdentityStrip />

      {playground && (
        <section className="showcase-section">
          <div className="showcase-section-head">
            <h2>Visuals</h2>
            <Link to={`/projects/${playground.slug}`} className="showcase-section-link">
              Playground
            </Link>
          </div>
          <ShowcaseGrid variant="home-visuals">
            <ShowcaseTile
              title={playground.title}
              subtitle="In progress"
              line={playground.line}
              field={<HeroField reduce={Boolean(reduce)} />}
              size="large"
              href={`/projects/${playground.slug}`}
            />
          </ShowcaseGrid>
        </section>
      )}

      <section className="showcase-section">
        <div className="showcase-section-head">
          <h2>Development</h2>
          <Link to="/projects" className="showcase-section-link">
            All development
          </Link>
        </div>
        <ShowcaseGrid variant="home-work">
          {featuredDev.map((project) => (
            <ShowcaseTile
              key={project.slug}
              title={project.title}
              subtitle={project.org || project.status}
              line={project.line}
              size={project.featuredSize}
              href={project.hasCaseStudy ? `/projects/${project.slug}` : '/projects'}
            />
          ))}
        </ShowcaseGrid>
      </section>

      <section className="showcase-section">
        <div className="showcase-section-head">
          <h2>Photography</h2>
          <Link to="/media" className="showcase-section-link">
            All media
          </Link>
        </div>
        <ShowcaseGrid variant="home-media">
          {featuredMedia.map((item) => (
            <ShowcaseTile
              key={item.id}
              title={item.title}
              subtitle={item.location}
              img={item.src}
              orientation={item.orientation}
              href="/media"
            />
          ))}
        </ShowcaseGrid>
      </section>

      <motion.section
        className="bio-teaser"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p>
          Senior Software Developer at Metrolinx. I design and build systems for Ontario
          rail, and I make photographs.
        </p>
        <Link to="/about" className="showcase-section-link">
          About
        </Link>
      </motion.section>
    </div>
  );
}

export default Home;
