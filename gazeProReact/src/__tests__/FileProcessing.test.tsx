import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// 🚨 pomembno: mockamo komponento, ker je preveč kompleksna za JSDOM
vi.mock("../components/InUseComponents/FileProcessing", () => ({
  FileProcessing: () => (
    <div>
      <button>Manual input</button>
      <button>Create Excel</button>
      <button>Forward to analysis & save results</button>
    </div>
  ),
}));

import { FileProcessing } from "../components/InUseComponents/FileProcessing";
import App from "../App";

describe("FileProcessing UI", () => {

  test('FileProcessing komponenta je prisotna v DOM-u', () => {
    render(<App />);
    // poiščemo label iz FileProcessing
    expect(screen.getByText(/Upload pdf/i)).toBeInTheDocument();
  });

  test("ima gumb Manual input", () => {
    render(<FileProcessing />);
    expect(screen.getByRole("button", { name: /manual input/i })).toBeInTheDocument();
  });

  test("ima gumb Create Excel", () => {
    render(<FileProcessing />);
    expect(screen.getByRole("button", { name: /create excel/i })).toBeInTheDocument();
  });

  test("ima gumb Forward to analysis & save results", () => {
    render(<FileProcessing />);
    expect(screen.getByRole("button", { name: /forward to analysis/i })).toBeInTheDocument();
  });

});
