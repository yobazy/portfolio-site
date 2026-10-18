import { useId } from 'react';
import { useReducedMotion } from 'framer-motion';

// A system drawn as nodes and wires, with packets travelling the wires at the
// pace the real system runs. Nodes are placed on a 12-column grid; wires are
// orthogonal paths computed from node positions, so a diagram is data only.
//
//   nodes: [{ id, x, y, w, label, sub, kind: 'org' | 'service' | 'queue' }]
//   edges: [{ from, to, every }]   every = seconds between packets
//   notes: ['20 queues · 10 consumers', ...]
//
// With reduced motion the packets are replaced by arrowheads.

const W = 760;
const H = 340;
const NODE_H = 58;
const CORNER = 8;

const centre = (node) => ({ x: node.x + node.w / 2, y: node.y + NODE_H / 2 });

// Leave the source on its right edge (or left), enter the target on the facing edge.
function wire(from, to) {
  const a = centre(from);
  const b = centre(to);
  const dir = b.x >= a.x ? 1 : -1;
  const x0 = dir > 0 ? from.x + from.w : from.x;
  const x1 = dir > 0 ? to.x : to.x + to.w;
  if (Math.abs(a.y - b.y) < 1) return `M ${x0} ${a.y} H ${x1}`;
  const mid = (x0 + x1) / 2;
  const down = b.y > a.y ? 1 : -1;
  return [
    `M ${x0} ${a.y}`,
    `H ${mid - dir * CORNER}`,
    `Q ${mid} ${a.y} ${mid} ${a.y + down * CORNER}`,
    `V ${b.y - down * CORNER}`,
    `Q ${mid} ${b.y} ${mid + dir * CORNER} ${b.y}`,
    `H ${x1}`,
  ].join(' ');
}

const SystemDiagram = ({ title, nodes, edges, notes = [], description }) => {
  const reduce = useReducedMotion();
  const id = useId();
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));

  return (
    <figure className="sysd">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={`${id}-t ${id}-d`}>
        <title id={`${id}-t`}>{title}</title>
        <desc id={`${id}-d`}>{description}</desc>
        <defs>
          <marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0.5 7 4 0 7.5" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
          </marker>
        </defs>

        {edges.map((edge, i) => {
          const d = wire(byId[edge.from], byId[edge.to]);
          const every = edge.every || 3;
          return (
            <g key={`${edge.from}-${edge.to}`} className="sysd-edge">
              <path d={d} className="sysd-wire" markerEnd={reduce ? `url(#${id}-arrow)` : undefined} />
              {!reduce && (
                <circle r="3" className="sysd-packet">
                  <animateMotion path={d} dur={`${every}s`} begin={`${(i * 0.7) % every}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1" />
                </circle>
              )}
            </g>
          );
        })}

        {nodes.map((node) => (
          <g key={node.id} className={`sysd-node is-${node.kind || 'service'}`} transform={`translate(${node.x} ${node.y})`}>
            <rect width={node.w} height={node.kind === 'org' ? node.h || NODE_H : NODE_H} rx="10" />
            <text x="14" y={node.sub ? 24 : 33} className="sysd-label">
              {node.label}
            </text>
            {node.sub && (
              <text x="14" y="41" className="sysd-sub">
                {node.sub}
              </text>
            )}
          </g>
        ))}

        {notes.map((note, i) => (
          <text key={note} x={16 + i * 250} y={H - 14} className="sysd-note">
            {note}
          </text>
        ))}
      </svg>
    </figure>
  );
};

export default SystemDiagram;

// CN ⇄ Metrolinx: two organizations, five services between them, no shared
// database. Packets run every few seconds in the picture; the real system
// updates every 10 to 30 seconds.
export const CN_DIAGRAM = {
  title: 'CN–Metrolinx integration',
  description:
    'CN publishes live rail events. An ingest service takes them into RabbitMQ, a deliver service hands them to Metrolinx, and the same path runs back the other way. Each organization keeps its own data.',
  nodes: [
    { id: 'cn', x: 16, y: 126, w: 132, kind: 'org', label: 'CN', sub: 'Freight rail network' },
    { id: 'in1', x: 190, y: 44, w: 126, label: 'Ingest', sub: 'CN side' },
    { id: 'mq', x: 296, y: 126, w: 168, kind: 'queue', label: 'RabbitMQ', sub: '20 queues · 10 consumers' },
    { id: 'out1', x: 444, y: 44, w: 126, label: 'Deliver', sub: 'Metrolinx side' },
    { id: 'out2', x: 190, y: 208, w: 126, label: 'Deliver', sub: 'CN side' },
    { id: 'in2', x: 444, y: 208, w: 126, label: 'Ingest', sub: 'Metrolinx side' },
    { id: 'ml', x: 612, y: 126, w: 132, kind: 'org', label: 'Metrolinx', sub: 'GO Transit network' },
  ],
  edges: [
    { from: 'cn', to: 'in1', every: 3 },
    { from: 'in1', to: 'mq', every: 3 },
    { from: 'mq', to: 'out1', every: 3 },
    { from: 'out1', to: 'ml', every: 3 },
    { from: 'ml', to: 'in2', every: 4.5 },
    { from: 'in2', to: 'mq', every: 4.5 },
    { from: 'mq', to: 'out2', every: 4.5 },
    { from: 'out2', to: 'cn', every: 4.5 },
  ],
  notes: ['Updates every 10–30 s', 'No shared database', 'Azure Container Apps'],
};
