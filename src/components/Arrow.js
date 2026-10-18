// One arrow, one stroke weight, everywhere a link points somewhere.
// `dir` is 'right' (default), 'up-right' for links that leave the site,
// 'left' for back links, 'down' for pull handles.
const ROTATE = { right: 0, 'up-right': -45, down: 90, left: 180, up: -90 };

const Arrow = ({ dir = 'right', size = 14, className = '' }) => (
  <svg
    className={`arrow ${className}`}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={ROTATE[dir] ? { transform: `rotate(${ROTATE[dir]}deg)` } : undefined}
  >
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
  </svg>
);

export default Arrow;
