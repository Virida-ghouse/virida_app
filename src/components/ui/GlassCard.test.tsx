import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GlassCard from "./GlassCard";

describe("GlassCard", () => {
  it("renders children content", () => {
    render(<GlassCard>hello card</GlassCard>);
    expect(screen.getByText("hello card")).toBeTruthy();
  });

  it("applies glow-border class when hover is enabled", () => {
    const { container } = render(
      <GlassCard hover className="extra">
        content
      </GlassCard>
    );
    const root = container.querySelector(".glass-card");
    expect(root?.className).toContain("glow-border");
    expect(root?.className).toContain("extra");
  });
});
