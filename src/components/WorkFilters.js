import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { DURATION, EASE_PREMIUM } from '../lib/motion';

// The pressed tab's fill slides between tabs rather than jumping. It only
// re-measures when the pressed tab changes, not when the page re-renders.
const Pill = ({ on, pressed }) =>
  on ? (
    <motion.span
      className="work-type-pill"
      layoutId="work-type-pill"
      layoutDependency={pressed}
      transition={{ duration: DURATION.base, ease: EASE_PREMIUM }}
      aria-hidden="true"
    />
  ) : null;

// Past this many options, ones with nothing left to show fold away.
const LONG_LIST = 12;

// On touch screens, focusing the search box raises a keyboard over the list.
const coarsePointer = () => window.matchMedia?.('(pointer: coarse)').matches;

// A searchable, scrollable checklist behind a button, so the bar stays one row
// whether there are three companies or fifty.
const FacetMenu = ({ label, plural, options, selected, onToggle, onClear }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  // Selections are pinned to the top as of opening, so ticking doesn't reshuffle the list.
  const [pinned, setPinned] = useState([]);
  // Anything ticked or unticked while open stays listed, so focus never lands on a removed row.
  const [touched, setTouched] = useState([]);
  const root = useRef(null);
  const trigger = useRef(null);
  const search = useRef(null);
  const list = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    if (!coarsePointer()) search.current?.focus();
    const onDown = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const toggleOpen = () => {
    if (!open) {
      setPinned(selected);
      setTouched([]);
      setQuery('');
      setShowAll(false);
    }
    setOpen(!open);
  };

  const close = (refocus) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };

  const needle = query.trim().toLowerCase();
  const ordered = [
    ...options.filter((option) => pinned.includes(option.value)),
    ...options.filter((option) => !pinned.includes(option.value)),
  ];
  const searched = needle
    ? ordered.filter((option) => option.label.toLowerCase().includes(needle))
    : ordered;
  const folds = !needle && !showAll && options.length > LONG_LIST;
  const visible = folds
    ? searched.filter(
        (option) =>
          option.count ||
          selected.includes(option.value) ||
          pinned.includes(option.value) ||
          touched.includes(option.value)
      )
    : searched;
  const hidden = searched.length - visible.length;

  const toggle = (value) => {
    setTouched((list) => (list.includes(value) ? list : [...list, value]));
    onToggle(value);
  };

  // Footer buttons unmount themselves; keep focus in the panel without raising a phone keyboard.
  const refocus = () => (coarsePointer() ? trigger : search).current?.focus();

  const boxes = () => [...(list.current?.querySelectorAll('input[type="checkbox"]') || [])];

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      close(true);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const stops = [trigger.current, search.current, ...boxes()];
    const at = stops.indexOf(document.activeElement);
    if (at === -1) return;
    event.preventDefault();
    const next = event.key === 'ArrowDown' ? Math.min(at + 1, stops.length - 1) : Math.max(at - 1, 0);
    stops[next].focus();
  };

  const onSearchKey = (event) => {
    if (event.key === 'Enter' && needle && visible.length) {
      event.preventDefault();
      toggle(visible[0].value);
    }
  };

  // Tabbing away closes the panel. A null relatedTarget is a click on something
  // unfocusable, which the mousedown listener already handles.
  const onBlur = (event) => {
    if (open && event.relatedTarget && !root.current?.contains(event.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div className="work-facet" ref={root} onKeyDown={open ? onKeyDown : undefined} onBlur={onBlur}>
      <button
        type="button"
        ref={trigger}
        className={`work-facet-trigger${selected.length ? ' is-active' : ''}`}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={toggleOpen}
      >
        {label}
        {selected.length > 0 && (
          <span className="work-facet-badge">
            {selected.length}
            <span className="visually-hidden"> selected</span>
          </span>
        )}
        <span className="work-facet-caret" aria-hidden="true" />
      </button>

      {open && (
        <div className="work-facet-panel" id={panelId} role="group" aria-label={`Filter by ${label.toLowerCase()}`}>
          <input
            ref={search}
            type="search"
            className="work-facet-search"
            placeholder={`Search ${options.length} ${plural}`}
            aria-label={`Search ${plural}`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onSearchKey}
          />
          <ul className="work-facet-list" ref={list}>
            {visible.map((option) => {
              const checked = selected.includes(option.value);
              return (
                <li key={option.value}>
                  <label className={`work-facet-option${!option.count && !checked ? ' is-empty' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(option.value)}
                    />
                    <span className="work-facet-name">{option.label}</span>
                    <span className="work-facet-count">{option.count}</span>
                  </label>
                </li>
              );
            })}
            {!visible.length && <li className="work-facet-none">No {plural} match “{query}”.</li>}
          </ul>
          {(hidden > 0 || selected.length > 0) && (
            <div className="work-facet-foot">
              {hidden > 0 && (
                <button
                  type="button"
                  className="work-facet-clear"
                  onClick={() => {
                    setShowAll(true);
                    refocus();
                  }}
                >
                  {hidden} more with no matches
                </button>
              )}
              {selected.length > 0 && (
                <button
                  type="button"
                  className="work-facet-clear"
                  onClick={() => {
                    onClear();
                    refocus();
                  }}
                >
                  Clear {plural}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// The box keeps its own text and writes to the URL after a pause. Reading it
// back from the URL on every keystroke drops characters when typing fast.
const SearchBox = ({ value, onChange, flushRef }) => {
  const [text, setText] = useState(value);
  const sent = useRef(value);
  const timer = useRef(null);

  useEffect(() => {
    if (value === sent.current) return;
    // Changed from outside (a chip, Clear all, Back): take the URL's value.
    window.clearTimeout(timer.current);
    timer.current = null;
    sent.current = value;
    setText(value);
  }, [value]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // The URL drops whitespace-only queries, so remember those as empty.
  const send = (next) => {
    timer.current = null;
    sent.current = next.trim() ? next : '';
    onChange(next);
  };

  // Lets another filter change land a pending search first, as its own history entry.
  flushRef.current = () => {
    if (timer.current === null) return;
    window.clearTimeout(timer.current);
    send(text);
  };

  const onInput = (event) => {
    const next = event.target.value;
    setText(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => send(next), 200);
  };

  return (
    <input
      type="search"
      className="work-search"
      placeholder="Search projects"
      aria-label="Search projects"
      value={text}
      onChange={onInput}
    />
  );
};

const WorkFilters = ({ filters, facets, shown, onChange, onReset, active, flushSearch }) => {
  const root = useRef(null);
  // Removing a chip unmounts the focused button: once the chips re-render, move
  // to the one that took its place, or back to search when none are left. The
  // router commits URL changes in a transition, so this waits for the render
  // rather than a frame.
  const chipFocus = useRef(null);
  const refocusChip = (index) => {
    chipFocus.current = index;
  };

  const toggle = (key, value) => {
    const list = filters[key];
    onChange({
      [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
    });
  };

  const labelFor = (options, value) =>
    options.find((option) => option.value === value)?.label || value;

  const typeLabel = facets.types.find((type) => type.key === filters.type)?.label;
  const q = filters.q.trim();

  const chips = [
    typeLabel && { key: 'type', text: typeLabel, remove: () => onChange({ type: null }) },
    ...filters.orgs.map((value) => ({
      key: `org-${value}`,
      text: labelFor(facets.orgs, value),
      remove: () => toggle('orgs', value),
    })),
    ...filters.tech.map((value) => ({
      key: `tech-${value}`,
      text: labelFor(facets.tech, value),
      remove: () => toggle('tech', value),
    })),
    q && { key: 'q', text: `“${q}”`, remove: () => onChange({ q: '' }) },
  ].filter(Boolean);

  // While the row closes it keeps showing what was cleared, rather than
  // emptying first and then collapsing. Those leftovers can't be reached.
  const count = `${shown} of ${facets.all} projects`;
  const last = useRef({ chips, count });
  useLayoutEffect(() => {
    if (active) last.current = { chips, count };
  });
  const shownChips = active ? chips : last.current.chips;

  const chipKeys = chips.map((chip) => chip.key).join('|');
  // Before paint, so focus never falls to the page while the chips go inert.
  useLayoutEffect(() => {
    if (chipFocus.current === null) return;
    const index = chipFocus.current;
    chipFocus.current = null;
    const buttons = (active && root.current?.querySelectorAll('.work-chip')) || [];
    const next = buttons[Math.min(index, buttons.length - 1)] || root.current?.querySelector('.work-search');
    next?.focus();
  }, [chipKeys, active]);

  // On narrow screens the tabs scroll sideways; keep the pressed one in view.
  // Sideways only, and clear of the fade at the strip's right edge.
  const pressType = (event, type) => {
    const tab = event.currentTarget;
    const strip = tab.parentElement;
    if (strip.scrollWidth > strip.clientWidth) {
      const fade = 32;
      const t = tab.getBoundingClientRect();
      const s = strip.getBoundingClientRect();
      if (t.left < s.left) strip.scrollLeft -= s.left - t.left;
      else if (t.right > s.right - fade) strip.scrollLeft += t.right - (s.right - fade);
    }
    onChange({ type });
  };

  return (
    <div className="work-filters" ref={root}>
      <div className="work-filters-row">
        <div className="work-types" role="group" aria-label="Project type">
          <button
            type="button"
            className="work-type"
            aria-pressed={!filters.type}
            onClick={(event) => pressType(event, null)}
          >
            <Pill on={!filters.type} pressed={filters.type} />
            All <span className="work-type-count">{facets.total}</span>
          </button>
          {facets.types.map((type) => (
            <button
              key={type.key}
              type="button"
              className="work-type"
              aria-pressed={filters.type === type.key}
              disabled={!type.count && filters.type !== type.key}
              onClick={(event) => pressType(event, filters.type === type.key ? null : type.key)}
            >
              <Pill on={filters.type === type.key} pressed={filters.type} />
              {type.label} <span className="work-type-count">{type.count}</span>
            </button>
          ))}
        </div>

        <div className="work-filters-tools">
          <FacetMenu
            label="Company"
            plural="companies"
            options={facets.orgs}
            selected={filters.orgs}
            onToggle={(value) => toggle('orgs', value)}
            onClear={() => onChange({ orgs: [] })}
          />
          <FacetMenu
            label="Tech"
            plural="technologies"
            options={facets.tech}
            selected={filters.tech}
            onToggle={(value) => toggle('tech', value)}
            onClear={() => onChange({ tech: [] })}
          />
          <SearchBox value={filters.q} onChange={(q) => onChange({ q })} flushRef={flushSearch} />
        </div>
      </div>

      {/* Always mounted so screen readers hear the first change. It opens and
          closes by animating its row height, so the results below slide rather
          than jump. */}
      <div className={`work-filters-reveal${active ? ' is-open' : ''}`}>
        <div className="work-filters-clip">
          <div className="work-filters-status">
            <p className="visually-hidden" aria-live="polite">
              {count}
            </p>
            {/* Holds its last text while the row closes, like the chips. */}
            <p className="work-filters-count" aria-hidden="true">
              {active ? count : last.current.count}
            </p>
            <span className="work-filters-chips" inert={active ? undefined : ''}>
              {shownChips.map((chip, index) => (
                <button
                  key={chip.key}
                  type="button"
                  className="work-chip"
                  onClick={() => {
                    chip.remove();
                    refocusChip(index);
                  }}
                  aria-label={`Remove ${chip.text}`}
                >
                  {chip.text}
                  <span aria-hidden="true">×</span>
                </button>
              ))}
              <button
                type="button"
                className="work-filters-reset"
                onClick={() => {
                  onReset();
                  refocusChip(0);
                }}
              >
                Clear all
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkFilters;
