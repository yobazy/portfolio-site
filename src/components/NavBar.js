import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TransitionLink } from '../lib/pageTransition';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';

export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      // The home hero carries the name; the logo takes over once it's gone.
      setPastHero(window.scrollY > window.innerHeight * 0.4);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
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
    <nav aria-label="Primary" className={`navbar ${scrolled || !isHome ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {isHome && !pastHero ? (
          <span className="navbar-spacer" aria-hidden="true" />
        ) : (
          <TransitionLink to="/" className="navbar-logo">
            Hey, it's Baz.
          </TransitionLink>
        )}
        <button
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-content ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <TransitionLink
              to="/projects"
              className={isActive('/projects') ? 'active' : ''}
            >
              Development
            </TransitionLink>
            <TransitionLink
              to="/media"
              className={isActive('/media') ? 'active' : ''}
            >
              Media
            </TransitionLink>
            <TransitionLink
              to="/blog"
              className={isActive('/blog') ? 'active' : ''}
            >
              Blog
            </TransitionLink>
            <TransitionLink
              to="/about"
              className={isActive('/about') ? 'active' : ''}
            >
              About
            </TransitionLink>
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
