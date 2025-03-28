import './App.css';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Development from './pages/Development';
import Blog from './pages/Blog';
import { About } from './components/About';
import MediaSection from './components/MediaSection';
import { Projects } from './components/Projects';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/development" element={<Development />} />
        <Route path="/media" element={<MediaSection />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
