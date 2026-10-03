import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGroup, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import ShowcaseGrid from '../components/ShowcaseGrid';
import ShowcaseTile from '../components/ShowcaseTile';
import ProjectSheet from '../components/ProjectSheet';
import WorkFilters from '../components/WorkFilters';
import { projects } from '../data/projects';
import { ARRIVE, DURATION, EASE_PREMIUM } from '../lib/motion';
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

const GLIDE = { duration: DURATION.base, ease: EASE_PREMIUM };
const FIRST_PAINT = new Map();

// Keys of the tiles and headings currently inside the viewport.
const inView = () => {
  const keys = new Set();
  document.querySelectorAll('[data-work-key]').forEach((node) => {
    const { top, bottom } = node.getBoundingClientRect();
    if (bottom > 0 && top < window.innerHeight) keys.add(node.dataset.workKey);
  });
  return keys;
};

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

  const reduce = useReducedMotion();

  // Keys carry the grid a tile sits in, so moving between grids (a lead
  // dropping into the small grid) reads as arriving rather than stretching.
  const onScreen = [
    ...lead.map((project) => `lead:${project.slug}`),
    ...personal.map((project) => `personal:${project.slug}`),
    ...systems.map((project) => `professional:${project.slug}`),
    ...earlier.map((project) => `earlier:${project.slug}`),
    ...(independent.length ? ['section:personal'] : []),
    ...(systems.length ? ['section:professional'] : []),
    ...(earlier.length ? ['section:earlier'] : []),
    ...(shown.length ? [] : ['empty']),
  ];
  const onScreenKey = onScreen.join('|');

  // When the results change, things that were in view glide to their new
  // place; anything new, or arriving from off screen, fades up where it lands
  // instead of flying in from far away. Nothing animates on the first paint.
  // The DOM still holds the previous layout during this render.
  // Plans are built from the last committed screen and cached per change, so
  // a render the router throws away can't leak into the next one.
  const committed = useRef(null);
  const draft = useRef({});
  const base = committed.current;
  let generation = base ? base.generation : FIRST_PAINT;
  if (base && base.key !== onScreenKey && !reduce) {
    const d = draft.current;
    if (d.from !== base.key || d.to !== onScreenKey || d.y !== window.scrollY) {
      const visible = inView();
      const next = new Map(base.generation);
      base.keys.forEach((key) => {
        if (!visible.has(key)) next.set(key, (next.get(key) || 0) + 1);
      });
      draft.current = { from: base.key, to: onScreenKey, y: window.scrollY, generation: next };
    }
    generation = draft.current.generation;
  }
  useLayoutEffect(() => {
    committed.current = { key: onScreenKey, keys: onScreenKey.split('|'), generation };
  }, [onScreenKey, generation]);

  // A new generation remounts the element, so it fades in rather than glides.
  const mountKey = (key) => `${key}~${generation.get(key) || 0}`;
  const settle = (key) => {
    const arriving =
      base &&
      !reduce &&
      (!base.keys.includes(key) || generation.get(key) !== base.generation.get(key));
    return {
      'data-work-key': key,
      layout: 'position',
      layoutId: `work-${mountKey(key)}`,
      // Re-renders for anything else (opening a project) must not re-measure.
      layoutDependency: onScreenKey,
      initial: arriving ? ARRIVE : false,
      animate: { opacity: 1, y: 0 },
      transition: GLIDE,
    };
  };
  const heading = (key, text) => (
    <motion.h2
      key={mountKey(`section:${key}`)}
      id={`work-${key}`}
      {...settle(`section:${key}`)}
    >
      {text}
    </motion.h2>
  );

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
  // Clear all in the empty state unmounts itself; land on the search box instead.
  const focusSearch = useRef(false);
  useLayoutEffect(() => {
    if (!focusSearch.current) return;
    focusSearch.current = false;
    document.querySelector('.work-search')?.focus();
  }, [onScreenKey]);

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
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <div className="gallery-page work-page">
          <header className="gallery-header">
            <h1 className="page-title">Development</h1>
            <p>What I'm building on my own, the systems I've shipped at work, and where it started.</p>
            <WorkFilters
              filters={filters}
              facets={facets}
              sections={[
                ['personal', 'Personal', independent],
                ['professional', 'Professional', systems],
                ['earlier', 'Earlier (Demos)', earlier],
              ]
                .filter(([, , list]) => list.length)
                .map(([key, label, list]) => ({ key, label, count: list.length }))}
              shown={shown.length}
              active={filtered}
              onChange={update}
              onReset={reset}
              flushSearch={flushSearch}
            />
          </header>

          {!shown.length && (
            <motion.div
              key={mountKey('empty')}
              className="gallery-list-block is-first work-empty"
              {...settle('empty')}
            >
              <p>Nothing matches those filters.</p>
              <button
                type="button"
                className="work-filters-reset"
                onClick={() => {
                  focusSearch.current = true;
                  reset();
                }}
              >
                Clear all
              </button>
            </motion.div>
          )}

          {independent.length > 0 && (
            <section className={blockClass('personal')} aria-labelledby="work-personal">
              {heading('personal', 'Personal')}
              {lead.length > 0 && (
                <ShowcaseGrid variant="gallery-lead">
                  {lead.map((project) => (
                    <ShowcaseTile
                      key={mountKey(`lead:${project.slug}`)}
                      title={project.title}
                      subtitle={project.tag}
                      line={project.line}
                      img={project.img}
                      fit={project.imgFit}
                      size="large"
                      onClick={() => open(project)}
                      animation={settle(`lead:${project.slug}`)}
                    />
                  ))}
                </ShowcaseGrid>
              )}
              {personal.length > 0 && (
                <ShowcaseGrid variant="gallery-personal">
                  {personal.map((project) => (
                    <ShowcaseTile
                      key={mountKey(`personal:${project.slug}`)}
                      title={project.title}
                      subtitle={project.tag}
                      line={project.line}
                      img={project.img}
                      fit={project.imgFit}
                      onClick={() => open(project)}
                      animation={settle(`personal:${project.slug}`)}
                    />
                  ))}
                </ShowcaseGrid>
              )}
            </section>
          )}

          {systems.length > 0 && (
            <section className={blockClass('professional')} aria-labelledby="work-professional">
              {heading('professional', 'Professional')}
              <ShowcaseGrid variant="gallery">
                {systems.map((project) => (
                  <ShowcaseTile
                    key={mountKey(`professional:${project.slug}`)}
                    title={project.title}
                    subtitle={project.org}
                    line={project.line}
                    tags={project.skills?.slice(0, 3)}
                    onClick={() => open(project)}
                    animation={settle(`professional:${project.slug}`)}
                  />
                ))}
              </ShowcaseGrid>
            </section>
          )}

          {earlier.length > 0 && (
            <section className={blockClass('earlier', 'is-quiet')} aria-labelledby="work-earlier">
              {heading('earlier', 'Earlier (Demos)')}
              <ShowcaseGrid variant="gallery-earlier">
                {earlier.map((project) => (
                  <ShowcaseTile
                    key={mountKey(`earlier:${project.slug}`)}
                    title={project.title}
                    line={project.line}
                    tags={project.skills?.slice(0, 3)}
                    img={project.img}
                    onClick={() => open(project)}
                    animation={settle(`earlier:${project.slug}`)}
                  />
                ))}
              </ShowcaseGrid>
            </section>
          )}

          {active && <ProjectSheet project={active} onClose={close} />}
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
};

export default Work;
