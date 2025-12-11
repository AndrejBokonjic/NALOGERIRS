// gazeProReact/src/setupTests.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'electron', {
  value: {
    ipcRenderer: {
      send: vi.fn(),
      on: vi.fn(),
      removeAllListeners: vi.fn(),
    },
  },
  writable: true,
});
