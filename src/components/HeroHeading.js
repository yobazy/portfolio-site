import { useEffect, useRef } from 'react';

// "Hey, it's Baz." set letter by letter, with a swell of weight running
// through it (Instrument Sans is variable, 400 to 700). The pointer, or a
// finger, swells the letters under it too. JS only writes --p (0 to 1) on
// each letter; App.css turns it into weight.

const WORDS = [
  { text: 'Hey,' },
  { text: 'it’s' },
  { text: 'Baz', em: true, tail: '.' },
];

const HeroHeading = ({ reduce = false }) => {
  const ref = useRef(null);

  useEffect(() => {
    const heading = ref.current;
    if (!heading || reduce) return undefined;
    const letters = [...heading.querySelectorAll('.hh-letter')];
    const surface = heading.closest('.hero') || heading;
    const near = letters.map(() => 0);
    const start = performance.now();
    const pointer = { x: 0, y: 0, live: false, last: 0 };
    let frame = 0;

    const onMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.live = true;
      pointer.last = performance.now();
    };
    const onLeave = () => {
      pointer.live = false;
    };

    const tick = (now) => {
      const size = parseFloat(getComputedStyle(heading).fontSize) || 80;
      // A pointer that has gone still for a while lets the wave have it back.
      const idle = !pointer.live || now - pointer.last > 2500;
      const px = idle ? -1e4 : pointer.x;
      const py = idle ? -1e4 : pointer.y;
      const t = (now - start) / 1000;
      const reach = size * 0.9;
      letters.forEach((letter, i) => {
        const r = letter.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height / 2);
        const swell = 0.5 + 0.5 * Math.sin(t * 1.6 - i * 0.55);
        const target = Math.max(Math.exp(-(dx * dx + dy * dy) / (2 * reach * reach)), swell);
        near[i] += (target - near[i]) * 0.14;
        letter.style.setProperty('--p', near[i].toFixed(3));
      });
      frame = requestAnimationFrame(tick);
    };

    surface.addEventListener('pointermove', onMove, { passive: true });
    surface.addEventListener('pointerdown', onMove, { passive: true });
    surface.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      surface.removeEventListener('pointermove', onMove);
      surface.removeEventListener('pointerdown', onMove);
      surface.removeEventListener('pointerleave', onLeave);
      letters.forEach((letter) => letter.style.removeProperty('--p'));
    };
  }, [reduce]);

  let index = 0;
  const spell = (text) =>
    [...text].map((char) => (
      <span key={index++} className="hh-letter">
        {char}
      </span>
    ));

  return (
    <h1 ref={ref} className={`hero-heading ${reduce ? '' : 'is-live'}`} aria-label="Hey, it’s Baz.">
      {WORDS.map((word, w) => (
        <span key={word.text} aria-hidden="true">
          {w > 0 && ' '}
          <span className="hh-word">
            {word.em ? <em>{spell(word.text)}</em> : spell(word.text)}
            {word.tail && spell(word.tail)}
          </span>
        </span>
      ))}
    </h1>
  );
};

export default HeroHeading;
