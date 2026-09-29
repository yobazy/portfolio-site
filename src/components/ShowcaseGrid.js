const ShowcaseGrid = ({ children, variant = 'default', className = '' }) => {
  return (
    <div className={`showcase-grid showcase-grid-${variant} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default ShowcaseGrid;
