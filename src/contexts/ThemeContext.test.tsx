import React from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe("ThemeContext", () => {
  it("defaults to dark theme when nothing is stored", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe("dark");
  });

  it("loads and toggles theme, and writes to storage", () => {
    localStorage.setItem("virida_theme", "light");
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("light");

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem("virida_theme")).toBe("dark");
  });

  it("supports setting an explicit theme", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("light");
    });
    expect(result.current.theme).toBe("light");
  });
});
