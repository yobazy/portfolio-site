// The leopard rosette from the wordmark: a thick ring broken into three spots.
// Drawn once here so the nav, dock and pitch deck share the same mark.
const Rosette = ({ size = 14, className = '', title }) => (
  <svg
    className={`rosette ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden={title ? undefined : 'true'}
    role={title ? 'img' : undefined}
  >
    {title && <title>{title}</title>}
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3.6">
      <path d="M6.2 7.4a7.2 7.2 0 0 1 9.9-1.6" />
      <path d="M19 9.6a7.2 7.2 0 0 1-1.9 9.4" />
      <path d="M12.6 19.1a7.2 7.2 0 0 1-7.4-6.3" />
    </g>
  </svg>
);

export default Rosette;
