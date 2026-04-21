import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "./authService";

const apiFetchMock = vi.fn();

vi.mock("./apiConfig", async () => {
  const actual = await vi.importActual<typeof import("./apiConfig")>("./apiConfig");
  return {
    ...actual,
    apiFetch: (...args: unknown[]) => apiFetchMock(...args),
  };
});

describe("authService", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("calls login endpoint and returns json payload", async () => {
    const payload = { success: true, token: "tok" };
    apiFetchMock.mockResolvedValue({ json: vi.fn().mockResolvedValue(payload) });

    const result = await authService.login({ email: "a@b.c", password: "pw" });

    expect(apiFetchMock).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "a@b.c", password: "pw" }),
    });
    expect(result).toEqual(payload);
  });

  it("calls getMe endpoint", async () => {
    const payload = { success: true, data: { id: "u1" } };
    apiFetchMock.mockResolvedValue({ json: vi.fn().mockResolvedValue(payload) });

    const result = await authService.getMe();

    expect(apiFetchMock).toHaveBeenCalledWith("/api/auth/me");
    expect(result).toEqual(payload);
  });

  it("calls register/update/refresh endpoints", async () => {
    apiFetchMock.mockResolvedValue({ json: vi.fn().mockResolvedValue({ success: true }) });

    await authService.register({
      email: "n@x.dev",
      username: "neo",
      password: "pw",
    });
    await authService.updateProfile({ firstName: "Neo" });
    await authService.refreshToken("refresh-token");

    expect(apiFetchMock).toHaveBeenCalledWith("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "n@x.dev", username: "neo", password: "pw" }),
    });
    expect(apiFetchMock).toHaveBeenCalledWith("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify({ firstName: "Neo" }),
    });
    expect(apiFetchMock).toHaveBeenCalledWith("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: "refresh-token" }),
    });
  });

  it("removes local storage keys on logout", async () => {
    apiFetchMock.mockResolvedValue({ json: vi.fn().mockResolvedValue({ success: true }) });
    localStorage.setItem("virida_token", "tok");
    localStorage.setItem("virida_user", "user");

    await authService.logout("refresh");

    expect(apiFetchMock).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: "refresh" }),
    });
    expect(localStorage.getItem("virida_token")).toBeNull();
    expect(localStorage.getItem("virida_user")).toBeNull();
  });
});
