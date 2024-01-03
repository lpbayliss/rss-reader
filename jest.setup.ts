/* eslint-disable @typescript-eslint/no-empty-function */
import '@testing-library/jest-dom';
// import { render } from '@testing-library/react';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: unknown) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
