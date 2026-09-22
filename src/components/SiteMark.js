import { Link, useLocation } from 'react-router-dom';

const SiteMark = () => {
  const { pathname } = useLocation();

  if (pathname !== '/') return null;

  return (
    <Link to="/" className="site-mark">
      Hey, it's Baz.
    </Link>
  );
};

export default SiteMark;
