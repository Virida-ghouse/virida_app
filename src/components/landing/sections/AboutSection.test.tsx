import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutSection from "./AboutSection";

describe("AboutSection", () => {
  it("renders story content and team signature", () => {
    render(<AboutSection />);

    expect(screen.getByText("Notre histoire")).toBeTruthy();
    expect(screen.getByText("10 étudiants, 1 idée, 1 serre")).toBeTruthy();
    expect(screen.getByText(/setayesh, christophe/i)).toBeTruthy();
  });
});
