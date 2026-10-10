// Filtering for the Development page: kind, tech and free-text search. The
// tech facet is derived from the project data, so a new skill shows up without
// edits here. Types group the page into sections; they aren't a filter.

export const TYPES = [
  { key: 'personal', label: 'Personal', categories: ['personal', 'visuals'] },
  { key: 'professional', label: 'Professional', categories: ['professional', 'client'] },
  { key: 'earlier', label: 'Earlier (Demos)', categories: ['earlier'] },
];

// What a project is, as opposed to what it's built with. Listed in this order.
export const KINDS = [
  { key: 'web', label: 'Web apps' },
  { key: 'apps', label: 'Desktop & mobile' },
  { key: 'ai', label: 'AI & automation' },
  { key: 'data', label: 'Data & infrastructure' },
];

// `type` and `org` were filters once; old links drop them on the next change.
const PARAMS = ['type', 'org', 'kind', 'tech', 'q'];

const skillsOf = (project) => project.skills || [];

const kindsOf = (project) =>
  KINDS.filter((kind) => kind.key === project.kind).map((kind) => kind.label);

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
      kind: kindsOf(project).map(slugify),
      tech: skillsOf(project).map(slugify),
      text: [
        project.title,
        ...kindsOf(project),
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

export const emptyFilters = { kind: [], tech: [], q: '' };

const knownValues = (projects, key) =>
  new Set(projects.flatMap((project) => indexOf(project)[key]));

// Links get shared and hand-edited: fold case, drop duplicates and anything
// that no longer exists in the data.
const cleanList = (values, known) => [
  ...new Set(values.map(slugify).filter((value) => known.has(value))),
];

export const readFilters = (params, projects) => ({
  kind: cleanList(params.getAll('kind'), knownValues(projects, 'kind')),
  tech: cleanList(params.getAll('tech'), knownValues(projects, 'tech')),
  q: params.get('q') || '',
});

// Keeps any params that aren't ours (utm_* and friends).
export const writeFilters = (current, { kind, tech, q }) => {
  const params = new URLSearchParams(current);
  PARAMS.forEach((key) => params.delete(key));
  kind.forEach((value) => params.append('kind', value));
  tech.forEach((skill) => params.append('tech', skill));
  if (q.trim()) params.set('q', q);
  return params;
};

export const hasFilters = ({ kind, tech, q }) =>
  Boolean(kind.length || tech.length || q.trim());

// Each test can be skipped so a facet counts against every filter but its own.
const matches = (project, filters, skip) => {
  const index = indexOf(project);
  if (skip !== 'kind' && filters.kind.length) {
    if (!filters.kind.some((value) => index.kind.includes(value))) return false;
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
    skillsOf(project).forEach((label) => {
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
// Options sort by how many projects they'd show, unless `order` fixes them.
const facet = (projects, filters, key, valuesOf, order) => {
  const all = tally(projects, valuesOf);
  const live = tally(
    projects.filter((project) => matches(project, filters, key)),
    valuesOf
  );
  return [...all.values()]
    .map((option) => ({ ...option, count: live.get(option.value)?.count || 0 }))
    .sort((a, b) =>
      order
        ? order.indexOf(a.label) - order.indexOf(b.label)
        : b.count - a.count || a.label.localeCompare(b.label)
    );
};

export const buildFacets = (projects, filters) => ({
  all: projects.length,
  kind: facet(projects, filters, 'kind', kindsOf, KINDS.map((kind) => kind.label)),
  tech: facet(projects, filters, 'tech', skillsOf),
});
