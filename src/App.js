import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Suspense, lazy, useLayoutEffect } from 'react';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import { settlePageTransition } from './lib/pageTransition';

// Only the home page ships in the first bundle; everything else loads on its
// first visit. The transition holds its "after" snapshot until a route
// commits, so a chunk still loading never shows as a blank page.
const Work = lazy(() => import('./pages/Work'));
const Media = lazy(() => import('./pages/Media'));
const Project = lazy(() => import('./pages/Project'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const XrayLab = lazy(() => import('./pages/XrayLab'));
const About = lazy(() => import('./components/About').then((m) => ({ default: m.About })));
// The tweak panel: always in development, and anywhere with ?tweak in the URL
// (handy on a Vercel preview, on a phone).
const tweaking =
  process.env.NODE_ENV === 'development' || new URLSearchParams(window.location.search).has('tweak');
const Tweaks = tweaking ? lazy(() => import('./dev/Tweaks')) : null;
function ScrollToTop() {
  const { pathname } = useLocation();

  // Before paint, so a page transition's "after" snapshot starts at the top.
  useLayoutEffect(() => {
    // The deck opens over the hero without a page change, so glide up to it.
    const deck = pathname === '/now';
    window.scrollTo({ top: 0, left: 0, behavior: deck && window.scrollY > 0 ? 'smooth' : 'instant' });
    settlePageTransition();
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <NavBar />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Work />} />
          <Route path="/projects/:slug" element={<Project />} />
          <Route path="/media" element={<Media />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/now" element={<Home />} />
        <Route path="/lab/xray" element={<XrayLab />} />
        </Routes>
      </Suspense>
      <Footer />
      {Tweaks && (
        <Suspense fallback={null}>
          <Tweaks />
        </Suspense>
      )}
    </div>
  );
}

export default App;
