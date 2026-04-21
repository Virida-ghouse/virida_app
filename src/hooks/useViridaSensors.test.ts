import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useViridaSensors } from "./useViridaSensors";

describe("useViridaSensors", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches sensors, builds map and alerts", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        data: [
          {
            id: "1",
            type: "ph",
            current_value: 4.8,
            status: "online",
            unit: "",
            last_reading: { timestamp: "2026-01-01T00:00:00Z" },
          },
          {
            id: "2",
            type: "light",
            current_value: 120,
            status: "online",
            unit: "lux",
            last_reading: { timestamp: "2026-01-01T00:00:00Z" },
          },
        ],
      }),
    } as unknown as Response);

    const { result } = renderHook(() => useViridaSensors(60000));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.connected).toBe(true);
    expect(result.current.sensors).toHaveLength(2);
    expect(result.current.map.ph).toBe(4.8);
    expect(result.current.map.light).toBe(120);
    expect(result.current.alerts.length).toBeGreaterThan(0);
    expect(fetchMock).toHaveBeenCalled();
  });

  it("handles failed fetch and allows refetch", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: false, status: 500 } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: [] }),
      } as unknown as Response);

    const { result } = renderHook(() => useViridaSensors(60000));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.connected).toBe(false);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.connected).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
