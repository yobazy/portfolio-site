import imgGhosts from '../assets/img/ghosts-playground.jpg';
import imgObservatory from '../assets/img/observatory.jpg';

// `cover` is a picture of the thing the post is about, where there is one.
export const posts = [
  {
    slug: 'build-it-while-its-warm',
    title: 'Building ghosts-playground',
    date: 'September 2026',
    readTime: '4 min',
    excerpt: "A webcam, a projector and a pile of shaders. Most of what made it work came from seeing every change a frame later.",
    tags: ['creativity', 'webgl', 'side-projects'],
    cover: imgGhosts,
  },
  {
    slug: 'build-the-tool-you-can-see',
    title: 'Keeping track of five coding agents',
    date: 'September 2026',
    readTime: '4 min',
    excerpt: "I was running five Claude Code sessions at once and spending most of my time checking on them. So I built an app for it, now called Observatory.",
    tags: ['tooling', 'workflow', 'agents'],
    cover: imgObservatory,
  },
  {
    slug: 'stop-burning-tokens',
    title: 'Where my Claude tokens were going',
    date: 'March 2026',
    readTime: '3 min',
    excerpt: "I used to give Claude as much context as I could. Most of it was wasted. These are the habits that cost me the most.",
    tags: ['claude', 'llm', 'productivity'],
  }
];
