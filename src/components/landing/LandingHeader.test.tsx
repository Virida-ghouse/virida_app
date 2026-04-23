import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LandingHeader from "./LandingHeader";

let currentTheme: "dark" | "light" = "dark";
const toggleThemeMock = vi.fn();

vi.mock("../../contexts/ThemeContext", () => ({
  useTheme: () => ({
    theme: currentTheme,
    toggleTheme: toggleThemeMock,
  }),
}));

describe("LandingHeader", () => {
  it("renders brand and navigation anchors", () => {
    render(<LandingHeader onNavigateToLogin={vi.fn()} />);

    expect(screen.getByText("Vir")).toBeTruthy();
    expect(screen.getByText("ida")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Serre" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Tarifs" })).toBeTruthy();
  });

  it("handles theme and login actions", () => {
    const onNavigateToLogin = vi.fn();
    render(<LandingHeader onNavigateToLogin={onNavigateToLogin} />);

    fireEvent.click(screen.getByText("light_mode"));
    fireEvent.click(screen.getByRole("button", { name: /connexion/i }));

    expect(toggleThemeMock).toHaveBeenCalledOnce();
    expect(onNavigateToLogin).toHaveBeenCalledOnce();
  });

  it("shows dark_mode icon when current theme is light", () => {
    currentTheme = "light";
    render(<LandingHeader onNavigateToLogin={vi.fn()} />);

    expect(screen.getByText("dark_mode")).toBeTruthy();
    currentTheme = "dark";
  });
});
