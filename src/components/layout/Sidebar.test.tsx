import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { describe, expect, it, vi } from "vitest";
import Sidebar from "./Sidebar";

const renderSidebar = (props?: Partial<ComponentProps<typeof Sidebar>>) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <Sidebar
        open
        onToggle={vi.fn()}
        currentView="dashboard"
        onViewChange={vi.fn()}
        {...props}
      />
    </ThemeProvider>
  );

describe("Sidebar", () => {
  it("renders menu entries when open", () => {
    renderSidebar();

    expect(screen.getByText("Dashboard")).toBeTruthy();
    expect(screen.getByText("Plants")).toBeTruthy();
    expect(screen.getByText("Sensors")).toBeTruthy();
    expect(screen.getByText("Settings")).toBeTruthy();
  });

  it("calls onViewChange when selecting an item", () => {
    const onViewChange = vi.fn();
    renderSidebar({ onViewChange });

    fireEvent.click(screen.getByText("Energy"));
    expect(onViewChange).toHaveBeenCalledWith("energy");
  });
});
