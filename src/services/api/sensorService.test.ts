import { beforeEach, describe, expect, it, vi } from "vitest";
import { sensorService } from "./sensorService";

const apiFetchMock = vi.fn();

vi.mock("./apiConfig", async () => {
  const actual = await vi.importActual<typeof import("./apiConfig")>("./apiConfig");
  return {
    ...actual,
    apiFetch: (...args: unknown[]) => apiFetchMock(...args),
  };
});

describe("sensorService", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
    apiFetchMock.mockResolvedValue({ json: vi.fn().mockResolvedValue({ success: true }) });
  });

  it("builds filtered sensors query", async () => {
    await sensorService.getSensors({ greenhouseId: "g1", type: "temp", active: "true" });

    expect(apiFetchMock).toHaveBeenCalledWith("/api/sensors?greenhouseId=g1&type=temp&active=true");
  });

  it("creates a sensor via POST", async () => {
    const data = { name: "T1", type: "temperature", unit: "C", greenhouseId: "g1" };
    await sensorService.createSensor(data);

    expect(apiFetchMock).toHaveBeenCalledWith("/api/sensors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("builds readings endpoint with pagination params", async () => {
    await sensorService.getSensorReadings("s1", { limit: "100", offset: "0" });

    expect(apiFetchMock).toHaveBeenCalledWith("/api/sensors/s1/readings?limit=100&offset=0");
  });

  it("covers remaining CRUD and reading endpoints", async () => {
    await sensorService.getSensor("s1");
    await sensorService.updateSensor("s1", { name: "renamed" });
    await sensorService.deleteSensor("s1");
    await sensorService.addSensorReading("s1", { value: 42, quality: "ok" });

    expect(apiFetchMock).toHaveBeenCalledWith("/api/sensors/s1");
    expect(apiFetchMock).toHaveBeenCalledWith("/api/sensors/s1", {
      method: "PUT",
      body: JSON.stringify({ name: "renamed" }),
    });
    expect(apiFetchMock).toHaveBeenCalledWith("/api/sensors/s1", {
      method: "DELETE",
    });
    expect(apiFetchMock).toHaveBeenCalledWith("/api/sensors/s1/readings", {
      method: "POST",
      body: JSON.stringify({ value: 42, quality: "ok" }),
    });
  });
});
