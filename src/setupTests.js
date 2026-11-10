// Adds custom jest-dom matchers to Vitest's expect.
// https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
import { beforeAll } from 'vitest';
import i18n from './i18n';

// Tests assert the Chinese copy, independent of the host browser language.
beforeAll(async () => {
  await i18n.changeLanguage('zh-CN');
});

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
