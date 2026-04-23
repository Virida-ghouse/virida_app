import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

const loginMock = vi.fn();
const registerMock = vi.fn();

vi.mock("../services/api", () => ({
  authService: {
    login: (...args: unknown[]) => loginMock(...args),
    register: (...args: unknown[]) => registerMock(...args),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthContext", () => {
  beforeEach(() => {
    loginMock.mockReset();
    registerMock.mockReset();
    localStorage.clear();
  });

  it("hydrates user and token from localStorage", async () => {
    localStorage.setItem("virida_token", "token");
    localStorage.setItem(
      "virida_user",
      JSON.stringify({
        id: "u1",
        firstName: "A",
        lastName: "B",
        email: "a@b.c",
        role: "user",
        createdAt: "2026-01-01",
      })
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe("token");
    expect(result.current.user?.id).toBe("u1");
  });

  it("logs in and persists auth data", async () => {
    loginMock.mockResolvedValue({
      token: "jwt",
      user: {
        id: "u2",
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.dev",
        role: "admin",
        createdAt: "2026-01-01",
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login("john@doe.dev", "pw");
    });

    expect(loginMock).toHaveBeenCalledWith({ email: "john@doe.dev", password: "pw" });
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem("virida_token")).toBe("jwt");
  });

  it("registers then logout clears storage/state", async () => {
    registerMock.mockResolvedValue({
      token: "reg-token",
      user: {
        id: "u3",
        firstName: "Neo",
        lastName: "Anderson",
        email: "neo@matrix.dev",
        role: "user",
        createdAt: "2026-01-01",
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.register({
        firstName: "Neo",
        lastName: "Anderson",
        email: "neo@matrix.dev",
        password: "pw",
      });
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem("virida_token")).toBeNull();
    expect(localStorage.getItem("virida_user")).toBeNull();
  });

  it("clears invalid persisted user json on bootstrap", async () => {
    localStorage.setItem("virida_token", "tok");
    localStorage.setItem("virida_user", "{bad-json");
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem("virida_token")).toBeNull();
    expect(localStorage.getItem("virida_user")).toBeNull();
    errSpy.mockRestore();
  });

  it("throws when login/register response misses token or user", async () => {
    loginMock.mockResolvedValue({ token: "", user: null });
    registerMock.mockResolvedValue({ token: "", user: null });
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await expect(
      result.current.login("broken@virida.org", "pw")
    ).rejects.toBeInstanceOf(Error);
    await expect(
      result.current.register({
        firstName: "A",
        lastName: "B",
        email: "broken@virida.org",
        password: "pw",
      })
    ).rejects.toBeInstanceOf(Error);
    errSpy.mockRestore();
  });
});
