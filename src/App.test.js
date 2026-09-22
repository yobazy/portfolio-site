import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders identity and development', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: "Hey, it's Baz." })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Development' })).toBeInTheDocument();
});
