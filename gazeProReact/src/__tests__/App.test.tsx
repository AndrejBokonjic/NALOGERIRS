// gazeProReact/src/__tests__/App.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { describe, expect, test } from "vitest";

describe("App osnovne interakcije", () => {

  test("prikaže pozdravni naslov", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /gazepro measurements/i })
    ).toBeInTheDocument();
  });

  test("gumb za prikaz/skritje obvestila deluje", async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggleBtn = screen.getByRole("button", { name: /prikaži obvestilo/i });
    await user.click(toggleBtn);

    expect(
      screen.getByText(/testno dodatno besedilo/i)
    ).toBeInTheDocument();

    await user.click(toggleBtn);

    expect(
      screen.queryByText(/testno dodatno besedilo/i)
    ).not.toBeInTheDocument();
  });

  test("gumb za spremembo barve ozadja spremeni background", async () => {
    const user = userEvent.setup();
    render(<App />);

    const btn = screen.getByRole("button", { name: /spremeni barvo ozadja/i });

    const initialColor = document.body.style.backgroundColor;

    await user.click(btn);

    expect(document.body.style.backgroundColor).not.toBe(initialColor);
  });

  test("UI se naloži brez napak in vsebuje osnovne elemente", () => {
    render(<App />);

    // Pozdrav komponenta
    expect(screen.getByText(/gazepro measurements/i)).toBeInTheDocument();

    // Gumb za obvestilo
    expect(screen.getByRole("button", { name: /prikaži obvestilo/i })).toBeInTheDocument();

    // Gumb za spremembo ozadja
    expect(screen.getByRole("button", { name: /spremeni barvo ozadja/i })).toBeInTheDocument();
  });
});
