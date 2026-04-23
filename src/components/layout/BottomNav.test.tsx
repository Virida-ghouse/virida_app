import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BottomNav from "./BottomNav";

describe("BottomNav", () => {
  it("renders all mobile navigation labels", () => {
    render(<BottomNav currentView="dashboard" onViewChange={vi.fn()} />);

    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Crops")).toBeTruthy();
    expect(screen.getByText("Energy")).toBeTruthy();
    expect(screen.getByText("Auto")).toBeTruthy();
    expect(screen.getByText("Plus")).toBeTruthy();
  });

  it("calls onViewChange when clicking an item", () => {
    const onViewChange = vi.fn();
    render(<BottomNav currentView="dashboard" onViewChange={onViewChange} />);

    fireEvent.click(screen.getByRole("button", { name: /energy/i }));
    expect(onViewChange).toHaveBeenCalledWith("energy");
  });
});
