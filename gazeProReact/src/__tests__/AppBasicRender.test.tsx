// src/__tests__/AppBasicRender.test.tsx
// src/__tests__/AppBasicRender.test.tsx
import { render, screen } from '@testing-library/react';
import App from '../App';
import { describe, expect, test } from 'vitest';

describe('App osnovni render testi', () => {
  test('App se lahko rendera brez napake', () => {
    render(<App />);
    expect(screen.getByText(/GazePro Measurements/i)).toBeInTheDocument();
  });
});
