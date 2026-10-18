import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getProjectBySlug } from '../data/projects';

// The projects as an x-ray gallery. Each screenshot floats in a
// computer-vision frame a little larger than itself, with its position read
// out in the corner. Frames drift with the pointer and can be dragged. Where
// one frame passes over another project's picture, that part of the picture
// shows as an x-ray. A tap on a frame selects it; the picture carries a
// layoutId so whatever opens can grow out of it.

export const GALLERY = [
  { slug: 'observatory', x: 0.3, y: 0.4, w: 0.3, z: 1, depth: 0.5 },
  { slug: 'ghosts-playground', x: 0.72, y: 0.28, w: 0.26, z: 4, depth: 1.1 },
  { slug: 'mixvault', x: 0.56, y: 0.66, w: 0.28, z: 2, depth: 0.7 },
  { slug: 'link', x: 0.15, y: 0.72, w: 0.2, z: 5, depth: 1.3 },
  { slug: 'short-turn', x: 0.85, y: 0.7, w: 0.22, z: 3, depth: 0.9 },
];

const PAD = 0.07;
const RATIO = 10 / 16;
const TAP_PX = 6;

const rect = (card, stage) => {
  const scale = stage.w < 700 ? 1.45 : stage.w < 1000 ? 1.25 : 1;
  const w = card.w * stage.w * scale;
  const h = w * RATIO;
  const x = card.x * stage.w - w / 2 + card.dx;
  const y = card.y * stage.h - h / 2 + card.dy;
  const pad = w * PAD;
  return { x, y, w, h, frame: { x: x - pad, y: y - pad, w: w + pad * 2, h: h + pad * 2 } };
};

const overlap = (a, b) => {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const r = Math.min(a.x + a.w, b.x + b.w);
  const btm = Math.min(a.y + a.h, b.y + b.h);
  return r > x && btm > y ? { x, y, w: r - x, h: btm - y } : null;
};

const XrayGallery = ({ cards: initial = GALLERY, selected = null, onSelect, dim = false, className = '' }) => {
  const reduce = useReducedMotion();
  const stageRef = useRef(null);
  const [stage, setStage] = useState({ w: 1200, h: 720 });
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [cards, setCards] = useState(() => initial.map((card) => ({ ...card, dx: 0, dy: 0 })));
  const drag = useRef(null);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return undefined;
    const measure = () => setStage({ w: node.clientWidth, h: node.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) return undefined;
    const onMove = (event) => {
      if (drag.current) return;
      const node = stageRef.current;
      if (!node) return;
      const box = node.getBoundingClientRect();
      setPointer({
        x: ((event.clientX - box.left) / box.width - 0.5) * 2,
        y: ((event.clientY - box.top) / box.height - 0.5) * 2,
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce]);

  const onDown = (event, slug) => {
    if (dim) return;
    const card = cards.find((c) => c.slug === slug);
    drag.current = { slug, startX: event.clientX, startY: event.clientY, dx: card.dx, dy: card.dy, moved: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    setCards((list) => {
      const top = Math.max(...list.map((c) => c.z)) + 1;
      return list.map((c) => (c.slug === slug ? { ...c, z: top } : c));
    });
  };
  const onMove = (event) => {
    const d = drag.current;
    if (!d) return;
    d.moved = Math.max(d.moved, Math.hypot(event.clientX - d.startX, event.clientY - d.startY));
    setCards((list) =>
      list.map((c) =>
        c.slug === d.slug ? { ...c, dx: d.dx + event.clientX - d.startX, dy: d.dy + event.clientY - d.startY } : c
      )
    );
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d && d.moved < TAP_PX) onSelect?.(d.slug);
  };

  const placed = useMemo(() => {
    const amount = Math.min(stage.w, stage.h) * 0.02;
    return cards
      .map((card) => {
        const drift = {
          dx: card.dx + (reduce ? 0 : pointer.x * amount * card.depth),
          dy: card.dy + (reduce ? 0 : pointer.y * amount * card.depth),
        };
        return { ...card, ...rect({ ...card, ...drift }, stage), project: getProjectBySlug(card.slug) };
      })
      .filter((card) => card.project);
  }, [cards, pointer, stage, reduce]);

  return (
    <div
      className={`xray-stage ${dim ? 'is-dim' : ''} ${className}`}
      ref={stageRef}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {placed.map((card, i) => {
        const windows = placed
          .filter((other) => other.z > card.z)
          .map((other) => overlap(other.frame, card))
          .filter(Boolean);
        const cx = (card.x + card.w / 2) / stage.w;
        const cy = (card.y + card.h / 2) / stage.h;
        const open = selected === card.slug;
        return (
          <motion.div
            key={card.slug}
            className={`xray-card ${open ? 'is-open' : ''}`}
            style={{ left: card.frame.x, top: card.frame.y, width: card.frame.w, height: card.frame.h, zIndex: card.z }}
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.05 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            onPointerDown={(event) => onDown(event, card.slug)}
            role="button"
            tabIndex={dim ? -1 : 0}
            aria-label={`${card.project.title}: open`}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect?.(card.slug);
              }
            }}
          >
            <span className="xray-frame" aria-hidden="true">
              <i className="xray-tick is-tl" />
              <i className="xray-tick is-tr" />
              <i className="xray-tick is-bl" />
              <i className="xray-tick is-br" />
            </span>
            <span className="xray-readout" aria-hidden="true">
              X: {cx.toFixed(2)} Y: {cy.toFixed(2)}
            </span>
            {/* While open, the picture lives in the panel; the frame keeps its place. */}
            {!open && (
              <motion.figure
                layoutId={`pic-${card.slug}`}
                className="xray-picture"
                style={{ left: card.x - card.frame.x, top: card.y - card.frame.y, width: card.w, height: card.h }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              >
                <img src={card.project.img} alt="" draggable="false" />
                {windows.map((win, j) => (
                  <img
                    key={j}
                    src={card.project.img}
                    alt=""
                    draggable="false"
                    className="xray-under"
                    style={{
                      clipPath: `inset(${win.y - card.y}px ${card.x + card.w - (win.x + win.w)}px ${
                        card.y + card.h - (win.y + win.h)
                      }px ${win.x - card.x}px)`,
                    }}
                  />
                ))}
                <figcaption>
                  <span>{card.project.title}</span>
                  <small>{card.project.line}</small>
                </figcaption>
              </motion.figure>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default XrayGallery;
