import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';

export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';

  const isActive = (path) => {
    if (path === '/projects') {
      return location.pathname === '/projects' || location.pathname.startsWith('/projects/');
    }
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${scrolled || !isHome ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {isHome ? (
          <span className="navbar-spacer" aria-hidden="true" />
        ) : (
          <Link to="/" className="navbar-logo">
            Hey, it's Baz.
          </Link>
        )}
        <button
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-content ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <Link to="/projects" className={isActive('/projects') ? 'active' : ''}>
              Development
            </Link>
            <Link to="/media" className={isActive('/media') ? 'active' : ''}>
              Media
            </Link>
            <Link to="/blog" className={isActive('/blog') ? 'active' : ''}>
              Blog
            </Link>
            <Link to="/about" className={isActive('/about') ? 'active' : ''}>
              About
            </Link>
          </div>

          <div className="social-icons-container mobile-only">
            <a
              href="https://www.linkedin.com/in/bazilkhan"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
            >
              <img src={navIcon1} alt="LinkedIn" className="social-icon-img" />
            </a>
            <a
              href="https://github.com/yobazy"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
            >
              <img src={navIcon2} alt="GitHub" className="social-icon-img" />
            </a>
          </div>
        </div>

        <div className="social-icons-container desktop-only">
          <a
            href="https://www.linkedin.com/in/bazilkhan"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
          >
            <img src={navIcon1} alt="LinkedIn" className="social-icon-img" />
          </a>
          <a
            href="https://github.com/yobazy"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
          >
            <img src={navIcon2} alt="GitHub" className="social-icon-img" />
          </a>
        </div>
      </div>
    </nav>
  );
};
