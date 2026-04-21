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

  it("updates historical data, system status and thresholds", () => {
    useSensorStore
      .getState()
      .updateHistoricalData("s1", { sensorId: "s1", data: [{ timestamp: new Date(), value: 10 }] });
    useSensorStore.getState().setSystemStatus({
      isOnline: false,
      lastUpdate: new Date(),
      activeAlerts: 2,
      systemHealth: "warning",
    });
    useSensorStore
      .getState()
      .setAlertThresholds([{ sensorType: "TEMPERATURE" as any, min: 10, max: 30 }]);

    expect(useSensorStore.getState().historicalData.get("s1")?.sensorId).toBe("s1");
    expect(useSensorStore.getState().systemStatus.activeAlerts).toBe(2);
    expect(useSensorStore.getState().alertThresholds).toHaveLength(1);
  });
});
