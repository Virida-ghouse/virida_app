import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PolitiqueConfidentialite from "./PolitiqueConfidentialite";

describe("PolitiqueConfidentialite", () => {
  it("renders privacy policy sections", () => {
    render(<PolitiqueConfidentialite onBack={vi.fn()} />);

    expect(screen.getByText("Politique de confidentialité")).toBeTruthy();
    expect(screen.getByText(/données collectées/i)).toBeTruthy();
    expect(screen.getByText(/vos droits \(rgpd\)/i)).toBeTruthy();
  });

  it("triggers go back action", () => {
    const onBack = vi.fn();
    render(<PolitiqueConfidentialite onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: /retour/i }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
