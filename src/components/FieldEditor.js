import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FILTER_CHOICES, LAYER_CHOICES, SHAPES } from './MembraneField';

// The hero field's edit panel: the shape ghosts cuts around, which of its
// layers and filters are on, how lively it moves, and its colour. Every change
// lands on the field at once. Picking a preset afterwards starts over from it.
const FieldEditor = ({ look, onChange, onReset, onClose }) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const set = (patch) => onChange({ ...look, ...patch });
  const toggle = (key, name) =>
    set({ [key]: look[key].includes(name) ? look[key].filter((n) => n !== name) : [...look[key], name] });

  const close = useRef(onClose);
  close.current = onClose;

  // Focus lands on the panel once, when it opens; Escape closes it.
  useEffect(() => {
    ref.current?.focus();
    const onKey = (event) => event.key === 'Escape' && close.current();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const chips = (key, choices) => (
    <div className="field-editor-chips">
      {choices.map(([name, label]) => (
        <button
          key={name}
          type="button"
          className={`field-editor-chip ${look[key].includes(name) ? 'is-on' : ''}`}
          aria-pressed={look[key].includes(name)}
          onClick={() => toggle(key, name)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const slider = (key, label, min, max, step, disabled = false) => (
    <label className={`field-editor-slider ${disabled ? 'is-off' : ''}`}>
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={look[key]}
        disabled={disabled}
        onChange={(event) => set({ [key]: Number(event.target.value) })}
      />
    </label>
  );

  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      className="field-editor"
      role="dialog"
      aria-label="Edit the field"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: 12, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="field-editor-head">
        <span className="field-editor-title">Edit the field</span>
        <button type="button" className="field-editor-text" onClick={onReset}>
          Reset
        </button>
        <button type="button" className="field-editor-text" onClick={onClose}>
          Done
        </button>
      </header>

      <div className="field-editor-body">
        <section>
          <h3>Shape</h3>
          <div className="field-editor-segments" role="radiogroup" aria-label="Shape">
            {SHAPES.map(([name, label]) => (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={look.shape === name}
                className={`field-editor-chip ${look.shape === name ? 'is-on' : ''}`}
                onClick={() => set({ shape: name })}
              >
                {label}
              </button>
            ))}
          </div>
          {look.shape === 'word' && (
            <label className="field-editor-word">
              <span className="visually-hidden">Your word</span>
              <input
                type="text"
                value={look.word}
                maxLength={14}
                placeholder="Type a word"
                spellCheck="false"
                onChange={(event) => set({ word: event.target.value })}
              />
            </label>
          )}
        </section>

        <section>
          <h3>Layers</h3>
          {chips('layers', LAYER_CHOICES)}
        </section>

        <section>
          <h3>Filters</h3>
          {chips('filters', FILTER_CHOICES)}
          {slider('strength', 'Strength', 0, 1, 0.01, !look.filters.length)}
        </section>

        <section>
          <h3>Motion</h3>
          {slider('energy', 'Energy', 0.3, 1.8, 0.01)}
        </section>

        <section>
          <h3>Colour</h3>
          <div className="field-editor-segments" role="radiogroup" aria-label="Colour">
            {[
              ['tint', 'Periwinkle'],
              ['full', 'Full colour'],
            ].map(([name, label]) => (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={look.colour === name}
                className={`field-editor-chip ${look.colour === name ? 'is-on' : ''}`}
                onClick={() => set({ colour: name })}
              >
                {label}
              </button>
            ))}
          </div>
          {slider('hue', 'Hue', 0, 1, 0.005, look.colour !== 'full')}
        </section>
      </div>
    </motion.div>
  );
};

export default FieldEditor;
