import React from 'react';
import { Banner } from '../components/Banner';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';

function Home() {
  return (
    <div className="home-page">
      <Banner />
      <About />
      <Skills />
      <Projects />
    </div>
  );
}

export default Home; 