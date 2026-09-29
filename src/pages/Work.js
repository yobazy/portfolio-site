import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ShowcaseGrid from '../components/ShowcaseGrid';
import ShowcaseTile from '../components/ShowcaseTile';
import ProjectSheet from '../components/ProjectSheet';
import WorkFilters from '../components/WorkFilters';
import { projects } from '../data/projects';
import {
  applyFilters,
  buildFacets,
  emptyFilters,
  hasFilters,
  readFilters,
  typeOf,
  warnSlugCollisions,
  writeFilters,
} from '../data/projectFilters';

warnSlugCollisions(projects);

const Work = () => {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params, projects), [params]);
  const facets = useMemo(() => buildFacets(projects, filters), [filters]);
  const shown = useMemo(() => applyFilters(projects, filters), [filters]);
  const filtered = hasFilters(filters);

  const independent = shown.filter((project) => typeOf(project) === 'personal');
  // A lone lead tile would sit half-width beside an empty column, so it joins the grid.
  const leads = independent.filter((project) => project.lead);
  const lead = leads.length > 1 ? leads : [];
  const personal = independent.filter((project) => !lead.includes(project));
  const systems = shown.filter((project) => typeOf(project) === 'professional');
  const earlier = shown.filter((project) => typeOf(project) === 'earlier');
  const [active, setActive] = useState(null);

  // The first visible section sits tight under the filter bar.
  const firstSection = [
    ['personal', independent],
    ['professional', systems],
    ['earlier', earlier],
  ].find(([, list]) => list.length)?.[0];
  const blockClass = (key, extra) =>
    ['gallery-list-block', key === firstSection ? 'is-first' : '', extra]
      .filter(Boolean)
      .join(' ');

  // Router state lags the address bar while a navigation transition is pending,
  // and search writes land after a debounce, so build on the live URL.
  const currentParams = () => new URLSearchParams(window.location.search);
  // Set by the search box: lands a pending search before any other change.
  const flushSearch = useRef(() => {});

  // Typing replaces the history entry; ticks and tabs push one so Back undoes them.
  const update = (patch) => {
    if (!('q' in patch)) flushSearch.current();
    const current = currentParams();
    setParams(writeFilters(current, { ...readFilters(current, projects), ...patch }), {
      replace: Object.keys(patch).every((key) => key === 'q'),
    });
  };
  const reset = () => {
    flushSearch.current();
    setParams(writeFilters(currentParams(), emptyFilters));
  };
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
        <WorkFilters
          filters={filters}
          facets={facets}
          shown={shown.length}
          active={filtered}
          onChange={update}
          onReset={reset}
          flushSearch={flushSearch}
        />
      </header>

      {!shown.length && (
        <div className="gallery-list-block is-first work-empty">
          <p>Nothing matches those filters.</p>
          <button type="button" className="work-filters-reset" onClick={reset}>
            Clear all
          </button>
        </div>
      )}

      {independent.length > 0 && (
        <section className={blockClass('personal')} aria-labelledby="work-personal">
          <h2 id="work-personal">Personal</h2>
          {lead.length > 0 && (
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
          )}
          {personal.length > 0 && (
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
          )}
        </section>
      )}

      {systems.length > 0 && (
        <section className={blockClass('professional')} aria-labelledby="work-professional">
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
      )}

      {earlier.length > 0 && (
        <section className={blockClass('earlier', 'is-quiet')} aria-labelledby="work-earlier">
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
      )}

      {active && <ProjectSheet project={active} onClose={close} />}
    </div>
  );
};

export default Work;
