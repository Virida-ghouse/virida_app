import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CTASection from "./CTASection";

describe("CTASection", () => {
  it("renders texts and contact link", () => {
    render(<CTASection onNavigateToLogin={vi.fn()} />);

    expect(screen.getByText("Prêt à planter ?")).toBeTruthy();
    expect(screen.getByRole("link", { name: /nous contacter/i })).toHaveProperty("getAttribute");
  });

  it("calls login navigation when CTA button is clicked", () => {
    const onNavigateToLogin = vi.fn();
    render(<CTASection onNavigateToLogin={onNavigateToLogin} />);

    fireEvent.click(screen.getByRole("button", { name: /créer mon compte/i }));
    expect(onNavigateToLogin).toHaveBeenCalledOnce();
  });
});
