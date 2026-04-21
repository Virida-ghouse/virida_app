import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useSensorData } from "./useSensorData";
import { useSensorStore } from "../store/sensorStore";

describe("useSensorData", () => {
  beforeEach(() => {
    useSensorStore.setState({
      sensorData: new Map(),
      historicalData: new Map(),
      systemStatus: {
        isOnline: true,
        lastUpdate: new Date(),
        activeAlerts: 0,
        systemHealth: "good",
      },
      userPreferences: {
        theme: "light",
        chartPeriod: "24h",
        refreshRate: 5000,
        notifications: true,
      },
      alertThresholds: [],
    });
  });

  it("writes generated mock data to the store", async () => {
    const { result } = renderHook(() => useSensorData("sensor-1"));

    await waitFor(() => {
      expect(result.current.data?.id).toBe("sensor-1");
    });

    expect(result.current.data?.unit).toBe("°C");
  });
});
