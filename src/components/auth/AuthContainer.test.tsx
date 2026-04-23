import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthContainer from "./AuthContainer";

vi.mock("../../contexts/ThemeContext", () => ({
  useTheme: () => ({
    theme: "dark",
    toggleTheme: vi.fn(),
  }),
}));

vi.mock("./LoginForm", () => ({
  default: ({ onToggleMode, onError }: { onToggleMode: () => void; onError: (msg: string) => void }) => (
    <div>
      <button onClick={onToggleMode}>go-register</button>
      <button onClick={() => onError("login error")}>raise-login-error</button>
    </div>
  ),
}));

vi.mock("./RegisterForm", () => ({
  default: ({ onToggleMode }: { onToggleMode: () => void }) => (
    <div>
      <span>register-form</span>
      <button onClick={onToggleMode}>go-login</button>
    </div>
  ),
}));

describe("AuthContainer", () => {
  it("starts with login form then toggles to register form", () => {
    render(<AuthContainer />);

    expect(screen.getByText("go-register")).toBeTruthy();
    fireEvent.click(screen.getByText("go-register"));
    expect(screen.getByText("register-form")).toBeTruthy();
  });

  it("shows alert when form reports an error", () => {
    render(<AuthContainer />);

    fireEvent.click(screen.getByText("raise-login-error"));
    expect(screen.getByText("login error")).toBeTruthy();
  });

  it("applies mobile styles when media query matches", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("max-width"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    render(<AuthContainer />);

    const logo = screen.getByAltText("Virida Logo") as HTMLImageElement;
    expect(logo.style.width).toBe("45px");
  });
});
