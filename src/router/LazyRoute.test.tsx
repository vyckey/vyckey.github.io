import { render, screen } from '@testing-library/react';

// `createBrowserRouter` reads window.location when the router module is
// evaluated, so the URL must be set before App (and therefore Router) loads.
// Tool routes are code-split with React.lazy, so this also covers the
// Suspense boundary.
it('lazy-loads a tool route', async () => {
  window.history.pushState({}, '', '/tools/markdown');
  const { default: App } = await import('../App');

  render(<App />);

  expect(
    await screen.findByRole(
      'heading',
      { level: 1, name: 'Markdown 预览' },
      { timeout: 10000 }
    )
  ).toBeInTheDocument();
}, 20000);
