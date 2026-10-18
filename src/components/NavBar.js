import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TransitionLink } from '../lib/pageTransition';
import Rosette from './Rosette';
import { nowSection, sections } from '../data/sections';

const LINKEDIN = 'https://www.linkedin.com/in/bazilkhan';
const GITHUB = 'https://github.com/yobazy';

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.5 8.6H3.2V21h3.3V8.6ZM4.9 3A1.9 1.9 0 1 0 4.9 6.9 1.9 1.9 0 0 0 4.9 3ZM21 13.4c0-3.3-1.8-5.1-4.5-5.1a4 4 0 0 0-3.5 1.9V8.6H9.8V21H13v-6.4c0-1.7.6-2.9 2.2-2.9 1.5 0 2.1 1 2.1 2.9V21H21v-7.6Z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.6 4.9.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
  </svg>
);

const isActive = (pathname, to) =>
  to === '/projects' ? pathname === '/projects' || pathname.startsWith('/projects/') : pathname === to || pathname.startsWith(`${to}/`);

// Top bar on every screen; on phones the section links move to a dock at the
// bottom, within reach of a thumb.
export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const deckOpen = pathname === nowSection.to;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav aria-label="Primary" className={`navbar ${scrolled || !isHome ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <TransitionLink to="/" className="navbar-logo" aria-label="Bazil Khan, home">
            <span>Bazil</span>
            <Rosette size={12} />
            <span>Khan</span>
          </TransitionLink>

          <div className="nav-links">
            {sections.map((section) => (
              <TransitionLink
                key={section.to}
                to={section.to}
                className={isActive(pathname, section.to) ? 'active' : ''}
                aria-current={isActive(pathname, section.to) ? 'page' : undefined}
              >
                {section.label}
              </TransitionLink>
            ))}
          </div>

          <div className="navbar-right">
            {/* On the deck the same pill closes it; the page underneath never left. */}
            <TransitionLink
              to={deckOpen ? '/' : nowSection.to}
              className={`navbar-now ${deckOpen ? 'is-close' : ''}`}
            >
              {!deckOpen && <span className="navbar-now-dot" aria-hidden="true" />}
              {deckOpen ? 'Close' : nowSection.label}
            </TransitionLink>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="GitHub">
              <GitHubIcon />
            </a>
          </div>
        </div>
      </nav>

      <nav aria-label="Sections" className="dock">
        {[...sections, nowSection].map((section) => (
          <TransitionLink
            key={section.to}
            to={section.to === nowSection.to && deckOpen ? '/' : section.to}
            className={`dock-item ${isActive(pathname, section.to) ? 'active' : ''} ${
              section.to === nowSection.to ? 'is-now' : ''
            }`}
            aria-current={isActive(pathname, section.to) ? 'page' : undefined}
          >
            {section.to === nowSection.to && <span className="navbar-now-dot" aria-hidden="true" />}
            {section.short}
          </TransitionLink>
        ))}
      </nav>
    </>
  );
};
