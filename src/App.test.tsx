import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page', async () => {
  render(<App />);
  expect(await screen.findByText('VYCKEY')).toBeInTheDocument();
});
