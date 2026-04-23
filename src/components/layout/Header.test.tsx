import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { describe, expect, it, vi } from "vitest";
import Header from "./Header";

const logoutMock = vi.fn();

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { firstName: "Ada", lastName: "Lovelace" },
    logout: logoutMock,
  }),
}));

vi.mock("../plants/ui/NotificationMenu", () => ({
  NotificationMenu: () => <div>notifications</div>,
}));

const renderWithTheme = () =>
  render(
    <ThemeProvider theme={createTheme()}>
      <Header />
    </ThemeProvider>
  );

describe("Header", () => {
  it("renders brand and user name", () => {
    renderWithTheme();

    expect(screen.getByText("VIRIDA")).toBeTruthy();
    expect(screen.getByText("Ada Lovelace")).toBeTruthy();
  });

  it("opens user menu and triggers logout", () => {
    renderWithTheme();

    fireEvent.click(screen.getByText("AL"));
    fireEvent.click(screen.getByText("Se déconnecter"));

    expect(logoutMock).toHaveBeenCalledOnce();
  });
});
