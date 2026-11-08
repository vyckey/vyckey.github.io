import { render, screen } from '@testing-library/react';

// `createBrowserRouter` reads window.location when the router module is
// evaluated, so the URL must be set before App (and therefore Router) loads.
it('renders the tools index for /tools', async () => {
  window.history.pushState({}, '', '/tools');
  const { default: App } = await import('../App');

  render(<App />);

  expect(
    await screen.findByText('开发者工具箱', {}, { timeout: 5000 })
  ).toBeInTheDocument();
  expect(screen.getByText('全部工具')).toBeInTheDocument();
});
