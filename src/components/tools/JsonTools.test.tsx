import { render, waitFor } from '@testing-library/react';
import JsonTools from './JsonTools';

describe('JsonTools', () => {
  it('renders the sample JSON document in the viewer', async () => {
    const { container } = render(<JsonTools />);

    // `react-json-view` is a UMD bundle whose default export is an object in
    // some bundlers. If that shape is not unwrapped, rendering throws
    // "Element type is invalid" before any JSON content appears.
    await waitFor(() => {
      expect(container.querySelector('.react-json-view')).not.toBeNull();
    });
    expect(container.querySelector('.react-json-view')).toHaveTextContent(
      'Vyckey'
    );
  });
});
