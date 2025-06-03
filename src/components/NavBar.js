import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';

export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
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
            <Link 
              to="/" 
              className={activeLink === '/' ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/projects" 
              className={activeLink === '/projects' ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <a 
              href="https://bkvisuals100.pixieset.com/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Media
            </a>
            <Link 
              to="/blog" 
              className={activeLink === '/blog' ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              to="/about"
              className={activeLink === '/about' ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
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
