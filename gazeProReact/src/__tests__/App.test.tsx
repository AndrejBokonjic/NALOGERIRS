import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { describe, expect, test } from 'vitest';

describe('App osnovne interakcije', () => {
  test('prikaže pozdravni naslov', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /gazepro measurements/i })
    ).toBeInTheDocument();
  });

  test('gumb za prikaz/skritje obvestila deluje', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggleBtn = screen.getByRole('button', { name: /prikaži obvestilo/i });
    await user.click(toggleBtn);

    const text = screen.getByText(/testno dodatno besedilo/i);
    expect(text).toBeInTheDocument();

    await user.click(toggleBtn);
    expect(screen.queryByText(/testno dodatno besedilo/i)).not.toBeInTheDocument();
  });

  test('gumb za spremembo barve ozadja spremeni background', async () => {
    const user = userEvent.setup();
    render(<App />);

    const btn = screen.getByRole('button', { name: /spremeni barvo ozadja/i });
    const initial = document.body.style.backgroundColor;

    await user.click(btn);
    expect(document.body.style.backgroundColor).not.toBe(initial);
  });

  test('gumba + in - spreminjata velikost besedila', async () => {
    const user = userEvent.setup();
    render(<App />);

    const text = screen.getByText(/to besedilo lahko spreminja velikost/i);
    const bigger = screen.getByRole('button', { name: /^\+$/ });
    const smaller = screen.getByRole('button', { name: /^-$/ });

    const initialSize = text.style.fontSize || '16px';

    await user.click(bigger);
    expect(text.style.fontSize).not.toBe(initialSize);

    await user.click(smaller);
    expect(text).toBeInTheDocument();
  });

  // 🔥 DODANI TEST #2 (preveri, da je FileProcessing prisoten)
  test('FileProcessing komponenta je prisotna v DOM-u', () => {
    render(<App />);
    expect(screen.getByText(/upload pdf/i)).toBeInTheDocument();
  });
});
