import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Page changes run as view transitions: a push, the next page sliding in from
// the side its tab sits on in the nav, this one drifting back beneath it.
// Going back up (to home, or a post back to the blog) pushes the other way.
// The direction rides on <html data-side>; App.css does the rest. A `morph` names
// the element that should grow into the next page's title (its `.page-title`);
// otherwise each title rides with its own page. Browsers without view
// transitions, and anyone who prefers reduced motion, get the instant switch.
// The browser's own Back and Forward stay instant.
//
// react-router only drives view transitions from a data router, so this does
// it by hand: it navigates inside the transition and holds the "after"
// snapshot until the new route has committed (see `settlePageTransition`).

// Where a path sits along the nav, so a sideways move knows which way to go.
const NAV_ORDER = ['/', '/projects', '/media', '/blog', '/about'];
const navIndex = (path) => {
  const top = `/${path.split('/')[1] || ''}`;
  const at = NAV_ORDER.indexOf(top);
  return at < 0 ? NAV_ORDER.length : at;
};

let settle = null;
let arriving = false;
let current = null;

const plainClick = (event) =>
  !event.defaultPrevented &&
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey;

const supported = () =>
  typeof document.startViewTransition === 'function' &&
  !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Called once the new route has committed and scrolled to the top.
export const settlePageTransition = () => {
  settle?.();
  settle = null;
};

// Freezes, at mount, whether this page arrived through a transition, so its
// own entrance animation can stand down instead of doubling up.
export const useArrival = () => useState(() => arriving)[0];

export const TransitionLink = ({ to, morph, onClick, ...props }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const go = (event) => {
    onClick?.(event);
    if (!plainClick(event) || !supported() || to === pathname) return;
    event.preventDefault();

    // This page's own title leaves with the page, unless it is the morph source.
    const leaving = [...document.querySelectorAll('.page-title')];
    leaving.forEach((node) => {
      node.style.viewTransitionName = 'none';
    });
    const title = morph?.(event.currentTarget);
    if (title) title.style.viewTransitionName = 'page-title';

    const root = document.documentElement;
    // Only a transition with a morph source lifts the next title out of its page.
    if (title) root.dataset.morph = '';
    else delete root.dataset.morph;
    const back = to === '/' || pathname.startsWith(`${to}/`);
    const from = navIndex(pathname);
    const next = navIndex(to);
    root.dataset.side = next === from ? (back ? 'left' : 'right') : next > from ? 'right' : 'left';
    arriving = true;

    const transition = document.startViewTransition(
      () =>
        new Promise((resolve) => {
          settle = resolve;
          // Never hold the page frozen if the route is slow to commit.
          window.setTimeout(() => settle === resolve && settlePageTransition(), 1000);
          navigate(to);
        })
    );
    current = transition;
    transition.finished.finally(() => {
      // A newer click may have taken over; leave its state alone.
      if (current === transition) {
        current = null;
        arriving = false;
        delete root.dataset.side;
        delete root.dataset.morph;
      }
      // A reused page component (one project to another) keeps its title node.
      [...leaving, title].forEach((node) => {
        if (node) node.style.viewTransitionName = '';
      });
    });
  };

  return <Link to={to} onClick={go} {...props} />;
};
