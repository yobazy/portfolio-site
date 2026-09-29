// The site's top-level sections. The hero wires, the home sections, and the
// NavBar links all follow this order; `to` must match the NavBar hrefs.
export const sections = [
  { to: '/projects', label: 'Development', note: 'things I build' },
  { to: '/media', label: 'Media', note: 'photographs' },
  { to: '/blog', label: 'Blog', note: 'notes' },
  { to: '/about', label: 'About', note: 'the long version' },
];

export const sectionFor = (to) => {
  const index = sections.findIndex((section) => section.to === to);
  return { ...sections[index], number: String(index + 1).padStart(2, '0') };
};
