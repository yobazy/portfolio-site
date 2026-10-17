// The site's top-level sections. The home sections, the NavBar links and the
// phone dock all follow this order; `to` must match the NavBar hrefs.
// `short` is the label the phone dock uses where five words have to fit.
export const sections = [
  { to: '/projects', label: 'Development', short: 'Work', note: 'things I build' },
  { to: '/media', label: 'Media', short: 'Media', note: 'photographs' },
  { to: '/blog', label: 'Blog', short: 'Blog', note: 'notes' },
  { to: '/about', label: 'About', short: 'About', note: 'the long version' },
];

// The pitch deck: what Baz is building right now, for showing on a phone.
export const nowSection = { to: '/now', label: 'Now', short: 'Now', note: 'building right now' };

export const sectionFor = (to) => {
  const index = sections.findIndex((section) => section.to === to);
  return { ...sections[index], number: String(index + 1).padStart(2, '0') };
};
