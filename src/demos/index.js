import { lazy } from 'react';

// In-site demos, by the key a project names in `interactive`. Each loads on
// its first use so the home page never pays for them.
export const demos = {
  chills: lazy(() => import('./ChillsDemo')),
};
