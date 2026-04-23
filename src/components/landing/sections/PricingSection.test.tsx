import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PricingSection from "./PricingSection";

describe("PricingSection", () => {
  it("renders pricing offer and waitlist CTA", () => {
    render(<PricingSection />);

    expect(screen.getByText("Une serre, tout inclus")).toBeTruthy();
    expect(screen.getByText("Kit Starter — Tout est inclus")).toBeTruthy();
    expect(screen.getByRole("link", { name: /rejoindre la liste d'attente/i })).toBeTruthy();
  });
});
