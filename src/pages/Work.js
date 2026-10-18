import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGroup, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import ShowcaseGrid from '../components/ShowcaseGrid';
import ShowcaseTile from '../components/ShowcaseTile';
import ProjectSheet from '../components/ProjectSheet';
import WorkFilters from '../components/WorkFilters';
import { projectPage, projects } from '../data/projects';
import { ARRIVE, DURATION, EASE_PREMIUM } from '../lib/motion';
import {
  KINDS,
  TYPES,
  applyFilters,
  buildFacets,
  emptyFilters,
  hasFilters,
  readFilters,
  typeLabel,
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

  // Grouped by what a project is (web app, desktop or mobile, AI, data), with
  // personal work first in each group, then the day job, then the early demos.
  const rank = (project) => TYPES.findIndex((type) => type.key === typeOf(project));
  const groups = KINDS.map((kind) => {
    const list = shown
      .filter((project) => project.kind === kind.key)
      .sort((a, b) => rank(a) - rank(b) || Number(Boolean(b.lead)) - Number(Boolean(a.lead)));
    return {
      ...kind,
      pictures: list.filter((project) => project.img),
      notes: list.filter((project) => !project.img),
      count: list.length,
    };
  }).filter((group) => group.count);
  const [active, setActive] = useState(null);

  const reduce = useReducedMotion();

  // Keys carry the grid a tile sits in, so moving between grids reads as
  // arriving rather than stretching.
  const onScreen = [
    ...groups.flatMap((group) => [
      ...group.pictures.map((project) => `${group.key}:${project.slug}`),
      ...group.notes.map((project) => `${group.key}-note:${project.slug}`),
      `section:${group.key}`,
    ]),
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
  const firstSection = groups[0]?.key;
  const blockClass = (key) =>
    ['gallery-list-block', key === firstSection ? 'is-first' : ''].filter(Boolean).join(' ');

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
            <p>Grouped by what each thing is. Personal work first, then the day job, then where it started.</p>
            <WorkFilters
              filters={filters}
              facets={facets}
              sections={groups.map((group) => ({ key: group.key, label: group.label, count: group.count }))}
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

          {groups.map((group) => (
            <section key={group.key} className={blockClass(group.key)} aria-labelledby={`work-${group.key}`}>
              {heading(group.key, group.label)}
              {group.pictures.length > 0 && (
                <ShowcaseGrid variant="gallery-personal">
                  {group.pictures.map((project) => (
                    <ShowcaseTile
                      key={mountKey(`${group.key}:${project.slug}`)}
                      title={project.title}
                      subtitle={[typeLabel(project), project.tag || project.org].filter(Boolean).join(' · ')}
                      line={project.line}
                      img={project.img}
                      fit={project.imgFit}
                      href={projectPage(project)}
                      onClick={() => open(project)}
                      animation={settle(`${group.key}:${project.slug}`)}
                    />
                  ))}
                </ShowcaseGrid>
              )}
              {group.notes.length > 0 && (
                <ShowcaseGrid variant="gallery">
                  {group.notes.map((project) => (
                    <ShowcaseTile
                      key={mountKey(`${group.key}-note:${project.slug}`)}
                      title={project.title}
                      subtitle={[typeLabel(project), project.org].filter(Boolean).join(' · ')}
                      line={project.line}
                      tags={project.skills?.slice(0, 3)}
                      onClick={() => open(project)}
                      animation={settle(`${group.key}-note:${project.slug}`)}
                    />
                  ))}
                </ShowcaseGrid>
              )}
            </section>
          ))}

          {active && <ProjectSheet project={active} onClose={close} />}
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
};

export default Work;
