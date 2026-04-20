import { beforeEach, describe, expect, it } from "vitest";
import { useViridaStore } from "./useViridaStore";

describe("useViridaStore", () => {
  beforeEach(() => {
    useViridaStore.setState({
      selectedZone: null,
      apiUrl: "http://localhost:3000",
      plants: [],
      sensors: useViridaStore.getState().sensors,
      zones: useViridaStore.getState().zones,
      automationRules: useViridaStore.getState().automationRules,
    });
  });

  it("updates selected zone", () => {
    useViridaStore.getState().setSelectedZone("zone-1");
    expect(useViridaStore.getState().selectedZone).toBe("zone-1");
  });

  it("updates a sensor value by id", () => {
    const firstSensor = useViridaStore.getState().sensors[0];
    useViridaStore.getState().updateSensorValue(firstSensor.id, 99);
    const updated = useViridaStore.getState().sensors.find((s) => s.id === firstSensor.id);
    expect(updated?.value).toBe(99);
  });

  it("toggles automation rule enabled flag", () => {
    const firstRule = useViridaStore.getState().automationRules[0];
    const initial = firstRule.enabled;
    useViridaStore.getState().toggleAutomationRule(firstRule.id);
    const updated = useViridaStore.getState().automationRules.find((r) => r.id === firstRule.id);
    expect(updated?.enabled).toBe(!initial);
  });
});
