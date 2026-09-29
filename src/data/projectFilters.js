// Filtering for the Development page. Facets are derived from the project
// data, so a new company or skill shows up in the filters without edits here.

export const TYPES = [
  { key: 'personal', label: 'Personal', categories: ['personal', 'visuals'] },
  { key: 'professional', label: 'Professional', categories: ['professional', 'client'] },
  { key: 'earlier', label: 'Earlier', categories: ['earlier'] },
];

const PARAMS = ['type', 'org', 'tech', 'q'];

// "Personal" is a label on side projects, not a company to filter by.
const companiesOf = (project) =>
  project.org && project.org !== 'Personal' ? [project.org] : [];

const skillsOf = (project) => project.skills || [];

export const typeOf = (project) =>
  TYPES.find((type) => type.categories.includes(project.category))?.key ?? null;

// Symbols carry meaning in tech names (C, C++, C#, .NET), so spell them out
// before stripping punctuation.
export const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/\+/g, '-plus')
    .replace(/#/g, '-sharp')
    .replace(/^\./, 'dot-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Everything a filter pass needs from a project, worked out once per project.
const cache = new WeakMap();
const indexOf = (project) => {
  let entry = cache.get(project);
  if (!entry) {
    entry = {
      type: typeOf(project),
      orgs: companiesOf(project).map(slugify),
      tech: skillsOf(project).map(slugify),
      text: [
        project.title,
        project.org,
        project.tag,
        project.line,
        project.description,
        ...skillsOf(project),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    };
    cache.set(project, entry);
  }
  return entry;
};

export const emptyFilters = { type: null, orgs: [], tech: [], q: '' };

const knownValues = (projects, key) =>
  new Set(projects.flatMap((project) => indexOf(project)[key]));

// Links get shared and hand-edited: fold case, drop duplicates and anything
// that no longer exists in the data.
const cleanList = (values, known) => [
  ...new Set(values.map(slugify).filter((value) => known.has(value))),
];

export const readFilters = (params, projects) => {
  const type = (params.get('type') || '').toLowerCase();
  return {
    type: TYPES.some((t) => t.key === type) ? type : null,
    orgs: cleanList(params.getAll('org'), knownValues(projects, 'orgs')),
    tech: cleanList(params.getAll('tech'), knownValues(projects, 'tech')),
    q: params.get('q') || '',
  };
};

// Keeps any params that aren't ours (utm_* and friends).
export const writeFilters = (current, { type, orgs, tech, q }) => {
  const params = new URLSearchParams(current);
  PARAMS.forEach((key) => params.delete(key));
  if (type) params.set('type', type);
  orgs.forEach((org) => params.append('org', org));
  tech.forEach((skill) => params.append('tech', skill));
  if (q.trim()) params.set('q', q);
  return params;
};

export const hasFilters = ({ type, orgs, tech, q }) =>
  Boolean(type || orgs.length || tech.length || q.trim());

// Each test can be skipped so a facet counts against every filter but its own.
const matches = (project, filters, skip) => {
  const index = indexOf(project);
  if (skip !== 'type' && filters.type && index.type !== filters.type) return false;
  if (skip !== 'orgs' && filters.orgs.length) {
    if (!filters.orgs.some((org) => index.orgs.includes(org))) return false;
  }
  if (skip !== 'tech' && filters.tech.length) {
    if (!filters.tech.some((skill) => index.tech.includes(skill))) return false;
  }
  const q = filters.q.trim().toLowerCase();
  if (q && !index.text.includes(q)) return false;
  return true;
};

export const applyFilters = (projects, filters) =>
  projects.filter((project) => matches(project, filters));

const tally = (projects, valuesOf) => {
  const counts = new Map();
  projects.forEach((project) => {
    valuesOf(project).forEach((label) => {
      const value = slugify(label);
      const entry = counts.get(value) || { value, label, count: 0 };
      entry.count += 1;
      counts.set(value, entry);
    });
  });
  return counts;
};

// Two labels on one slug would merge into a single filter option.
export const warnSlugCollisions = (projects) => {
  if (process.env.NODE_ENV === 'production') return;
  const seen = new Map();
  projects.forEach((project) => {
    [...companiesOf(project), ...skillsOf(project)].forEach((label) => {
      const value = slugify(label);
      const other = seen.get(value);
      if (other && other !== label) {
        // eslint-disable-next-line no-console
        console.warn(`Filter labels "${other}" and "${label}" share the slug "${value}".`);
      }
      seen.set(value, label);
    });
  });
};

// Every option that exists anywhere, with its count under the other filters.
// Selected options stay listed even at zero so they can be unticked.
const facet = (projects, filters, key, valuesOf) => {
  const all = tally(projects, valuesOf);
  const live = tally(
    projects.filter((project) => matches(project, filters, key)),
    valuesOf
  );
  return [...all.values()]
    .map((option) => ({ ...option, count: live.get(option.value)?.count || 0 }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
};

export const buildFacets = (projects, filters) => {
  const typePool = projects.filter((project) => matches(project, filters, 'type'));
  return {
    all: projects.length,
    total: typePool.length,
    types: TYPES.map((type) => ({
      ...type,
      count: typePool.filter((project) => indexOf(project).type === type.key).length,
    })),
    orgs: facet(projects, filters, 'orgs', companiesOf),
    tech: facet(projects, filters, 'tech', skillsOf),
  };
};
