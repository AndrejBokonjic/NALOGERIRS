// gazeProReact/src/__tests__/Pozdrav.test.tsx
import { render, screen } from '@testing-library/react';
import { Pozdrav } from '../components/InUseComponents/Pozdrav';
import { expect, test } from 'vitest';

test('rendera glavni naslov', () => {
  render(<Pozdrav />);
  expect(
    screen.getByRole('heading', { name: /gazepro measurements/i })
  ).toBeInTheDocument();
});
