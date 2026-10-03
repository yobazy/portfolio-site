import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useLayoutEffect } from 'react';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Work from './pages/Work';
import Media from './pages/Media';
import Project from './pages/Project';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import { About } from './components/About';
import { settlePageTransition } from './lib/pageTransition';

function ScrollToTop() {
  const { pathname } = useLocation();

  // Before paint, so a page transition's "after" snapshot starts at the top.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    settlePageTransition();
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Work />} />
        <Route path="/projects/:slug" element={<Project />} />
        <Route path="/media" element={<Media />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
