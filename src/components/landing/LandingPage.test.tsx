import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LandingPage from "./LandingPage";

vi.mock("./LandingHeader", () => ({
  default: ({ onNavigateToLogin }: { onNavigateToLogin: () => void }) => (
    <button onClick={onNavigateToLogin}>header-login</button>
  ),
}));
vi.mock("./sections/HeroSection", () => ({
  default: ({ onNavigateToLogin }: { onNavigateToLogin: () => void }) => (
    <button onClick={onNavigateToLogin}>hero-login</button>
  ),
}));
vi.mock("./sections/CTASection", () => ({
  default: ({ onNavigateToLogin }: { onNavigateToLogin: () => void }) => (
    <button onClick={onNavigateToLogin}>cta-login</button>
  ),
}));
vi.mock("./LandingFooter", () => ({
  default: ({ onNavigateToLegal }: { onNavigateToLegal?: (page: "mentions" | "confidentialite") => void }) => (
    <button onClick={() => onNavigateToLegal?.("mentions")}>open-legal</button>
  ),
}));

vi.mock("./sections/EveSection", () => ({ default: () => <div>eve</div> }));
vi.mock("./sections/MarketplaceSection", () => ({ default: () => <div>market</div> }));
vi.mock("./sections/GreenhouseSection", () => ({ default: () => <div>greenhouse</div> }));
vi.mock("./sections/DashboardPreview", () => ({ default: () => <div>dashboard-preview</div> }));
vi.mock("./sections/PricingSection", () => ({ default: () => <div>pricing</div> }));
vi.mock("./sections/AboutSection", () => ({ default: () => <div>about</div> }));
vi.mock("./sections/PartnersSection", () => ({ default: () => <div>partners</div> }));
vi.mock("./sections/ContactFormSection", () => ({ default: () => <div>contact</div> }));
vi.mock("./sections/OpenSourceSection", () => ({ default: () => <div>oss</div> }));

describe("LandingPage", () => {
  it("calls login callback from header/hero/cta", () => {
    const onNavigateToLogin = vi.fn();
    render(<LandingPage onNavigateToLogin={onNavigateToLogin} />);

    fireEvent.click(screen.getByText("header-login"));
    fireEvent.click(screen.getByText("hero-login"));
    fireEvent.click(screen.getByText("cta-login"));

    expect(onNavigateToLogin).toHaveBeenCalledTimes(3);
  });

  it("forwards legal navigation callback to footer", () => {
    const onNavigateToLegal = vi.fn();
    render(<LandingPage onNavigateToLogin={vi.fn()} onNavigateToLegal={onNavigateToLegal} />);

    fireEvent.click(screen.getByText("open-legal"));
    expect(onNavigateToLegal).toHaveBeenCalledWith("mentions");
  });
});
