import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RGPDProvider, useRGPD } from "./RGPDContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RGPDProvider>{children}</RGPDProvider>
);

describe("RGPDContext", () => {
  it("shows banner when no consent exists", async () => {
    const { result } = renderHook(() => useRGPD(), { wrapper });
    await waitFor(() => expect(result.current.showBanner).toBe(true));
  });

  it("hides banner when stored consent is still valid", async () => {
    const consent = { essential: true, analytics: true, functional: false, marketing: false };
    localStorage.setItem("virida_rgpd_consent", JSON.stringify(consent));
    localStorage.setItem("virida_rgpd_consent_date", Date.now().toString());

    const { result } = renderHook(() => useRGPD(), { wrapper });
    await waitFor(() => expect(result.current.showBanner).toBe(false));
    expect(result.current.consent).toEqual(consent);
  });

  it("re-opens banner when stored consent is expired", async () => {
    const consent = { essential: true, analytics: true, functional: true, marketing: false };
    const oldTimestamp = Date.now() - 14 * 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem("virida_rgpd_consent", JSON.stringify(consent));
    localStorage.setItem("virida_rgpd_consent_date", oldTimestamp.toString());

    const { result } = renderHook(() => useRGPD(), { wrapper });
    await waitFor(() => expect(result.current.showBanner).toBe(true));
  });

  it("accepts all cookies and persists consent", async () => {
    const { result } = renderHook(() => useRGPD(), { wrapper });
    await waitFor(() => expect(result.current.showBanner).toBe(true));

    act(() => {
      result.current.acceptAll();
    });

    expect(result.current.showBanner).toBe(false);
    expect(result.current.consent?.analytics).toBe(true);
    expect(localStorage.getItem("virida_rgpd_consent")).toContain("\"analytics\":true");
  });

  it("saves custom preferences but always keeps essential true", async () => {
    const { result } = renderHook(() => useRGPD(), { wrapper });
    await waitFor(() => expect(result.current.showBanner).toBe(true));

    act(() => {
      result.current.savePreferences({
        essential: false,
        analytics: false,
        functional: true,
        marketing: false,
      });
    });

    expect(result.current.consent?.essential).toBe(true);
    expect(result.current.consent?.functional).toBe(true);
  });

  it("refuses non-essential cookies", async () => {
    const { result } = renderHook(() => useRGPD(), { wrapper });
    await waitFor(() => expect(result.current.showBanner).toBe(true));

    act(() => {
      result.current.refuseAll();
    });

    expect(result.current.consent).toEqual({
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
  });

  it("opens and closes preferences modal", async () => {
    const { result } = renderHook(() => useRGPD(), { wrapper });
    await waitFor(() => expect(result.current.showBanner).toBe(true));

    act(() => {
      result.current.openPreferences();
    });
    expect(result.current.showPreferencesModal).toBe(true);

    act(() => {
      result.current.closePreferences();
    });
    expect(result.current.showPreferencesModal).toBe(false);
  });
});
