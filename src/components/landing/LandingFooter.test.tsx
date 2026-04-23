import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LandingFooter from "./LandingFooter";

describe("LandingFooter", () => {
  it("renders footer sections and contact links", () => {
    render(<LandingFooter />);

    expect(screen.getByText("Produit")).toBeTruthy();
    expect(screen.getByText("Légal")).toBeTruthy();
    expect(screen.getByText("Contact")).toBeTruthy();
    expect(screen.getByText("virida.ghouse@gmail.com")).toBeTruthy();
  });

  it("navigates to legal pages via callback", () => {
    const onNavigateToLegal = vi.fn();
    render(<LandingFooter onNavigateToLegal={onNavigateToLegal} />);

    fireEvent.click(screen.getByRole("button", { name: /mentions légales/i }));
    fireEvent.click(screen.getByRole("button", { name: /confidentialité/i }));

    expect(onNavigateToLegal).toHaveBeenNthCalledWith(1, "mentions");
    expect(onNavigateToLegal).toHaveBeenNthCalledWith(2, "confidentialite");
  });
});
