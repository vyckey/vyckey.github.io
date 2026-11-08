// Adds custom jest-dom matchers to Vitest's expect.
// https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';

// jsdom does not implement ResizeObserver, which antd components rely on.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserverMock;
}

// jsdom does not implement matchMedia either.
if (!window.matchMedia) {
  window.matchMedia = query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
