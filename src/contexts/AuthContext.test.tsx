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

  it("throws when useAuth is used outside provider", () => {
    expect(() => renderHook(() => useAuth())).toThrowError(
      "useAuth must be used within an AuthProvider"
    );
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
});
