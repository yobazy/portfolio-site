import ShowcaseGrid from '../components/ShowcaseGrid';
import ShowcaseTile from '../components/ShowcaseTile';
import { projectsByCategory } from '../data/projects';

const Work = () => {
  const professional = projectsByCategory('professional');
  const client = projectsByCategory('client');
  const visuals = projectsByCategory('visuals');
  const personal = projectsByCategory('personal');
  const earlier = projectsByCategory('earlier');
  const systems = [...professional, ...client];

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <h1>Development</h1>
        <p>Systems, products, and client builds.</p>
      </header>

      {visuals.length > 0 && (
        <ShowcaseGrid variant="gallery-visuals">
          {visuals.map((project) => (
            <ShowcaseTile
              key={project.slug}
              title={project.title}
              subtitle="In progress"
              line={project.line}
              img={project.img}
              size="large"
              href={project.url}
            />
          ))}
        </ShowcaseGrid>
      )}

      <ShowcaseGrid variant="gallery">
        {systems.map((project) => (
          <ShowcaseTile
            key={project.slug}
            title={project.title}
            subtitle={project.org}
            line={project.line}
            href={project.hasCaseStudy ? `/projects/${project.slug}` : undefined}
          />
        ))}
      </ShowcaseGrid>

      <section className="gallery-list-block">
        <h2>Personal</h2>
        <ShowcaseGrid variant="gallery-demos">
          {personal.map((project) => (
            <ShowcaseTile
              key={project.slug}
              title={project.title}
              subtitle={project.status}
              line={project.line}
              img={project.img}
              fit={project.imgFit}
            />
          ))}
        </ShowcaseGrid>
      </section>

      <section className="gallery-list-block">
        <h2>Earlier</h2>
        <ShowcaseGrid variant="gallery-demos">
          {earlier.map((project) => (
            <ShowcaseTile
              key={project.slug}
              title={project.title}
              line={project.line}
              img={project.img}
              href={project.url}
            />
          ))}
        </ShowcaseGrid>
      </section>
    </div>
  );
};

export default Work;
