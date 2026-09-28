import { useRef, useState } from 'react';
import ShowcaseGrid from '../components/ShowcaseGrid';
import ShowcaseTile from '../components/ShowcaseTile';
import ProjectSheet from '../components/ProjectSheet';
import { projectsByCategory, projectsInCategories } from '../data/projects';

const Work = () => {
  const professional = projectsByCategory('professional');
  const client = projectsByCategory('client');
  const independent = projectsInCategories('personal', 'visuals');
  const lead = independent.filter((project) => project.lead);
  const personal = independent.filter((project) => !project.lead);
  const earlier = projectsByCategory('earlier');
  const systems = [...professional, ...client];
  const [active, setActive] = useState(null);
  const opener = useRef(null);

  const open = (project) => {
    opener.current = document.activeElement;
    setActive(project);
  };

  const close = () => {
    setActive(null);
    requestAnimationFrame(() => opener.current?.focus?.());
  };

  return (
    <div className="gallery-page work-page">
      <header className="gallery-header">
        <h1>Development</h1>
        <p>What I'm building on my own, the systems I've shipped at work, and where it started.</p>
      </header>

      <section className="gallery-list-block is-first" aria-labelledby="work-personal">
        <h2 id="work-personal">Personal</h2>
        <ShowcaseGrid variant="gallery-lead">
          {lead.map((project) => (
            <ShowcaseTile
              key={project.slug}
              title={project.title}
              subtitle={project.tag}
              line={project.line}
              img={project.img}
              fit={project.imgFit}
              size="large"
              onClick={() => open(project)}
            />
          ))}
        </ShowcaseGrid>
        <ShowcaseGrid variant="gallery-personal">
          {personal.map((project) => (
            <ShowcaseTile
              key={project.slug}
              title={project.title}
              subtitle={project.tag}
              line={project.line}
              img={project.img}
              fit={project.imgFit}
              onClick={() => open(project)}
            />
          ))}
        </ShowcaseGrid>
      </section>

      <section className="gallery-list-block" aria-labelledby="work-professional">
        <h2 id="work-professional">Professional</h2>
        <ShowcaseGrid variant="gallery">
          {systems.map((project) => (
            <ShowcaseTile
              key={project.slug}
              title={project.title}
              subtitle={project.org}
              line={project.line}
              onClick={() => open(project)}
            />
          ))}
        </ShowcaseGrid>
      </section>

      <section className="gallery-list-block is-quiet" aria-labelledby="work-earlier">
        <h2 id="work-earlier">Earlier</h2>
        <ShowcaseGrid variant="gallery-earlier">
          {earlier.map((project) => (
            <ShowcaseTile
              key={project.slug}
              title={project.title}
              line={project.line}
              img={project.img}
              onClick={() => open(project)}
            />
          ))}
        </ShowcaseGrid>
      </section>

      {active && <ProjectSheet project={active} onClose={close} />}
    </div>
  );
};

export default Work;
