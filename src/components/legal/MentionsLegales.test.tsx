import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MentionsLegales from "./MentionsLegales";

describe("MentionsLegales", () => {
  it("renders legal page content", () => {
    render(<MentionsLegales onBack={vi.fn()} />);

    expect(screen.getByText("Mentions légales")).toBeTruthy();
    expect(screen.getByText(/éditeur du site/i)).toBeTruthy();
    expect(screen.getByText(/hébergement/i)).toBeTruthy();
  });

  it("calls onBack when clicking return button", () => {
    const onBack = vi.fn();
    render(<MentionsLegales onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: /retour/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
