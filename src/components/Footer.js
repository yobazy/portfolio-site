import { useEffect, useRef, useState } from 'react';
import { TransitionLink } from '../lib/pageTransition';
import Rosette from './Rosette';
import Arrow from './Arrow';
import { sections } from '../data/sections';

export const EMAIL = 'bazilkhn@gmail.com';
export const LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bazilkhan' },
  { label: 'GitHub', href: 'https://github.com/yobazy' },
  { label: 'Photos', href: 'https://bkvisuals100.pixieset.com/' },
];

export const useCopy = (text) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    }, () => {});
  };
  return [copied, copy];
};

export const Footer = () => {
  const year = new Date().getFullYear();
  const [copied, copy] = useCopy(EMAIL);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-lead">
          <p className="footer-title">Let's connect</p>
          <p className="footer-text">Collaborations, roles, or a note about the work.</p>
          <div className="footer-email">
            <a href={`mailto:${EMAIL}`} className="footer-email-link">
              {EMAIL}
            </a>
            {typeof navigator !== 'undefined' && navigator.clipboard && (
              <button type="button" className="footer-copy" onClick={copy}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
            <span className="visually-hidden" aria-live="polite">
              {copied ? 'Email copied' : ''}
            </span>
          </div>
          {/* For handing the site over in person: point a phone at it. */}
          <figure className="footer-qr">
            <img src="/qr-now.svg" alt="QR code for heyitsbaz.com/now" width="96" height="96" />
            <figcaption>Scan to open on your phone</figcaption>
          </figure>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <ul>
            {sections.map((section) => (
              <li key={section.to}>
                <TransitionLink to={section.to}>{section.label}</TransitionLink>
              </li>
            ))}
          </ul>
          <ul>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <Arrow dir="up-right" size={11} />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-base">
          <span className="footer-mark">
            Bazil <Rosette size={11} /> Khan
          </span>
          <span className="footer-copyright">Toronto · {year}</span>
        </div>
      </div>
    </footer>
  );
};
