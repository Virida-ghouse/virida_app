import { beforeEach, describe, expect, it, vi } from "vitest";
import { plantService } from "./plantService";

const apiFetchMock = vi.fn();

vi.mock("./apiConfig", async () => {
  const actual = await vi.importActual<typeof import("./apiConfig")>("./apiConfig");
  return {
    ...actual,
    apiFetch: (...args: unknown[]) => apiFetchMock(...args),
  };
});

describe("plantService", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
    apiFetchMock.mockResolvedValue({ json: vi.fn().mockResolvedValue({ success: true }) });
  });

  it("builds plants list endpoint with query params", async () => {
    await plantService.getPlants({ greenhouseId: "g1", status: "active", species: "tomato" });
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plants?greenhouseId=g1&status=active&species=tomato"
    );
  });

  it("encodes plant name for RAG info endpoint", async () => {
    await plantService.getPlantInfo("Tomate Cerise");
    expect(apiFetchMock).toHaveBeenCalledWith("/api/plants/plant-info?plantName=Tomate%20Cerise");
  });

  it("uses multipart form-data upload endpoint with auth header", async () => {
    localStorage.setItem("virida_token", "token123");
    const file = new File(["data"], "photo.png", { type: "image/png" });

    await plantService.uploadPhoto("p1", file, "caption");

    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-advanced/p1/photos/upload",
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Bearer token123" },
      })
    );
  });
});
