import { beforeEach, describe, expect, it } from "vitest";
import { useSensorStore } from "./sensorStore";

describe("useSensorStore", () => {
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

  it("stores latest sensor data by sensor id", () => {
    useSensorStore.getState().updateSensorData({
      id: "s1",
      type: "TEMPERATURE",
      value: 23,
      unit: "C",
      timestamp: new Date(),
      location: { x: 0, y: 0, z: 0 },
      status: "normal",
    });

    expect(useSensorStore.getState().sensorData.get("s1")?.value).toBe(23);
  });

  it("merges user preference updates", () => {
    useSensorStore.getState().updateUserPreferences({ refreshRate: 1000, theme: "dark" });
    expect(useSensorStore.getState().userPreferences.refreshRate).toBe(1000);
    expect(useSensorStore.getState().userPreferences.theme).toBe("dark");
    expect(useSensorStore.getState().userPreferences.chartPeriod).toBe("24h");
  });
});
