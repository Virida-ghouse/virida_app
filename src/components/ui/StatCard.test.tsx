import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatCard from "./StatCard";

describe("StatCard", () => {
  it("renders label, value and unit", () => {
    render(
      <StatCard
        icon="thermostat"
        iconColor="text-red-500"
        iconBg="bg-red-100"
        label="Température"
        value={24}
        unit="°C"
      />
    );

    expect(screen.getByText("Température")).toBeTruthy();
    expect(screen.getByText("24")).toBeTruthy();
    expect(screen.getByText("°C")).toBeTruthy();
  });

  it("renders trend when provided", () => {
    render(
      <StatCard
        icon="water_drop"
        iconColor="text-blue-500"
        iconBg="bg-blue-100"
        label="Humidité"
        value="58"
        unit="%"
        trend="+2%"
      />
    );

    expect(screen.getByText("+2%")).toBeTruthy();
  });
});
